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

    res.status(200).send(users)

})

// app.get("/products", (req: Request, res: Response) => {

//     res.status(200).send(products)

// })

app.get("/product/search", (req: Request, res: Response) => {

    const q = req.query.q as string
    const result = products.filter(
        (product) => {
            return product.name.toLowerCase().includes(q.toLowerCase())
        })

    res.status(200).send(result)

})

app.post("/users", (req: Request, res: Response) => {

    const id = req.body.id
    const email = req.body.email
    const password = req.body.password

    const newUser: TUser = {
        id,
        email,
        password
    }

    users.push(newUser)

    res.status(201).send("Usuário cadastrado")
})

app.post("/products", (req: Request, res: Response) => {

    const id = req.body.id
    const name = req.body.name
    const price = req.body.price
    const category = req.body.category

    const newProduct: TProduct = {
        id,
        name,
        price,
        category
    }

    products.push(newProduct)

    res.status(200).send("Produto cadastrado")
})

app.post("/purchases", (req: Request, res: Response) => {

    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = req.body.quantity
    const totalPrice = req.body.totalPrice

    const newPurchase: TPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }

    purchases.push(newPurchase)

    res.status(200).send("Compra realizada")
})

app.get("/products/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const result = products.find((product) => product.id === id)

    res.status(200).send(result)

})

app.get("/users/:id/purchases", (req: Request, res: Response) => {

    const id = req.params.id

    const result = purchases.find((purchase) => purchase.userId === id)

    res.status(200).send(result)

})

app.delete("/users/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const indexToDelete = users.findIndex((user) => {
        return user.id === id
    })

    if (indexToDelete >= 0) {
        users.splice(indexToDelete, 1)
    }

    res.status(200).send("User apagado")

})

app.delete("/products/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const indexToDelete = products.findIndex((product) => {
        return product.id === id
    })

    if (indexToDelete >= 0) {
        products.splice(indexToDelete, 1)
    }

    res.status(200).send("Produto apagado")

})

app.put("/users/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined

    const userToEdit = users.find((user) => user.id === id)

    if (userToEdit) {
        
        userToEdit.email = newEmail || userToEdit.email
        userToEdit.password = newPassword || userToEdit.password
    }

    res.status(200).send("Cadastro atualizado")
})

app.put("/products/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as CATEGORY | undefined

    const productToEdit = products.find((product) => product.id === id)

    if (productToEdit) {
        
        productToEdit.name = newName || productToEdit.name
        productToEdit.price = newPrice || productToEdit.price
        productToEdit.category = newCategory || productToEdit.category
    }

    res.status(200).send("Produto atualizado")
})

app.get("/products", (req: Request, res: Response) => {

    res.status(200).send(products)

})