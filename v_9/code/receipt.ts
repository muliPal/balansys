/*
Concepts
    -margin
    -creator
    -reviewer
*/
import {
    grid, cell, root,table_options, tabulator, homo, plan,
    homozone, heterozone, driver_source
} from "../../../outlook/v/zone/zone.js";
//
//
import { 
    view,view_options, label, mutall_error, basic_value 
} from "../../../schema/v/code/schema.js";

import {
    creator, reviewer,
} from "./panel.js";
//
//The panel that shows the header of a receipt
export class receipt extends heterozone{
    //
    //
    constructor(parent?:view, options?:table_options){
        
        //
        const sql =
            `select 
                #
                #The row index of the this homozone
                image.image as \`image.image\`,
                receipt.receipt as \`receipt.receipt\`,
                #
                receipt.ref as \`receipt.ref\`,
                supplier.name as \`supplier.name\`,
                receipt.date as \`receipt.date\`,
                receipt.amount as \`receipt.amount\`,
                receipt.description as \`receipt.description\`
            from
                receipt
                #
                #This join is needed for linking supplier to receipt, if supplier exists
                left join supplier on receipt.supplier = supplier.supplier
                #
                #Link receipt to image
                inner join image on receipt.image = image.image
                inner join consumer on receipt.consumer = consumer.consumer 
            limit 100   
            `;
        //
        //
        const ds:driver_source ={
            type:'sql',
            sql,
            row_index:'image.image',
            dbname:'balansys'  
        }
        //
        //Create the main homozone, sharing options and paremt with the heterozone
        const main:homozone = new homozone(ds, options, parent);
        //
        //
        //Classify the header and footer sections for freezing purposes
        const header:table_options = {class_name:'header'}
        const footer:table_options = {class_name:'footer'}
        //
        //The plan of the heterozone is based a main homozone. We cannot create
        //receipts (but we can ctreate inages that define receipts). There is
        //reviewer on the right that opens up a record and a reviewer on the right
        //that saves saves the record. Refereshing the panel is optional 
        const plan:plan = [
            //
            //The header
            [new homozone(undefined, header), new homozone(undefined, header), main.get_header(header), new homozone()],
            //
            //The body
            [main.get_leftie(), new reviewer(main, 0), main, new reviewer(main, 0)],
            //
            //The footer
            [new homozone(undefined, footer), new homozone(undefined, footer), new creator(main, 1, footer), new homozone(undefined, footer)]
        ];    
        //
        const defaults:table_options = {
            //
            ticks:[
                //The receipt primary key is important for saving a receipt but need
                //not be visible
                ['receipt.receipt', {hidden:true}],
            ],
            
        }
        //
        //Defalt options are overriden by the user defined ones    
        super(plan, {...defaults, ...options}, parent);
        
    }   
}
