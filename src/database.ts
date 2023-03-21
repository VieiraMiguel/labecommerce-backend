import { TUser, TProduct, TPurchase } from "./types"

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
        category: "utensilho"
    },
    {
        id: "2",
        name: "produto2",
        price: 150,
        category: "eletro"
    },
]

export const purchases: TPurchase[] = [
    {
        userId: users[1].id,
        productId: products[0].id,
        quantity: 2,
        totalPrice: products[0].price * 2,
    },
    {
        userId: users[0].id,
        productId: products[1].id,
        quantity: 3,
        totalPrice: products[1].price * 3,
    }
]