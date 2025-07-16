
import {mutall_error} from "../../../schema/v/code/schema.js";
import {io_type} from "../../../schema/v/code/io.js";


//A view is the root of all classes in the outlook library, so, it holds methods 
//that and properties that all outlook users can access
export class view {
    // 
    //This is used for indexing a view object to support implementation of the 
    //static 'current' property, as well as associateing this view with a state
    //object in the management of sessions. It is set when this view is 
    //constructed. See onpopstate 
    public key: number;
    // 
    //Lookup storage for all views created by this application.
    static lookup: Map<number, view> = new Map();
    // 
    //The current active view where the events (on a html page) are wired. E.g.
    //<button onclick=view.current.open_dbase()>Ok</button>
    static current: view;
    //
    //A view is associated with a win property. Typically it is the current
    //window, when the view is created. This variable is protected so that
    //it accessible only via getters and setters. This is important because
    //other derivatives of this class access the window property in different
    //ways. For instance, a baby page gets its window from its mother
    protected win__: Window = window
    // 
    //These are getter and setter to access the protected win variable. See 
    //documention for propertu win__ above to appreciate the reason for using 
    //of getters and setters in derived classes   
    get win() { return this.win__; }
    set win(win: Window) { this.win__ = win; }
    //
    //The document of a view is that of its the window
    get document() {
        return this.win.document;
    }
    //
    //The id of a view is a unique name formed from its key, prefixed with 
    //word view, e.g., view1, view2, etc.
    //Id is used in so many waus n a view. It is not useful to define it at this
    //level
    //public get id(){return `view${this.key}`}
    //
    //The children nodes of the root document element of this page
    //to support restoring of this page in response to the on pop state event.
    //The ordinary programmer is not expected to interact with this property, 
    //so it is protected
    protected child_nodes: Array<ChildNode> = [];
    //
    //The end of time date is the highest valid date that the relational 
    //databases can accommodate
    public static end_of_time:string = '9999-12-31';
    
    //
    constructor(
        //
        //The address  of the page. Some popup pages don`t have 
        //a url that`s why it`s optional.
        public url?: string
    ) {
        // 
        //Register this view identified by the last entry in the lookup table for views.
        // 
        //The view's key is the count of the number of keys in the lookup.
        this.key = view.lookup.size;
        view.lookup.set(this.key, this);
   }
   
   //Returns an attribute's value, if it is available; otherwise an error
   public get_attribute_value(element:HTMLElement, name:string):string{
       //
       //Get the named attribute from the given element
       const value = element.getAttribute(name);
       //
       //The attribute must be set; otherwise its an error
       if (value===null){
           //
           //Report teh error
           throw new mutall_error(`This element (see the console.log) has no attribute named ${name}.`, element);
       }
       //
       return value;
   }

