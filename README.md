# Express, TypeScript, Knex, MySQL2 and Azure Application Insights Example

This project is a minimal Express.js application written in TypeScript.  It uses
Knex.js to connect to a MySQL database via the `mysql2` driver and integrates
Azure Application Insights for performance monitoring and error tracking.

## Prerequisites

* **Node.js**: Ensure you have Node.js installed (version 14 or higher is
  recommended).  You can download it from [nodejs.org](https://nodejs.org/).
* **MySQL**: A running MySQL server with a database you can connect to.
* **Azure Application Insights** (optional): Create an Application Insights
  resource in Azure and copy the connection string or instrumentation key.

## Setup

1. **Install dependencies**

   Navigate into the project directory and install the dependencies:

   ```bash
   cd express-app
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file and edit the values to match your
   environment:

   ```bash
   cp .env.example .env
   # Then edit .env to set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and optionally APPINSIGHTS_CONNECTION_STRING
   ```

   * `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Connection
     details for your MySQL database.
   * `APPINSIGHTS_CONNECTION_STRING`: Your Azure Application Insights
     connection string (or set `APPINSIGHTS_INSTRUMENTATIONKEY` instead).
   * `PORT`: The port on which the Express server will listen (default is
     3000).

3. **Run the application in development**

   Use the following command to start the server with TypeScript and
   automatically restart on changes:

   ```bash
   npm run dev
   ```

   The server will start on the port specified in your `.env` file (or 3000 by
   default).  Navigate to `http://localhost:3000/` in your browser to see a
   JSON response containing a greeting and the current time from the
   database.

4. **Build and run for production**

   To build the TypeScript files and run the compiled JavaScript:

   ```bash
   npm run build
   npm start
   ```

## Database migrations and seeds

This project includes a `knexfile.ts` with basic configuration for Knex.  You
can create migration and seed directories under `express-app/migrations` and
`express-app/seeds` as needed.  For more information on using Knex CLI, see
the [Knex documentation](https://knexjs.org/).

## Application Insights

If you provide a valid `APPINSIGHTS_CONNECTION_STRING` in your environment
variables, the server will automatically send performance and exception data
to Azure Application Insights.  This integration uses the
[`applicationinsights`](https://www.npmjs.com/package/applicationinsights)
package for Node.js.

## Notes

* The default route (`/`) demonstrates a simple `SELECT NOW()` query using
  Knex.  Modify or extend the routes to suit your own application needs.
* The Application Insights integration is optional.  If no connection string
  or instrumentation key is provided, the application will run without
  telemetry.
* Remember to run `npm install` before using this project, as the `node_modules`
  folder is not included in the archive.