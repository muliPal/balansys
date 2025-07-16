/*
Concepts
    -margin
    -creator
    -reviewer
*/
import { homozone, heterozone } from "../../../outlook/v/zone/zone.js";
import { creator, reviewer, } from "./panel.js";
//
//The panel that shows the header of a receipt
export class receipt extends heterozone {
    //
    //
    constructor(parent, options) {
        //
        const sql = `select 
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
        const ds = {
            type: 'sql',
            sql,
            row_index: 'image.image',
            dbname: 'balansys'
        };
        //
        //Create the main homozone, sharing options and paremt with the heterozone
        const main = new homozone(ds, options, parent);
        //
        //
        //Classify the header and footer sections for freezing purposes
        const header = { class_name: 'header' };
        const footer = { class_name: 'footer' };
        //
        //The plan of the heterozone is based a main homozone. We cannot create
        //receipts (but we can ctreate inages that define receipts). There is
        //reviewer on the right that opens up a record and a reviewer on the right
        //that saves saves the record. Refereshing the panel is optional 
        const plan = [
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
        const defaults = {
            //
            ticks: [
                //The receipt primary key is important for saving a receipt but need
                //not be visible
                ['receipt.receipt', { hidden: true }],
            ],
        };
        //
        //Defalt options are overriden by the user defined ones    
        super(plan, { ...defaults, ...options }, parent);
    }
}