    //Returns the values of the currently selected inputs 
    //from a list of named ones 
    public get_input_choices(name: string): Array<string> {
        //
        //Collect the named radio/checked inputs
        const radios = Array.from(this.document.querySelectorAll(`input[name="${name}"]:checked`));
        //
        //Map teh selected inputs to thiier values and return the collection
        return radios.map(r => (<HTMLInputElement>r).value);
    }
    //
    //Returns the value from an identified input or textarea element.
    //The function will return null (rather than '' or fail) if there is no input 
    //value. It returns Error if the value is empty and required
    public get_input_value(id: string): string|null|Error {
        //
        //Get the identified element.
        const elem = this.get_element(id);
        //
        //It must be an input  element or textarea.
        if (!(elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement))
            throw new mutall_error(`'${id}' is not an input or textarea element`);
        //
        //The desired value is.
        let value = elem.value === "" ? null: elem.value; 
        //
        //If the value is required and is null, then return an error
        const value2 = elem.hasAttribute('required') && value===null 
            ? new Error(`${id} is required`): value;
        // 
        //Return the desired value.
        return value2;
    }
    //
    //Returns the value of the checked radio button that has the given name.
    //Return null if there is no checked radio button. If any of the named 
    //buttons has a required attribute, then an error is retirned if none is 
    //checked
    public get_checked_value(name: string): string|null|Error {
        //
        //Get the radio button that matches the given name and is checked.
        const radio = this.document.querySelector(`input[name='${name}']:checked`);
        //
        //Do not continue with further checks if there is no checked radio button
        if (radio === null) {
            //
            //Get all the named radio buttons that have a required attribute
            const buttons= this.document.querySelectorAll(`input[name='${name}'][required]`);
            //
            //Required is true if there is at least one required button
            return (buttons.length>0) ? new Error(`${name} is required`):null;
        }
        //
        //Ensure that the radio element is a HTMLInputElement.
        if (!(radio instanceof HTMLInputElement)) 
            throw new mutall_error(`The input named '${name}' is not a HTMLInputElement`);
        //
        //The radio button's value must be set. It is a sign a poorly designed form 
        //if not
        if(radio.value === "") 
            throw new mutall_error(`No value found for input named '${name}'`);
        //
        //Return the checked value.
        return radio.value;
    }
    //
    //Get the selected value from the identified selector.
    //There must be a selected value.
    public get_selected_value(id: string): string {
        //
        //Get the Select Element identified by the id.
        const select = this.get_element(id);
        //
        //Ensure that the select is a HTMLSelectElement.
        if (!(select instanceof HTMLSelectElement))
            throw new mutall_error(`The element identified by '${id}' is not a HTMLSelectElement.`);
        //
        //Ensure that the select element value is set.
        if(select.value === "") 
            throw new mutall_error(`The value of the select element identified by '${id}' is not set.`);
        //
        //Return the selected value
        return select.value;
    }

    //Create a new element from  the given tagname and attributes 
    //we assume that the element has no children in this version.
    public create_element<
        //
        //The tagname is the string index of the html map.
        tagname extends keyof HTMLElementTagNameMap,
        // 
        //Collection of attributed values. The typescript Partial  data type
        //is a short form of
        //attribute_collection extends {[key in attribute_name]?:HTMLElementTagNameMap[tagname][key]}
        attribute_collection extends Partial<HTMLElementTagNameMap[tagname]>
    >(
        //
        //The element's tag name
        tagname: tagname,
        //
        //The parent of the element to be created.
        anchor: HTMLElement,
        //
        //The attributes of the element
        attributes?: attribute_collection
    ): HTMLElementTagNameMap[tagname] {
        //
        //Create the element holder based on the td's owner document
        const element = this.document.createElement(tagname);
        //
        //Attach this element to the anchor, if the anchor is defined 
        if (anchor!==undefined) anchor.appendChild(element);
        //
        //Loop through all the keys to add the atributes, if they are defoned
        if (attributes!==undefined)
        for (let key in attributes) {
            const value: any = attributes[key];
            // 
            // JSX does not allow class as a valid name
            if (key === "className") {
                // 
                //Take care of multiple class values
                const classes = (<string>value).split(" ");
                classes.forEach(c => element.classList.add(c));
            }
            else if (key === "textContent") {
                element.textContent = value;
            }
            else if (key.startsWith("on") && typeof attributes[key] === "function") {
                element.addEventListener(key.substring(2), value);
            }
            else {
                // <input disable />      { disable: true }
                if (typeof value === "boolean" && value) {
                    element.setAttribute(key, "");
                } else {
                    //
                    // <input type="text" />  { type: "text"}
                    element.setAttribute(key, value);
                }
            }
        }
        //
        //Rteurn the element
        return element;
    }
    //
    //Return the identified element, if it exists. If it does not, then throw an
    //exception 
    get_element(id: string): HTMLElement {
        //
        //Get the identified element from the current browser context.
        const element:HTMLElement|null = this.document.getElementById(id);
        //
        //Check the element for a null value
        if (element === null) 
            throw new mutall_error(`The element identified by #${id} not found`);
        //
        //Return (found) the element       
        return element;
    }
    
