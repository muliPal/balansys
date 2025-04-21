with 
    mysupplier as (
        select
            #
            #The row index of the supplier homozone
            supplier.supplier as `supplier.supplier`,
            #
            supplier.name as `supplier.name`,
            business.title as `business.title`,
            business.tel as `business.tel`,
            business.email as `business.email`,
            business.address as `business.address`,
            business.pin as `business.pin`
        from
            supplier
            left join business on supplier.business = business.business        
    ) 
    select 
        mysupplier.*
    from
        receipt
        left join mysupplier on receipt.supplier = mysupplier.`supplier.supplier`
    