import { users, products, purchases, createUser, getAllUsers, createProduct,getAllProducts, getProductByID, queryProductsByName, getAllPurchasesFromUserId } from "./database";
import { CATEGORY } from "./types";

// console.log(users)
// console.log(products)
// console.log(purchases)

createUser("Miguel", "miguel@gmail.com", "miguel123")
getAllUsers()
createProduct("p004", "Monitor HD", 800, CATEGORY.ELECTRONICS)
getAllProducts()
getProductByID("p004")
queryProductsByName("produto2")
getAllPurchasesFromUserId("1")