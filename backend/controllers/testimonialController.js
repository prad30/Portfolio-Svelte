const { Testimonial } = require("../models/testimonialModel");

const addTestimonial = async (req, res) => {
    try {
        const { name, position, company, country, review } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !position || !company || !country || !review) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const testimonial = await Testimonial.create({
            name,
            position,
            company,
            country,
            review,
            image
        });

        res.status(201).json({ message: "Testimonial saved successfully!", testimonial });
    } catch (error) {
        console.error("Error saving testimonial:", error);
        res.status(500).json({ error: "Failed to save testimonial" });
    }
};

module.exports = { addTestimonial };
