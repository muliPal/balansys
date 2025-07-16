import {driver_source,table_options, } from "../../../outlook/v/zone/zone.js";
import { view,view_options, label } from "../../../schema/v/code/schema.js";
//
//This file is being developed as part of the mutall library
import {panel, page, panel_options} from "./panel.js";

//
//Transcription is the page that helps us to digitize images of physical receipts
export class transcription extends page{
    //
    constructor(
        //
        //To implement the view has-a hierarchy
        public parent?:view,
        
    ){
        //Options for controlling the transcription page
        const options:table_options = {
            dbname:'balansys'
        }
        //
        //
        super(parent, options);
        //
        //Create the 4 panels of postek, using this transcription as the parent
        this.panels = [
            new file(this),
            new image(this),
            new consumer(this),
            new receipt(this),
            new purchase(this),
            /*
            new total(this)
            */
        ]
    }
}

//The panel that shows the scanned image files
class file extends panel{
    //
    constructor(parent:transcription){
        //
        //
        const sql =`
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
        const ds:driver_source = {
            type:'sql',
            sql,
            row_index:'image.image'
        };
        //
        //Options for controlling file panel
        const options:table_options = {
            //
            //Files will be shown in read-nly mode
            io_type:'read_only',
        }
        //    
        super(ds,  options, parent, 'path');
    }   
}

//The panel that shows the actual scanned images of receipts 
class image extends panel{
    //
    constructor(parent:transcription){
        //
        //Fomulate the root path
        const root = `/balansys/images`;
        //
        const sql =`
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
        const ds:driver_source = {
            type:'sql',
            sql,
            row_index:'image.image'
        };
        //
        //
        const options:table_options = {
            io_type:'image'
        }
        //    
        super(ds,  options, parent,'image');
    }   
}

//The panel that shows the owners/consumers of thses receipts
class consumer extends panel{
    //
    constructor(parent:transcription){
        //
        const sql =`
            select 
                #
                #The row index of the image homozone
                consumer.consumer as \`consumer.consumer\`,
                #
                #Display short name of consumer
                consumer.name as \`consumer.name\`,
                business.title as \`business.title\`
            from
                consumer
                #
                #Join supplier to business if business is available
                left join business on consumer.business = business.business
                #
                #Link consumer to image
                inner join receipt  on receipt.consumer = consumer.consumer
                inner join image on receipt.image=image.image
            `;
        //
        //    
        const source:driver_source = {
            type:'sql',
            sql,
            row_index:'consumer.consumer'
        };
        //
        //Options for controlling the consumer
        //
        //Define the business label
        const business_name:label = [undefined, 'business', 'name'];
        //
        const options:panel_options = {
            //
            //Transpose the data source
            transposed:true, 
            //
            //Consumer name is the same as the business name. NB. This is an 
            //example of nested options.
            ticks:[
                {mark:'consumer.name', options:{subjects:[business_name]}}, 
            ]
        }
        //    
        super(source,  options, parent, 'consumer.name');
    } 
    //
    //This method does not apply to consumer
    show_selection(): void {
        //
        //Get the row index

    }  
}


//The panel that shows the header of a receipt
class receipt extends panel{
    //
    constructor(parent:transcription){
        //
        const sql =
            `select 
                #
                #The row index of the this homozone
                receipt.receipt as \`receipt.receipt\`,
                #
                receipt.ref as \`receipt.ref\`,
                receipt.date as \`receipt.date\`,
                receipt.amount as \`receipt.amount\`,
                receipt.description as \`receipt.description\`,
                supplier.name as \`supplier.name\`
            from
                receipt
                #
                #This join is needed for linking supplier to receipt, if supplier exists
                left join supplier on receipt.supplier = supplier.supplier
                #
                #Link receipt to image
                inner join image on receipt.image = image.image
                
            `;
        //    
        const ds:driver_source = {
            type:'sql',
            sql,
            row_index:'receipt.receipt'
        };
        const options:table_options = {}
        //    
        super(ds,  options, parent, 'receipt.ref');
    }   
}

//The panel that shows purchase in a receipt 
class purchase extends panel{
    //
    constructor(parent:transcription){
        //
        const sql =
            `select 
                #
                #The row index of the this homozone
                purchase.purchase as \`purchase.purchase\`,
                #
                purchase.ref as \`purchase.ref\`,
                product.name as \`product.name\`,
                purchase.qty as \`purchase.qty\`,
                purchase.price as \`purchase.price\`,
                purchase.unit as \`purchase.unit\`,
                product.code as \`product.code\`
            from
                purchase
                #
                #Link purchase to image
                inner join receipt on purchase.receipt = receipt.receipt
                inner join image on receipt.image = image.image
                inner join product on purchase.product=product.product
            #Rxpand teh sql to include an empty row    
            union
            select
                #
                #The row index of the this homozone
                null as \`purchase.purchase\`,
                #
                null \`as purchase.ref\`,
                null as  \`product.name\`,
                null as \`purchase.qty\`,
                null as \`purchase.price\`,
                null as \`purchase.unit\`,
                null as \`product.code\`
            `;
        //    
        const ds:driver_source = {
            type:'sql',
            sql,
            row_index:'purchase.purchase'
        };
        const options:table_options = {}
        //    
        super(ds,  options, parent, 'purchase.ref');
    }   
    //
    //This show method is different form the others because it only displays
    //the purchases related to the selected index
    //Modify the sql for the heterozone to include the condition implied by the
    //selected index
    async show(): Promise<void> {} 
}