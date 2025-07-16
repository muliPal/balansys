WITH purchase_data AS (
    SELECT
        `receipt`.`receipt` AS `receipt.receipt`,
        `product`.`name` AS `product.name`,
        `purchase`.`unit` AS `purchase.unit`,
        `purchase`.`qty` AS `purchase.qty`,
        `purchase`.`price` AS `purchase.price`,
        `purchase`.`vat` AS `purchase.vat`,
        `receipt`.`amount` AS `receipt.amount`
    FROM
        `receipt`
    LEFT JOIN `purchase` ON `purchase`.`receipt` = `receipt`.`receipt`
    LEFT JOIN `product` ON `purchase`.`product` = `product`.`product`
)
SELECT *
FROM `purchase_data`

UNION ALL

SELECT
    NULL AS `receipt.receipt`,
    NULL AS `product.name`,
    NULL AS `purchase.unit`,
    NULL AS `purchase.qty`,
    NULL AS `purchase.price`,
    NULL AS `purchase.vat`,
    NULL AS `receipt.amount`;
