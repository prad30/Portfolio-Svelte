const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
    }
);

// Define the Testimonial model
const Testimonial = sequelize.define("Testimonials", {
    name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    review: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
},{
    tableName: "Testimonials",
    timestamps: true
}
);

// return Testimonial;

module.exports = {Testimonial,sequelize};
