SELECT
    folder.full_name AS folder_name,
    image.full_name as image_name,
    image.image AS image_index,
    receipt.accuracy AS accuracy,
    product.name AS product,
    product.code AS code,
    purchase.unit AS unit,
    purchase.price AS purchase_price,
    consumer.name AS consumer,
    business.name AS supplier
FROM
    folder
INNER JOIN image ON image.folder = folder.folder
LEFT JOIN receipt ON receipt.image = image.image
LEFT JOIN consumer ON receipt.consumer = consumer.consumer
LEFT JOIN business ON consumer.business = business.business
LEFT JOIN supplier ON supplier.business = business.business
INNER JOIN purchase ON purchase.receipt = receipt.receipt
LEFT JOIN product ON product.product = purchase.product;
