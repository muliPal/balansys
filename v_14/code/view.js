// 
// Define the namespace needed to create svg elements. This is needed by the
//metavisuo system. Its defined here to prevent cluttering the mataviouo namespace
export const svgns = "http://www.w3.org/2000/svg";
//View is the root of all classes in the outlook library, so, it holds methods 
//methods and properties that all outlook users can access.
//Its descendants can dispatch and listen to events.
export class view extends EventTarget {
    url;
    //
    //Every view has a proxy -- a element that represents the view. The user
    //of this property is responsible for setting it. This is designed to be 
    //compatible with earlier view-derived classes
    shell;
    // 
    //This is used for indexing a view object to support implementation of the 
    //static 'current' property, as well as associating this view with a state
    //object in the management of sessions. It is set when this view is 
    //constructed. See onpopstate 
    key;
    // 
    //Lookup storage for all views created by this application.
    static lookup = new Map();
    // 
    //The current active view where the events (on a html page) are wired. E.g.
    //<button onclick=view.current.open_dbase()>Ok</button>
    static current;
    //
    //A view is associated with a win property. Typically it is the current
    //window, when the view is created. This variable is protected so that
    //it accessible only via getters and setters. This is important because
    //other derivatives of this class access the window property in different
    //ways. For instance, a baby page gets its window from its mother
    win__ = window;
    // 
    //These are getter and setter to access the protected win variable. See 
    //documention for propertu win__ above to appreciate the reason for using 
    //of getters and setters in derived classes   
    get win() { return this.win__; }
    set win(win) { this.win__ = win; }
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
    child_nodes = [];
    //
    //The end of time date is the highest valid date that the relational 
    //databases can accommodate
    static end_of_time = '9999-12-31';
    //
    constructor(
    //
    //The address  of the page. Some popup pages don`t have 
    //a url that`s why it`s optional.
    url) {
        //
        //Initialize the parent evet target
        super();
        this.url = url;
        // 
        //Register this view identified by the last entry in the lookup table for views.
        // 
        //The view's key is the count of the number of keys in the lookup.
        this.key = view.lookup.size;
        view.lookup.set(this.key, this);
    }
    //Returns an attribute's value, if it is available; otherwise an error
    get_attribute_value(element, name) {
        //
        //Get the named attribute from the given element
        const value = element.getAttribute(name);
        //
        //The attribute must be set; otherwise its an error
        if (value === null) {
            //
            //Report teh error
            throw new mutall_error(`This element (see the console.log) has no attribute named ${name}.`, element);
        }
        //
        return value;
    }
    //Returns the values of the currently selected inputs 
    //from a list of named ones 
    get_input_choices(name) {
        //
        //Collect the named radio/checked inputs
        const radios = Array.from(this.document.querySelectorAll(`input[name="${name}"]:checked`));
        //
        //Map teh selected inputs to thiier values and return the collection
        return radios.map(r => r.value);
    }
    //
    //Returns the value from an identified input or textarea element.
    //The function will return null (rather than '' or fail) if there is no input 
    //value. It returns Error if the value is empty and required
    get_input_value(id) {
        //
        //Get the identified element.
        const elem = this.get_element(id);
        //
        //It must be an input  element or textarea.
        if (!(elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement))
            throw new mutall_error(`'${id}' is not an input or textarea element`);
        //
        //The desired value is.
        let value = elem.value === "" ? null : elem.value;
        //
        //If the value is required and is null, then return an error
        const value2 = elem.hasAttribute('required') && value === null
            ? new Error(`${id} is required`) : value;
        // 
        //Return the desired value.
        return value2;
    }
    //
    //Returns the value of the checked radio button that has the given name.
    //Return null if there is no checked radio button. If any of the named 
    //buttons has a required attribute, then an error is retirned if none is 
    //checked
    get_checked_value(name) {
        //
        //Get the radio button that matches the given name and is checked.
        const radio = this.document.querySelector(`input[name='${name}']:checked`);
        //
        //Do not continue with further checks if there is no checked radio button
        if (radio === null) {
            //
            //Get all the named radio buttons that have a required attribute
            const buttons = this.document.querySelectorAll(`input[name='${name}'][required]`);
            //
            //Required is true if there is at least one required button
            return (buttons.length > 0) ? new Error(`${name} is required`) : null;
        }
        //
        //Ensure that the radio element is a HTMLInputElement.
        if (!(radio instanceof HTMLInputElement))
            throw new mutall_error(`The input named '${name}' is not a HTMLInputElement`);
        //
        //The radio button's value must be set. It is a sign a poorly designed form 
        //if not
        if (radio.value === "")
            throw new mutall_error(`No value found for input named '${name}'`);
        //
        //Return the checked value.
        return radio.value;
    }
    //
    //Get the selected value from the identified selector.
    //There must be a selected value.
    get_selected_value(id) {
        //
        //Get the Select Element identified by the id.
        const select = this.get_element(id);
        //
        //Ensure that the select is a HTMLSelectElement.
        if (!(select instanceof HTMLSelectElement))
            throw new mutall_error(`The element identified by '${id}' is not a HTMLSelectElement.`);
        //
        //Ensure that the select element value is set.
        if (select.value === "")
            throw new mutall_error(`The value of the select element identified by '${id}' is not set.`);
        //
        //Return the selected value
        return select.value;
    }
    //Create a new element from  the given tagname and attributes 
    //we assume that the element has no children in this version.
    create_element(
    //
    //The element's tag name
    tagname, 
    //
    //The parent of the element to be created.
    anchor, 
    //
    //The attributes of the element
    attributes) {
        //
        //Create the element holder based on the td's owner document
        const element = this.document.createElement(tagname);
        //
        //Attach this element to the anchor, if the anchor is defined 
        if (anchor !== undefined)
            anchor.appendChild(element);
        //
        //Loop through all the keys to add the atributes, if they are defoned
        if (attributes !== undefined)
            for (let key in attributes) {
                const value = attributes[key];
                // 
                // JSX does not allow class as a valid name
                if (key === "className") {
                    // 
                    //Take care of multiple class values
                    const classes = value.split(" ");
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
                    }
                    else {
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
    get_element(id) {
        //
        //Get the identified element from the current browser context.
        const element = this.document.getElementById(id);
        //
        //Check the element for a null value
        if (element === null)
            throw new mutall_error(`The element identified by #${id} not found`);
        //
        //Return (found) the element       
        return element;
    }
    //Given a variable, x, (whose optional name may also be given) return it 
    //if it is set; otherwise report the situation. This utility helps us to
    //work with optional properties without having to set up private versions
    //to match.
    //NB. 'x 'is some data -- any data. 'name' is a name that describes that data 
    //for reporting purposes   
    myget(x, name) {
        //
        //Return x if defined. N.B.. Do not use the shortcut 'if (x)...' because
        //that includes null -- which is defined 
        if (x !== undefined)
            return x;
        //
        //...otherwise report it
        throw new mutall_error(`Variable ${name ?? ''} not set. Check initialization`);
    }
    //Search and return the the only element selected by the gigen css
    //css selector; it is an error if more than 1 or none is found.
    query_selector(css) {
        //
        //Get the identified element from the current browser context.
        const elements = Array.from(this.document.querySelectorAll(css));
        //
        //If there is more than one element, warn the user
        if (elements.length > 1)
            throw new mutall_error(`There are ${elements.length} elements selected by ${css}`);
        //
        //Check the elements is empty
        if (elements.length === 0)
            throw new mutall_error(`The element with selector ${css} not found`);
        //
        //Return (the only found) the )HML) element       
        return elements[0];
    }
    //Show or hide the identified a window panel. This method is typeically 
    //used for showing/hiding a named grou of elements that must be shown
    //or hidden as required
    show_panel(id, show) {
        //
        //Get the identified element
        const elem = this.get_element(id);
        //
        //Hide the element if the show is not true
        elem.hidden = !show;
    }
    //Use the Luxon library to return the date and time for now() formated in 
    //the way  MYsql expects it. 
    now() {
        //
        //Discontinue the lusxon library
        //return luxon.DateTime.now().toFormat('YYYY-MM-DD hh:mm:ss');
        //
        //se the alternative method to get a mysql-compatible date strin for 
        //now();
        return this.standardise_date(new Date());
    }
    //
    //This is a general procedure for standardising conversion of dates to mySQL
    //compatible string format. I still a problem importing from a node_modules
    //library. Js won't understand import * as y from "x". It only understands
    //paths of the form: "./x.js" "../x.js", "/a/b/c/x.js". Perhaps its time to
    //learn how to use webpack. For now, use the native Js metod of convering the
    //date to a ISOstring, then replacing the T with a space and Z with noting
    standardise_date(date) {
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
    //Exploit typical layouts of input element on form to extract values. This 
    //assumes that we can extract enough information from the form to determine, 
    //e.g.,  
    //- the type of input, i,e., simple text or use of radio buttons
    //- if any input is required or not
    //This information is supplied using dataset technology in HTML using tags 
    //such as data-required, data-io type, etc.
    //The given id is that of an envelop tag; the dataset attributes will be 
    //specified on this element.
    //The output will be determined by data-required and data-io type attributes
    //Here is an example of an input that satisfies this arrangement
    /*
    <label data-field="username" data-required data-iotype="text">
        Username:<input type="text">
    </label>
    
    <label data-required>
        Username:<input type="text" name="username">
    </label>
    */
    get_value(id) {
        //
        //Get the identified enveloping element, e.g. the label element in the 
        //the above example
        const env = this.get_envelop_element(id);
        //
        //Get the io type. Currently only 2 are supported; text and radio. If 
        //no io type is available, then we assume it is a simple input.
        const io_type = this.get_io_type_from_envelop(env);
        //
        //Use the envelop and io type to get the raw value, string or null. For 
        //check boxes, if there is nothing checked, the raw value is null. For 
        //simple input, the null is a zero-length string
        let raw = this.get_raw_value(env, io_type);
        //
        //Determine whether the value is required or not;
        const is_required = Boolean(env.dataset.required);
        //
        //If an input is required and it is empty, return the an error...
        if (is_required && raw === null)
            return new Error(`Input '${id}' is required`);
        //
        //...otherwise return the raw value
        return raw;
    }
    //Using the same envelop strategy as the get_value(), get the identified
    //files
    get_files(id) {
        //
        //Get the identified enveloping element, e.g., the label element in the 
        //the above example
        const env = this.get_envelop_element(id);
        //
        //Use the envelop and io type to get the raw value, string or null. For 
        //check boxes, if there is nothing checked, the raw value is null. For 
        //simple input, the null is a zero-length string
        const file = this.get_files_using_envelop(env);
        //
        //Determine whether the value is required or not;
        const is_required = Boolean(env.dataset.required);
        //
        //If an input is required and it is empty, return the an error...
        if (is_required && file === null)
            return new Error(`Input '${id}' is required`);
        //
        //...otherwise return the file value
        return file;
    }
    //Returns the file under the given envelop
    get_files_using_envelop(env) {
        //
        //Use the envelop to search for an input element of type file
        const inputs = env.querySelectorAll('input[type="file"]');
        //
        //Its an error if none is found
        if (inputs.length === 0)
            throw new mutall_error(`No file input element is found under current envelop element`, env);
        //
        //It islao an errror if the search result is ambiguous
        if (inputs.length > 1)
            throw new mutall_error(`There is more than 1 file input element under curremt envelop`, env);
        //
        //Get the only input element
        const input = inputs[0];
        //
        //Return the file if it is defined and there is at least one selection;
        //otherwise null
        return input.files ?? null;
    }
    //Return the element that envelops the one with the given id
    get_envelop_element(id) {
        //
        //Let element be the envelop
        let element;
        //
        //Try the data-field route first
        if (element = this.document.querySelector(`*[data-field="${id}"]`))
            return element;
        //
        //Try the normal id route
        if (element = this.document.getElementById(id))
            return element;
        //
        //Try name route
        const elements = Array.from(this.document.getElementsByName(id));
        if (elements.length > 0) {
            //
            const data_field = elements[0].closest('*[data-field], *[id]');
            //
            if (data_field)
                return data_field;
        }
        //
        //Element not found
        throw new mutall_error(`No envelop element matches '${id}' using the Name, Id or Data-field strategy`);
    }
    //Get the io-type from a given envelop element; its found in the data-iotype
    //attribute. Assume it is 'text' if the attribute is not found
    get_io_type_from_envelop(env) {
        //
        //Get the io-type (string) from the envelop element if it is defined; 
        //otherwise assume it is simple text
        const text = env.dataset.iotype ?? 'text';
        //
        //Translate the text to a matching io
        switch (text) {
            //
            //Simple text input (without size)
            case 'text': return { type: 'text' };
            //
            //Text area input
            case 'textarea': return 'textarea';
            //
            //Radio input
            case 'radios': return 'radios';
            //
            //Dropdown selector
            case 'select': return 'select';
            //
            //Any orher case is a mismatch and should be reported to the programmer
            default:
                throw new mutall_error(`'${text}' is not a valid io_type`);
        }
    }
    //
    //Use the envelop and io type to get the raw alue as text or null. For 
    //radios/check boxes and selector if there is nothing checked, the raw value
    // is null. For simple input, the null is a zero-length, or name 'null' string. 
    get_raw_value(env, io_type) {
        //
        //Translate the iotype to a matching value
        switch (io_type) {
            //
            //Getting input form a radio
            case 'radios': return this.get_radio_value(env);
            //
            //Getting input from a select input / dropdown selector
            case 'select': return this.get_text_value(env);
            //
            //Getting input from a text area
            case 'textarea': return this.get_text_value(env);
            //
            //Handle complex io types, e.g., {type:'text', size:10} 
            default:
                //
                //Test if the io type is of the complext type, e.g., 
                //{type:'text', size:10} 
                if (typeof io_type === 'object' && 'type' in io_type) {
                    //
                    //Destructure to get the type
                    const { type } = io_type;
                    //
                    //Depending on the type....
                    switch (type) {
                        case 'text': return this.get_text_value(env);
                        default:
                            throw new mutall_error(`'${type}' is not a valid io-type`);
                    }
                }
                //Any other io type must be is a mismatch and should be reported
                // as an error
                throw new mutall_error(`Unable to get the value of io_type '${io_type}'`);
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
    get_radio_value(env) {
        //
        //The envelop must have a data-field attribute, from which we can get 
        //the name associated with the radio element under it
        const name = env.dataset.field;
        if (!name)
            throw new mutall_error(`The envlop enclosing radio buttons must have a data field named the same as the buttons`, env);
        //
        //Use the name to formulate a css for isolating radio fields for this 
        //envelop
        const css = `input[type="radio"][name="${name}"]`;
        //
        //Collect all the radio buttons under this envelop
        const radios = env.querySelectorAll(css);
        //
        //There must be at least 2
        if (radios.length < 2)
            throw new mutall_error(`At least 2 radio buttons are expected. ${radios.length} was found. See the console log`, radios);
        //
        //Collect all radio buttons that are checked
        const checkeds = env.querySelectorAll(`${css}:checked`);
        //
        //Return a null if none of them is checked
        if (checkeds.length === 0)
            return null;
        //
        //If more than one is cehcked, this is a poor form design
        if (checkeds.length >= 2)
            throw new mutall_error(`Check you form. ${checkeds.length} buttons are checked. Only 1 was expected`);
        //
        //Get the (trimmed) value of the checked button
        const value = checkeds.item(0).value.trim();
        //
        //Return null if the input has an empty value, or is explicitly entered
        //as null
        return ['', 'null'].includes(value.toLowerCase()) ? null : value;
    }
    //
    //Retrieve value from a child input (of an enveloping element) that has a 
    //value key
    get_text_value(env) {
        //
        //Select all the elements that are immediate children of the envelop
        const all_elements = Array.from(env.children);
        //
        //Select only those cases that have a value key
        const elements = all_elements.filter(e => 'value' in e);
        //
        //Its a design fault if no element can be found 
        if (elements.length === 0)
            throw new mutall_error('No element with a value key found', env);
        //
        //It is also a form design fault if more than 1 element is found
        if (elements.length > 1)
            throw new mutall_error(`Only 1 value element is expected. ${elements.length} were found`);
        //
        //Get the only element's value and trim it
        const value = elements[0].value.trim();
        //
        //Return null if the input has an empty value, or is explicitly entered
        //as null
        return ['', 'null', 'undefined'].includes(value.toLowerCase()) ? null : value;
    }
    //
    //Report the errors at the appropriate place in teh current form
    report_error(id, msg) {
        //
        //Use the given id to get the general data field area where to report. 
        //It must be available
        const element = this.get_element(id);
        //
        //Get the  specific element where to report
        const report = element.querySelector('.error');
        //
        //If there is no place to report, then this is a badly designed form; alert the user
        if (report === null)
            throw new mutall_error(`No element for reporting errors for field '${id}'`);
        //
        //Now report the error message
        report.textContent = msg;
    }
}
//A page is a view with display panels
export class page extends view {
    //
    //A page has named panels that the user must ensure that they 
    //are set before they are shown.
    panels;
    constructor(url) {
        super(url);
        // 
        //Initialize the panels dictionary
        this.panels = new Map();
    }
    //
    //The user must call this method on a new application object; its main 
    //purpose is to complete those operations of a constructor that require
    //to function synchronously
    async initialize() {
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
    onpopstate(evt) {
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
        const key = evt.state;
        // 
        //Use the key to get the view being restored. We assume that it must be 
        //a baby of the same type as this one
        const new_view = view.lookup.get(key);
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
    async show_panels() {
        //
        //The for loop is used so that the panels can throw 
        //exception and stop when this happens  
        for (const panel of this.panels.values()) {
            await panel.paint();
        }
    }
    //Restore the children nodes of this view by re-attaching them to the 
    //document element of this page's window.  
    restore_view(key) {
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
    async open() {
        return window;
    }
    //Remove a quiz page from a users view and wait for the base to rebuild. 
    //In popups we simply close the window; in babies we do a history back, 
    //and wait for the mother to be reinstated. In general, this does 
    //nothing
    async close() { }
    //Save the children of the root document element of this view to the history
    //stack using the 'how' method
    save_view(how) {
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
        "");
    }
    //Show the given message in a report panel, Depending on the nature of the 
    //resport, the appropriate styling is applied
    async report(error, msg) {
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
export class panel extends view {
    css;
    base;
    //
    //The panel's target element is set (from css in the constructor arguments)
    //when the panel is painted
    target;
    //
    constructor(
    //
    //The CSS to describe the targeted element on the base page
    css, 
    //
    //A base view is the home of the panel
    base) {
        //The ur (required to initialize a view) is that of the base
        super(base.url);
        this.css = css;
        this.base = base;
    }
    //
    //Start painting the panel
    async paint() {
        //
        //Get the targeted element. It must be only one
        const targets = Array.from(this.document.querySelectorAll(this.css));
        //
        //There must be a target    
        if (targets.length == 0)
            throw new mutall_error(`No target found with CSS ${this.css}`);
        //
        //Multiple targets is a sign of an error
        if (targets.length > 1)
            throw new mutall_error(`Multiple targets found with CSS ${this.css}`);
        //
        //The target must be a html element
        if (!(targets[0] instanceof HTMLElement))
            throw new mutall_error(`
        The element targeted by CSS ${this.css} must be an html element`);
        //
        //Set the html element and continue painting the panel
        this.target = targets[0];
        //
        //Continue to paint the pannel. This method is implemented differently
        //depending the obe extending class    
        await this.continue_paint();
    }
    //
    //The window of a panel is the same as that of its base view, 
    //so a panel does not need to be opened
    get win() {
        return this.base.win;
    }
}
//
//A custom alert (to replace the normal js version) using dialog technology
export function myalert(message) {
    //
    //Create a dialog element that is used to serve the message
    const dlg = document.createElement("dialog");
    //
    //Append the dialog to the current document body...step 2. This will be
    //undone in step 5 below 
    document.body.appendChild(dlg);
    //
    //Append the message to the dialog with the assumption that it is html
    //formated
    dlg.innerHTML = message;
    //
    //Create a cancel button which is responsible for closing the dialog
    //
    //Create button
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    //
    //Assign onclick listener, that removes the dialog completely -- the 
    //opposite of step 2 above....step 5
    cancel.onclick = () => document.body.removeChild(dlg);
    //
    //Append the cancel button to the dialog
    dlg.appendChild(cancel);
    //
    //Finally show the created dialog box in a modal version
    dlg.showModal();
}
//
//This class extends the normal Javascript error object by alerting the user
// before logging the same error, stack trace details and other user defined 
//variables values to the console.
export class mutall_error extends Error {
    //
    //Every error has an error message. The extra information is optional. If
    //present, it is displayed in the console log, and the user is alerted to this
    //fact. Typically, the extra is a a complex object, where we can use the 
    //console log to inspect it.
    constructor(msg, ...extra) {
        //
        //Use the message to initialize the parent error object
        super(msg);
        //
        //If the extra is available, then console log it asfirst
        if (extra.length > 0)
            console.log(extra);
        //
        //Compile the console log invitation
        const invitation = extra.length > 0 ? "" : 'See the user  messages in the console.log for further details';
        //
        //Alert the user with the error message, expanded with console 
        //invitation.
        myalert(`${msg}<br/><br/>${invitation}`);
    }
    //Use a dialogbox (hooked to the body of the current docment)to report the
    //given error message and the invitation to inspect teh console.log for
    //further details
    report(msg) {
        //
        //Get the document's body where to hook the reporting assembly
        const body = document.body;
        //
        //Create the div assembly to comprise of the 'Open' dialog button
        //and the dialog box itself. To the assemby:-
        const assembly = document.createElement('div');
        body.insertBefore(assembly, body.firstChild);
        //
        //Add the dialog box to the assembly.
        const dlg = document.createElement('dialog');
        assembly.appendChild(dlg);
        //
        //Add the button (for opening the dialogbox to review the error message
        //when desired) to the top of the body.
        const open = document.createElement('button');
        assembly.appendChild(open);
        open.textContent = 'Open';
        open.onclick = () => dlg.showModal();
        //
        //To the dialog box:-
        //
        //Add the 'Close' button for hidding the dialog for reviewing 
        //later when desired
        const close = document.createElement('button');
        dlg.appendChild(close);
        close.textContent = 'Close';
        close.onclick = () => dlg.close();
        //
        //Add the 'Remove' button for detaching the dialog assemby from the 
        //document's body
        const remove = document.createElement('button');
        dlg.appendChild(remove);
        remove.textContent = 'Remove';
        remove.onclick = () => body.removeChild(assembly);
        //
        //Add a div place holder for the message string and transfer the message
        //content.
        const holder = document.createElement('div');
        dlg.appendChild(holder);
        holder.innerHTML = msg;
        //
        //Show the dialog modally
        dlg.showModal();
    }
}
