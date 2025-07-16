import { 
    homo, homozone, heterozone, driver_source, table_options, hetero, plan, table_option_interface, 
    grid, cell, seed, record, listener
} from "../../../outlook/v/zone/zone.js";

import { view, view_options, mutall_error, basic_value } from "../../../schema/v/code/schema.js";
//
import {radio} from "../../../schema/v/code/io.js"
//
//Options for controlling  pannels
export interface panel_option_interface extends table_option_interface{
    //
    //Should the data source be transposed or not
    transposed:boolean;
    //
    //Show field in update mode
    updateable:boolean
}
export type panel_options = Partial<panel_option_interface>;

//A general purpose container of ios
export abstract class container extends view{
    //
    constructor(parent?: view, options?: view_options){
        super(parent, options)
    }
   
    //
    //A container can show
    abstract show():Promise<void>;

    //Show the selection of a container if it is not the parent of the given cell
    //There is no cell to show in the very first show
    abstract show_selection(cell?:cell):void;
} 

//Group is a container of panels, similar to a folder.
export class group extends container{
    //
    //The row index column name for the (trancription) group is the image primary 
    //key. In future it will be determined programatically
    public row_index_cname:string ='image.image';
    //
    constructor(
        parent?: view, 
        options?: panel_options,
        //
        //The key feature of a group is that it has members 
        public members:Array<container>=[],
    ){
        super(parent, options);
    }

    //
    //To show a group is to show her members
    async show():Promise<void>{
        //
        //The members must be set by now; show them
        for(const member of this.members!) await member.show();
    }

    //Update the selection of the tanscription group, except the one where 
    // the click has occurred
    show_selection(cell?:cell):void{
        //
        for(const member of this.members) member.show_selection(cell);
    }
}



//The homozone for supporting the creation of new records
export class creator extends homo.margin{
    //
    constructor(homozone:homozone, dim:0|1, options?: table_options, parent?: view){
        //
        //The default settings of a creator
        const defaults:table_options = {
            //
            //The io type of a creator depends on the context
            io_type:'default',
            //
            class_name:'creator',
            //
            //A creator always show in edit mode
            mode:'edit',
        }
        //
        super(homozone, dim, {...defaults, ...options}, parent);
    }

    // Prevent the default behavior of the onblur event listener, which typically 
    // writes to a database. In this case, override it to perform no action.
    async onblur(cell: cell, evt?: Event): Promise<void> {}

    //A creator has no data to display
    async display_data(): Promise<void> {}

    //Set the initial cell values
    async init_io_value(cell:cell):Promise<void>{
        //
        //The io  must be set by now
        cell.io!.value = this.get_default_value(cell);
    }
    
    //
    //Get the defailt value of a cell from either the user options, frm the
    //underlying database, etc.
    get_default_value(cell:cell):basic_value{
        //
        //If the user has a preference, then use it
        const value:basic_value|undefined = cell.search_option('default_value');
        if (value) return value;
        //
        //Read the value from the database -- depending on the first non-primary
        //seed for this cell
        return this.get_default_value_from_db(cell); 
    }
    //
    //Set the io of the given cell to its default value
    get_default_value_from_db(cell:cell):basic_value{
        //
        //Get the principal seeds of the cell
        const seeds:Array<seed>|undefined = cell.principals;
        //
        //Only cells where a principals exist are considerd
        if (seeds && seeds.length>0) {} else return null;
        //
        //Get the first 1 principal seed.
        const seed:seed = seeds[0];
        //
        //Extract the database column of the seed
        const value:basic_value = seed.col.default;
        //
        //If the default value is empty, then ignore it
        if (value===''||value===null) return null;
        //
        //If the value has an opening and closing bracket, then its a function
        //evaluate it; otherwise use it to set the default value
        const mydefault:basic_value = value.endsWith('()') ? this.evaluate_mysql_expr(value): value;
        //
        //Set the cell's io value. It must exist
        return mydefault;
    } 

    //Evaluate a mysql expression to get a basic value
    evaluate_mysql_expr(str:string):basic_value{
        //
        //If the default value is a null string, return a null value
        if (str==='null') return null;
        //
        //If the default valus is a timestamp, then return today's date
        if (str==='CURRENT_TIMESTAMP()') return this.get_todays_date();
        //
        //Alert the user of this new default expression 
        throw new mutall_error(`Unable to evaluate ${str}`);
    }   
        
}

//The homozone to support reviewing of records
export class reviewer extends homo.margin{
    //
    constructor(
        //
        //The base homozone from which this margin is based
        homozone:homozone, 
        //
        //The orientation of the margin
        dim:0|1,
        //
        //Will the radio button come out checked or not? The default is unchecked 
        public checked:boolean=false,
        //
        //What will the onchange even do: open a record or save it?
        public action:'open'|'write',
        // 
        options?: table_options, 
        parent?: view
    ){
        //
        super(homozone, dim, options, parent);
        //
        this.options = {
            //
            //A creator always show in edit mode
            mode: 'edit',
            //
            //The user may wish to override the above options
            ...options,
        }
    }
    //
    //Overrde the cell initialization to add radio buttons named after the cell's
    //index
    async init_cell(cell: cell): Promise<void> {
        //
        //Use the cell's index to deduce the its radio name.
            //
            //The orientation of the cell depends on whether the paret is 
            //transposed or not. Its the row index we need if the parent homozone
            // //is not transposed
            const dim:0|1 = !cell.parent.transposed ? 0:1; 
            //
            //Read the cell's index value
            const index:string = cell.index[dim];
        //
        //Ensure that the index is a valid name by prefixing it with an i
        const name:string = `i${index}`
        //
        //Add the checkbox io type before initialization, not checked. NB. The 
        // user can override this option via cell options
        cell.options = {io_type:{type:'radio', name, checked:this.checked}}
        //
        //Continue with normal initialization
        await super.init_cell(cell);
    } 
    
