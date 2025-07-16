select
  receipt.date as  `receipt.date` ,
  receipt.ref as  `receipt.ref`,
  supplier.name as `supplier.name`,
  consumer.name as  `consumer.name`
from
    receipt
    inner join supplier on receipt.supplier=supplier.supplier
    inner join consumer on receipt.consumer=consumer.consumer
