import { users, products, purchases, createUser, getAllUsers, createProduct, getAllProducts, getProductByID, queryProductsByName, getAllPurchasesFromUserId } from "./database";
import { CATEGORY, TProduct, TPurchase, TUser } from "./types";

import express, { Request, Response } from "express";
import cors from "cors"

// console.log(users)
// console.log(products)
// console.log(purchases)

// createUser("Miguel", "miguel@gmail.com", "miguel123")
// getAllUsers()
// createProduct("p004", "Monitor HD", 800, CATEGORY.ELECTRONICS)
// getAllProducts()
// getProductByID("p004")
// queryProductsByName("produto2")
// getAllPurchasesFromUserId("1")

const app = express()
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


app.get("/users", (req: Request, res: Response) => {

    try {

        res.status(200).send(users)

    } catch (error) {

        console.log(error)

        res.status(500)
    }
})


app.get("/products", (req: Request, res: Response) => {

    try {

        res.status(200).send(products)

    } catch (error) {

        console.log(error)

        res.status(500)
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


app.get("/product/search", (req: Request, res: Response) => {

    try {

        const q = req.query.q as string

        if (q.length < 1) {

            res.status(404)

            throw new Error("Query params deve possuir pelo menos um caractere")

        } else {
            const result = products.filter(
                (product) => {
                    return product.name.toLowerCase().includes(q.toLowerCase())
                })

            res.status(200).send(result)
        }

    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})

app.post("/users", (req: Request, res: Response) => {

    try {

        const id = req.body.id
        const email = req.body.email
        const password = req.body.password

        if (typeof id !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (users.find((user => user.id === id))) {

            res.status(400)
            throw new Error("'id' já existe em outra conta")
        }

        else if (users.find((user => user.email === email))) {

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

            const newUser: TUser = {
                id,
                email,
                password
            }

            users.push(newUser)

            res.status(201).send("Usuário cadastrado")

        }

    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})

app.post("/products", (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price
        const category = req.body.category

        if (typeof id !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (products.find((product => product.id === id))) {

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

            const newProduct: TProduct = {
                id,
                name,
                price,
                category
            }

            products.push(newProduct)
            res.status(200).send("Produto cadastrado")
        }


    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})

app.post("/purchases", (req: Request, res: Response) => {

    try {
        const userId = req.body.userId
        const productId = req.body.productId
        const quantity = req.body.quantity
        const totalPrice = req.body.totalPrice

        if (typeof userId !== "string") {

            res.status(400)
            throw new Error("'id' inválido. Deve ser do tipo 'string'")
        }

        else if (!users.find((user => user.id === userId))) {

            res.status(400)
            throw new Error("'userId' deve corresponder a um 'id' de usuários cadastrados")
        }

        else if (typeof productId !== "string") {

            res.status(400)
            throw new Error("'productId' inválido. Deve ser do tipo 'string'")
        }

        else if (!products.find((product => product.id === productId))) {

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

            const newPurchase: TPurchase = {
                userId,
                productId,
                quantity,
                totalPrice
            }

            purchases.push(newPurchase)

            res.status(200).send("Compra realizada")
        }

    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})

app.get("/products/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const result = products.find((product) => product.id === id)

        if (result) {

            res.status(200).send(result)
        }
        else {

            res.status(400)
            throw new Error("'id' não encontrado")
        }

    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})

app.get("/users/:id/purchases", (req: Request, res: Response) => {

    try {

        const id = req.params.id
        const result = purchases.find((purchase) => purchase.userId === id)

        if (result) {

            res.status(200).send(result)
        }
        else {

            res.status(400)
            throw new Error("'id' não encontrado")
        }

    } catch (error) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
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

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
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

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
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

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
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

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
})