    //Search and return the the only element selected by the gigen css
    //css selector; it is an error if more than 1 or none is found.
    query_selector(css: string): HTMLElement {
        //
        //Get the identified element from the current browser context.
        const elements: Array<Element>=
            Array.from(this.document!.querySelectorAll(css));
        //
        //If there is more than one element, warn the user
        if (elements.length>1) 
            throw new mutall_error(`There are ${elements.length} elements selected by ${css}`);
        //
        //Check the elements is empty
        if (elements.length === 0) 
            throw new mutall_error(`The element with selector ${css} not found`);
        //
        //Return (the only found) the )HML) element       
        return <HTMLElement>elements[0];
    }
    
    
    

    //Show or hide the identified a window panel. This method is typeically 
    //used for showing/hiding a named grou of elements that must be shown
    //or hidden as required
    public show_panel(id: string, show: boolean): void {
        //
        //Get the identified element
        const elem = this.get_element(id);
        //
        //Hide the element if the show is not true
        elem.hidden = !show;
    }
    
    //Use the Luxon library to return the date and time for now() formated in 
    //the way  MYsql expects it. 
    public now():string{
        //
        //Discontinue the lusxon library
        //return luxon.DateTime.now().toFormat('YYYY-MM-DD hh:mm:ss');
        //
        //se the alternative method to get a mysql-compatible date strin for 
        //now();
        return view.standardise_date(new Date());
    }
    //
    //This is a general procedure for standardising conversion of dates to mySQL
    //compatible string format. I still a problem importing from a node_modules
    //library. Js won't understand import * as y from "x". It only understands
    //paths of the form: "./x.js" "../x.js", "/a/b/c/x.js". Perhaps its time to
    //learn how to use webpack. For now, use the native Js metod of convering the
    //date to a ISOstring, then replacing the T with a space and Z with noting
    static standardise_date(date:Date):string{
        //
        //Discontinue using the lucon libray
        //return luxon.DateTime.fromJSDate(date).toFormat('YYYY-MM-DD hh:mm:ss');
        //
        //Use the given date to bject and ...
        const str = date
            //
            //Convert the date ISO string, e.g., "2023-01-27T00:12:00.0000Z"
            .toISOString()
            //
            //Replace the T with a space
            .replace("T", " ")
            //
            //Remove the trailing Z for Zulu zone
            .replace("Z", "");
         //
         //Return the result as, e.g. "2023-01-27 00:12:00.0000" Will Mysql 
         //accept the .0000 bit? Not sure.
         return str;   
        
    }
    
