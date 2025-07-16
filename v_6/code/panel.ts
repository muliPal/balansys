import { homo, driver_source, table_options, hetero, plan } from "../../../outlook/v/zone/zone.js";
import { view, view_options } from "../../../schema/v/code/schema.js";

//A page is a container of homozone based panels 
export abstract class page extends view{
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
        for(const panel of this.panels) await panel.show();
    }
}
//
//The homozone based panel that make up a page
export class panel extends homo.zone{
    //
    //This heterozone is needed so so hat this homozone is displayed with headers
    public heterozone:hetero.zone;
    //
    //Tell typescript that the parent of a panel is a page (not just a view)
    declare parent:page;
    //
    constructor(
        driver_source:driver_source, 
        options:table_options, 
        parent:page
    ){
        //
        super(driver_source,options,parent);
        //
        //Create a heterozone using the this one as the body, so that the headers
        //can be displayed
        //
        //The plan of the heterozone is based on this homozone, assuming a normal
        //rather than transposed layout
        const plan:plan = [
            [this.get_header()],
            [this]
        ];
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
    //A panel overrides the normal show method by showing that of the homozone
    //instead
    async show():Promise<void>{
        await this.heterozone.show();
    }
}