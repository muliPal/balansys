import { homo, driver_source, table_options, hetero, plan, table_option_interface, grid 
} from "../../../outlook/v/zone/zone.js";

import { view, view_options } from "../../../schema/v/code/schema.js";
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

//A page is a container of homozone based panels 
export abstract class page extends view{
    //
    //This represents the receipt that will be shown in all our panels
    public row_index:string='200';
    //
    //The zone based panels that make up a transcriptipn page
    public panels:Array<panel>=[];
    //
    constructor(
        //
        //To implement the view has-a hierarchy
        public parent?:view,
        //
        //The options for controlling a view
        public options?:view_options
    ){
        super(parent, options)   
    }
    //
    //Show all the panels of a page
    async show():Promise<void>{
        //
        for(const panel of this.panels) panel.show();
    }
}
//
//The homozone based panel that make up a page
export class panel extends homo.zone{
    //
    //This is the column that we are going to use to show our selection
    public col_index:string;
    //
    //This heterozone is needed so so hat this homozone is displayed with headers
    public heterozone:hetero.zone;
    //
    //Tell typescript that the parent of a panel is a page (not just a view)
    declare parent:page;
    //
    constructor(
        driver_source:driver_source, 
        options:panel_options, 
        parent:page,
        col_index:string
    ){
        //
        super(driver_source,options,parent);
        //
        //
        this.col_index=col_index;
        //
        //Create a heterozone using the this one as the body, so that the headers
        //can be displayed
        //
        //The plan of the heterozone is based on this homozone
        const plan:plan = this.get_plan();
        //
        //The option of a heterozone
        const heteroptions:table_options = {
            //
            //The heterozones will be anchored at the element that matches
            //the constructor name
            anchor:`#${this.constructor.name}`
        }
        //
        //Presently, there are no specific options associated with the homozone
        this.heterozone = new hetero.zone(plan, parent, heteroptions)
    }
    //
    //Get the plan of this panel, taking transposion into account
    get_plan():plan{
        //
        //Start with unknown plan
        let plan:plan;
        //
        //The plan depends on whether there is transposition or not
        const transposed:boolean|undefined = this.search_option('transposed');
        //
        //Consider teh normal case
        if (!transposed){
            plan = [
                [this.get_header()],
                [this]
            ]
        }else{
            //
            //Transpose the driver of this homozone
            this.driver_source = {type:'transpose', source:this.driver_source!}
            plan = [
                [this.get_leftie(), this]
            ]
        }
        //
        //Return the plan
        return plan;
    }
    //
    //A panel overrides the normal show method by showing that of the homozone
    //instead
    async show():Promise<void>{
        //
        //Show the panel naturally
        await this.heterozone.show();
        //
        //Show the selected cell
        this.show_selection();    
    }
    //
    //
    show_selection():void{
        //
        //1.Select the grid/cell of interest
        //
        //1.2 Get the row index from the parent page
        const row:string = this.parent.row_index;
        //
        //1.3 Get the column index (available locally)
        const col:string = this.col_index;
        //
        //1.4 Get the indexed grid from the indexed cells of this homozone
        const grid:grid = this.cells_indexed![row][col];
        //
        //1.5 Select the indexed grid
        grid.select();
        //
        //Scroll the grid to the view
        grid.td.scrollIntoView({block:'center'})
    }
    //Redefine the search to search the table option interface
    search_option<i extends keyof panel_option_interface>(key:i):panel_option_interface[i]|undefined{
        //
        return <panel_option_interface[i]> super.search_option(<keyof table_option_interface>key);
    }
}