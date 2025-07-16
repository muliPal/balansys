with purchase_data as(
select
    product.name as `product.name`,
    purchase.unit as `purchase.unit`,
    purchase.qty as `purchase.qty`,
    purchase.price as `purchase.price`,
    purchase.vat as `purchase.vat`,
    receipt.amount as `receipt.amount`
from
    receipt
inner join purchase on purchase.receipt=purchase.purchase
inner join product on purchase.product=product.product
)
select * from purchase_data
union all
select
    null as `product.name`,
    null as `purchase.unit`,
    null as `purchase.qty`,
    null as `purchase.price`,
    null as `purchase.vat`,
    null as `receipt.amount`