WITH

-- 1. Accuracy <75
low_accuracy_receipts AS (
select
    image.image,
    receipt.accuracy,
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
),

-- 2. Products named "item"
products_named_item AS (
  select
    image.image,
    product.name,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
    product.name ="item"
    and consumer.name = "mutall"
),

-- 3. Numeric product.
numeric_product_names AS (
   select
    image.image,
    product.name,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
    product.name REGEXP '^[0-9]+$'
    and consumer.name = "mutall"

),

-- 4. Product code is text
text_product_codes AS (
select
    image.image,
    product.code,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
    product.code REGEXP '^[A-Za-z]+$'
    and consumer.name="mutall"
),

-- 5. Null purchase unit
null_purchase_units AS (
    select
    image.image,
    purchase.unit,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
    purchase.unit IS NULL
    and consumer.name="mutall"
),

-- 6. Purchases with unsensible units and text codes?????
unsensible_purchase_units AS (
select
    image.image,
    purchase.unit,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
    product.code REGEXP '[A-Za-z]'
    and purchase.unit IN ('shs', 'cts')
    and consumer.name="mutall"
),


-- 7. Product named 'water bill'
products_named_water_bill AS (
select
    image.image,
    product.name,
    image.full_name
from
   image
   inner join receipt on receipt.image=image.image
   inner join purchase on purchase.receipt=receipt.receipt
   inner join product on purchase.product=product.product
   inner join consumer on receipt.consumer=consumer.consumer
where
   product.name = 'water bill'
   and consumer.name="mutall"
)

-- Choose the CTE to SELECT from below
SELECT * FROM low_accuracy_receipts;
-- Example: SELECT * FROM products_named_item;
