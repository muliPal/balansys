import { homo, hetero } from "../../../outlook/v/zone/zone.js";
import { view } from "../../../schema/v/code/schema.js";
//A page is a container of homozone based panels 
export class page extends view {
    parent;
    options;
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
            await panel.show();
    }
}
//
//The homozone based panel that make up a page
export class panel extends homo.zone {
    //
    //This heterozone is needed so so hat this homozone is displayed with headers
    heterozone;
    //
    constructor(driver_source, options, parent) {
        //
        super(driver_source, options, parent);
        //
        //Create a heterozone using the this one as the body, so that the headers
        //can be displayed
        //
        //The plan of the heterozone is based on this homozone, assuming a normal
        //rather than transposed layout
        const plan = [
            [this.get_header()],
            [this]
        ];
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
    //A panel overrides the normal show method by showing that of the homozone
    //instead
    async show() {
        await this.heterozone.show();
    }
}
