import { TUser, CATEGORY, TProduct, TPurchase } from "./types"

export const users: TUser[] = [
    {
        id: "1",
        email: "alguem@gmail.com",
        password: "alguempass"
    },
    {
        id: "2",
        email: "fulano@gmail.com",
        password: "fulanopass"
    }
]

export const products: TProduct[] = [
    {
        id: "1",
        name: "produto1",
        price: 100,
        category: CATEGORY.ACCESSORIES
    },
    {
        id: "2",
        name: "produto2",
        price: 150,
        category: CATEGORY.GAMES_AND_CONSOLES
    },
]

export const purchases: TPurchase[] = [
    {
        userId: "2",
        productId: "1",
        quantity: 2,
        totalPrice: products[0].price * 2,
    },
    {
        userId: "1",
        productId: "2",
        quantity: 3,
        totalPrice: products[1].price * 3,
    }
]

export function createUser(id: string, email: string, password: string): void {

    users.push({
        id,
        email,
        password
    })

    console.log("Cadastro realizado com sucesso")
}

export function getAllUsers(): void {
    console.log(users)
}

export function createProduct(id: string, name: string, price: number, category: CATEGORY): void {

    products.push({
        id,
        name,
        price,
        category
    })

    console.log("Produto criado com sucesso")
}

export function getAllProducts(): void {
    console.log(products)
}

export function getProductByID(idToSeach: string): void {

    console.log(products.find(product => product.id === idToSeach))
}

export function queryProductsByName(q: string): void {
    const query = products.find(product => product.name.toLowerCase().includes(q.toLowerCase()))

    console.log(query)
}

export function createPurchase(userId: string, productId: string, quantity: number, totalPrice: number): void {
    purchases.push({
        userId,
        productId,
        quantity,
        totalPrice
    })
    console.log("Compra realizada com sucesso")
}

export function getAllPurchasesFromUserId(userIdToSearch: string): void {
    console.log(purchases.find(purchase => purchase.userId === userIdToSearch))
}

