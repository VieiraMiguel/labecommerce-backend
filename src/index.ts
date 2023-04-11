import { users, products, purchases, createUser, getAllUsers, createProduct, getAllProducts, getProductByID, queryProductsByName, getAllPurchasesFromUserId } from "./database";
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

        const result = await db("users")

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

        const result = await db("products")

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

app.get("/purchases", (req: Request, res: Response) => {

    try {

        res.status(200).send(purchases)

    } catch (error) {

        console.log(error)

        res.status(500)
    }
})


app.get("/product/search", async (req: Request, res: Response) => {

    try {

        const q = req.query.q as string

        const products = await db("products")

        if (q.length < 1) {

            res.status(404)

            throw new Error("Query params deve possuir pelo menos um caractere")

        } else {
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

app.post("/users", async (req: Request, res: Response) => {

    try {

        const id = req.body.id
        //const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        // const createdAt = await db.raw(`DATETIME("now")`)

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

            await db.raw(`INSERT INTO users(id, email, password)
            VALUES ("${id}", "${email}", "${password}");`)

            res.status(201).send("Usuário cadastrado")

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
        const category = req.body.category

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

        else if (
            category !== CATEGORY.ACCESSORIES &&
            category !== CATEGORY.CLOTHES_AND_SHOES &&
            category !== CATEGORY.ELECTRONICS &&
            category !== CATEGORY.GAMES_AND_CONSOLES
        ) {
            res.status(400)
            throw new Error("'category' deve ser um dos tipos válidos")
        }

        else {

            // const newProduct: TProduct = {
            //     id,
            //     name,
            //     price,
            //     category
            // }

            //products.push(newProduct)

            await db.raw(`INSERT INTO products(id, name, price, category)
            VALUES ("${id}", "${name}", "${price}", "${category}");`)

            res.status(200).send("Produto cadastrado")
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
        const userId = req.body.userId
        const productId = req.body.productId
        const quantity = req.body.quantity
        const totalPrice = req.body.totalPrice

        const users = await db.raw(`SELECT * FROM users`)

        const products = await db.raw(`SELECT * FROM products`)

        if (typeof userId !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (!users.find(((user: { id: string; }) => user.id === userId))) {

            res.status(400)
            throw new Error("'userId' deve corresponder a um 'id' de usuários cadastrados")
        }

        else if (typeof productId !== "string") {

            res.status(400)
            throw new Error("'productId' inválido. Deve ser do tipo 'string'")
        }

        else if (!products.find(((product: { id: string; }) => product.id === productId))) {

            res.status(400)
            throw new Error("'productId' deve corresponder a um 'id' de produtos cadastrados")
        }

        else if (typeof quantity !== "number") {

            res.status(400)
            throw new Error("'quantity' inválido. Deve ser do tipo 'number'")
        }

        else if (typeof totalPrice !== "number") {

            res.status(400)
            throw new Error("'totalPrice' inválido. Deve ser do tipo 'number'")
        }

        else {

            // const newPurchase: TPurchase = {
            //     userId,
            //     productId,
            //     quantity,
            //     totalPrice
            // }

            // purchases.push(newPurchase)

            await db.raw(`INSERT INTO purchases(userId, productId, quantity, totalPrice)
            VALUES ("${userId}", "${productId}", "${quantity}", "${totalPrice}");`)

            res.status(200).send("Compra realizada")
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

app.get("/products/:id", async (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const products = await db.raw(`SELECT * FROM products`)

        const result = products.find((product: { id: string; }) => product.id === id)

        if (result) {

            res.status(200).send(result)
        }
        else {

            res.status(400)
            throw new Error("'id' não encontrado")
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

app.get("/users/:id/purchases", async (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const purchases = await db.raw(`SELECT * FROM purchases`)

        const result = purchases.filter((purchase: { buyer_id: string; }) => purchase.buyer_id === id)

        if (result) {

            res.status(200).send(result)
        }
        else {

            res.status(400)
            throw new Error("'id' não encontrado")
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

app.delete("/users/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const indexToDelete = users.findIndex((user) => {
            return user.id === id
        })

        if (indexToDelete >= 0) {

            users.splice(indexToDelete, 1)

            res.status(200).send("User apagado")
        }
        else if (indexToDelete === -1) {

            res.status(400)

            throw new Error("User não encontrado")
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

app.delete("/products/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const indexToDelete = products.findIndex((product) => {
            return product.id === id
        })

        if (indexToDelete >= 0) {

            products.splice(indexToDelete, 1)

            res.status(200).send("Produto apagado")
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

app.put("/users/:id", (req: Request, res: Response) => {


    try {

        const id = req.params.id

        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password as string | undefined

        const userToEdit = users.find((user) => user.id === id)

        if (userToEdit) {
            if (typeof newEmail !== "string") {
                res.status(400)

                throw new Error("'email' inválido. Deve ser do tipo 'string'")
            } else {

                userToEdit.email = newEmail || userToEdit.email
            }
            if (typeof newPassword !== "string") {
                res.status(400)

                throw new Error("'password' inválida. Deve ser do tipo 'string'")

            } else {

                userToEdit.password = newPassword || userToEdit.password
            }

            res.status(200).send("Cadastro atualizado")
        }
        else {

            res.status(400)

            throw new Error("User não encontrado")
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

app.put("/products/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newCategory = req.body.category as CATEGORY | undefined

        const productToEdit = products.find((product) => product.id === id)

        if (productToEdit) {

            if (typeof newName !== "string") {
                res.status(400)

                throw new Error("'name' inválido. Deve ser do tipo 'string'")

            } else {

                productToEdit.name = newName || productToEdit.name
            }

            if (typeof newPrice !== "number") {
                res.status(400)

                throw new Error("'price' inválida. Deve ser do tipo 'number'")

            } else {

                productToEdit.price = newPrice || productToEdit.price
            }

            if (
                newCategory !== CATEGORY.ACCESSORIES &&
                newCategory !== CATEGORY.CLOTHES_AND_SHOES &&
                newCategory !== CATEGORY.ELECTRONICS &&
                newCategory !== CATEGORY.GAMES_AND_CONSOLES
            ) {
                res.status(400)

                throw new Error("'category' deve ser um dos tipos válidos")

            } else {

                productToEdit.category = newCategory || productToEdit.category
            }

            res.status(200).send("Produto atualizado")
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

app.get("/purchases/:id", async (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const purchases = await db
            .select(
                "purchases.id",
                "total_price",
                "delivered_at",
                "paid",
                "buyer_id",
                "users.email"
            )
            .from("purchases")
            .where({ "purchases.id": id })
            .innerJoin("users", "purchases.buyer_id", "=", "users.id")

        const productList = await db
            .select(
                "products.id",
                "products.name",
                "products.price",
                "products.category",
                "purchases_products.quantity"
            )
            .from("products")
            .where({ "purchases_products.purchase_id": id })
            .innerJoin("purchases_products", "products.id", "=", "purchases_products.product_id")

        res.status(200).send({ ...purchases[0], productsList: productList })

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