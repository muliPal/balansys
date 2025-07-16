
select 
                #
                #The row index of the this homozone
                purchase.purchase,
                #
                product.name as `product.name`,
                purchase.qty as `purchase.qty`,
                purchase.price as `purchase.price`,
                purchase.unit as `purchase.unit`,
                product.code as `product.code`
            from
                purchase
                #
                #Link purchase to image
                inner join receipt on purchase.receipt = receipt.receipt
                inner join image on receipt.image = image.image 
                inner join product on purchase.product=product.product 