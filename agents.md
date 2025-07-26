# Agents in This Repository

This repository contains a small application that demonstrates how multiple
"agents" work together to build a functional web service. In this context an
agent is a distinct part of the system responsible for a particular
responsibility—such as handling incoming HTTP requests, interacting with a
database, or collecting telemetry data. Each agent focuses on a single
concern, making the application easier to understand, maintain and extend.

## HTTP Agent (Express)

The HTTP agent listens for incoming network requests and routes them to the
appropriate handler functions. It is implemented with the
[Express](https://expressjs.com/) framework and defined in
`src/index.ts`. The HTTP agent performs the following duties:

- Creates an Express application and configures it to parse JSON request
  bodies.
- Defines route handlers. In this example, the root route (`/`) responds
  with a friendly greeting and the current time reported by the database.
- Starts the HTTP server on a configurable port.

## Data Access Agent (Knex + MySQL2)

Database operations are encapsulated in a data access agent built with
[Knex.js](https://knexjs.org/) and the
[mysql2](https://www.npmjs.com/package/mysql2) driver. The configuration is
centralized in `src/db.ts`, which exposes a pre‑configured Knex instance.
Key responsibilities of the data access agent include:

- Reading connection details (host, port, username, password, database name)
  from environment variables to keep secrets out of source control.
- Creating and exporting a single Knex instance that can be re‑used across
  the application.
- Running database queries and returning their results. In the example route
  handler, the agent executes `SELECT NOW()` to fetch the current time from
  the MySQL server.

Because Knex uses connection pooling internally, it efficiently manages
database connections under the hood and helps prevent resource exhaustion.

## Telemetry Agent (Azure Application Insights)

Operational telemetry and error reporting are handled by the telemetry agent
integrated through [Azure Application
Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview).
This agent is initialized at application start if either
`APPINSIGHTS_CONNECTION_STRING` or `APPINSIGHTS_INSTRUMENTATIONKEY` is set in
the environment. Its responsibilities include:

- Automatically collecting performance metrics about HTTP requests and
  dependencies.
- Tracking exceptions raised in route handlers. If an error occurs during
  a database query, the telemetry agent records the exception before the
  request handler returns a 500 status code.
- Sending collected telemetry to Azure for analysis and visualization.

To enable the telemetry agent, provision an Application Insights resource in
Azure and set your connection string or instrumentation key in the `.env`
file.

## Putting It All Together

When a client makes a request to the server, the HTTP agent delegates any
database work to the data access agent. If telemetry is configured, the
telemetry agent records details about the request and reports any errors that
occur. By keeping these concerns separate, the repository provides a simple
example of how to structure an application around cooperating agents that each
focus on a single responsibility.

Feel free to extend the application by adding new agents—such as a caching
agent, authentication agent or message queue agent—depending on your needs.
Refer to the existing agents for guidance on how to organize and initialize
additional components.
