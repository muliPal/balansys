WITH

-- 2. Products named "item"
products_named_item AS (
    SELECT
        image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE product.name = 'item'
),

-- 3. Numeric product.
numeric_product_names AS (
    SELECT
        image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE product.name REGEXP '^[0-9]+$'
),

-- 4. Product code is text
text_product_codes AS (
    SELECT
        image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE product.code REGEXP '^[A-Za-z]+$'
),

-- 5. Purchases with unsensible units and text codes?????
unsensible_purchase_units AS (
    SELECT
       image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE product.code REGEXP '[A-Za-z]'
    AND purchase.unit IN ('shs', 'cts')
),


-- 7. Null purchase unit
null_purchase_units AS (
    SELECT
        image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE purchase.unit IS NULL
),

-- 8. Product named 'water bill'
products_named_water_bill AS (
    SELECT
       image.image as image
    FROM folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
    WHERE product.name = 'water bill'
),


-- 10. Accuracy <75
low_accuracy_receipts AS (
select
    image.image,
    consumer.name,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join consumer on receipt.consumer=consumer.consumer
where
    receipt.accuracy <=75
    and consumer.name = "mutall"
order by
    receipt.accuracy asc
)
-- These are the querries with no results and need review
-- 1. Receipt accuracy is NULL
-- receipts_with_null_accuracy AS (
--     SELECT
--        image.image as image
--     FROM folder
--     INNER JOIN image ON image.folder = folder.folder
--     LEFT JOIN receipt ON receipt.image = image.image
--     LEFT JOIN consumer ON receipt.consumer = consumer.consumer
--     LEFT JOIN business ON consumer.business = business.business
--     LEFT JOIN supplier ON supplier.business = business.business
--     INNER JOIN purchase ON purchase.receipt = receipt.receipt
--     LEFT JOIN product ON product.product = purchase.product
--     WHERE receipt.accuracy IS NULL
-- ),
-- 9. Product name is 'co-op' or 'kcb'???
-- products_with_bank_names AS (
--     SELECT
--         image.image as image
--     FROM folder
--     INNER JOIN image ON image.folder = folder.folder
--     LEFT JOIN receipt ON receipt.image = image.image
--     LEFT JOIN consumer ON receipt.consumer = consumer.consumer
--     LEFT JOIN business ON consumer.business = business.business
--     LEFT JOIN supplier ON supplier.business = business.business
--     INNER JOIN purchase ON purchase.receipt = receipt.receipt
--     LEFT JOIN product ON product.product = purchase.product
--     WHERE product.name REGEXP '^(co-op|kcb)|co-op$|kcb$'
-- ),

-- 6. Suppliers whose names start or end with 'co-op' or 'kcb'????
-- suppliers_with_bank_names AS (
--     SELECT
--         image.image as image
--     FROM folder
--     INNER JOIN image ON image.folder = folder.folder
--     LEFT JOIN receipt ON receipt.image = image.image
--     LEFT JOIN consumer ON receipt.consumer = consumer.consumer
--     LEFT JOIN business ON consumer.business = business.business
--     LEFT JOIN supplier ON supplier.business = business.business
--     INNER JOIN purchase ON purchase.receipt = receipt.receipt
--     LEFT JOIN product ON product.product = purchase.product
--     WHERE business.name REGEXP '^(co-op|kcb)|co-op$|kcb$'
-- ),


-- individual totals don't match receipt total.

-- Choose the CTE to SELECT from below
SELECT * FROM low_accuracy_receipts;
-- Example: SELECT * FROM products_named_item;
