select
    product.name as product,
    purchase.qty as qty,
    purchase.unit as unit,
    purchase.price as price,
    purchase.vat as vat
from
    purchase
inner join product on product.purchase = product.product;

