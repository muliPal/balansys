//
//import the view class
import { view } from "../../../schema/v/code/schema.js";

import { homo, driver_source, options, hetero, plan } from "../../../outlook/v/zone/zone.js"
import { readonly } from "../../../schema/v/code/io.js";
//
//This page is representing the transcription page as encountered in our mock up
export class page extends view {
    //
    //a page might have one or more pannels
    public pannels?:Array<pannel>;
    //
    //call the parent class.
    constructor() {
        super();
    }
    //
    //Here we show the list of image files in the file section not from first princeples but
    //using the zone library.

    //My mock up comprises of four sections, viz., file, image, receipt and purchase.
    //This method shows all of these sections in terms of zones(as encountered in the zone library).

    //
    //On this method, i intend to show the receipt data with headers and empty inputs

    //
    //On this method, i intend to show the purchase data with headers and empty inputs


}
//
//class pannel
class pannel extends homo.zone{
    //
    //a heterozone???  clarify
    public heterozone?:hetero.zone;
    //
    //method responsible for displaying the pannel
    public async show(): Promise<void> {
        
    }
}