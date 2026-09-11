const { error } = require('console');
const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})



routers.get('/getAnimalcare', (req, res) => {
    const query = `SELECT 
    ac.DateOfCare,
    ac.AnimalID,
    ac.EmployeeID,
    ac.ZoneID,
    a.Species AS Animals,
    CONCAT(e.FirstName, ' ', e.LastName) AS Employees,
    z.ZoneName AS ZoneName,
    a.Nickname
FROM 
    animal_care ac
JOIN 
    animals a ON ac.AnimalID = a.AnimalID
JOIN 
    employees e ON ac.EmployeeID = e.EmployeeID
JOIN 
    zones z ON ac.ZoneID = z.ZoneID; 
`;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching Table:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No AnimalCare found" });
        }
    });
});


routers.get('/zone', (req, res) => {
    const query = `SELECT 
    z.ZoneID, 
    z.ZoneName, 
    COUNT(DISTINCT a.AnimalID) AS CurrentAnimals,
    COUNT(DISTINCT e.EmployeeID) AS CurrentEmployees
    FROM 
        zones z
    LEFT JOIN animals a ON z.ZoneID = a.ZoneID
    LEFT JOIN employees e ON z.ZoneID = e.ZoneID
    GROUP BY 
        z.ZoneID, z.ZoneName
    HAVING 
        CurrentAnimals > 0 AND CurrentEmployees > 0;`;

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


routers.get('/getAnimalInZone/:zoneID', (req, res) => {
    const zoneID = req.params.zoneID;
    if (!zoneID) {
        return res.status(400).json({ error: "ZoneID is required" });
    }

    const query = `
        SELECT 
            z.ZoneID, 
            z.ZoneName, 
            a.AnimalID, 
            a.Species AS Species,
            a.Nickname,
            CONCAT(a.Species, ' (', a.Nickname, ')') AS Species_Nickname
        FROM 
            zones z
        LEFT JOIN 
            animals a ON z.ZoneID = a.ZoneID
        WHERE 
            z.ZoneID = ?`;

    connection.query(query, [zoneID], (err, results) => {
        if (err) {
            console.log("Error fetching animals in zone:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No animals found in this zone" });
        }
    });
});


routers.get('/getEmployeeInZone/:zoneID', (req, res) => {
    const zoneID = req.params.zoneID;
    if (!zoneID) {
        return res.status(400).json({ error: "ZoneID is required" });
    }

    const query = `
    SELECT 
        z.ZoneID, 
        z.ZoneName, 
        e.EmployeeID, CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName
    FROM 
        zones z
    LEFT JOIN 
        employees e ON z.ZoneID = e.ZoneID
    WHERE 
        z.ZoneID = ?;`;

    connection.query(query, [zoneID], (err, results) => {
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


routers.get('/getEmployee/:AnimalID', (req, res) => {
    const animalID = req.params.AnimalID;
    if (!animalID) {
        return res.status(400).json({ error: "animalID is required" });
    }

    const query =
        `SELECT EmployeeID
        FROM animal_care
        WHERE AnimalID = ?;`;

    connection.query(query, [animalID], (err, results) => {
        if (err) {
            console.log("Error fetching Employee:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No Employee found" });
        }
    });
});

routers.get('/getAnimal/:EmployeeID', (req, res) => {
    const employeeID = req.params.EmployeeID;
    if (!employeeID) {
        return res.status(400).json({ error: "employeeID is required" });
    }

    const query = `SELECT AnimalID
        FROM animal_care
        WHERE EmployeeID = ?;`;

    connection.query(query, [employeeID], (err, results) => {
        if (err) {
            console.log("Error fetching EmployeeID:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "No Animal found" });
        }
    })

});


routers.post('/insertAnimalCare', (req, res) => {
    const { AnimalID, EmployeeID, DateOfCare, ZoneID } = req.body;

    const query = ` INSERT INTO animal_care (AnimalID, EmployeeID, DateOfCare, ZoneID)
        VALUES (?, ?, ?, ?) `;

    connection.query(query, [AnimalID, EmployeeID, DateOfCare, ZoneID], (err, results) => {
        if (err) {
            let ErrorMessage = "";
            if (err.sqlMessage && err.sqlMessage.includes('PRIMARY')) {
                ErrorMessage = "Duplicate entry for PRIMARY KEY detected.";
            } else {
                console.error('Error inserting data:', err);
                return res.status(500).json({ message: 'Failed to insert data', error: err });
            }
            return res.status(400).json({ message: ErrorMessage });
        }


        res.status(200).json({ message: 'Data inserted successfully', results });
    });
});


routers.delete('/deleteAnimalCare/:AnimalID/:EmployeeID', (req, res) => {
    const { AnimalID, EmployeeID } = req.params;

    const query = "DELETE FROM animal_care WHERE AnimalID = ? AND EmployeeID = ?";
    connection.query(query, [AnimalID, EmployeeID], (err, results) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                let errorMessage = "You cannot delete or update this record because it is referenced by another table. Please update or delete the related data first.";
                return res.status(409).json({ message: errorMessage });
            } else {
                console.log("Error deleting data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "AnimalCare not found" });
        }

        res.status(200).json({ message: "AnimalCare deleted successfully" });
    });
});



module.exports = routers;