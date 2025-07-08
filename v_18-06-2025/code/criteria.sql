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
