// 
// The schema.js file is part of the Mutall library, which provides essential functionality 
// for accessing and managing key components and data structures across the entire project.
import { view, mutall_error } from "../../../schema/v/code/schema.js";
// 
// SQL as JSON objects enables property-based access and cleaner organization compared to raw strings. 
// This approach lets you package related queries in a class structure for easier reuse and modification.
// Converting to JSON format eliminates repetitive SQL code when implementing similar database behaviors, improving maintainability.
export class select extends view {
    fields;
    from;
    where;
    orderby;
    // 
    // Define a property that describes the fields getting selected
    // Class properties defining SQL query components: the query string, fields to select, 
    // source table, filter conditions, sort order, and execution functions.
    // Define a constructor for sql
    constructor(fields, from, where, orderby, parent, options) {
        super(parent, options);
        this.fields = fields;
        this.from = from;
        this.where = where;
        this.orderby = orderby;
    }
    // 
    // This method returns the sql statement that corresponds to this sql instance
    build() {
        // 
        //Convert the array of strings into a single string with comma new separated fields
        const fields = this.fields.join(",\n");
        // 
        // construct the from clause by joining table name and the join expression
        const from = `${this.from.tname} ${this.from.join}`;
        // 
        // Construct the where clause - only add "WHERE" if there are conditions
        const where = this.where && this.where.length > 0
            ? `where \n ${this.where.join(" and ")}`
            : "";
        // 
        // Construct the orderby clause
        const orderby = this.orderby
            ? `orderby \n ${this.orderby}`
            : "";
        // 
        // 
        // Compile the final sql and returns it
        return `
            select
                ${fields}
            from
                ${from}
            ${where} 
            ${orderby}
        `;
    }
    // 
    //Builds the SQL query, executes it via PHP,and returns the retrieved data
    async exec() {
        //  
        // get the sql
        const sql = this.build();
        //
        //Search for the database name in the view hierarchy
        const dbname = this.search_option('dbname');
        //
        //Report an error if the dbname cannot be found
        if (!dbname)
            throw new mutall_error('No database found in the view hierarchy');
        // 
        // executing the sqls from the build metho
        const results = await this.exec_php("database", [dbname, false], "get_sql_data", [sql]);
        return results;
    }
}
