const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');
// const cors = require("cors");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


routers.get('/getCountData', (req, res) => {
    const query = `
    SELECT 
    (SELECT COUNT(ZoneID) FROM zones) AS All_Zone,
    (SELECT COUNT(AnimalID) FROM animals) AS All_Animal,
	(SELECT COUNT(EmployeeID) FROM employees) AS All_Employee,
    (SELECT COUNT(UserID) FROM users WHERE Role = "User")AS All_User;`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({
            All_Zone: results[0].All_Zone,
            All_Animal: results[0].All_Animal,
            All_Employee: results[0].All_Employee,
            All_User: results[0].All_User,
        });
    });
});

routers.get('/getAnimalBirthdays', (req, res) => {
    const query = `
    SELECT 
        AnimalID, 
        Nickname, 
        Species, 
        DateOfBirth 
    FROM animals;`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
});

routers.get('/top-animals', (req, res) => {
    const query = `
        SELECT a.Species, a.Nickname, COUNT(f.UserID) AS FavoriteCount
        FROM favorite f
        JOIN animals a ON f.AnimalID = a.AnimalID
        GROUP BY a.AnimalID
        ORDER BY FavoriteCount DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

routers.get('/diet-animal-count', (req, res) => {
    const query = `
        SELECT c.DietType, COALESCE(COUNT(a.AnimalID), 0) AS AnimalCount
        FROM category c
        LEFT JOIN animals a ON a.CategoryID = c.CategoryID
        GROUP BY c.DietType;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        return res.json(results);
    });
});

routers.get('/habitat-animal-count', (req, res) => {
    const query = `
        SELECT c.HabitatType, COALESCE(COUNT(a.AnimalID), 0) AS AnimalCount
        FROM category c
        LEFT JOIN animals a ON a.CategoryID = c.CategoryID
        GROUP BY c.HabitatType;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        return res.json(results);
    });
});

routers.get('/animal-care', (req, res) => {
    const query = `
        SELECT 
            CONCAT(e.FirstName, " ", e.LastName) AS Name,
            COUNT(a.AnimalID) AS TotalAnimalsCared,
            GROUP_CONCAT(DISTINCT z.ZoneName ORDER BY z.ZoneName) AS ZonesCared
        FROM 
            animal_care AS a
        JOIN 
            employees AS e ON a.EmployeeID = e.EmployeeID
        JOIN 
            zones AS z ON z.ZoneID = a.ZoneID
        GROUP BY 
            e.EmployeeID
        ORDER BY 
            TotalAnimalsCared DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).send('Database error');
        }
        // ส่งผลลัพธ์ไปที่ client
        res.json(results);
    });
});


routers.get('/CountDataInZone', (req, res) => {
    const sql = `
        SELECT 
	z.ZoneID, 
	z.ZoneName,
    COUNT(DISTINCT a.AnimalID) AS AnimalCount,
    COUNT(DISTINCT e.EmployeeID) AS EmployeeCount,
    z.AnimalCapacity, 
    z.EmployeeCapacity
FROM zones z
LEFT JOIN animals a ON z.ZoneID = a.ZoneID
LEFT join employees e ON e.ZoneID = z.ZoneID
GROUP BY z.ZoneID
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

module.exports = routers;