    // Prevent the default behavior of the onblur event listener, which typically 
    // writes to a database. In this case, override it to perform no action.
    async onblur(cell: cell, evt?: Event): Promise<void> {}

    // The onchange event behavior is determined by the values of the action 
    // property: "open" or "write". 
    // - If the action is "open", it creates a new record and opens it.
    // - If the action is "write", it writes the record to the database and, 
    // upon success, refreshes the heterozone.
    async onchange(cell:cell, evt:MouseEvent):Promise<void>{
        //
        //If the user wishes to handle this event themselves, then respect it.
        let onchange:listener|undefined;
        if (onchange=this.search_option('onchange')) await onchange(cell);
        //
        //If the user does not want he default behaviour, then respect it
        // 
        //The homozone of the record is the same as that of ths reviewer
        // The dimension of the record is the same as that of the reviewer 
        // The parent of a record is this reviewer
        //There are no explicit options associated with this record
        const myrecord = new record(cell, this.orientation, this, {});
       //
       // Use a switch statement to handle the specific action type
        switch (this.action) {
            //
            // If the action is "open", create a new record and open it
            case "open": return myrecord.open();
            //
            // If the action is "write", attempt to write the record to the database
            case "write":
                //
                // Write the record to the databnase 
                const ok:boolean = await myrecord.write();
                //
                //Uncheck the io if the writing failed
                if (!ok && cell.io instanceof radio) cell.io.input.checked=false;
                //
                //If sucessful, do a refresh the homozone, unless the user has 
                // denied it
                const found:boolean|undefined = this.search_option('refresh_after_write');
                const refresh:boolean = found===undefined?true:found;
                //
                //Refresh if necessary, otherwise close the record so that it is
                //not left hanging
                if (refresh) await this.refresh(); else myrecord.close();
            break;
        }     
    }
}


//The homozone to support cleaning/deleting of records
export class deleter extends homozone{
    //
    constructor(driver_source?: driver_source | undefined, options?: table_options, parent?: view){
        super(driver_source, options, parent)
    }
}

//
//A panel is a homozonewhich has a heterozone to organize her siblings. It is 
// also a leaf container. In contrast a group is another container (which can 
// hold panels and other containers). This allows us to build a panel/container 
// hierarchial model used for managing the Balansys page
export abstract class panel extends homozone implements container{
    //
    //The heterozone that organises the zones adjacent to this panel
    public organizer:heterozone;
    //
    //Every panel must have a plan of how her siblings are laid out. 
    public abstract plan:plan;
    //
    //Show the selection of a panel if it is not the parent of the given cell
    public abstract show_selection(cell?:cell):void;
    //
    constructor(
        public sql:string,
        public row_index_cname:string, 
        options:panel_options, 
        parent:view,
        //
        //This is the column name that we are going to use to show our selection
        public selection_cname:string
    ){
        //
        //Use the sql to formulate a driver
        const ds:driver_source = {
            type:'sql',
            sql,
            row_index:row_index_cname
        }
        
        super(ds, options, parent);
        //
        //The default options of a heterozone
        const defaults:table_options = {
            //
            //The heterozones will be anchored at the element that matches
            //the constructor name
            anchor:`#${this.constructor.name}`
        }
        //
        //Set the organizing heterozone. NB.The default options can be overriden 
        // by the user. NB. The plan is not known until show time. The panels
        //options are pased to the organizerheterozone so that they are accessible
        //from the view hierarchy
        this.organizer = new heterozone(undefined, {...defaults, ...options},  parent, );  
    }

     //Simulate the onclick event after a reviewer has changed. The given cell 
        //is from the reviewer; we need to construct one that matches the consumer,
        //then simulate the consumer's click event
        async onclick_from_reviewer(cell:cell):Promise<void>{
            //
            //Get the primary key tick mark
            const pk:string = cell.index[this.orientation];
            //
            //The consumere's selection fieldhas the other tick mark
            const selection = this.selection_cname;
            //
            //Use the consumer oriemttaion to get the row and column coordinates
            const [row, col] = this.orientate([pk, this.orientation], selection);
            //
            //Get the consumer cell on which to simulate the click event
            const cell2:grid = this.cells_indexed![row][col];
            //
            //Now simulate the onclick even on the consumer
            this.onclick(<cell>cell2);
        }

    //Tests if this panel is transposed or not. It is transposed an option
    //suugests so
    get is_transposed():boolean{
        //
        //
        //By default, a panel is not transposed. If it is, then searching for the
        //option should return true.
        //Get the nearest transposition option
        return this.search_option('transposed')??false;
    }

    //
    //The panel show method overrides the normal version by showing that of the 
    // organizing heterozone
    async show():Promise<void>{
        //
        //Before showing a panel, adjust her driver sql to include a condition 
        //that respects the transcription display settings. This depends on the
        //panel in question
        await this.modify_driver();
        //
        //Set this organizer's plan to match that of this panel;
        this.organizer.plan = this.plan;
        //
        //Show the organizing heterozone instead
        await this.organizer.show();
        //
        //Highlight the current selection and scroll it into view
        this.show_selection();
    }
    //
    //Before showing a panel, adjust her driver sql to include a condition 
    //that respects the transcription display settings
    abstract modify_driver():Promise<void>;
  
    //Redefine the search to search the table option interface
    search_option<i extends keyof panel_option_interface>(key:i):panel_option_interface[i]|undefined{
        //
        return <panel_option_interface[i]> super.search_option(<keyof table_option_interface>key);
    }
}


