
        
            select 
                #
                #The row index of the image homozone
                image.image as `image.image`,
                consumer.name,
                #
                concat(folder.full_name, "/", image.short_name) as `path`
            from
                image
                inner join folder on image.folder = folder.folder
                inner join receipt on receipt.image = image.image
                inner join consumer on receipt.consumer = consumer.consumer        
           
        #
        #Add the condition that limits images to the current consumer
        where 
            consumer.consumer = 4
        