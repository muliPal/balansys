WITH dirty_receipts AS (
    SELECT
        folder.full_name AS image_name,
        image.image AS image_index,
        receipt.accuracy AS accuracy,
        product.name AS product,
        product.code AS code,
        purchase.unit AS unit,
        purchase.price AS purchase_price,
        consumer.name AS consumer,
        supplier.name AS supplier
    FROM
        folder
    INNER JOIN image ON image.folder = folder.folder
    LEFT JOIN receipt ON receipt.image = image.image
    LEFT JOIN consumer ON receipt.consumer = consumer.consumer
    LEFT JOIN business ON consumer.business = business.business
    LEFT JOIN supplier ON supplier.business = business.business
    INNER JOIN purchase ON purchase.receipt = receipt.receipt
    LEFT JOIN product ON product.product = purchase.product
)

-- 1. Dirty receipts where accuracy is below 75
-- SELECT * FROM dirty_receipts WHERE accuracy IS NULL;
--  SELECT COUNT(*) AS accuracy_null FROM dirty_receipts WHERE accuracy IS NULL;

-- 2. Product name is 'item'
-- SELECT * FROM dirty_receipts WHERE product = 'item';
--  SELECT COUNT(*) AS product_item FROM dirty_receipts WHERE product = 'item';

-- 3. Product name is a number
-- SELECT * FROM dirty_receipts WHERE product REGEXP '^[0-9]+$';
--  SELECT COUNT(*) AS product_is_number FROM dirty_receipts WHERE product REGEXP '^[0-9]+$';

-- 4. Product code is text
-- SELECT * FROM dirty_receipts WHERE code REGEXP '[A-Za-z]';
--  SELECT COUNT(*) AS code_has_text FROM dirty_receipts WHERE code REGEXP '[A-Za-z]';

-- 5. Purchase unit is 'shs' or 'cts'
-- SELECT * FROM dirty_receipts WHERE unit IN ('shs', 'cts');
-- SELECT COUNT(*) AS unit_shs_or_cts FROM dirty_receipts WHERE unit IN ('shs', 'cts');

-- 6. Purchase price is null
-- SELECT * FROM dirty_receipts WHERE purchase_price IS NULL;
-- SELECT COUNT(*) AS price_is_null FROM dirty_receipts WHERE purchase_price IS NULL;

-- 7. Purchase price is text
-- SELECT * FROM dirty_receipts WHERE purchase_price REGEXP '[A-Za-z]';
--  SELECT COUNT(*) AS price_is_text FROM dirty_receipts WHERE purchase_price REGEXP '[A-Za-z]';

-- 8. Supplier name starts or ends with 'co-op' or 'kcb'
-- SELECT * FROM dirty_receipts WHERE supplier REGEXP '^(co-op|kcb)|co-op$|kcb$';
--  SELECT COUNT(*) AS supplier_coop_kcb FROM dirty_receipts WHERE supplier REGEXP '^(co-op|kcb)|co-op$|kcb$';

-- 9. Purchase unit is null
-- SELECT * FROM dirty_receipts WHERE unit IS NULL;
--  SELECT COUNT(*) AS unit_is_null FROM dirty_receipts WHERE unit IS NULL;

-- 10. Product name is 'water bill'
-- SELECT * FROM dirty_receipts WHERE LOWER(product) = 'water bill';
--  SELECT COUNT(*) AS product_water_bill FROM dirty_receipts WHERE LOWER(product) = 'water bill';

--  11. Receipt accuracy is 75 or below
--  SELECT * FROM dirty_receipts WHERE accuracy <= 75;
  SELECT COUNT(*) AS accuracy_below_75 FROM dirty_receipts WHERE accuracy <= 75;