    //Exploit typical layouts of input element on form to extract values. This assumes that
    //we can extract enough information from the form to determine, e.g, 
    //- the type of input, i,e. simple text or use of radio buttons
    //- if any input is required or not
    //This information is supplied using dataset technology in HTML using tgs such as 
    //data-required, data-io type, etc.
    //The given id is that of an envelop tag; the dataset attributes will be specified on this
    //element.
    //The output will be determined by data-required and data-io type attributes
    //Here is an example of an input that satisfies this arrangement
    /*
    <label id="username" data-required="true" data-iotype="text">
        Username:<input type="text"> 
        <span class="error"></span>
    </label>
    */
    public get_value(id:string):string|null|Error{
        //
        //Get the identified enveloping element, e.g. the label element in the 
        //our example
        const env = this.get_element(id);
        //
        //Get the io type. Currently only 2 are supported; they are text or radio. If 
        //no io type is available, we assume this is a simple input,
        const io_type:io_type = this.get_io_type(env);
        //
        //Use the envelop and io type to get the raw value, string or null. For check boxes,
        //if there is nothing checked, the raw value is null. For simple input, the null is a
        //zero-length string
        let raw:string|null = this.get_raw_value(env, io_type);
        //
        //Determine whether the value is required or not;
        const is_required:boolean = Boolean(env.dataset.required);
        //
        //If an input is required and it is empty, return the an error
        if (is_required && raw===null) return new Error(`Input '${id}' is required`);
        //
        //Otherwise return the raw value
        return raw;
    }
    //
    //Get the io-type from a given envelop element; its found in the data-iotype
    //attribute. Assume it is 'text' if the attribute is not found
    private get_io_type(env:HTMLElement):io_type{
        //
        //Get the io-type (string) from the envelop element if it is defined; 
        //otherwise assume it is simple text
        const text:string = env.dataset.iotype ?? 'text';
        //
        //Translate the text to a matching io
        switch(text){
            //
            //Simple text input
            case 'text':
               return {type:'text'};
            //
            //Text area input
            case 'textarea': return 'textarea';
            //
            //Radio input
            case 'radio':
               return 'radios';
            //
            //Dropdown selector
            case 'select':
                return 'select'
            //
            //Any orher case is a mistatch and should be reported to the programmer
            default:
                throw new mutall_error(`'${text}' is not a valid io_type`);
        }
    }
    //
    //Use the envelop and io type to get the raw alue as text or null. For 
    //radios/check boxes and selector if there is nothing checked, the raw value is null. 
    //For simple input, the null is a zero-length string. 
    private get_raw_value(env:HTMLElement, io_type:io_type):string|null{
        //
        //Translate the text to a matching io
        switch(io_type){
            //
            //Getting input form a radio
            case 'radios': return this.get_radio_value(env);
            //
            //Getting input from a select input / dropdown selector
            case 'select': return this.get_select_value(env);
            //
            //Getting input from a text area
            case 'textarea': return this.get_textarea_value(env)
            //
            //Any orher case is a mistatch and should be reported to the programmer
            default:
                //
                //Test if the io type of of the complext type. E.g., 
                //{type:'text', size:10} 
                if (typeof io_type==='object' && 'type' in io_type){
                    //
                    //Destructructure to get the type
                    const {type} = io_type;
                    //
                    //Depending on the type....
                    switch(type){
                        case 'text': return this.get_text_value(env);
                        default: 
                        throw  new mutall_error(`'${type}' is not a valid io-type`);
                    }
                }
                //Unknown io type
                //
                throw new mutall_error(`Unable to get the value of '${io_type}' io_type`);
                    
        }
   }
    //
    //Retrieve value from selector elements such as radio and checkboxes
    /*
    <fieldset id="operation" data-iotype="radio" data-required="true">
        <legend >What do you want to do?</legend>
        <label>
            <input type="radio" value ="up" name="option"> Sign Up to be Member
        </label>

        <label>
            <input type="radio" value="in" name="option"> Sign In as Member
        </label>
        <span class="error"></span>
    </fieldset>
    
    In this case, fieldset is the envlop element
    */
    private get_radio_value(env:HTMLElement):string|null{
        //
        //Collect all the radio buttons in under this envelop
        const radios:NodeListOf<HTMLElement>= env.querySelectorAll('input[type=radio]');
        //
        //There must be at least 2
        if (radios.length<2) throw new mutall_error(`At least 2 radio buttons are expected. ${radios.length} was found. See the console log`, radios);
        //
        //Collect all radio buttons that are checked
        const checkeds:NodeListOf<HTMLElement>= env.querySelectorAll('input[type=radio]:checked');
        //
        //Return a null if none of them is checked
        if (checkeds.length===0) return null;
        //
        //If more than one is cehcked, thois is a poor form design
        if (checkeds.length>=2) throw new mutall_error(`Check you form. ${checkeds.length} buttons are checked. Only 1 was expected`)
        //
        //Get the (trimmed) value of the checked button
        const value = (<HTMLInputElement>checkeds.item(0)).value.trim();
        //
        //Return null if the input has an empty value, or is explicily entered
        //as null
        return ['', 'null'].includes(value.toLowerCase()) ? null: value;
    }
    //
    //Retrieve value from a simple input, that is, text-based input element
    private get_text_value(env:HTMLElement):string|null{
        //
        //Assume there is an input element in the neighborhood under the
        //envelop 
        const element:HTMLElement|null = env.querySelector('input');
        //
        //Ensure that such an element does indeed exist
        if(element===null) 
            throw new mutall_error('There is no input element unde the envelopping element. See the log', env);
        //
        //Ensure that the element is indeed an input
        if (!(element instanceof HTMLInputElement))
            throw new mutall_error('This element is not an input. See the console log', element);
        //
        //Get the trimed down value
        const value:string = element.value.trim();
        //
        //Return null if the input has an empty value, or is explicitly entered
        //as null
        return ['', 'null'].includes(value.toLowerCase()) ? null: value;
    }
    //
    //Get value specified in a dropdown/select element
    private get_select_value(env: HTMLElement): string | null{
        //
        //Get the select element from the given envelop
        const element: HTMLElement | null = env.querySelector('select');
        //
        //Check to see if the element exists
        if (element === null) throw new mutall_error('Envelop element does not have a select child element. See the console log',env);
        //
        //Make sure that the element indeed is a select
        if(!(element instanceof HTMLSelectElement)) throw new mutall_error('No select element is detected. See the console log', env);
        //
        //Get the (trimmed) value of the selected option
        const value = element.value.trim();
        //
        //Return null if the input has an empty value, or is explicily entered
        //as null
        return ['', 'null'].includes(value.toLowerCase()) ? null: value;
    }
    //
    //Retrive the value of the text area within the given envelop
    //This input, unlike the simple case, uses the textarea element. 
    //The value of a text area is accessec via the textContent property
    private get_textarea_value(env:HTMLElement): string | null {
        //
        //Get the textarea element envelopped by the env
        const element: HTMLElement | null = env.querySelector('textarea');
        //
        //Ensure that the text area exists
        if(element === null) throw new mutall_error('There is no textarea element unde the envelopping element. See the log', env);
        //
        //Ensure that the elment retrieved is actually a text area
        if(!(element instanceof HTMLTextAreaElement)) throw new mutall_error('This element is not a text area. See the console log', element);
        //
        //Get the text content treamed if it is filed else return the null value
        const value:string | null = element.textContent? element.textContent.trim(): element.textContent;
        //
        //In case of a null value return it as it is and don't continue
        if (!value) return value;
        //
        //Further tests if the value is a string
        //Return null if the input has an empty value, or is explicitly entered
        //as null
        return ['', 'null'].includes(value.toLowerCase()) ? null: value;
    }
    //
    //Report the dirty cases in teh login form at the appropriate place
    public report_error(id: string, msg:string):void{
        //
        //Use the same key to get the general area where to report
        const element = this.get_element(id);
        //
        //Get the  specific element where to report
        const report:HTMLElement|null = element.querySelector('.error');
        //
        //If there is no place to report, then this is a badly designed form; alert the user
        if (report===null)
            throw new mutall_error(`No element for reporting errors for field '${id}'`);
        //
        //Now report the error message
        report.textContent = msg;
    }
}

