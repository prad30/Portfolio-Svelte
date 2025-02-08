const express = require("express");
const multer = require("multer");
const cors = require("cors");
// const { Sequelize } = require("sequelize");
require("dotenv").config();
const path = require("path");

const {Testimonial, sequelize } = require("./models/testimonialModel");

// Controller import
const testimonialController = require("./controllers/testimonialController");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Set up PostgreSQL connection
// const sequelize = new Sequelize(
//     process.env.DB_NAME, // Database name
//     process.env.DB_USER, // PostgreSQL username
//     process.env.DB_PASS, // PostgreSQL password
//     {
//         host: process.env.DB_HOST,
//         dialect: "postgres",
//     }
// );

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");  
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});


const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("API is working!");
});



app.get("/api/testimonials", async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll();
        res.status(200).json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.post("/api/testimonials/add", upload.single("image"), testimonialController.addTestimonial);


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
