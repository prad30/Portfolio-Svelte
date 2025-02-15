const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require('dotenv').config();


const { Testimonial,sequelize} = require("./models/testimonialModel");

const testimonialController = require("./controllers/testimonialController");

const app = express();
const PORT = process.env.PORT || 5500;

const distPath = path.resolve(__dirname, '..', 'dist'); // Go up one level from the backend

app.use(express.static(distPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });


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



    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