//A page is a view with display panels
export class page extends view{
    //
    //A page has named panels that the user must ensure that they 
    //are set before they are shown.
    protected panels: Map<string, panel>;
    
    constructor(url?: string){
        super(url); 
        // 
        //Initialize the panels dictionary
        this.panels = new Map();
    }
    
    //
    //The user must call this method on a new application object; its main 
    //purpose is to complete those operations of a constructor that require
    //to function synchronously
    async initialize(): Promise<void>{
        //
        //Set the window for this page
        this.win = await this.open();
        //
        //Add the pop state listener to ensure that if a history back button
        //is clicked on, we can restore this page
        this.win.onpopstate = (evt) => this.onpopstate(evt);
    }
    //Handle the on pop state listener by saving the current state and 
    //restoring the view matching the event's history state
    protected onpopstate(evt: PopStateEvent) {
        // 
        //Ignore any state that has no components to restore. Typically
        //this is the initial state placed automatically on the history 
        //stack when this application loaded initially. For this version, the
        //null state is never expected because we did replace it in this 
        //application's initializetion
        if (evt.state === null) 
            throw new mutall_error("Null state unexpected");
        // 
        //Get the saved view's key
        const key = <number>evt.state;
        // 
        //Use the key to get the view being restored. We assume that it must be 
        //a baby of the same type as this one
        const new_view =<page> view.lookup.get(key);
        //
        //It is an error if the key has no matching view.
        if (new_view === undefined) 
            throw new mutall_error(`This key ${key} has no view`);
        // 
        //Restore the components of the new view
        new_view.restore_view(key);
    }
    
    // 
    //The default way a quiz view shows its content is 
    //by looping through all its panels and painting 
    //them. A quiz view without panels can override this method 
    //to paint their contents.
    public async show_panels(): Promise<void> {
        //
        //The for loop is used so that the panels can throw 
        //exception and stop when this happens  
        for (const panel of this.panels.values()) {
            await panel.paint();
        }
    }
    
    
    
