# Antojos UPB - Backend (Server)

This is the backend for the **Antojos UPB** project, which provides the RESTful API. It is built using **Spring Boot (Java)** and includes connectivity to a **Microsoft SQL Server** database.

## 📋 Prerequisites

1. **Java JDK 17** (or a later version configured in the project).
2. **Microsoft SQL Server** installed and running on your computer via the default port (`1433`).

## ⚙️ Database Configuration

For security and consistency reasons (`spring.jpa.hibernate.ddl-auto=validate`), the backend **does not automatically create the database or tables**. It assumes the schema already exists with its tables ready.  
1. Open SQL Server Management Studio (SSMS).

2. Make sure you have an enabled user that allows authentication via **SQL Server Authentication** in SSMS; you can use the `sa` user that comes by default with SQL Server. If it is not enabled, you can enable it in SSMS; see the tutorial at the link: https://youtu.be/-GRnoHHnous?si=MyQt8ibfJ0Y3bV5J.
  
3. Make sure that SQL Server has the TCP/IP protocol enabled to allow connection to the backend; see the tutorial at the link: https://youtu.be/6d3d-LzA-V4?si=B4tMzWYsSwFEur5_.

3. **IMPORTANT:** Go to the `databaseSchema.sql` file located in the `src/main/resources/database/` folder and ** run the SQL script in SSMS to create the database**. This will create all the necessary tables and relationships.

## 🔐 Setting Environment Variables

For security reasons, the server will read your database credentials from environment variables rather than from the source code. Before starting the server, you must set the `DB_USERNAME` and `DB_PASSWORD` environment variables and assign them the username and password values you set in SQL Server. 

**You must run the following commands in your operating system’s terminal:**

- **On Windows:**

   ```powershell
   # 1. Create the variables permanently (User Level)
   [System.Environment]::SetEnvironmentVariable(“DB_USERNAME”, ‘your_sql_username’, “User”)
   [System.Environment]::SetEnvironmentVariable(“DB_PASSWORD”, ‘your_sql_password’, “User”)

   # 2. Verify in a NEW PowerShell window
   $env:DB_USERNAME
   $env:DB_PASSWORD
   ```
- **On Mac / Linux:**
  ```bash
  # 1. Add the variables to the configuration file
  echo ‘export DB_USERNAME="your_sql_username"’ >> ~/.zshrc
  echo ‘export DB_PASSWORD="your_sql_password"’ >> ~/.zshrc

  # 2. Apply the changes to the current session
  source ~/.zshrc

  # 3. Verify that they were saved correctly
  echo $DB_USERNAME
  echo $DB_PASSWORD
  ```

## 🚀 Running the Server

Once you've set the variables in the terminal, navigate to the `server` folder and use the built-in Gradle Wrapper tool to start the application:

- **On Windows:**
  ```powershell
  .\gradlew.bat bootRun
  ```
- **On Mac / Linux:**
  ```bash
  ./gradlew bootRun
  ```

If your database was created and the credentials are correct, you will see the Spring logs ending with a message similar to:  
✅ *`Started [AppName] in [X] seconds` (running by default at http://localhost:8080).*
