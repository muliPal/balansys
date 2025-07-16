//
//This file is being developed as part of the mutall library
import { panel, page } from "./panel.js";
//
//Transcription is the page that helps us to digitize images of physical receipts
export class transcription extends page {
    parent;
    //
    constructor(
    //
    //To implement the view has-a hierarchy
    parent) {
        //Options for controlling the transcription page
        const options = {
            dbname: 'balansys'
        };
        //
        //
        super(parent, options);
        this.parent = parent;
        //
        //Create the 4 panels of postek, using this transcription as the parent
        this.panels = [
            new file(this),
            new image(this),
            new receipt(this),
            new purchase(this),
        ];
    }
}
//The panel that shows the scanned image files
class file extends panel {
    //
    constructor(parent) {
        //
        const sql = `
            select 
                #
                #The row index of the image homozone
                image.image as \`image.image\`,
                #
                concat(folder.full_name, "/", image.short_name) as \`path\`
            from
                image
                inner join folder on image.folder = folder.folder        
            `;
        //
        //    
        const ds = {
            type: 'sql',
            sql,
            row_index: 'image.image'
        };
        //
        //Options for controlling file panel
        const options = {
            //
            //Files will be shown in read-nly mode
            io_type: 'read_only',
        };
        //    
        super(ds, options, parent);
    }
}
//The panel that shows the actual scanned images of receipts 
class image extends panel {
    //
    constructor(parent) {
        //
        //Fomulate the root path
        const root = `/image`;
        //
        const sql = `
            select 
                #
                #The row index of the file homozone
                image.image as \`image.image\`,
                #
                #Construct the image column fit for driving href in an img element
                concat_ws('/', '${root}', folder.full_name, image.short_name) as image
            from
                image
                inner join folder on image.folder = folder.folder    
            `;
        //    
        const ds = {
            type: 'sql',
            sql,
            row_index: 'image.image'
        };
        //
        //
        const options = {
            io_type: 'image'
        };
        //    
        super(ds, options, parent);
    }
}
//The panel that shows the header of a receipt
class receipt extends panel {
    //
    constructor(parent) {
        //
        const sql = `WITH receipt_data AS (
                SELECT
                    receipt.receipt as \`receipt.receipt\`,
                    receipt.date AS \`receipt.date\`,
                    receipt.ref AS \`receipt.ref\`,
                    supplier.name AS \`supplier.name\`,
                    supplier.name AS \`supplier.kra_pin\`,
                    consumer.name AS \`consumer.name\`
                FROM
                    receipt
                    left JOIN supplier ON receipt.supplier = supplier.supplier
                    left JOIN consumer ON receipt.consumer = consumer.consumer
                )
                SELECT * FROM receipt_data
                UNION ALL
                SELECT
                     NULL AS \`receipt.receipt\`,
                    NULL AS \`receipt.date\`,
                    NULL AS \`receipt.ref\`,
                    NULL AS \`supplier.name\`,
                    NULL AS \`supplier.kra_pin\`,
                    NULL AS \`consumer.name\`
                   `;
        //    
        const ds = {
            type: 'sql',
            sql,
            row_index: 'receipt.receipt'
        };
        const options = {};
        //    
        super(ds, options, parent);
    }
}
//The panel that shows purchase in a receipt 
class purchase extends panel {
    //
    constructor(parent) {
        //
        const sql = `with purchase_data as(
        select
            purchase.purchase as \`purchase.purchase\`,
            product.name as \`product.name\`,
            purchase.unit as \`purchase.unit\`,
            purchase.qty as \`purchase.qty\`,
            purchase.price as \`purchase.price\`,
            purchase.vat as \`purchase.vat\`,
            receipt.amount as \`receipt.amount\`
        from
            receipt
        left join purchase on purchase.receipt=purchase.purchase
        left join product on purchase.product=product.product
        )
        select * from purchase_data
        union all
        select
            null as \`purchase.purchase\`,
            null as \`product.name\`,
            null as \`purchase.unit\`,
            null as \`purchase.qty\`,
            null as \`purchase.price\`,
            null as \`purchase.vat\`,
            null as \`receipt.amount\`
            `;
        //    
        const ds = {
            type: 'sql',
            sql,
            row_index: 'purchase.purchase'
        };
        const options = {};
        //    
        super(ds, options, parent);
    }
}
