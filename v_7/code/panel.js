import { homo, hetero } from "../../../outlook/v/zone/zone.js";
import { view } from "../../../schema/v/code/schema.js";
//A page is a container of homozone based panels 
export class page extends view {
    parent;
    options;
    //
    //This represents the receipt that will be shown in all our panels
    row_index = '200';
    //
    //The zone based panels that make up a transcriptipn page
    panels = [];
    //
    constructor(
    //
    //To implement the view has-a hierarchy
    parent, 
    //
    //The options for controlling a view
    options) {
        super(parent, options);
        this.parent = parent;
        this.options = options;
    }
    //
    //Show all the panels of a page
    async show() {
        //
        for (const panel of this.panels)
            panel.show();
    }
}
//
//The homozone based panel that make up a page
export class panel extends homo.zone {
    //
    //This is the column that we are going to use to show our selection
    col_index;
    //
    //This heterozone is needed so so hat this homozone is displayed with headers
    heterozone;
    //
    constructor(driver_source, options, parent, col_index) {
        //
        super(driver_source, options, parent);
        //
        //
        this.col_index = col_index;
        //
        //Create a heterozone using the this one as the body, so that the headers
        //can be displayed
        //
        //The plan of the heterozone is based on this homozone
        const plan = this.get_plan();
        //
        //The option of a heterozone
        const heteroptions = {
            //
            //The heterozones will be anchored at the element that matches
            //the constructor name
            anchor: `#${this.constructor.name}`
        };
        //
        //Presently, there are no specific options associated with the homozone
        this.heterozone = new hetero.zone(plan, parent, heteroptions);
    }
    //
    //Get the plan of this panel, taking transposion into account
    get_plan() {
        //
        //Start with unknown plan
        let plan;
        //
        //The plan depends on whether there is transposition or not
        const transposed = this.search_option('transposed');
        //
        //Consider teh normal case
        if (!transposed) {
            plan = [
                [this.get_header()],
                [this]
            ];
        }
        else {
            //
            //Transpose the driver of this homozone
            this.driver_source = { type: 'transpose', source: this.driver_source };
            plan = [
                [this.get_leftie(), this]
            ];
        }
        //
        //Return the plan
        return plan;
    }
    //
    //A panel overrides the normal show method by showing that of the homozone
    //instead
    async show() {
        //
        //Show the panel naturally
        await this.heterozone.show();
        //
        //Show the selected cell
        this.show_selection();
    }
    //
    //
    show_selection() {
        //
        //1.Select the grid/cell of interest
        //
        //1.2 Get the row index from the parent page
        const row = this.parent.row_index;
        //
        //1.3 Get the column index (available locally)
        const col = this.col_index;
        //
        //1.4 Get the indexed grid from the indexed cells of this homozone
        const grid = this.cells_indexed[row][col];
        //
        //1.5 Select the indexed grid
        grid.select();
        //
        //Scroll the grid to the view
        grid.td.scrollIntoView({ block: 'center' });
    }
    //Redefine the search to search the table option interface
    search_option(key) {
        //
        return super.search_option(key);
    }
}
