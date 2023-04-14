-- Active: 1680540658607@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

INSERT INTO users
VALUES (
        "u001",
        "user1",
        "user1@gmail.com",
        "user1password",
        DATETIME("now", "localtime")
    ), (
        "u002",
        "user2",
        "user2@gmail.com",
        "user2password",
        DATETIME("now", "localtime")
    ), (
        "u003",
        "user3",
        "user3@gmail.com",
        "user3password",
        DATETIME("now", "localtime")
    ), (
        "u004",
        "user4",
        "user4@gmail.com",
        "user4password",
        DATETIME("now", "localtime")
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

INSERT INTO products
VALUES (
        "p001",
        "Carro Antigo",
        500000,
        "Carro de 1938 pertencente ao herdeiro de um fazendeiro magnata",
        "https://picsum.photos/id/111/800"
    ), (
        "p002",
        "Triciclo",
        50,
        "Triciclo infantil usado em condições razoáveis de conservação. Acompanha corrente com cadeado",
        "https://picsum.photos/id/146/800"
    ), (
        "p003",
        "Relógio Vintage",
        130,
        "Relógio mecânico de mesa estilo vintage",
        "https://picsum.photos/id/175/800"
    ), (
        "p004",
        "Veleiro",
        750000,
        "Veleiro de 50 pés ideal para aventuras em mares calmos",
        "https://picsum.photos/id/211/800"
    ), (
        "p005",
        "Câmera Analógica",
        85,
        "Câmera analógica de filme com zoom ótico manual",
        "https://picsum.photos/id/250/800"
    );

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer_id TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT,
        paid INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (buyer_id) REFERENCES users(id)
    );

INSERT INTO purchases
VALUES (
        "c001",
        "u002",
        310,
        DATETIME("now", "localtime"),
        0
    ), (
        "c002",
        "u001",
        500255,
        DATETIME("now", "localtime"),
        1
    ), (
        "c003",
        "u002",
        85,
        DATETIME("now", "localtime"),
        1
    ), (
        "c004",
        "u004",
        750000,
        DATETIME("now", "localtime"),
        1
    );

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
    );

INSERT INTO
    purchases_products
VALUES ("c001", "p002", 1), ("c001", "p003", 2), ("c002", "p001", 1), ("c002", "p005", 3), ("c003", "p005", 1), ("c004", "p004", 1);

DROP TABLE users;

DROP TABLE products;

DROP TABLE purchases;

DROP TABLE purchases_products;

SELECT * FROM purchases;

SELECT * FROM purchases_products;

SELECT * FROM products;

-- SELECT

--     purchases_products.purchase_id,

--     purchases_products.product_id,

--     products.name,

--     products.price,

--     purchases_products.quantity,

--     purchases.total_price,

--     purchases.paid,

--     purchases.delivered_at,

--     purchases.buyer_id

-- FROM purchases_products

--     INNER JOIN purchases ON purchases_products.purchase_id = purchases.id

--     INNER JOIN products ON purchases_products.product_id = products.id;