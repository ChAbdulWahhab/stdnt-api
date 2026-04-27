# 🎓 Student Management API
A lightweight, performant RESTful API built with **Node.js** and **Express.js** designed for streamlined student data management.

## 🚀 Quick Start

### 1. Clone & Initialize
```bash
git clone <your-repo-url>
cd nodejs-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Spin up the Server
```bash
# Running in production mode
node server.js

# For development (if nodemon is configured)
npm run dev
```

## 📡 API Reference

### Core Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Base API health check & metadata |
| **GET** | `/students` | Fetch all student records |
| **GET** | `/students/:id` | Fetch a specific student by UID |
| **GET** | `/students/city/:city` | Filter students by geographic location |
| **GET** | `/students/stats/summary` | Aggregate stats (Total count, grade distribution, etc.) |
| **POST** | `/students` | Provision a new student record |
| **PUT** | `/students/:id` | Update existing record attributes |
| **DELETE** | `/students/:id` | Hard delete a student record |

### 🔍 Advanced Filtering (Query Params)
The `/students` endpoint supports powerful filtering and sorting out of the box:

* **Filter by Grade:** `GET /students?grade=A`
* **Filter by Location:** `GET /students?city=Karachi`
* **Property Sorting:** `GET /students?sort=age`
* **Chained Queries:** `GET /students?grade=A&sort=age`

---

## 📝 Payload Examples

### Provisioning a Student (`POST`)
**Endpoint:** `/students`
```json
{
  "name": "Ali Ahmed",
  "age": 20,
  "city": "Karachi",
  "grade": "A"
}
```

### Updating a Record (`PUT`)
**Endpoint:** `/students/:id`
```json
{
  "city": "Lahore",
  "grade": "B"
}
```

---

## 📊 Standard Response Schema
All responses follow a consistent JSON structure for easier frontend consumption:
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": [...]
}
```

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Architecture:** REST

---
**Maintained with ❤️ by the Dev Team**

---
