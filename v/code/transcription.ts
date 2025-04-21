import {
    grid, cell, root,table_options, plan, homozone, drivers, panel,
    driver_source
} from "../../../outlook/v/zone/zone.js";
import { view, label, mutall_error, basic_value, mymap} from "../../../schema/v/code/schema.js";
import {resizer} from "../../../resizer/v/code/resize.js";
import "sql.js";
// import {authoriser} from "../../../authoriser/v/code/authoriser.js"
//
//
//A general panel purposely built for this transcription application
abstract class mypanel extends panel.panel{
    //
    //The plan of this panel
    public abstract plan:plan;
    //
    //The constructor of this panel exposes assumes teh driver is of the sql type
    // and therfore exposes the the sql statement (rather than the driver)
    constructor(
        public sql:string,
         row_index:string, 
         anchor: HTMLElement | string, 
         options:table_options, 
         parent: view
    ){
        //
        //Define the general data source for the panels in this module
        const ds: driver_source = {
            type:'sql',
            sql,
            row_index,
            dbname:'balansys'
        }
        //
        super(ds, anchor, options, parent);
    }
}

//A peer is a panel that represent a diferent view of the same image. This
//class allows us to program peers consistently, i.e., without caring how they
//are contained. That means putting panels in a group does not make them peers!
export abstract class peer extends mypanel{
    //
    //Currently all the peers are managed as a group
    declare parent:panel.group;
    //
    //All peer panels have a driver source that looks like...
    declare driver_source:{type:'sql', sql:string, row_index:string}
    //
    constructor(
        sql: string, 
        row_index_cname: string, 
        anchor:HTMLElement|string,
        options: table_options, 
        //
        //Peers are managed as a unit,
        parent: panel.group, 
    ){
        super(sql, row_index_cname, anchor, options, parent);
    }
    //
    //If you click on a peer, the transcription image primary key changes 
    //accordingly, causing all other peers to show their new selections. 
    //The consumer is unaffected. 
    async onclick(cell:cell, evt:MouseEvent):Promise<void>{
        //
        //Perform the action being overriden, i.e, the cell selection
        await super.onclick(cell, evt);
        //
        //Show selection on related panels
        //
        //Get the new image key.
        const image_pk:string  =cell.index[this.orientation];
        //
        //Ignore this click if the image has not changed after the click (1)
        if (image_pk === transcription.image_pk) return;
        //
        //Update the tree view image (to support the operation just tested in (1))
        transcription.image_pk = image_pk;
        //
        //Get the root view, i.e., the transcription view
        const tv = <transcription>this.search_root_view();
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
    async show_selection(clicked?:cell):Promise<void>{
        //
        //Do not repaint this peer if the clicked cell comes from this zone 
        if (clicked?.parent === this) return;
        //
        //Get the indexing coordinates of the cell to select
        //
        //Get the primary key of the image to show; its the first coordinate
        let pk:string|undefined = transcription.image_pk;
        //
        //If the primary key is absent, then assume that this is a new consumer
        // Set pk to be the first image in this panel. It should be shared with 
        // all the peers
        if (pk===undefined) pk = (transcription.image_pk = this.get_1st_image());
        //
        //Get the index of the desired cell
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell2:cell|undefined = this.cells_indexed?.[row]?.[col];
        //
        //Its an error if this cell cannot be found
        if (!cell2) throw new mutall_error(`Unable to find cell ['${row}', '${col}'] of this peer`);
        //
        //Select the indexed grid
        cell2.select();
        //
        //Scroll the grid to the view so that the record shows at the start of
        //the list view
        cell2.td.scrollIntoView({block:'center', inline:'center'});
    }

    //Returns the primary key of the first record in this panel
    get_1st_image():string{
        //
        //Get the orientation of this homozone; it is designed so that the axis
        // parallel to this alines with the primary keys
        const dim:number = this.orientation;
        //
        //Get thh axis primary key axis 
        const axis:root.axis = this.axes[dim];
        //
        //Get the first mark
        const mark:string = axis.ticks[0].mark;
        //
        //return the mark
        return mark;
    }

    //Before showing a peer, adjust its driver sql to take the current
    //consumer setting into account
    get_modified_driver_sql():string|undefined{
        //
        //Add the condition that limits images to the current consumer if there is one
        const where:string = transcription.consumer_pk?`where consumer.consumer = ${transcription.consumer_pk}`:''; 
        //
        //Complete the sql, limiting the display to 20 case in this debugging phase
        const sql:string = `
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
export class transcription extends panel.group{
    public resizer?:resizer;
    //
    // Add the authoriser
    // public authoriser=new authoriser(this,'#launch')
    //
    public image_group:image_group;
    public purchase:purchase;
    public consumer:consumer;
    public supplier:supplier;
  
    
    //
    //Set the initial display condition manually set at 3, 300, meaning the 300th 
    // image of the 3rd consumer. This number changes on clicking a peer or 
    // consumer pannel. Display is defined as static so that we can access it 
    // from any where, i.e., without following the view has-a hierarchy. 
    static Initial_display:{consumer:number, image:number} = {consumer:2, image:0};
    //
    //The following properties are used to control the display of the transcription
    //and need to be accessed from may places. They are defined as static to support
    //this requirement.
    //
    //This represents the image that generally controls what we see in 
    // the peer panels and the purchases
    static  image_pk:string|undefined;
    //
    //The current consumer primary key
    static consumer_pk:string|undefined;
     //
     public zoom:number = 1
     public rotation: number = 0;
     public translateX: number = 0;
     public translateY: number = 0;
     
    
    constructor(
        //
        //To implement the view has-a hierarchy
        public parent?:view,
        
    ){
        //Options for controlling the transcription page
        const options:table_options = {
            dbname:'balansys'
        }
        
        //Use an empty list to create the group
        super([], parent, options);
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
    async show(): Promise<void> {
        await super.show();
        this.resizer=new resizer(this.document.body,{min_panel_size:40})
    }
//
    //Zoom in to the selected image group member
    zoom_in(dir:boolean):void{
        //
        //Get the current image element
        let image = <HTMLImageElement>this.document.querySelector('.selected>img');
        //
        //Define the zoom resolution
        const resolution:number = 0.1; 
        //
        //Get scaling multiplier, based on the zoom direction
        this.zoom =  dir? this.zoom+resolution: this.zoom-resolution;
        //
        //Apply the saling to the image using transform 
        image.style.transform = `scale(${this.zoom})`;
    } 
    //    
    // Rotate the selected image group member
    rotate(dir: boolean): void { 
        //
        // Get the current image element
        let image = <HTMLImageElement>this.document.querySelector('.selected>img');
        if (!image) return; // Avoid errors if no image is selected
    
        //
        // Define the rotation resolution
        const resolution: number = 90; 
    
        //
        // Update rotation value based on direction
        this.rotation = dir ? this.rotation + resolution : this.rotation - resolution;
    
        //
        // Apply transformation: translate + scale + rotate
        image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
    }
    // Move the image in X and Y directions
    translate(dx: number, dy: number): void {
    //
    // Get the currently selected image
    let image = <HTMLImageElement>this.document.querySelector('.selected>img');
    if (!image) return;

    //
    // Update translation values
    this.translateX += dx;
    this.translateY += dy;

    //
    // Apply transformations: translate + scale + rotate
    image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
}
pan(dx: number, dy: number): void {
    //
    // Get the currently selected image
    let image = <HTMLImageElement>this.document.querySelector('.selected>img');
    if (!image) return;

    //
    // Update translation values
    this.translateX += dx;
    this.translateY += dy;

    //
    // Apply all transformations correctly
    image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom}) rotate(${this.rotation}deg)`;
}



    //Complete the construction of a page by running asynchronous methods
    async init():Promise<void>{
        //
        //Get the relative consumer and image display positions
        const {consumer, image} = transcription.Initial_display;
        //
        //Initialize the consumer and image primary keys
        transcription.consumer_pk = await this.get_consumer_pk(consumer);
        transcription.image_pk = await this.get_initial_image_pk(image);
    }

    //
    //Returns the primary key of the initial image to scroll to.
    async get_initial_image_pk(i:number):Promise<string|undefined>{
        //
        //Formulate the sql to retrieve only the i'th image
        const sql:string = `
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
        `
        //
        //Run the query
        const result:Array<{image:basic_value}> = await this.exec_php(
            'database',
            ['balansys', false],
            'get_sql_data',
            [sql]
        );
        //
        //Return undedined if no image was found
        if (result.length===0) return undefined;
        //
        //Extract and return the resulting string
        return String(result[0].image);
        
    }

    //Initialize the consumer primary key, using the display setting
    async get_consumer_pk(i:number):Promise<string|undefined>{
        //
        //Formulate the sql to retrieve only the i'th consumer
        const sql:string = `
            select 
                consumer 
            from 
                consumer 
            order by consumer 
            limit 1 offset ${i}`
        //
        //Run the query
        const result:Array<{consumer:basic_value}> = await this.exec_php(
            'database',
            ['balansys', false],
            'get_sql_data',
            [sql]
        );
        //
        //If there are not consumers return undefined
        if (result.length===0) undefined 
        //
        //Extract and return the resulting string
        return String(result[0].consumer);
    }
}

//The panel that shows the owners/consumers of thses receipts
export class consumer extends mypanel{
    //
    //Save the display settings here.The map indexing key is the consumer primary 
    //key. The indexed string is the image primary key. NB. A map is used as it
    //does not break down if you retrieve a non existing key. The structure
    //{[index:number]:number}, I think, would throw an exception, similar to
    //how array indexing behaves. Investigate this assumption
    public displays:Map<string, string> = new Map();
    //
    //The creator subpanel has this consumer as the homozone; its a margin oriented
    // columnwise    
    creator = new panel.creator(this, 1);    
    
