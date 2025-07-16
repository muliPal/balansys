import { homo, homozone, heterozone, record } from "../../../outlook/v/zone/zone.js";
import { view, mutall_error } from "../../../schema/v/code/schema.js";
//
import { radio } from "../../../schema/v/code/io.js";
//A general purpose container of ios
export class container extends view {
    //
    constructor(parent, options) {
        super(parent, options);
    }
}
//Group is a container of panels, similar to a folder.
export class group extends container {
    members;
    //
    //The row index column name for the (trancription) group is the image primary 
    //key. In future it will be determined programatically
    row_index_cname = 'image.image';
    //
    constructor(parent, options, 
    //
    //The key feature of a group is that it has members 
    members = []) {
        super(parent, options);
        this.members = members;
    }
    //
    //To show a group is to show her members
    async show() {
        //
        //The members must be set by now; show them
        for (const member of this.members)
            await member.show();
    }
    //Update the selection of the tanscription group, except the one where 
    // the click has occurred
    show_selection(cell) {
        //
        for (const member of this.members)
            member.show_selection(cell);
    }
}
//The homozone for supporting the creation of new records
export class creator extends homo.margin {
    //
    constructor(homozone, dim, options, parent) {
        //
        //The default settings of a creator
        const defaults = {
            //
            //The io type of a creator depends on the context
            io_type: 'default',
            //
            class_name: 'creator',
            //
            //A creator always show in edit mode
            mode: 'edit',
        };
        //
        super(homozone, dim, { ...defaults, ...options }, parent);
    }
    // Prevent the default behavior of the onblur event listener, which typically 
    // writes to a database. In this case, override it to perform no action.
    async onblur(cell, evt) { }
    //A creator has no data to display
    async display_data() { }
    //Set the initial cell values
    async init_io_value(cell) {
        //
        //The io  must be set by now
        cell.io.value = this.get_default_value(cell);
    }
    //
    //Get the defailt value of a cell from either the user options, frm the
    //underlying database, etc.
    get_default_value(cell) {
        //
        //If the user has a preference, then use it
        const value = cell.search_option('default_value');
        if (value)
            return value;
        //
        //Read the value from the database -- depending on the first non-primary
        //seed for this cell
        return this.get_default_value_from_db(cell);
    }
    //
    //Set the io of the given cell to its default value
    get_default_value_from_db(cell) {
        //
        //Get the principal seeds of the cell
        const seeds = cell.principals;
        //
        //Only cells where a principals exist are considerd
        if (seeds && seeds.length > 0) { }
        else
            return null;
        //
        //Get the first 1 principal seed.
        const seed = seeds[0];
        //
        //Extract the database column of the seed
        const value = seed.col.default;
        //
        //If the default value is empty, then ignore it
        if (value === '' || value === null)
            return null;
        //
        //If the value has an opening and closing bracket, then its a function
        //evaluate it; otherwise use it to set the default value
        const mydefault = value.endsWith('()') ? this.evaluate_mysql_expr(value) : value;
        //
        //Set the cell's io value. It must exist
        return mydefault;
    }
    //Evaluate a mysql expression to get a basic value
    evaluate_mysql_expr(str) {
        //
        //If the default value is a null string, return a null value
        if (str === 'null')
            return null;
        //
        //If the default valus is a timestamp, then return today's date
        if (str === 'CURRENT_TIMESTAMP()')
            return this.get_todays_date();
        //
        //Alert the user of this new default expression 
        throw new mutall_error(`Unable to evaluate ${str}`);
    }
}
//The homozone to support reviewing of records
export class reviewer extends homo.margin {
    checked;
    action;
    //
    constructor(
    //
    //The base homozone from which this margin is based
    homozone, 
    //
    //The orientation of the margin
    dim, 
    //
    //Will the radio button come out checked or not? The default is unchecked 
    checked = false, 
    //
    //What will the onchange even do: open a record or save it?
    action, 
    // 
    options, parent) {
        //
        super(homozone, dim, options, parent);
        this.checked = checked;
        this.action = action;
        //
        this.options = {
            //
            //A creator always show in edit mode
            mode: 'edit',
            //
            //The user may wish to override the above options
            ...options,
        };
    }
    //
    //Overrde the cell initialization to add radio buttons named after the cell's
    //index
    async init_cell(cell) {
        //
        //Use the cell's index to deduce the its radio name.
        //
        //The orientation of the cell depends on whether the paret is 
        //transposed or not. Its the row index we need if the parent homozone
        // //is not transposed
        const dim = !cell.parent.transposed ? 0 : 1;
        //
        //Read the cell's index value
        const index = cell.index[dim];
        //
        //Ensure that the index is a valid name by prefixing it with an i
        const name = `i${index}`;
        //
        //Add the checkbox io type before initialization, not checked. NB. The 
        // user can override this option via cell options
        cell.options = { io_type: { type: 'radio', name, checked: this.checked } };
        //
        //Continue with normal initialization
        await super.init_cell(cell);
    }
    // Prevent the default behavior of the onblur event listener, which typically 
    // writes to a database. In this case, override it to perform no action.
    async onblur(cell, evt) { }
    // The onchange event behavior is determined by the values of the action 
    // property: "open" or "write". 
    // - If the action is "open", it creates a new record and opens it.
    // - If the action is "write", it writes the record to the database and, 
    // upon success, refreshes the heterozone.
    async onchange(cell, evt) {
        //
        //If the user wishes to handle this event themselves, then respect it.
        let onchange;
        if (onchange = this.search_option('onchange'))
            await onchange(cell);
        //
        //If the user does not want he default behaviour, then respect it
        //
        //The tick mark is derived from the cell's index,
        const mark = cell.index[this.orientation];
        // 
        //The homozone of the record is the same as that of ths reviewer
        // The dimension of the record is the same as that of the reviewer 
        // The parent of a record is this reviewer
        //There are no explicit options associated with this record
        const myrecord = new record(mark, this.homozone, this.orientation, this, {});
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
                const ok = await myrecord.write();
                //
                //Uncheck the io if the writing failed
                if (!ok && cell.io instanceof radio)
                    cell.io.input.checked = false;
                //
                //If sucessful, do a refresh the homozone
                if (ok)
                    await this.refresh();
                break;
        }
    }
}
//The homozone to support cleaning/deleting of records
export class deleter extends homozone {
    //
    constructor(driver_source, options, parent) {
        super(driver_source, options, parent);
    }
}
//
//A panel is a homozonewhich has a heterozone to organize her siblings. It is 
// also a leaf container. In contrast a group is another container (which can 
// hold panels and other containers). This allows us to build a panel/container 
// hierarchial model used for managing the Balansys page
export class panel extends homozone {
    sql;
    row_index_cname;
    selection_cname;
    //
    //The heterozone that organises the zones adjacent to this panel
    organizer;
    //
    constructor(sql, row_index_cname, options, parent, 
    //
    //This is the column name that we are going to use to show our selection
    selection_cname) {
        //
        //Use the sql to formulate a driver
        const ds = {
            type: 'sql',
            sql,
            row_index: row_index_cname
        };
        super(ds, options, parent);
        this.sql = sql;
        this.row_index_cname = row_index_cname;
        this.selection_cname = selection_cname;
        //
        //The default options of a heterozone
        const defaults = {
            //
            //The heterozones will be anchored at the element that matches
            //the constructor name
            anchor: `#${this.constructor.name}`
        };
        //
        //Set the organizing heterozone. NB.The default options can be overriden 
        // by the user. NB. The plan is not known until show time. The panels
        //options are pased to the organizerheterozone so that they are accessible
        //from the view hierarchy
        this.organizer = new heterozone(undefined, { ...defaults, ...options }, parent);
    }
    //Simulate the onclick event after a reviewer has changed. The given cell 
    //is from the reviewer; we need to construct one that matches the consumer,
    //then simulate the consumer's click event
    async onclick_from_reviewer(cell) {
        //
        //Get the primary key tick mark
        const pk = cell.index[this.orientation];
        //
        //The consumere's selection fieldhas the other tick mark
        const selection = this.selection_cname;
        //
        //Use the consumer oriemttaion to get the row and column coordinates
        const [row, col] = this.orientate([pk, this.orientation], selection);
        //
        //Get the consumer cell on which to simulate the click event
        const cell2 = this.cells_indexed[row][col];
        //
        //Now simulate the onclick even on the consumer
        this.onclick(cell2);
    }
    //Tests if this panel is transposed or not. It is transposed an option
    //suugests so
    get is_transposed() {
        //
        //
        //By default, a panel is not transposed. If it is, then searching for the
        //option should return true.
        //Get the nearest transposition option
        return this.search_option('transposed') ?? false;
    }
    //
    //The panel show method overrides the normal version by showing that of the 
    // organizing heterozone
    async show() {
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
    }
    //Redefine the search to search the table option interface
    search_option(key) {
        //
        return super.search_option(key);
    }
}
