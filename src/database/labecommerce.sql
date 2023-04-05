-- Active: 1680540658607@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

INSERT INTO users
VALUES (
        "u001",
        "user1@gmail.com",
        "user1pass"
    ), (
        "u002",
        "user2@gmail.com",
        "user2pass"
    ), (
        "u003",
        "user3@gmail.com",
        "user3pass"
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    );

INSERT INTO products
VALUES (
        "p001",
        "produto1",
        150,
        "Jogos e consoles"
    ), (
        "p002",
        "produto2",
        50,
        "Acessórios"
    ), (
        "p003",
        "produto3",
        230,
        "Eletrônicos"
    ), (
        "p004",
        "produto4",
        200,
        "Roupas e calçados"
    ), (
        "p005",
        "produto5",
        140,
        "Acessórios"
    );

DROP TABLE users;

SELECT * FROM users;

DROP TABLE products;

SELECT * FROM products;

SELECT * FROM products WHERE name LIKE "produto%";

INSERT INTO users
VALUES (
        "u004",
        "user4@gmail.com",
        "user4pass"
    );

INSERT INTO products
VALUES (
        "p006",
        "produto6",
        250,
        "Jogos e consoles"
    );

SELECT * FROM users WHERE id LIKE "u00%";

SELECT * FROM products WHERE name LIKE "produto%";

DELETE FROM users WHERE id = "p001";

DELETE FROM products WHERE id = "p001";

UPDATE users
SET
    id = "u001",
    email = "user1edit",
    password = "user1editpass"
WHERE id = "u001";

UPDATE products
SET
    id = "p002",
    name = "produto2edit",
    price = "55",
    category = "Eletrônicos"
WHERE id = "p002";

SELECT * FROM users ORDER BY email ASC;

SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;

SELECT *
FROM products
WHERE price BETWEEN 100 AND 230
ORDER BY price ASC;

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        total_price REAL NOT NULL,
        paid INTEGER NOT NULL,
        delivered_at TEXT,
        buyer_id TEXT NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users(id)
    );

INSERT INTO purchases
VALUES ("p001", 530, 1, NULL, "u002"), ("p002", 650, 0, NULL, "u002"), ("p003", 150, 0, NULL, "u001"), ("p004", 500, 0, NULL, "u001");

SELECT * FROM purchases;

DROP TABLE purchases;

UPDATE purchases SET delivered_at = DATETIME("now");

SELECT
    purchases.id AS purchaseId,
    purchases.total_price,
    purchases.paid,
    purchases.delivered_at,
    users.id AS userId,
    users.email
FROM purchases
    JOIN users ON purchases.buyer_id = users.id AND users.id = "u001"