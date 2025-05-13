import { homozone, panel } from "../../../outlook/v/zone/zone.js";
import { mutall_error } from "../../../schema/v/code/schema.js";
import { resizer } from "../../../resizer/v/code/resize.js";
// import {authoriser} from "../../../authoriser/v/code/authoriser.js"
//
//
//A general panel purposely built for this transcription application
class mypanel extends panel.panel {
    sql;
    //
    //The constructor of this panel exposes assumes teh driver is of the sql type
    // and therfore exposes the the sql statement (rather than the driver)
    constructor(sql, row_index, anchor, options, parent) {
        //
        //Define the general data source for the panels in this module
        const ds = {
            type: 'sql',
            sql,
            row_index,
            dbname: 'balansys'
        };
        //
        super(ds, anchor, options, parent);
        this.sql = sql;
    }
}
//A peer is a panel that represent a diferent view of the same image. This
//class allows us to program peers consistently, i.e., without caring how they
//are contained. That means putting panels in a group does not make them peers!
export class peer extends mypanel {
    //
    constructor(sql, row_index_cname, anchor, options, 
    //
    //Peers are managed as a unit,
    parent) {
        super(sql, row_index_cname, anchor, options, parent);
    }
    //
    //If you click on a peer, the transcription image primary key changes 
    //accordingly, causing all other peers to show their new selections. 
    //The consumer is unaffected. 
    async onclick(cell, evt) {
        //
        //Perform the action being overriden, i.e, the cell selection
        await super.onclick(cell, evt);
        //
        //Show selection on related panels
        //
        //Get the new image key.
        const image_pk = cell.index[this.orientation];
        //
        //Ignore this click if the image has not changed after the click (1)
        if (image_pk === transcription.image_pk)
            return;
        //
        //Update the tree view image (to support the operation just tested in (1))
        transcription.image_pk = image_pk;
        //
        //Get the root view, i.e., the transcription view
        const tv = this.search_root_view();
        //
        //Redraw the supplier panel
        await tv.supplier.show();
        //
        //Update the selection of the tanscription group, except the one where 
        // the click has occurred
        tv.image_group.show_selection(cell);
        //
        //Re-show the purchases
        await tv.purchase.show();
    }
    //
    //Show the selection of this peer, by highlighting the image followed
    // by a scrolling the selected cell into view. The given cell was the one 
    // clicked on. We use it to determin if this peer needs to be considered
    // for showing of selection
    async show_selection(clicked) {
        //
        //Do not repaint this peer if the clicked cell comes from this zone 
        if (clicked?.parent === this)
            return;
        //
        //Get the indexing coordinates of the cell to select
        //
        //Get the primary key of the image to show; its the first coordinate
        let pk = transcription.image_pk;
        //
        //If the primary key is absent, then assume that this is a new consumer
        // Set pk to be the first image in this panel. It should be shared with 
        // all the peers
        if (pk === undefined)
            pk = (transcription.image_pk = this.get_1st_image());
        //
        //Get the index of the desired cell
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell2 = this.cells_indexed?.[row]?.[col];
        //
        //Its an error if this cell cannot be found
        if (!cell2)
            throw new mutall_error(`Unable to find cell ['${row}', '${col}'] of this peer`);
        //
        //Select the indexed grid
        cell2.select();
        //
        //Scroll the grid to the view so that the record shows at the start of
        //the list view
        cell2.td.scrollIntoView({ block: 'center', inline: 'center' });
    }
    //Returns the primary key of the first record in this panel
    get_1st_image() {
        //
        //Get the orientation of this homozone; it is designed so that the axis
        // parallel to this alines with the primary keys
        const dim = this.orientation;
        //
        //Get thh axis primary key axis 
        const axis = this.axes[dim];
        //
        //Get the first mark
        const mark = axis.ticks[0].mark;
        //
        //return the mark
        return mark;
    }
    //Before showing a peer, adjust its driver sql to take the current
    //consumer setting into account
    get_modified_driver_sql() {
        //
        //Add the condition that limits images to the current consumer if there is one
        const where = transcription.consumer_pk ? `where consumer.consumer = ${transcription.consumer_pk}` : '';
        //
        //Complete the sql, limiting the display to 20 case in this debugging phase
        const sql = `
            ${this.sql}
            ${where}
                #
                #During this development phase, limit to 20 images. Consider 
                #pagination in future
                 limit 20
            `;
        //
        //return the sql
        return sql;
    }
}
//
//Transcription is the page that helps us to digitize images of physical receipts
export class transcription extends panel.group {
    parent;
    resizer;
    //
    // Add the authoriser
    // public authoriser=new authoriser(this,'#launch')
    //
    image_group;
    purchase;
    consumer;
    supplier;
    //
    //Set the initial display condition manually set at 3, 300, meaning the 300th 
    // image of the 3rd consumer. This number changes on clicking a peer or 
    // consumer pannel. Display is defined as static so that we can access it 
    // from any where, i.e., without following the view has-a hierarchy. 
    static Initial_display = { consumer: 2, image: 0 };
    //
    //The following properties are used to control the display of the transcription
    //and need to be accessed from may places. They are defined as static to support
    //this requirement.
    //
    //This represents the image that generally controls what we see in 
    // the peer panels and the purchases
    static image_pk;
    //
    //The current consumer primary key
    static consumer_pk;
    //
    zoom = 1;
    rotation = 0;
    translateX = 0;
    translateY = 0;
    constructor(
    //
    //To implement the view has-a hierarchy
    parent) {
        //Options for controlling the transcription page
        const options = {
            dbname: 'balansys'
        };
        //Use an empty list to create the group
        super([], parent, options);
        this.parent = parent;
        //
        //NB. Suplier is not a direct ember of the transcription
        this.supplier = new supplier(this);
        //
        //Create the 3 members of the transcription group
        this.members = [
            this.consumer = new consumer(this),
            this.image_group = new image_group(this),
            this.purchase = new purchase(this),
        ];
    }
    //
    // the show method
    async show() {
        await super.show();
        this.resizer = new resizer(document.body, {
            min_panel_size: 25,
            threshold: 5,
        });
    }
    //
    //Zoom in to the selected image group member
    zoom_in(dir) {
        //
        //Get the current image element
        let image = this.document.querySelector('.selected>img');
        //
        //Define the zoom resolution
        const resolution = 0.1;
        //
        //Get scaling multiplier, based on the zoom direction
        this.zoom = dir ? this.zoom + resolution : this.zoom - resolution;
        //
        //Apply the saling to the image using transform 
        image.style.transform = `scale(${this.zoom})`;
    }
    //    
    // Rotate the selected image group member
    rotate(dir) {
        //
        // Get the current image element
        let image = this.document.querySelector('.selected>img');
        if (!image)
            return; // Avoid errors if no image is selected
        //
        // Define the rotation resolution
        const resolution = 90;
        //
        // Update rotation value based on direction
        this.rotation = dir ? this.rotation + resolution : this.rotation - resolution;
        //
        // Apply transformation: translate + scale + rotate
        image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
    }
    // Move the image in X and Y directions
    translate(dx, dy) {
        //
        // Get the currently selected image
        let image = this.document.querySelector('.selected>img');
        if (!image)
            return;
        //
        // Update translation values
        this.translateX += dx;
        this.translateY += dy;
        //
        // Apply transformations: translate + scale + rotate
        image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
    }
    pan(dx, dy) {
        //
        // Get the currently selected image
        let image = this.document.querySelector('.selected>img');
        if (!image)
            return;
        //
        // Update translation values
        this.translateX += dx;
        this.translateY += dy;
        //
        // Apply all transformations correctly
        image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
    }
    //Complete the construction of a page by running asynchronous methods
    async init() {
        //
        //Get the relative consumer and image display positions
        const { consumer, image } = transcription.Initial_display;
        //
        //Initialize the consumer and image primary keys
        transcription.consumer_pk = await this.get_consumer_pk(consumer);
        transcription.image_pk = await this.get_initial_image_pk(image);
    }
    //
    //Returns the primary key of the initial image to scroll to.
    async get_initial_image_pk(i) {
        //
        //Formulate the sql to retrieve only the i'th image
        const sql = `
            select 
                image.image 
            from 
                image
                inner join receipt on receipt.image = image.image
                inner join consumer on receipt.consumer = consumer.consumer 
            where
                consumer.consumer = ${transcription.consumer_pk}
            limit 1
            offset ${i}          
        `;
        //
        //Run the query
        const result = await this.exec_php('database', ['balansys', false], 'get_sql_data', [sql]);
        //
        //Return undedined if no image was found
        if (result.length === 0)
            return undefined;
        //
        //Extract and return the resulting string
        return String(result[0].image);
    }
    //Initialize the consumer primary key, using the display setting
    async get_consumer_pk(i) {
        //
        //Formulate the sql to retrieve only the i'th consumer
        const sql = `
            select 
                consumer 
            from 
                consumer 
            order by consumer 
            limit 1 offset ${i}`;
        //
        //Run the query
        const result = await this.exec_php('database', ['balansys', false], 'get_sql_data', [sql]);
        //
        //If there are not consumers return undefined
        if (result.length === 0)
            undefined;
        //
        //Extract and return the resulting string
        return String(result[0].consumer);
    }
}
//The panel that shows the owners/consumers of thses receipts
export class consumer extends mypanel {
    //
    //Save the display settings here.The map indexing key is the consumer primary 
    //key. The indexed string is the image primary key. NB. A map is used as it
    //does not break down if you retrieve a non existing key. The structure
    //{[index:number]:number}, I think, would throw an exception, similar to
    //how array indexing behaves. Investigate this assumption
    displays = new Map();
    //
    //The creator subpanel has this consumer as the homozone; its a margin oriented
    // columnwise    
    creator = new panel.creator(this, 1);
    //The plan of an image is a standard panel with ability to create new
    //images 
    plan = [
        //
        //The headers
        [new homozone(), this.get_header(), new homozone()],
        //
        //The left reviewer is unchecked and will open the record if checked; the 
        // right review is already checked and will be used for wriring the record
        [
            new panel.reviewer(this, 0, false, 'open'),
            this,
            new panel.reviewer(this, 0, true, 'write')
        ],
        //
        //The record create functionality. The only reviewer on the right is unchecked 
        // will write the record if checked
        [
            new homozone(),
            this.creator,
            new panel.reviewer(this.creator, 0, false, 'write')
        ],
    ];
    //
    constructor(parent) {
        //
        const sql = `
            select 
                #
                #The row index of the image homozone
                consumer.consumer as \`consumer.consumer\`,
                #
                #Display short name of consumer
                consumer.name as \`consumer.name\`,
                 #
                #Note the # is a spciel symbol in mySql, so use : as the alias
                business.title as \`business.title:consumer\`
            from
                consumer
                #
                #Join supplier to business if business is available
                left join business on consumer.business = business.business
            order by consumer.consumer    
            `;
        //
        //
        //Options for controlling the consumer
        //
        //Define the business label and alias it with the business title
        const business_name = [undefined, 'business', 'name', undefined, ['consumer']];
        //
        const options = {
            //
            ticks: [
                //
                //Add a label to support that a consumer name is the same as the 
                //business name. NB. This is an example of nested options.
                ['consumer.name', { labels: [business_name] }],
            ],
            //
            //The consumer zone is transposed. This needs more thought
            //transposed:true
        };
        //    
        super(sql, 'consumer.consumer', '#consumer', options, parent);
    }
    //
    //For a consumer, the sql is independent of any other panel. It never changes
    //So the driver needs no modification
    get_modified_driver_sql() { return; }
    //
    //Show the selected consumer, guided by display settings of the transcription 
    async show_selection() {
        //
        //Do not show any  consumer selection if there is no consumer primary key
        const pk = transcription.consumer_pk;
        if (!pk)
            return;
        //
        //Get the column index of the desired cell; it is the same one used for
        //displaying a selection
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell)
            throw new mutall_error(`No cell is found at coordinate [${row} ${col}] of consumer`);
        //
        //Now select the grid as a cell
        cell.select();
    }
    //
    // Override the default homozone click behavior to enable actions beyond 
    // simple cell selection. When clicking on a consumer, the consumer 
    // component of the display updates, and the image is restored to the last 
    // version associated with that consumer. This requires tracking the last 
    // image for each consumer. If no previous image exists, the default 
    // assumption is that the last image is at relative position 0.
    async onclick(cell, evt) {
        //
        //Carry out the default behaviour of selecting the cell
        cell.select();
        //
        //Extend the cell selection so that the rest of the trancription 
        // page is refreshed to match the new consumer (primary key)
        //
        //Set the consumer primary key to match the current cell selection; 
        // that depends on this consumer's orientation
        transcription.consumer_pk = cell.index[this.orientation];
        //
        //Get the last image primary key for this consumer.
        transcription.image_pk = this.displays.get(transcription.consumer_pk);
        //
        //Get the transcription view; its the root view of this app
        const trans = this.search_root_view();
        //
        //Show the transcription group members only, i.e., its not a complete
        //transcription show
        await trans.image_group.show();
        //
        //Show the transcription purchases
        await trans.purchase.show();
    }
}
//The panel that shows the details of the purchased items on a receipt 
class purchase extends mypanel {
    //
    //Define an sql for retrieving purchases unconditionally
    static sql = `
        select 
                #
                #The row index of the this homozone
                purchase.purchase as \`purchase.purchase\`,
                #
                purchase.ref as ref,
                product.code as code,
                product.name as \`product.name\`,
                purchase.qty as qty,
                purchase.unit as unit,
                purchase.price as price
            from
                purchase
                #
                #Link purchase to image
                inner join receipt on purchase.receipt = receipt.receipt
                inner join image on receipt.image = image.image
                inner join product on purchase.product=product.product
        `;
    //
    //The creator sub panel
    //
    //Set the options to cause the onblur event to be raised on the creator.
    //let options:table_options ;
    //creator = new panel.creator(this, 1, options );
    creator = new panel.creator(this, 1);
    //
    //The plan of a purchase allows us to create and review purchase.
    plan = [
        //
        //The headers for purchase should be styled as frozen
        [
            new homozone(null, { class_name: 'header' }),
            this.get_header({ class_name: 'header' }),
            new homozone(null, { class_name: 'header' })
        ],
        //
        //There is a review on both sides of the body with a row orientation
        [
            new panel.reviewer(this, 0, false, 'open'),
            this,
            new panel.reviewer(this, 0, true, 'write')
        ],
        //
        //The creator
        [
            new homozone(null),
            this.creator,
            new panel.reviewer(this.creator, 0, false, 'write')
        ],
    ];
    //
    constructor(parent) {
        //
        const options = {
            //
            //Make all the input fields visible. The default is auto. This does not
            //work. The reason is that init_table is called by the root zone. panel
            //is not a root zone; it is the heterozne. Try this workround: ensure 
            // pass the options to the organizing heterozone on construction.
            table_layout: 'fixed',
            //
            //Enriching the tick mark labels
            ticks: [
                ['ref', {}, [undefined, 'purchase', 'ref']],
                ['code', {}, [undefined, 'product', 'code']],
                ['product.name', {}, [undefined, 'product', 'name']],
                ['qty', {}, [undefined, 'purchase', 'qty']],
                ['price', {}, [undefined, 'purchase', 'price']],
                ['unit', {}, [undefined, 'product', 'unit'], [undefined, 'purchase', 'unit']],
            ]
        };
        //    
        super(purchase.sql, 'purchase.purchase', '#purchase', options, parent);
    }
    //
    //Here i implement onblur prefill using 'code' as my condition.
    //If there is a similar code in the database, then i prefil the rest of the row with 
    //the appropriate data
    async onblur(cell, evt) {
        await super.onblur(cell, evt);
        console.log('cell.value?.io');
        //
        // Step 1: Is this the cell of interest?if not, discontinue.
        if (cell.index[1] !== 'code')
            return;
        //
        //2.The cell is of interest, use it to prefill the rest of the records.
        //
        //2.1.Get the code
        const code = cell.io?.value;
        //
        //If the code is undefined, discontinue this process.
        if (code === undefined)
            return;
        //
        //If code is null, you discontinue
        if (code === null)
            return;
        //
        //3.Formulate an sql for retrieving the desired data.
        const sql = `
        select 
                purchase.ref as ref,
                product.code as code,
                product.name as \`product.name\`,
                purchase.qty as qty,
                purchase.unit as unit,
                purchase.price as price
            from
                purchase
                inner join product on purchase.product=product.product
        WHERE 
           code = '${code}'
        `;
        //
        //4.Execute the sql to get some result.
        const results = await this.exec_php('database', ['balansys', false], 'get_sql_data', [sql]);
        //
        //Test whether the result is empty
        if (results.length === 0)
            return;
        //
        //5.Prefill the rest of the records with the appropriate data.  
        this.prefill(results, cell);
    }
    //
    //Prefill the rest of the record with the appropriate results.
    //ref is the cell from which i lost focus.
    prefill(results, ref) {
        //
        // 1. Get the first result (assuming one result per code)
        const data = results[0];
        //
        // 2. Access the row index of the cell
        const row = ref.index[0];
        //
        //Get the parent homozone of the cell, This will help us to get the adjuscent cells to it.
        const parent = ref.parent;
        //
        //Go through the data keys using them as the column index to retrieve 
        // and fill the corresponding cell
        //
        //Ensure the parent has cells indexed.
        if (parent.cells_indexed === undefined)
            throw new mutall_error('indexed cells not found');
        //
        //Go through the keys and for each key, identify the corresponding
        //  cell and fill its value with appropriate data.
        for (const key in data) {
            //
            //Get the cell
            const input_cell = parent.cells_indexed[row][key];
            //
            //Proceed to filling the corresponding cells with appropriate data.
            //
            //Get the io of the cell
            const input_io = input_cell.io;
            //
            //Ensure io is present before proceeding to set the value.
            if (input_io === undefined)
                throw new mutall_error('io was not found');
            //
            //Set the value of the io to the value of the the current key in the data object
            input_io.value = data[key];
        }
    }
    //Override the default show panel behavior so that if no image is available
    //the panel is not shown
    async show() {
        //
        //If there is no image, do not show the purchases
        if (!transcription.image_pk)
            return;
        //
        //Show the default panel
        await super.show();
    }
    //Modify the sql of the purchase panel so that the display reflects the 
    //current image of the transcription view
    get_modified_driver_sql() {
        //
        //Make sure that the image is available
        if (!transcription.image_pk)
            throw new mutall_error('No image primary key found');
        //
        //Use the value to condition the purchase sql
        const sql = `
            ${this.sql}
            where image.image = '${transcription.image_pk}'
            #
            #Sort by ascending reference numbers
            order by purchase.ref
        `;
        //
        //Return the sql
        return sql;
    }
    //
    //Show the last (edit) row for a purchase selection. NB. Purchases are not 
    //transposed
    async show_selection() {
        //
        //Get the mark of the last tick in the row dimension as the row index
        const ticks = this.axes[this.orientation].ticks;
        //
        //If there are no purchases, then nothing can be selected
        if (ticks.length === 0)
            return;
        // 
        //Get the last row
        const row = ticks[ticks.length - 1].mark;
        //
        //The column index is the one one used for selection
        const col = this.selection_cname;
        //
        //Get the indexed cell from the indexed cells of this homozone
        const cell = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell)
            throw new mutall_error(`No cell is found at coordinate [${row}, ${col}]`);
        //
        //Select the cell
        cell.select();
    }
}
//The supplier is a panel that shows the suppliers of the purchased products
export class supplier extends mypanel {
    static sql = `
        with 
            mysupplier as (
                select
                    #
                    #The row index of the supplier homozone
                    supplier.supplier as \`supplier.supplier\`,
                    #
                    supplier.name as \`supplier.name\`,
                    business.title as \`business.title:supplier\`,
                    business.tel as \`business.tel:supplier\`,
                    business.email as \`business.email:supplier\`,
                    business.address as \`business.address:supplier\`,
                    supplier.pin as \`supplier.pin:supplier\`
                from
                    supplier
                    left join business on supplier.business = business.business        
            ) 
            select 
                image.image as \`image.image\`,
                mysupplier.*
            from
                image
                inner join receipt on receipt.image = image.image
                left join mysupplier on receipt.supplier = mysupplier.\`supplier.supplier\`
            `;
    //
    plan = [
        //
        //The headers. Give class names to headers to allow for easily freezing them
        [
            new homozone(null, { class_name: 'header' }),
            new homozone(null, { class_name: 'header' }),
            this.get_header({ class_name: 'header' }),
            new homozone(null, { class_name: 'header' })
        ],
        //
        //There is a reviewer on both sides of the body with a row orientation.
        //The left one is unchecked and used for openinng a record; the right one
        //is checked and used for writing the record
        [
            this.get_leftie(),
            new panel.reviewer(this, 0, false, 'open'),
            this,
            //
            //Do not refresh the panel after writing
            new panel.reviewer(this, 0, true, 'write', { refresh_after_write: false })
        ],
    ];
    //Create the constructor for the supplier panel
    constructor(parent) {
        //
        const row_index_cname = 'image.image';
        const options = {
            //
            //The receipt primary key is important for saving a receipt but need
            //not be visible
            ticks: [
                //
                //Hide the supplier primary key
                ['supplier.supplier', { hidden: true }],
                //
                //Associate the supplier with a business name. The business will
                //also need to be aliased with a matching title
                ['supplier.name', { labels: [[undefined, 'business', 'name', undefined, ['supplier']]] }]
            ],
        };
        //
        super(supplier.sql, row_index_cname, '#supplier', options, parent);
    }
    //
    // Here, I override the default onblur event to implement custom behavior:
    // 1. Retrieve the value of the first cell in the row (supplier.name).
    // 2. Use this value as a condition in an SQL query to fetch additional details 
    //    about the supplier from the database.
    // 3. If data for the supplier is found, prefill the rest of the row with the retrieved data.
    // 4. If no data is found, leave the row unchanged.
    // This custom onblur ensures that once the user finishes editing the supplier name,
    // the system intelligently populates the rest of the row to save time and reduce errors.
    async onblur(cell, evt) {
        await super.onblur(cell, evt);
        //
        // Step 1: Is this the cell of interest?if not, discontinue.
        if (cell.index[1] !== 'supplier.name')
            return;
        //
        //2.The cell is of interest, use it to prefill the rest of the records.
        //
        //2.1.Get the name of the supplier.
        const supplier_name = cell.io?.value;
        //
        //If the supplier name is undefined, discontinue this process.
        if (supplier_name === undefined)
            return;
        //
        //If supplier name is null, you discontinue
        if (supplier_name === null)
            return;
        //
        //3.Formulate an sql for retrieving the desired data.
        const sql = `
        SELECT 
            business.title as \`business.title:supplier\`,
            business.tel \`business.tel:supplier\`,
            business.email \`business.email:supplier\`,
            business.address \`business.address:supplier\`,
            supplier.pin \`supplier.pin:supplier\`
        FROM 
            business
            inner join supplier on supplier.business= business.business
            
        WHERE 
           supplier.name = '${supplier_name}'
        `;
        //
        //4.Execute the sql to get some result.
        const results = await this.exec_php('database', ['balansys', false], 'get_sql_data', [sql]);
        //
        //Test whether the result is empty
        if (results.length === 0)
            return;
        //
        //5.Prefill the rest of the records with the appropriate data.  
        this.prefill(results, cell);
    }
    //
    //Prefill the rest of the record with the appropriate results.
    //ref is the cell from which i lost focus.
    prefill(results, ref) {
        //
        // 1. Get the first result (assuming one result per supplier)
        const data = results[0];
        //
        // 2. Access the row index of the cell
        const row = ref.index[0];
        //
        //Get the parent homozone of the cell, This will help us to get the adjuscent cells to it.
        const parent = ref.parent;
        //
        //Go through the data keys using them as the column index to retrieve 
        // and fill the corresponding cell
        //
        //Ensure the parent has cells indexed.
        if (parent.cells_indexed === undefined)
            throw new mutall_error('indexed cells not found');
        //
        //Go through the keys and for each key, identify the corresponding
        //  cell and fill its value with appropriate data.
        for (const key in data) {
            //
            //Get the cell
            const input_cell = parent.cells_indexed[row][key];
            //
            //Proceed to filling the corresponding cells with appropriate data.
            //
            //Get the io of the cell
            const input_io = input_cell.io;
            //
            //Ensure io is present before proceeding to set the value.
            if (input_io === undefined)
                throw new mutall_error('io was not found');
            //
            //Set the value of the io to the value of the the current key in the data object
            input_io.value = data[key];
        }
    }
    //
    //Show the first/only row for a consumer selection.
    async show_selection() {
        //
        //Get the mark of the first tick in the row dimension as the row index
        //
        const ticks = this.axes[this.orientation].ticks;
        //
        //If there are no purchases, then nothing can be selected
        if (ticks.length === 0)
            return;
        // 
        //Get the first row index
        const x = ticks[0].mark;
        //
        //The 2nd index is the name of the column used for selection
        const y = this.selection_cname;
        //
        //Use the zone's orientation to determine the row and colum indices
        const [row, col] = this.orientate([x, this.orientation], y);
        //
        //Get the indexed cell from the indexed cells of this homozone
        const cell = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell)
            throw new mutall_error(`No cell is found at coordinate [${row}, ${col}]`);
        //
        //Select the cell
        cell.select();
    }
    //Modify the sql of the purchase panel so that the display reflects the 
    //current image of the transcription view
    get_modified_driver_sql() {
        //
        //Make sure that the image is available
        if (!transcription.image_pk)
            throw new mutall_error('No image primary key found');
        //
        //Use the value to condition the purchase sql
        const sql = `
            ${this.sql}
            where image.image = '${transcription.image_pk}'
        `;
        //
        //Return the sql
        return sql;
    }
}
//
//
export class image_group extends panel.group {
    //
    //The members of the image group share the same column name for row 
    // indexing
    row_index_cname = 'image.image';
    //
    constructor(
    //
    parent) {
        //
        //Crratting the group with no members.
        super([], parent);
        //
        //Creating the members using the created group
        this.members = [
            new file(this),
            new image(this),
            new receipt(this),
            this.parent.supplier,
        ];
    }
}
//The panel that shows the header of a receipt
class receipt extends peer {
    //
    static sql = `select 
        #
        #The row index of the this homozone
        image.image as \`image.image\`,
        #
        # Receipt should not be vsible
        receipt.receipt as \`receipt.receipt\`,
        #
        receipt.ref as \`receipt.ref\`,
		#
		#The accuracy of gemini transcribing the receipt
		receipt.accuracy,
       
        receipt.date as \`receipt.date\`,
        receipt.amount as \`receipt.amount\`,
        receipt.vat as \`receipt.vat\`,
		receipt.vat_reg_no as \`receipt.vat_reg_no\`,
		receipt.amount as \`receipt.vat_amount\`,
        #etr.staff_name as \`etr.staff_name\`,
        #etr.teller_num as \`etr.teller_num\`,
        #etr.invoice_num as \`etr.invoice_num\`,
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
        left join business on consumer.business = business.business
        left join etr on receipt.etr = etr.etr
        left join intern on receipt.intern = intern.intern 
    `;
    //
    //The receipt panel cannot create be used for creating new entries
    //(but we can create images that intern creates receipts). There is
    // reviewer on the right that opens up a record and another one on the right
    //that saves saves the record. Refreshing the panel is optional 
    plan = [
        //
        //The headers. Give class names to headers to allow for easily freezing them
        [
            new homozone(null, { class_name: 'header' }),
            new homozone(null, { class_name: 'header' }),
            this.get_header({ class_name: 'header' }),
            new homozone(null, { class_name: 'header' })
        ],
        //
        //There is a reviewer on both sides of the body with a row orientation.
        //The left one is unchecked and used for openinng a reford; the right one
        //is checked and used for writing the record
        [
            this.get_leftie(),
            new panel.reviewer(this, 0, false, 'open'),
            this,
            //
            //Do not refresh the panel after writing
            new panel.reviewer(this, 0, true, 'write', { refresh_after_write: false })
        ],
    ];
    //
    //The receipt panel is part of the image group; other members are file and image
    constructor(parent) {
        //
        //
        const options = {
            //
            //Set the size of all fields to be 10 characters
            size: 10,
            //
            //The receipt primary key is important for saving a receipt but need
            //not be visible
            ticks: [
                //
                //Hide the receipt primary key
                ['receipt.receipt', { hidden: true }],
                //
                //Shorten the displayed receipt reference number
                ['receipt.ref', { size: 10, maxlength: 10 }],
                //
                //Supplier name is the same as the business name
                ['supplier.name', {}, [undefined, 'business', 'name']],
            ],
        };
        //    
        super(receipt.sql, 'image.image', '#receipt', options, parent);
    }
}
//The panel that shows the actual scanned images of receipts 
class image extends peer {
    static sql = `
            select 
                #
                #The row index of the file homozone
                image.image as \`image.image\`,
                #
                #Construct the image column fit for driving href in an img element
                concat_ws('/', '/balansys/images', folder.full_name, image.short_name) as image
            from
                image
                inner join folder on image.folder = folder.folder
                inner join receipt on receipt.image = image.image
                inner join consumer on receipt.consumer = consumer.consumer
            `;
    //The plan of an image is a standard panel with ability to create new
    //images 
    plan = [
        //
        //The headers
        [new homozone(null), this.get_header()],
        //
        [this.get_leftie(), this],
        //
        //The record create functionality
        [new homozone(null), new panel.creator(this, 1)],
    ];
    //
    //The image panel is part of the image group; other members are file and receipt
    constructor(parent) {
        //
        const options = {
            ticks: [
                //
                //Primary keys will be shown as read only values
                ['pk', { io_type: 'read_only' }],
                //
                //Image will be shown as an image
                ['image', { io_type: 'image' }],
            ]
        };
        //    
        super(image.sql, 'image.image', '#image', options, parent);
    }
    async show() {
        await super.show();
        //
        // add the navigation buttons
    }
}
//The panel that shows the scanned image files
class file extends peer {
    //
    //
    static sql = `
            select 
                #
                #The row index of the image homozone
                image.image as \`image.image\`,
                consumer.name,
                #
                concat(folder.full_name, "/", image.short_name) as \`path\`
            from
                image
                inner join folder on image.folder = folder.folder
                inner join receipt on receipt.image = image.image
                inner join consumer on receipt.consumer = consumer.consumer        
           `;
    //
    //The plan of an image is a standard panel (without ability to create new
    //or update files) 
    plan = [
        //
        //The headers should be styled as flozen
        [
            new homozone(null, { class_name: 'header' }),
            this.get_header({ class_name: 'header' })
        ],
        //
        [this.get_leftie(), this],
    ];
    //
    //The file panel is part of the image group; other members are receipt and image
    constructor(parent) {
        //
        //
        //Options for controlling file panel
        const options = {
            //
            //Files will be shown in read-nly mode
            io_type: 'read_only',
            //
            ticks: []
        };
        //    
        super(file.sql, 'image.image', '#file', options, parent);
    }
}
