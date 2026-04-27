/**
 * Student Management System API
 * @author Ab. Wahab
 * @version 1.0.0
 */

const express = require("express");
const app = express();

// ---------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------

// Parse incoming JSON payloads
app.use(express.json());

// Request Logger: Provides visibility into traffic patterns
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    next();
});

// ---------------------------------------------------------
// Data Persistence (Mock DB)
// ---------------------------------------------------------

let students = [
    { id: 1, name: "Ali Ahmed", age: 20, city: "Karachi", grade: "A" },
    { id: 2, name: "Sara Khan", age: 22, city: "Lahore", grade: "B" },
    { id: 3, name: "Usman Ali", age: 21, city: "Islamabad", grade: "A" },
    { id: 4, name: "Ayesha Malik", age: 23, city: "Karachi", grade: "B" },
    { id: 5, name: "Bilal Hassan", age: 20, city: "Lahore", grade: "C" },
];

let nextId = 6;

// ---------------------------------------------------------
// Core API Logic & Utilities
// ---------------------------------------------------------

/**
 * Standardized API Response Wrapper
 */
const apiResponse = (res, { status = 200, message = "", data = null }) => {
    return res.status(status).json({
        success: status < 400,
        message,
        ...(data && { data })
    });
};

// ---------------------------------------------------------
// REST Endpoints
// ---------------------------------------------------------

/**
 * @route   GET /
 * @desc    API Discovery & Health Check
 */
 app.get("/", (req, res) => {
     apiResponse(res, {
         message: "Student Management API v1.0 Operational",
         data: {
             version: "1.0.0",
             health: "stable",
             discovery: {
                 students: {
                     base: "/students",
                     methods: ["GET", "POST"],
                     filters: ["grade", "city", "sort"]
                 },
                 stats: "/students/stats/summary",
                 specific_student: "/students/:id"
             }
         }
     });
 });

/**
 * @route   GET /students
 * @desc    Retrieve students with optional filtering and sorting
 */
app.get("/students", (req, res) => {
    let { grade, city, sort } = req.query;
    let filteredStudents = [...students];

    if (grade) {
        filteredStudents = filteredStudents.filter(s => s.grade.toUpperCase() === grade.toUpperCase());
    }

    if (city) {
        filteredStudents = filteredStudents.filter(s => s.city.toLowerCase() === city.toLowerCase());
    }

    if (sort === "age") {
        filteredStudents.sort((a, b) => a.age - b.age);
    }

    if (!filteredStudents.length) {
        return apiResponse(res, { status: 404, message: "No records matched your criteria." });
    }

    apiResponse(res, { message: "Records retrieved successfully.", data: filteredStudents });
});

/**
 * @route   GET /students/stats/summary
 * @desc    Aggregate data metrics
 */
app.get("/students/stats/summary", (req, res) => {
    const summary = {
        totalRecords: students.length,
        avgAge: (students.reduce((acc, s) => acc + s.age, 0) / students.length).toFixed(2),
        distribution: {
            byGrade: students.reduce((acc, s) => ({ ...acc, [s.grade]: (acc[s.grade] || 0) + 1 }), {}),
            byCity: students.reduce((acc, s) => ({ ...acc, [s.city]: (acc[s.city] || 0) + 1 }), {})
        }
    };

    apiResponse(res, { message: "Summary statistics generated.", data: summary });
});

/**
 * @route   POST /students
 * @desc    Create a new student record
 */
app.post("/students", (req, res) => {
    const { name, age, city, grade } = req.body;

    // Strict Validation Logic
    if (!name || !age || !city || !grade) {
        return apiResponse(res, { status: 400, message: "Missing required fields: name, age, city, or grade." });
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 15 || parsedAge > 60) {
        return apiResponse(res, { status: 400, message: "Invalid age. Range must be between 15 and 60." });
    }

    const validGrades = ["A", "B", "C", "D", "F"];
    if (!validGrades.includes(grade.toUpperCase())) {
        return apiResponse(res, { status: 400, message: `Invalid grade. Allowed: ${validGrades.join(", ")}` });
    }

    const newRecord = { id: nextId++, name, age: parsedAge, city, grade: grade.toUpperCase() };
    students.push(newRecord);

    apiResponse(res, { status: 201, message: "Record provisioned successfully.", data: newRecord });
});

/**
 * @route   PUT /students/:id
 * @desc    Update an existing record via Partial Patch
 */
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return apiResponse(res, { status: 404, message: `Resource with ID ${id} not found.` });
    }

    const { name, age, city, grade } = req.body;

    // Atomic updates
    if (name) students[index].name = name;
    if (age) students[index].age = parseInt(age);
    if (city) students[index].city = city;
    if (grade) students[index].grade = grade.toUpperCase();

    apiResponse(res, { message: "Record updated successfully.", data: students[index] });
});

/**
 * @route   DELETE /students/:id
 * @desc    Hard delete a student record
 */
app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return apiResponse(res, { status: 404, message: `Resource with ID ${id} not found.` });
    }

    const deletedRecord = students.splice(index, 1)[0];
    apiResponse(res, { message: "Record purged successfully.", data: deletedRecord });
});

// ---------------------------------------------------------
// Error Handling Middleware
// ---------------------------------------------------------

// Handle undefined routes (404)
app.use((req, res) => {
    apiResponse(res, { status: 404, message: "Resource not found. Check documentation for valid endpoints." });
});

// Global Exception Catcher (500)
app.use((err, req, res, next) => {
    console.error(`[FATAL ERROR]: ${err.stack}`);
    apiResponse(res, { status: 500, message: "Internal Server Error. Our team has been notified." });
});

// ---------------------------------------------------------
// Initialization
// ---------------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ---------------------------------------------------
    API SERVER RUNNING
    PORT: ${PORT}
    ENV: Development
    URL: http://localhost:${PORT}
    ---------------------------------------------------
    `);
});