    //Restore the children nodes of this view by re-attaching them to the 
    //document element of this page's window.  
    public restore_view(key: number): void {
        //
        //Get the view of the given key
        const View = view.lookup.get(key);
        //
        //It's an error if the view has not been cached
        if (View === undefined) 
            throw new mutall_error(`This key ${key} has no matching view`);
        //
        //Get the root document element. 
        const root = View.document.documentElement;
        //
        //Clean the root before restoring it -- just in case the view
        //is attached to an old window;
        Array.from(root.childNodes).forEach(node => root.removeChild(node));
        //
        //Attach every child node of this view to the root document
        this.child_nodes.forEach(node => root.appendChild(node));
    }
    
    
    //Opening a page makes visible in the users view. All pages return the 
    //current window. Only popups create new ones.
    async open(): Promise<Window>{
        return window; 
    }
    
    //Remove a quiz page from a users view and wait for the base to rebuild. 
    //In popups we simply close the window; in babies we do a history back, 
    //and wait for the mother to be reinstated. In general, this does 
    //nothing
    async close():Promise<void>{}
    
    //Save the children of the root document element of this view to the history
    //stack using the 'how' method
    public save_view(how: "pushState" | "replaceState"): void {
        //
        //Get the root document element
        const root = this.document.documentElement;
        //
        //Save the child nodes to a local property
        this.child_nodes = Array.from(root.childNodes);
        //
        //Save (by either pushing or replacing) this view's state to the 
        //windows session history indirectly -- indirectly because we don't 
        //acutally save this view to the session history but its unique 
        //identification key -- which then is used for looking up the view's
        //details from the static map, view.lookup
        this.win.history[how](
            //
            //The state object pushed (or replaced) is simply the key that 
            //identifies this view in the static look for views, view.lookup
            this.key,
            //
            //The title of this state. The documentation does not tell us what
            //it is really used for. Set it to empty 
            "",
            //
            //This browser bar info is not very helpful, so discard it
            ""
        );
    }
    
    
    //Show the given message in a report panel, Depending on the nature of the 
    //resport, the appropriate styling is applied
    async report(error:boolean, msg: string){
        //
        //Get the report node element
        const report = this.get_element('report');
        //
        //Add the error message
        report.textContent = msg;
        //
        //Style the report, depending on the error status
        if (error) {
            report.classList.add('error');
            report.classList.remove('ok');
        } 
        else {
            report.classList.add('ok');
            report.classList.remove('error');
        }
    }
}


//A panel is a targeted section of a view. It can be painted 
//independently
export abstract class panel extends view {
    //
    //The panel's target element is set (from css in the constructor arguments)
    //when the panel is painted
    public target?: HTMLElement;
    //
    constructor(
        //
        //The CSS to describe the targeted element on the base page
        public css: string,
        //
        //A base view is the home of the panel
        public base: view
    ) {
        //The ur (required to initialize a view) is that of the base
        super(base.url);
    }
    //
    //Start painting the panel
    async paint(): Promise<void> {
        //
        //Get the targeted element. It must be only one
        const targets = Array.from(
            this.document.querySelectorAll(this.css));
        //
        //There must be a target    
        if (targets.length == 0) throw new mutall_error(
            `No target found with CSS ${this.css}`);
        //
        //Multiple targets is a sign of an error
        if (targets.length > 1) throw new mutall_error(
            `Multiple targets found with CSS ${this.css}`);
        //
        //The target must be a html element
        if (!(targets[0] instanceof HTMLElement)) throw new mutall_error(`
        The element targeted by CSS ${this.css} must be an html element`)
        //
        //Set the html element and continue painting the panel
        this.target = targets[0];
        //
        //Continue to paint the pannel. This method is implemented differently
        //depending the obe extending class    
        await this.continue_paint();
    }
    //
    //Continue painting the this pannel -- depending on its nature. 
    public abstract continue_paint(): Promise<void>;
    //
    //The window of a panel is the same as that of its base view, 
    //so a panel does not need to be opened
    get win() {
        return this.base.win;
    }
}
