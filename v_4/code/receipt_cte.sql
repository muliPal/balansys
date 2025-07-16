 WITH receipt_data AS (
                SELECT
                    receipt.receipt as `receipt.receipt`,
                    receipt.date AS `receipt.date`,
                    receipt.ref AS `receipt.ref`,
                    supplier.name AS `supplier.name`,
                    supplier.name AS `supplier.kra_pin`,
                    consumer.name AS `consumer.name`
                FROM
                    receipt
                    INNER JOIN supplier ON receipt.supplier = supplier.supplier
                    INNER JOIN consumer ON receipt.consumer = consumer.consumer
                )
                SELECT * FROM receipt_data
                UNION ALL
                SELECT
                     NULL AS `receipt.receipt`,
                    NULL AS `receipt.date`,
                    NULL AS `receipt.ref`,
                    NULL AS `supplier.name`,
                    NULL AS `supplier.kra_pin`,
                    NULL AS `consumer.name`