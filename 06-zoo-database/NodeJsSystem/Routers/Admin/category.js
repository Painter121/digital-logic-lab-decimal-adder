const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

routers.get('/getAll', (req , res) => {
    const qurey = `SELECT * FROM zoo.category;`;

    connection.query(qurey , (err, results) => {
        if(err){
            console.log("Error fetching zones:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if(results.length > 0){
            res.json(results);
        }else{
            res.status(404).json({ error: "No zones found" });
        }
    });
});

routers.get('/getCategory', (req , res) => {
    const qurey = `SELECT c.CategoryID, 
        c.DietType, 
        c.HabitatType, 
        COUNT(a.AnimalID) AS AnimalCount
        FROM Category c
        LEFT JOIN Animals a ON c.CategoryID = a.CategoryID
        GROUP BY c.CategoryID, c.DietType, c.HabitatType;`;

    connection.query(qurey , (err, results) => {
        if(err){
            console.log("Error fetching zones:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if(results.length > 0){
            res.json(results);
        }else{
            res.status(404).json({ error: "No zones found" });
        }
    });
});






module.exports = routers;

