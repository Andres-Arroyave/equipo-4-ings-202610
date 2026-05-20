# Smoke Test Critical Points - Backend (Server)

This document details 5 critical points that must be quickly tested in the **Antojos UPB** backend (Server) as part of a "Smoke Test".

## Summary Table

| Point | Flow Covered | Execution Method | Test Type |
|-------|--------------|------------------|-----------|
| 1. Server Startup & Health Check | Infrastructure | Hit `/health` endpoint | E2E / Integration |
| 2. Database Connection | Persistence | Hit endpoint requiring DB | Integration |
| 3. User Authentication | Security & Auth | Post valid credentials to login | Integration / E2E |
| 4. Fetching Vendor List | Core Read API | GET request to vendors endpoint | Integration |
| 5. Vendor Creation with Catalog | Complex Write API | POST request with vendor & catalog payload | Integration / E2E |

## Detailed Points

### 1. Server Startup & Health Check
*   **Flow Covered:** Server infrastructure. Guarantees that the application server starts up correctly and is capable of receiving and responding to basic HTTP requests without crashing due to environment or syntax errors.
*   **How to Execute:** By starting the server and sending a GET request to a basic `/health` or `/ping` endpoint. Verify that the response returns a `200 OK` status code.
*   **Test Type:** **E2E Test** or **Integration Test**.

### 2. Database Connection
*   **Flow Covered:** Persistence layer. Ensures that the backend can successfully establish a connection with the database and perform basic queries without throwing connection timeouts or credential errors.
*   **How to Execute:** By triggering an API endpoint that performs a simple read operation from the database, or through an automated startup script that verifies the connection pool. Verify that no database connection exceptions are thrown.
*   **Test Type:** **Integration Test**.

### 3. User Authentication (Login Endpoint)
*   **Flow Covered:** Security and session management. Verifies that the authentication logic is working, correctly validating credentials against the database, and issuing a valid authentication token.
*   **How to Execute:** By sending a POST request to the login endpoint (`/api/login`) with valid user credentials. Verify that the response returns a `200 OK` status along with the authentication token in the response body or cookies.
*   **Test Type:** **Integration Test** or **E2E Test**.

### 4. Fetching Vendor List (Data Retrieval)
*   **Flow Covered:** Core business read operations. Ensures that the API can retrieve and serialize complex data from the database and send it back to the client in the expected JSON format.
*   **How to Execute:** By sending a GET request to the endpoint responsible for listing vendors (`/api/vendors`). Verify that the response returns a `200 OK` status and an array of vendor objects containing the necessary fields.
*   **Test Type:** **Integration Test**.

### 5. Vendor Creation with Catalog (Complex Data Insertion)
*   **Flow Covered:** Complex business write operations and transaction management. Verifies the backend's ability to receive a composite payload, validate it, insert multiple related records into the database within a transaction, and return the newly created resources.
*   **How to Execute:** By sending an authenticated POST request to the vendor creation endpoint (e.g., `/api/vendors/with-catalog`) with a valid JSON payload containing both vendor info and product array. Verify that the response returns a `201 Created` status and the inserted relational data.
*   **Test Type:** **Integration Test** or **E2E Test**.

## Testing Instructions
For convenience, we created a script to run the smoke test. Here are the instructions:
1. be sure to be on the server folder
2. run the following command:
```bash
npm run test
``` 
3. wait a few seconds and check the results.