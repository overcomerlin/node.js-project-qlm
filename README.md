# 0-to-1 Project: Qualification Publish Management (QLM)

![Full-Stack Web Application](https://img.shields.io/badge/Web-Full--Stack-red)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-orange)
![Front-End](https://img.shields.io/badge/Front_End-React.js-yellow)
![Back-End](https://img.shields.io/badge/Back_End-Express.js-green)
![Database](https://img.shields.io/badge/Database-MySQL-cyan)
![Cache](https://img.shields.io/badge/Cache-Redis-blue)
![Containerization](https://img.shields.io/badge/Container-Docker-indigo)

## 📖 Overview

The Ministry of Transportation and Communications (MOTC) in Taiwan has implemented regulations requiring heavy-duty and commercial vehicles to be equipped with tachographs for safety compliance. A tachographs must be inspected every two years to ensure their accuracy and proper calibration. After the regular check for the tachograph, a certificate (license) should be publish to the driver of the vehicle. A valid certificate of conformity carries legal significance, attesting that the vehicle's tachograph has undergone rigorous inspection and is functioning properly.

QLM is a full-stack web application featuring a modern, responsive frontend built with React and the MDB React UI Kit. Its robust backend architecture utilizes a MySQL database for persistent data storage and Redis for high-performance caching, ensuring a scalable and efficient platform for managing data and user interactions. With the concept of QLM, a company could be authorized to manage the constomers' data and print the certificate for the specific mobile device in the vehicles.

## 🛠️ Instance Construction

- **Complete Build:**
  - The whole application is composed of four Docker containers named: `client_web`, `server`, `redis` and `database`.
  - Container `client_web`: leverages **Nginx** and **React.js** to handle the web infrastructure and provide front end UI services.
  - Container `server`: utilizes **Express.js** to process backend business logic and maintain the database.
  - Container `redis`: manages session data for user authentication.
  - Container `database`: a **MySQL** database accessed by **server**.
  - To build and start the containers, run the following command in the root directory containing `docker-compose.yml`: `docker compose up -d`.
- **Specific Build:**
  - In case of any container failed or crashed, or user wants to tweak somewhere in any one of containers, you can manage services individually.
  - **Start a single service (and its dependencies):**
    `docker compose up -d <service_name>` (e.g., `docker compose up -d server`)
  - **Stop all services:**
    `docker compose stop`
  - **Stop and remove all service containers and networks:**
    `docker compose down`
  - **Perform a full cleanup (including data volumes and images):**
    `docker compose down -v --rmi all`