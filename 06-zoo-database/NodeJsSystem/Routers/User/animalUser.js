const { error } = require('console');
const express = require('express');
const mysql = require('mysql2');
const routers = express.Router();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


routers.get('/getAnimalUser', (req, res) => {
    const query = 'SELECT * FROM zoo.animals;';

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching Animal:", err);
            return res.status(500).json({ error: "Internal Server Error" });

        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No animal found" });
        }
    });
});


module.exports = routers;