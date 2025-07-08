
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
-- 1.Dirty receipts where accuracy is null
-- SELECT *
-- FROM dirty_receipts
-- where accuracy is null

-- 2.Product name is item
-- SELECT *
-- FROM dirty_receipts
-- WHERE product = 'item';

-- 3.product names are numbers
-- SELECT *
-- FROM dirty_receipts
-- WHERE product REGEXP '^[0-9]+$';

-- 4.product code is text
-- SELECT *
-- FROM dirty_receipts
-- WHERE code REGEXP '^[A-Za-z]+$';

-- 5.purchase unit is not sensible
-- SELECT *
-- FROM dirty_receipts
-- WHERE code REGEXP '[A-Za-z]'
-- AND unit IN ('shs', 'cts');

-- 6.supplier name starts or ends with coop or kcb
-- SELECT *
-- FROM dirty_receipts
-- WHERE supplier REGEXP '^(co-op|kcb)|co-op$|kcb$';

-- 7.purchase unit is null
-- SELECT *
-- FROM dirty_receipts
-- WHERE unit IS NULL;

-- 8.Product name is water bill
-- SELECT *
-- FROM dirty_receipts
-- WHERE product = 'water bill';

-- 9.product name is kcb or co-op
-- select *
-- from dirty_receipts
-- where product REGEXP '^(co-op|kcb)|co-op$|kcb$';

-- 10.accuracy is 75 and below
SELECT *
FROM dirty_receipts
WHERE accuracy <= 75;

