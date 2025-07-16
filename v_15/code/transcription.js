import { homozone, drivers, panel } from "../../../outlook/v/zone/ zone.js";
import { mutall_error } from "../../../schema/v/code/schema.js";
//
//A general panel purposely built for this application
class mypanel extends panel.panel {
    sql;
    //
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
        //Get the new image key.
        const image_pk = cell.index[this.orientation];
        //
        //Ignore this click if the image has not changed
        if (image_pk === transcription.image_pk)
            return;
        //
        //Update the tree view image
        transcription.image_pk = image_pk;
        //
        //Get the transcription view
        const tv = this.search_root_view();
        //
        //Update the selection of the tanscription group, except the one where 
        // the click has occurred
        tv.image_group.show_selection(cell);
        //
        //Re-show the supplier
        await tv.supplier.show();
        //
        //Re-show the purchases
        await tv.purchase.show();
    }
    //
    //Shows the selection of this peer, by highlighting the image followed
    // by a scrolling into view
    show_selection(cell) {
        //
        //Do not repaint this peer if the given cell comes from this zone 
        if (cell?.parent === this)
            return;
        //
        //Get the primary key of the image to show
        const pk = transcription.image_pk;
        //
        //You cannot show a selection if there is no image primary key
        if (!pk)
            return;
        //
        //Get the index of the desired cell
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell2 = this.cells_indexed[row][col];
        //
        //Select the indexed grid
        cell2.select();
        //
        //Scroll the grid to the view so that the record shows at the start of
        //the list view
        cell2.td.scrollIntoView({ block: 'center' });
    }
    //Before showing a peer, adjust her driver sql to include a the current
    // consumer setting
    async modify_driver() {
        //
        //Add the condition that limits images to the current consumer if there is one
        const where = transcription.consumer_pk ? `where consumer.consumer = ${transcription.consumer_pk}` : '';
        //
        //Add the row value condition to the members sql
        const sql = `
        ${this.sql}
        ${where}
            #
            #During this development phase, limit to 20 images
            limit 20
        `;
        //
        //Update the driver source. For now assume all drivers are simple
        //(non-transposed) sql. In future, this assumption will be dropped
        if (!(this.driver instanceof drivers.sql))
            throw new mutall_error('Only sql drivers are supported');
        this.driver.sql = sql;
    }
}
//
//Transcription is the page that helps us to digitize images of physical receipts
export class transcription extends panel.group {
    parent;
    //
    consumer;
    image_panel;
    file;
    receipt;
    purchase;
    supplier;
    //
    //This helps us to manage the peer panels 
    image_group;
    //
    //Set the initial display condition manually at 3, 300, meaning the 300th image of
    //the 3rd consumer. This number changes on clicking a peer or consumer pannel
    //Display is defined as static so that we can access from any where, without
    //following the view has-a hierarchy. What do we lose by so doing? 
    static display = { consumer: 2, image: 0 };
    //The follwong properties are used to control the display of the transcription
    //and need to be accessed from may places. They are defined as static to support
    //this requirement. What do we lose by so doing?
    //
    //This represents the image that generally controls what we see in 
    // the peer panels and the purchases
    static image_pk;
    //
    //The current consumer primary key
    static consumer_pk;
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
        //Define the pannels here
        this.consumer = new consumer(this),
            this.purchase = new purchase(this);
        //
        //Create the branch of peers. Its parent is this transcription. Currently
        //there are no options associated with a branch
        //
        //Define an empty image group
        this.image_group = new panel.group(this, {}, []);
        //
        //Put all the peers in the image group
        this.file = new file(this.image_group);
        this.image_panel = new image(this.image_group);
        this.receipt = new receipt(this.image_group);
        //
        this.supplier = new supplier(this);
        //
        //Collect the panel peers
        const peers = [this.file, this.image_panel, this.receipt];
        //
        this.image_group.members = peers;
        //
        //Create the 3 members of the transcription group
        this.members = [
            this.consumer,
            this.image_group,
            this.purchase,
            this.supplier
        ];
    }
    //Complete the construction of a page by running asynchronous methods
    async init() {
        //
        //Get the relative consumer and image display positions
        const { consumer, image } = transcription.display;
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
                business.title as \`business.title\`
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
        //Define the business label
        const business_name = [undefined, 'business', 'name'];
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
    //For a consumer, the sql is independent of any other panel. It never changes
    //So the driver needs no modification
    async modify_driver() { }
    //
    //Show the selected consumer, guided by display settings of the transcription 
    show_selection() {
        //
        //Do not show any  consuler selection if there is no consumer primary key
        const pk = transcription.consumer_pk;
        if (!pk)
            return;
        //
        //Get the column index of the desired cell; it is the same one used for
        //displaying a selection
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell = this.cells_indexed[row][col];
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
        //Set the consumer primary key to match the current cell selectio; 
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
       
        receipt.date as \`receipt.date\`,
        receipt.amount as \`receipt.amount\`,
        receipt.vat as \`receipt.vat\`,
        #etr.staff_name as \`etr.staff_name\`,
        #etr.teller_num as \`etr.teller_num\`,
        #etr.invoice_num as \`etr.invoice_num\`,
        receipt.description as \`receipt.description\`,
        #
        #For tracking the intern who transcribed the receipt
        intern.name as \`intern.name\`
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
    async modify_driver() {
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
        //Update the driver source, assuming a straight sql driver
        if (!(this.driver instanceof drivers.sql))
            throw new mutall_error('Only sql drivers are supported');
        this.driver.sql = sql;
    }
    //
    //Show the last (edit) row for a purchase selection. NB. Purchases are not 
    //transposed
    show_selection() {
        //
        //Get the mark of the last tick in the row dimension as the row index
        const ticks = this.axes[this.orientation].ticks;
        //
        //If there are no purchases, then nothing can be selected
        if (ticks.length === 0)
            return;
        // 
        //Get the last row
        const row = ticks[ticks.length - 1].toString();
        //
        //The column index is the one one used for selection
        const col = this.selection_cname;
        //
        //Get the indexed grid
        const cell = this.cells_indexed[row][col];
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
                    business.title as \`business.title\`,
                    business.tel as \`business.tel\`,
                    business.email as \`business.email\`,
                    business.address as \`business.address\`,
                    business.pin as \`business.pin\`
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
        //The left one is unchecked and used for openinng a reford; the right one
        //is checked and used for writing the record
        [
            this.get_leftie(),
            new panel.reviewer(this, 0, false, 'open', { onchange: (cell) => this.onclick_from_reviewer(cell) }),
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
            ],
        };
        //
        super(supplier.sql, row_index_cname, '#supplier', options, parent);
    }
    show_selection(cell) {
    }
    //Modify the sql of the purchase panel so that the display reflects the 
    //current image of the transcription view
    async modify_driver() {
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
        //Update the driver source, assuming a straight sql driver
        if (!(this.driver instanceof drivers.sql))
            throw new mutall_error('Only sql drivers are supported');
        this.driver.sql = sql;
    }
}
