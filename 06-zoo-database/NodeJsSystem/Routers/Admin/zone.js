const { json } = require('body-parser');
const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');
const { join } = require('path');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

routers.get('/AllZone', (req, res) => {
    const query = 'SELECT * FROM zoo.zones;'

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching zones:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(404).json({ error: "No zones found" });
        }

    })
})

routers.get('/getZone/:id', (req, res) => {
    const ZoneId = req.params.id;

    const query = 'SELECT ZoneID, ZoneName, AnimalCapacity, EmployeeCapacity FROM zones WHERE ZoneID = ?';

    connection.query(query, [ZoneId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Zone not found');
        }

        return res.json(result[0]);
    });
});

//Employee
routers.get('/getCapacityZone', (req, res) => {
    const query = `
        SELECT 
            z.ZoneID, 
            z.ZoneName, 
            z.EmployeeCapacity, 
            (z.EmployeeCapacity - COUNT(e.EmployeeID)) AS RemainingCapacity
        FROM zoo.zones z
        LEFT JOIN employees e ON z.ZoneID = e.ZoneID
        GROUP BY z.ZoneID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching zones:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No zones found" });
        }
    });
});

routers.get('/getCapacityZone/:zoneID', (req, res) => {
    const zoneID = req.params.zoneID;
    const query = `
        SELECT 
    z.ZoneID,
    z.ZoneName, 
    z.EmployeeCapacity, 
    (z.EmployeeCapacity - COUNT(e.EmployeeID)) AS RemainingEmployeeCapacity,
    z.AnimalCapacity,
    (z.AnimalCapacity - (SELECT COUNT(a.AnimalID) FROM animals a WHERE a.ZoneID = z.ZoneID)) AS RemainingAnimalCapacity
    FROM zoo.zones z
    LEFT JOIN employees e ON e.ZoneID = z.ZoneID
    WHERE z.ZoneID = ?
    GROUP BY z.ZoneID;
    `;

    connection.query(query, [zoneID], (err, results) => {
        if (err) {
            console.log("Error fetching zone:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "Zone not found" });
        }
    });
});

routers.get('/getZoneList', (req, res) => {
    const query = `SELECT z.ZoneID, 
       z.ZoneName, 
       z.AnimalCapacity,
       z.EmployeeCapacity,
       (AnimalCapacity + EmployeeCapacity) AS TotalCapacity, 
       (z.AnimalCapacity - COUNT(DISTINCT a.AnimalID)) AS RemainingAnimalCapacity, 
       (z.EmployeeCapacity - COUNT(DISTINCT e.EmployeeID)) AS RemainingEmployeeCapacity,
       CASE 
        WHEN COUNT(DISTINCT e.EmployeeID) > 0 THEN '1'
        ELSE '0'
       END AS EmployeeStatus
        FROM Zones z
        LEFT JOIN Animals a ON z.ZoneID = a.ZoneID
        LEFT JOIN Employees e ON z.ZoneID = e.ZoneID
        GROUP BY z.ZoneID, z.ZoneName, z.AnimalCapacity, z.EmployeeCapacity;`;

    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error fetching zone:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: "No zones found" });
        }
    })
})


routers.post('/insertZone', (req, res) => {
    const { ZoneName, AnimalCapacity, EmployeeCapacity } = req.body;

    if (!ZoneName || !AnimalCapacity || !EmployeeCapacity) {
        return res.status(400).json({ error: "ZoneName and Capacity are required" });
    }

    const query = 'INSERT INTO zones(ZoneName, AnimalCapacity , EmployeeCapacity) VALUES(? , ? , ?);'

    connection.query(query, [ZoneName, AnimalCapacity, EmployeeCapacity], (err, results) => {
        if (err) {
            console.error(err);
            let errorMessage = "";
            if (err.sqlMessage.includes('ZoneName_UNIQUE')) {
                errorMessage = "Duplicate ZoneName detected. Please use a different ZoneName.";
                return res.status(400).json({ error: errorMessage });
            } else {
                console.log("Error inserting new zone:", err);
                return res.status(400).json({ error: errorMessage });
            }
        }

        res.status(201).json({ message: "Zone added successfully", zoneID: results.insertId })
    });
});


routers.patch('/updateZone/:id', (req, res) => {
    const { id } = req.params;
    const { ZoneName, AnimalCapacity, EmployeeCapacity } = req.body;

    if (!id || (!ZoneName && !AnimalCapacity && !EmployeeCapacity)) {
        return res.status(400).json({ error: "id and at least one field (ZoneName, AnimalCapacity or EmployeeCapacity) are required" });
    }

    const query = 'UPDATE zones SET ZoneName = ?, AnimalCapacity = ?, EmployeeCapacity = ? WHERE ZoneID = ?';

    connection.query(query, [ZoneName || null, AnimalCapacity || null, EmployeeCapacity || null, id], (err, results) => {
        if (err && err.sqlMessage && err.sqlMessage.includes('ZoneName_UNIQUE')) {
            const errorMessage = "Zone name already exists. Please use a different name.";
            return res.status(400).json({ error: errorMessage });
        } else if (err) {

            console.error(err);
            return res.status(500).json({ error: "An unexpected error occurred." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Zone not found" });
        }
        res.status(200).json({ message: "Zone updated successfully" });
    });
});



routers.delete('/deleteZone/:id', (req, res) => {
    const zoneID = req.params.id;

    const query = "DELETE FROM zones WHERE ZoneID = ?";
    connection.query(query, [zoneID], (err, results) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                let errorMessage = "You cannot delete or update this record because it is referenced by another table. Please update or delete the related data first.";
                // console.error(err);
                return res.status(409).json({ message: errorMessage });
            } else {
                console.log("Error deleting data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Zone not found" });
        }

        res.status(200).json({ message: "Zone deleted successfully" });
    });
});





module.exports = routers;