const {Testimonial} = require("../models/testimonialModel");

const addTestimonial = async (req, res) => {
    try {
        const { name, position, company, country, review, rating } = req.body; // Add rating here
        const image = req.file ? req.file.filename : null;

        // Ensure all fields are provided
        if (!name || !position || !company || !country || !review || !rating) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Create the new testimonial
        const testimonial = await Testimonial.create({
            name,
            position,
            company,
            country,
            review,
            image,
            rating
        });

        // Respond with the created testimonial
        res.status(201).json({ message: "Testimonial saved successfully!", testimonial });
    } catch (error) {
        console.error("Error saving testimonial:", error);
        res.status(500).json({ error: "Failed to save testimonial" });
    }
};

module.exports = { addTestimonial };
