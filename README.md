# ONLINE-BLOOD-BANK-MANAGEMENT-SYSTEM

*Empowering Lives Through Seamless Blood Donation Connections*

![Last Commit](https://img.shields.io/badge/last%20commit-today-brightgreen)
![Language](https://img.shields.io/badge/javascript-97.1%25-yellow)
![Languages](https://img.shields.io/badge/languages-3-blue)

## Built with the tools and technologies:

![Express](https://img.shields.io/badge/-Express-black)
![JSON](https://img.shields.io/badge/-JSON-lightgrey)
![Markdown](https://img.shields.io/badge/-Markdown-lightgrey)
![npm](https://img.shields.io/badge/-npm-red)
![Mongoose](https://img.shields.io/badge/-Mongoose-red)
![ENV](https://img.shields.io/badge/-ENV-yellow)
![JavaScript](https://img.shields.io/badge/-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/-Node.js-green)
![React](https://img.shields.io/badge/-React-blue)
![Vite](https://img.shields.io/badge/-Vite-purple)
![ESLint](https://img.shields.io/badge/-ESLint-purple)
![Axios](https://img.shields.io/badge/-Axios-blue)
![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-pink)
![Chart.js](https://img.shields.io/badge/-Chart.js-red)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Note](#note)

---

## 🧾 Overview

The **Online Blood Bank Management System** is a comprehensive platform designed to facilitate the management of blood donation and distribution, leveraging modern technologies like Node.js, MongoDB, and WebSockets for real-time interactions.

### Why Online Blood Bank Management System?

This project aims to streamline the connection between donors, recipients, and blood banks, ensuring efficient tracking and availability of blood resources. The core features include:

- ⚡ **Real-time Updates**: Instant notifications enhance user engagement and responsiveness.
- 🔐 **Role-Based Access Control**: Ensures that only authorized users can perform specific actions, addressing security concerns.
- 📋 **Comprehensive CRUD Operations**: Mongoose integration simplifies database interactions for developers.
- 💻 **User-Friendly Interface**: Built with React and Chakra UI for a seamless experience.
- 🚀 **Efficient Data Management**: Streamlined routes for managing blood requests and campaigns reduce complexity.
- 🛠️ **Robust Error Handling**: Middleware for structured error responses improves debugging and user experience.

---

## 🚀 Getting Started

### 📦 Prerequisites

This project requires the following dependencies:

- **Programming Language**: JavaScript  
- **Package Manager**: Npm

---

### 🛠️ Installation

Build Online-Blood-Bank-Management-System from the source and install dependencies:

1. **Clone the repository**:

```bash
git clone https://github.com/Sugeeshwara-Rathnayaka/Online-Blood-Bank-Management-System
```
Or, Extract the ZIP file

2. **Navigate to the backend directory**:

```bash
> cd Online-Blood-Bank-Management-System/backend
```

3. **Install the dependencies**:

```bash
> npm install
```

4. **Navigate to the frontend directory**:

```bash
> cd Online-Blood-Bank-Management-System/frontend
```

5. **Install the dependencies**:

```bash
> npm install
```

### Usage

1. **Run the backend of the project with**:

```bash
npm run dev
```

2. **Run the frontend of the project with**:

```bash
npm run dev
```
  - Check if the Frontend is running on port 5173

---

### Note

  - **Modular Architecture:** The project follows a clean and modular folder structure separating concerns between frontend and backend, making it easy to maintain and scale.
  - **Authentication & Role Management:**
    - JWT-based secure login system.
    - Role-based access (Donor, Requester, Hospital, Organization, Bloodbank Admin, Super Admin) ensures users only access permitted features.
   
  - **Technologies Used:**
    - **Frontend**: React + Vite + Chakra UI for fast rendering and modern UI.
    - **Backend**: Express.js + Node.js for scalable RESTful APIs.
    - **Database**: MongoDB with Mongoose ORM for seamless data modeling.

  - **API Integration:**
    - RESTful API endpoints organized by role (e.g., /api/donor, /api/hospital, etc.).
    - Middleware for route protection and structured error handling.

  - **Forms**: Uses React Hook Form for efficient and validated form handling in the frontend.

  - **Environment Configuration:**
    - All sensitive variables (DB URI, JWT secrets) are handled using .env files.
    - Example .env template provided in the project.
   
  - **Security Best Practices:**
    - Passwords hashed using bcryptjs.
    - API rate limiting and input validation can be implemented further.
   
  - **Future Enhancements:**
    - Donor location-based search.
    - Inventory alerts for low stock.
    - SMS/email reminders for eligible donations.
    - Appointment calendar sync for hospitals.

  - **Default Login Credentials:**
    - Donor - NIC = 200230302371 , Passwors = secure123.
    - Requester - NIC = 200230302371 , Passwors = secure123.
    - Hospital - UserName = SUGEE , Passwors = secure123.
    - Organization - UserName = SUGEE , Passwors = secure123.
    - Bloodbank Admin 1 - NIC = 200230302371 , Passwors = secure123.
    - Bloodbank Admin 2 - NIC = 200230302372 , Passwors = secure123.
    - Bloodbank Admin 3 - NIC = 200230302373 , Passwors = secure123.
    - Super Admin - UserName = SUGEE , Passwors = secure123.

    - **These accounts are already created in the database for demo purposes.**
    - **You can Login or Sign Up to explore all system features.**
