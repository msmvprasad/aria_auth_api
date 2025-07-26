import express from 'express';
import db from './db';
import * as appInsights from 'applicationinsights';

// Initialize Azure Application Insights if a connection string or
// instrumentation key is provided.  This will automatically collect
// performance metrics and errors from your application.  See the README
// for details on configuring your connection string.
const connectionString =
  process.env.APPINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

if (connectionString) {
  // Configure distributed tracing to use Application Insights' protocol
  appInsights
    .setup(connectionString)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();
  console.log('Azure Application Insights initialized');
}

const app = express();
const port = process.env.PORT || 3000;

// Built-in middleware to parse JSON bodies
app.use(express.json());

/**
 * Root route
 *
 * This simple endpoint demonstrates a basic database query using Knex.  It
 * selects the current time from the MySQL server and returns it in the
 * response along with a greeting.  If the query fails, it records the
 * exception using Application Insights (if configured) and responds with
 * an error.
 */
app.get('/', async (_req, res) => {
  try {
    // The result of db.raw() with MySQL2 comes back as an array: [rows, fields]
    const [rows] = await db.raw('SELECT NOW() as now');
    const now = rows[0]?.now;
    res.json({ message: 'Hello, world!', dbTime: now });
  } catch (error: any) {
    // Track the exception with Application Insights if available
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackException({ exception: error });
    }
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});