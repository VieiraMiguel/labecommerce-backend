import { /*users, products, purchases,*/ createUser, getAllUsers, createProduct, getAllProducts, getProductByID, queryProductsByName, getAllPurchasesFromUserId } from "./database";
import { CATEGORY, TProduct, TPurchase, TUser } from "./types";

import express, { Request, Response } from "express";
import cors from "cors"
import { db } from "./database/knex";

const app = express()
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


app.get("/users", async (req: Request, res: Response) => {

    try {

        const result = await db
            .select("id", "name", "email", "password", "created_at AS createdAt")
            .from("users")

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.get("/products", async (req: Request, res: Response) => {

    try {

        const q = req.query.q as string

        const products = await db("products")


        if (q === undefined) {

            const result = await db
                .select("id", "name", "price", "description", "image_url AS imageUrl")
                .from("products")

            res.status(200).send(result)

        }

        else if (q.length < 1) {

            res.status(404)

            throw new Error("Query params deve possuir pelo menos um caractere")

        }

        else if (q.length >= 1) {
            const result = products.filter(
                (product: { name: string; }) => {
                    return product.name.toLowerCase().includes(q.toLowerCase())
                })

            res.status(200).send(result)
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/purchases/:id", async (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const purchases = await db
            .select(
                "purchases.id AS purchaseId",
                "buyer_id AS buyerId",
                "users.name AS buyerName",
                "users.email AS buyerEmail",
                "total_price AS totalPrice",
                "purchases.created_at AS createdAt",
                "paid"
            )
            .from("purchases")
            .where({ "purchases.id": id })
            .innerJoin("users", "purchases.buyer_id", "=", "users.id")

        const productList = await db
            .select(
                "products.id",
                "products.name",
                "products.price",
                "products.description",
                "products.image_url AS imageUrl",
                "purchases_products.quantity"
            )
            .from("products")
            .where({ "purchases_products.purchase_id": id })
            .innerJoin("purchases_products", "products.id", "=", "purchases_products.product_id")

        res.status(200).send({ ...purchases[0], products: productList })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/users", async (req: Request, res: Response) => {

    try {

        const id = req.body.id
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        const users = await db.raw(`SELECT * FROM users`)

        if (typeof id !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (users.find(((user: { id: string; }) => user.id === id))) {

            res.status(400)
            throw new Error("'id' já existe em outra conta")
        }

        else if (users.find(((user: { email: string; }) => user.email === email))) {

            res.status(400)
            throw new Error("'email' já existe em outra conta")
        }

        else if (typeof email !== "string") {

            res.status(400)
            throw new Error("'email' inválido. Deve ser do tipo 'string'")
        }

        else if (typeof password !== "string") {

            res.status(400)
            throw new Error("'password' inválida. Deve ser do tipo 'string'")
        }

        else {

            await db.raw(`INSERT INTO users(id, name, email, password, created_at)
            VALUES ("${id}", "${name}", "${email}", "${password}", DATETIME("now", "localtime"))`)

            res.status(201).send({ message: "Cadastro realizado com sucesso" })

        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/products", async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price
        const description = req.body.description
        const imageUrl = req.body.imageUrl

        const products = await db.raw(`SELECT * FROM products`)

        if (typeof id !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (products.find(((product: { id: string; }) => product.id === id))) {

            res.status(400)
            throw new Error("'id' já utilizado em outro produto")
        }

        else if (typeof name !== "string") {

            res.status(400)
            throw new Error("'name' inválido. Deve ser do tipo 'string'")
        }

        else if (typeof price !== "number") {

            res.status(400)
            throw new Error("'price' inválido. Deve ser do tipo 'number'")
        }

        else {

            await db.raw(`INSERT INTO products(id, name, price, description, image_url)
            VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}");`)

            res.status(201).send({ message: "Produto cadastrado com sucesso" })
        }


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/purchases", async (req: Request, res: Response) => {
    try {

        const id = req.body.id
        const buyer = req.body.buyer
        const products = req.body.products
        const totalPrice = req.body.totalPrice

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (typeof buyer !== "string") {
            res.status(400)
            throw new Error("'buyer' inválido. Deve ser do tipo 'string'")
        }

        else if (products.length < 0) {
            res.status(400)
            throw new Error("A compra deve possuir ao menos um ítem")
        }

        for (let product of products) {
            const [productExists]: TProduct[] | undefined[] = await db(
                "products"
            ).where({ id: product.id })

            if (!productExists) {
                res.status(404)
                throw new Error("Produto não encontrado")
            }

            if (typeof product.quantity !== "number") {
                res.status(400)
                throw new Error("'quantity' inválido. Deve ser do tipo 'number'")
            }
            if (product.quantity < 1) {
                res.status(400)
                throw new Error("'quantity' deve ser ao menos 1")
            }
        }

        const [purchaseIdAlreadyExists] = await db(
            "purchases"
        ).where({ id })

        if (purchaseIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' da compra já existe")
        }

        let purchaseTotalPrice = 0
        for (let product of products) {
            const [productWithPrice] = await db("products").where({
                id: product.id,
            })
            purchaseTotalPrice += productWithPrice.price * product.quantity
        }

        await db.raw(`
        INSERT INTO purchases(id, buyer_id, total_price, created_at)
        VALUES ("${id}", "${buyer}", "${purchaseTotalPrice}", DATETIME("now", "localtime"));`)

        for (let product of products) {
            const [purchaseProductAlreadyExists] =
                await db("purchases_products")
                    .where({ purchase_id: id })
                    .andWhere({ product_id: product.id })

            if (purchaseProductAlreadyExists) {
                const newPurchaseProduct = {
                    ...purchaseProductAlreadyExists,
                    quantity: purchaseProductAlreadyExists.quantity + product.quantity,
                }

                await db("purchases_products")
                    .update(newPurchaseProduct)
                    .where({ purchase_id: id })
                    .andWhere({ product_id: product.id })
            } else {
                const newPurchaseProduct = {
                    purchase_id: id,
                    product_id: product.id,
                    quantity: product.quantity,
                }

                await db("purchases_products").insert(newPurchaseProduct)
            }
        }

        res.status(201).send("Pedido realizado com sucesso")
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado.")
        }
    }
})

app.put("/products/:id", async (req: Request, res: Response) => {

    try {

        const idToEdit = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        const products = await db("products")

        const productToEdit = products.find((product) => product.id === idToEdit)

        if (productToEdit) {

            if (typeof newId !== "string") {
                res.status(400)

                throw new Error("'id' inválido. Deve ser do tipo 'string'")

            }

            if (typeof newName !== "string") {
                res.status(400)

                throw new Error("'name' inválido. Deve ser do tipo 'string'")

            }

            if (typeof newPrice !== "number") {
                res.status(400)

                throw new Error("'price' inválida. Deve ser do tipo 'number'")

            }

            if (typeof newDescription !== "string") {
                res.status(400)

                throw new Error("'description' inválido. Deve ser do tipo 'string'")

            }

            if (typeof newImageUrl !== "string") {
                res.status(400)

                throw new Error("'imgUrl' inválido. Deve ser do tipo 'string'")

            }

            const updateProduct = {
                id: newId || productToEdit.id,
                name: newName || productToEdit.name,
                price: newPrice || productToEdit.price,
                description: newDescription || productToEdit.description,
                image_url: newImageUrl || productToEdit.image_url
            }

            await db("products").update(updateProduct).where({ id: idToEdit })

            res.status(200).send({ message: "Produto atualizado com sucesso" })
        }
        else {

            res.status(400)

            throw new Error("Produto não encontrado")
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        // await db("purchases").del().where({ id: idToDelete })

        // res.status(200).send({ message: "Pedido cancelado com sucesso" })

        const purchases = await db("purchases")

        const indexToDelete = purchases.findIndex((purchase) => {
            return purchase.id === idToDelete
        })

        if (indexToDelete >= 0) {

            await db("purchases").del().where({ id: idToDelete })

            res.status(200).send({ message: "Pedido cancelado com sucesso" })
        }
        else if (indexToDelete === -1) {

            res.status(400)

            throw new Error("Produto não encontrado")
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})