import { transcription, consumer } from './transcription.js';
//
//Defining a class called cleaner, that inherits all the properties & methods from another class called transcription
export default class Cleaner extends transcription {
    //
    //This is the special method that runs when you create a new instance of this class
    //It says the `parent` parameter is optional, because of the `?`
    //If passed, it'll be of type view
    constructor(parent) {
        // 
        //super() This calls the constructor of the parent class, i.e transcription
        super(parent);
        //
        //
        const criteria = new Query(this);
        //
        //
        this.consumer = criteria;
        //
        //
        this.members[0] = criteria;
    }
}
export class Query extends consumer {
    constructor(parent) {
        super(parent);
        //
        //
    }
}
