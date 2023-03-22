export type TUser = {
    id: string
    email: string
    password: string
}

export enum CATEGORY {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos",
    GAMES_AND_CONSOLES = "Jogos e consoles"
}

export type TProduct = {
    id: string
    name: string
    price: number
    category: CATEGORY
}

export type TPurchase = {
    userId: string
    productId: string
    quantity: number
    totalPrice: number
}