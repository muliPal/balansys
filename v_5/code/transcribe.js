//
//import the view class
import { view } from "../../../schema/v/code/schema.js";
import { homo, hetero } from "../../../outlook/v/zone/zone.js";
//
//This page is representing the transcription page as encountered in our mock up
export class mock_up extends view {
    //
    //call the parent class.
    constructor() {
        super();
    }
    //
    //Here we show the list of image files in the file section not from first princeples but
    //using the zone library.
    //
    async show_files() {
        //
        //Formulating an sql statement for retrieving the file names from the database.
        //Following the "zone standards"
        const statement = `
            select
                #
                #this is the row indexing column.It will not be displayed by default
                image,
                #
                #show the file name witout redundancy
                full_name
            from
                image`;
        //
        //Use the above sql statement to define the data source for your zone.
        const ds = {
            //
            //The source of data for this zone is the an sql statement
            type: 'sql',
            //
            //Specify the sql statement
            sql: statement,
            //
            //Specify the column that will be used as our row index.
            row_index: 'image',
            //
            //Specify the database source against which to run this sql.
            dbname: 'balansys'
        };
        //
        //Define the options that we use for controlling the zone and driver_source
        // is one of them
        const options = {
            //
            //Specify where to anchor the files as a css.
            anchor: '#file',
            io_type: 'read_only'
        };
        //
        //use the options to define the files homozone.
        const zone = new homo.zone(ds, options);
        //
        //show the homozone
        zone.show();
    }
    //
    //Show receipt images in the image section.
    //
    async show_images() {
        //
        //Define sql to retrieve the file names from the db
        const sql = `
            select
               substring(full_name,19) as name
            from
                image
        `;
        //
        //Execute the sql on the balansys database
        const result = await this.exec_php(
        //
        //the php class to execute on the server
        'database', 
        //
        //the constructor arguments
        ['balansys'], 
        //
        //the method we want to execute on the specified class
        'get_sql_data', 
        //
        //the method arguments
        [sql]);
        //
        //Get the section to anchor the images
        const image_section = this.get_element('image');
        //
        //Loop through all the filenames and for each create an img.
        for (let i = 0; i < result.length; i++) {
            //
            //Create the image tag
            const img = this.create_element(
            //
            //the type of element we want to create
            'img', 
            //
            //the section to anchor it on our document
            image_section);
            //
            //Access the image name from the results
            const name = result[i].name;
            //
            //update the src of the image element to the file name
            img.src = name;
        }
    }
    //
    //My mock up comprises of four sections, viz., file, image, receipt and purchase.
    //This method shows all of these sections in terms of zones(as encountered in the zone library).
    async show() {
        //
        //Here we show the list of image files section.
        await this.show_files();
        //
        //Show receipt images in the image section.
        await this.show_images();
        //
        //Show the receipt headers in the corresponding section.
        await this.show_receipt();
        //
        //Show the receipt details (as purchases )in the matching section.
        await this.show_purchase();
    }
    //
    //On this method, i intend to show the receipt data with headers and empty inputs
    async show_receipt() {
        //
        //Formulating an sql statement for retrieving the file names from the database.
        //Following the "zone standards"
        const statement = `
            WITH receipt_data AS (
                SELECT
                    receipt.receipt as \`receipt.receipt\`,
                    receipt.date AS \`receipt.date\`,
                    receipt.ref AS \`receipt.ref\`,
                    supplier.name AS \`supplier.name\`,
                    supplier.name AS \`supplier.kra_pin\`,
                    consumer.name AS \`consumer.name\`
                FROM
                    receipt
                    INNER JOIN supplier ON receipt.supplier = supplier.supplier
                    INNER JOIN consumer ON receipt.consumer = consumer.consumer
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
        //Use the above sql statement to define the data source for your zone.
        const ds = {
            //
            //The source of data for this zone is the an sql statement
            type: 'sql',
            //
            //Specify the sql statement
            sql: statement,
            //
            //Specify the column that will be used as our row index.
            row_index: 'receipt.receipt',
            //
            //Specify the database source against which to run this sql.
            dbname: 'balansys'
        };
        //
        //Define the options that we use for controlling the zone and driver_source
        // is one of them
        const options = {
            io_type: 'read_only'
        };
        //
        //use the options to define the files homozone.
        const body = new homo.zone(ds, options);
        //
        //Define a plan for the heterozone
        const plan = [
            [body.get_header()],
            [body]
        ];
        //Define the options of the heterozone
        const hetero_options = {
            //
            //Specify where to anchor the files as a css.
            anchor: '#receipt',
        };
        //
        //use the plan to create the heterozone
        const zone = new hetero.zone(plan, undefined, hetero_options);
        //
        //show the homozone
        zone.show();
    }
    //
    //On this method, i intend to show the purchase data with headers and empty inputs
    async show_purchase() {
        //
        //Formulating an sql statement for retrieving the file names from the database.
        //Following the "zone standards"
        const statement = `
        with purchase_data as(
        select
            receipt.receipt as \`receipt.receipt\`,
            product.name as \`product.name\`,
            purchase.unit as \`purchase.unit\`,
            purchase.qty as \`purchase.qty\`,
            purchase.price as \`purchase.price\`,
            purchase.vat as \`purchase.vat\`,
            receipt.amount as \`receipt.amount\`
        from
            receipt
        inner join purchase on purchase.receipt=purchase.purchase
        inner join product on purchase.product=product.product
        )
        select * from purchase_data
        union all
        select
            null as \`receipt.receipt\`,
            null as \`product.name\`,
            null as \`purchase.unit\`,
            null as \`purchase.qty\`,
            null as \`purchase.price\`,
            null as \`purchase.vat\`,
            null as \`receipt.amount\`
        `;
        //
        //Use the above sql statement to define the data source for your zone.
        const ds = {
            //
            //The source of data for this zone is the an sql statement
            type: 'sql',
            //
            //Specify the sql statement
            sql: statement,
            //
            //Specify the column that will be used as our row index.
            row_index: 'receipt.receipt',
            //
            //Specify the database source against which to run this sql.
            dbname: 'balansys'
        };
        //
        //Define the options that we use for controlling the zone and driver_source
        // is one of them
        const options = {
            io_type: 'read_only'
        };
        //
        //use the options to define the files homozone.
        const body = new homo.zone(ds, options);
        //
        //Define a plan for the heterozone
        const plan = [
            [body.get_header()],
            [body]
        ];
        //Define the options of the heterozone
        const hetero_options = {
            //
            //Specify where to anchor the files as a css.
            anchor: '#purchase',
        };
        //
        //use the plan to create the heterozone
        const zone = new hetero.zone(plan, undefined, hetero_options);
        //
        //show the homozone
        zone.show();
    }
}