    //The plan of an image is a standard panel with ability to create new
    //images 
    public plan:plan = [
        //
        //The headers
        [new homozone(), this.get_header(), new homozone()],
        //
        //The left reviewer is unchecked and will open the record if checked; the 
        // right review is already checked and will be used for wriring the record
        [
            new panel.reviewer(this,0, false, 'open'), 
            this, 
            new panel.reviewer(this,0, true, 'write')
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
    constructor(parent:view){
        //
        const sql =`
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
        const business_name:label = [undefined, 'business', 'name', undefined, ['consumer']];
        //
        const options:table_options = {
            //
            ticks:[
                //
                //Add a label to support that a consumer name is the same as the 
                //business name. NB. This is an example of nested options.
                ['consumer.name', {labels:[business_name]}],
            ],
            //
            //The consumer zone is transposed. This needs more thought
            //transposed:true
        }
        //    
        super(sql, 'consumer.consumer',  '#consumer', options, parent);

    } 
    //
    //For a consumer, the sql is independent of any other panel. It never changes
    //So the driver needs no modification
    get_modified_driver_sql():string|undefined{return}
    //
    //Show the selected consumer, guided by display settings of the transcription 
    async show_selection(): Promise<void> {
        //
        //Do not show any  consumer selection if there is no consumer primary key
        const pk:string|undefined = transcription.consumer_pk;
        if (!pk) return;
        //
        //Get the column index of the desired cell; it is the same one used for
        //displaying a selection
        const [row, col] = this.orientate([pk, this.orientation], this.selection_cname);
        //
        //Get the indexed grid from the indexed cells of this homozone
        const cell:cell|undefined = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell) throw new mutall_error(`No cell is found at coordinate [${row} ${col}] of consumer`); 
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
    async onclick(cell:cell, evt?:MouseEvent):Promise<void>{
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
        const trans:transcription = (<transcription>this.search_root_view());
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
class purchase extends mypanel{
    //
        //Define an sql for retrieving purchases unconditionally
        static sql:string = `
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
    plan:plan = [
        //
        //The headers for purchase should be styled as frozen
        [
            new homozone(null, {class_name:'header'}), 
            this.get_header({class_name:'header'}), 
            new homozone(null, {class_name:'header'})
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
    declare parent:transcription;
    //
    constructor(parent:transcription){
        //
        const options:table_options = {
            //
            //Make all the input fields visible. The default is auto. This does not
            //work. The reason is that init_table is called by the root zone. panel
            //is not a root zone; it is the heterozne. Try this workround: ensure 
            // pass the options to the organizing heterozone on construction.
            table_layout:'fixed',
            //
            //Enriching the tick mark labels
            ticks:[
                ['ref', {}, [undefined, 'purchase', 'ref']],
                ['code', {}, [undefined, 'product', 'code']],
                ['product.name',{}, [undefined, 'product', 'name']],
                ['qty', {}, [undefined, 'purchase', 'qty']],
                ['price', {}, [undefined, 'purchase', 'price']],
                ['unit', {}, [undefined, 'product', 'unit'], [undefined, 'purchase', 'unit']],
            ]
        }
        //    
        super(purchase.sql, 'purchase.purchase',  '#purchase', options, parent);
    }
    //
    //Here i was trying to get the value of the cell that i typed but i am only logging 
    // a message instead of the value
    // async onblur(cell: cell, evt?: Event): Promise<void> {
    //     await super.onblur(cell, evt);

    //     // Ensure the cell value is properly retrieved and trimmed
    //     const value = cell.value?.toString().trim(); // Convert to string in case it's not

    //     // Log the value of the cell, or indicate if it's empty
    //     if (value) {
    //         console.log("Cell value:", value);
    //     } else {
    //         console.log("Cell is empty or has no value.");
    //     }
    // }
    // 
    //Try logging the value of the cell 
    async onblur(cell: cell, evt?: Event): Promise<void> {
        await super.onblur(cell, evt);
    
        const value = cell?.value?.toString().trim();
        console.log(value);
    }

    //Override the default show panel behavior so that if no image is available
    //the panel is not shown
    async show():Promise<void>{
        //
        //If there is no image, do not show the purchases
        if (!transcription.image_pk) return;
        //
        //Show the default panel
        await super.show();
    }    
    
    //Modify the sql of the purchase panel so that the display reflects the 
    //current image of the transcription view
    get_modified_driver_sql():string|undefined{
        //
        //Make sure that the image is available
        if (!transcription.image_pk) throw new mutall_error('No image primary key found');
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
    async show_selection(): Promise<void> {
        //
        //Get the mark of the last tick in the row dimension as the row index
        const ticks:Array<root.tick> = this.axes[this.orientation].ticks;
        //
        //If there are no purchases, then nothing can be selected
        if (ticks.length===0) return;
        // 
        //Get the last row
        const row:string = ticks[ticks.length-1].mark;
        //
        //The column index is the one one used for selection
        const col:string = this.selection_cname;
        //
        //Get the indexed cell from the indexed cells of this homozone
        const cell:cell|undefined = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell) throw new mutall_error(`No cell is found at coordinate [${row}, ${col}]`); 
        //
        //Select the cell
        cell.select();
    }
}

//The supplier is a panel that shows the suppliers of the purchased products
export class supplier extends mypanel{

    static sql =`
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
                    business.pin as \`business.pin:supplier\`
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
    public plan:plan = [
        //
        //The headers. Give class names to headers to allow for easily freezing them
        [
            new homozone(null, {class_name:'header'}), 
            new homozone(null, {class_name:'header'}), 
            this.get_header({class_name:'header'}), 
            new homozone(null, {class_name:'header'})
        ],
        //
        //There is a reviewer on both sides of the body with a row orientation.
        //The left one is unchecked and used for openinng a record; the right one
        //is checked and used for writing the record
        [
            this.get_leftie(), 
            new panel.reviewer(this, 0, false, 'open',{onchange:(cell:cell)=>this.onclick_from_reviewer(cell)}), 
            this, 
            //
            //Do not refresh the panel after writing
            new panel.reviewer(this, 0, true, 'write',{refresh_after_write:false})
        ],
    ];

    //Create the constructor for the supplier panel
    constructor(parent:panel.group){
        //
        const row_index_cname: string = 'image.image'; 
        const options: table_options={
            //
            //The receipt primary key is important for saving a receipt but need
            //not be visible
            ticks:[
                //
                //Hide the supplier primary key
                ['supplier.supplier', {hidden:true}],
                //
                //Associate the supplier with a business name. The business will
                //also need to be aliased with a matching title
                ['supplier.name', {labels:[[undefined, 'business', 'name',undefined,['supplier']]]}]
            ],
        }; 
        //
        super(supplier.sql, row_index_cname, '#supplier', options, parent)        
    }
     //
    //Show the first/only row for a consumer selection.
    async show_selection(): Promise<void> {
        //
        //Get the mark of the first tick in the row dimension as the row index
            //
            const ticks:Array<root.tick> = this.axes[this.orientation].ticks;
            //
            //If there are no purchases, then nothing can be selected
            if (ticks.length===0) return;
            // 
            //Get the first row index
            const x:string = ticks[0].mark;
        //
        //The 2nd index is the name of the column used for selection
        const y:string = this.selection_cname;
        //
        //Use the zone's orientation to determine the row and colum indices
        const [row, col] = this.orientate([x, this.orientation], y)
        //
        //Get the indexed cell from the indexed cells of this homozone
        const cell:cell|undefined = this.cells_indexed?.[row]?.[col];
        //
        //It is an error if there is no cell at this coordinate
        if (!cell) throw new mutall_error(`No cell is found at coordinate [${row}, ${col}]`); 
        //
        //Select the cell
        cell.select();
    }
    
    //Modify the sql of the purchase panel so that the display reflects the 
    //current image of the transcription view
    get_modified_driver_sql():string|undefined{
        //
        //Make sure that the image is available
        if (!transcription.image_pk) throw new mutall_error('No image primary key found');
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
export class image_group extends panel.group{
    //
    //The members of the image group share the same column name for row 
    // indexing
    public row_index_cname = 'image.image';
    //
    //Redefine the parent of the image group
    declare parent:transcription;
    //
    constructor(
        //
        parent?:transcription
    ){
        //
        //Crratting the group with no members.
        super([], parent);
        //
        //Creating the members using the created group
        this.members =[
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
    public plan:plan = [
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
    constructor(parent:panel.group) {
        //
        //
        const options:table_options = {
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
    //
    //Here i try to call the onblur event listener and aler that i have lost focus there.
    async onblur(cell: cell, evt?: Event): Promise<void> {
        await super.onblur(cell, evt);
       console.log('the onblur in full effect');
       
    }
   
}
//The panel that shows the actual scanned images of receipts 
class image extends peer{
        
    static sql =`
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
    public plan:plan = [
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
    constructor(parent:panel.group){
        //
        const options:table_options = {
            ticks:[
                //
                //Primary keys will be shown as read only values
                ['pk', {io_type:'read_only'}],
                //
                //Image will be shown as an image
                ['image', {io_type:'image'}],
            ]
        }
        //    
        super(image.sql, 'image.image',  '#image', options, parent);
    }   
}

//The panel that shows the scanned image files
class file extends peer{
    //
        //
        static sql =`
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
    public plan:plan = [
        //
        //The headers should be styled as flozen
        [
            new homozone(null, {class_name:'header'}), 
            this.get_header({class_name:'header'})
        ],
        //
        [this.get_leftie(), this],
    ];
    //
    //The file panel is part of the image group; other members are receipt and image
    constructor(parent:panel.group){
        
        //
        //
        //Options for controlling file panel
        const options:table_options = {
            //
            //Files will be shown in read-nly mode
            io_type:'read_only',
            //
            ticks:[
                
            ]    
        }
        //    
        super(file.sql, 'image.image',  '#file', options, parent);
    }   
}