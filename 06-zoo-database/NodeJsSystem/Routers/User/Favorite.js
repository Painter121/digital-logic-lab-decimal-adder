const express = require('express');
const mysql = require('mysql2');
const routers = express.Router();
const multer = require('multer');
const upload = multer();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



routers.get('/getAll/:UserID', (req, res) => {
    const { UserID } = req.params;

    if (!UserID) {
        return res.status(400).json({ error: "UserID is required" });
    }

    const query = 'SELECT AnimalID FROM zoo.favorite WHERE UserID = ?';
    connection.query(query, [UserID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(results);
    });
});


routers.get('/checkFavorite/:UserID/:AnimalID', (req, res) => {
    const { UserID, AnimalID } = req.params;

    if (!UserID || !AnimalID) {
        return res.status(400).json({ error: "UserID and AnimalID are required" });
    }

    const query = 'SELECT UserID,AnimalID FROM zoo.favorite WHERE UserID = ? AND AnimalID = ?';
    connection.query(query, [UserID, AnimalID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
});



routers.post('/addFavorite', async (req, res) => {
    const { UserID, AnimalID } = req.body;

    if (!UserID || !AnimalID) {
        return res.status(400).json({ message: "UserID and AnimalID are required" });
    }

    try {
        const query = 'INSERT INTO zoo.favorite (UserID, AnimalID) VALUES (?, ?)';
        connection.query(query, [UserID, AnimalID], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred while adding data' });
            }
            res.status(200).json({ message: 'Data successfully added to the favorite table' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while adding data' });
    }
});


routers.delete('/removeFavorite/:UserID/:AnimalID', async (req, res) => {
    const { UserID, AnimalID } = req.params;
    if (!UserID || !AnimalID) {
        return res.status(400).json({ message: "UserID and AnimalID are required" });
    }
    try {
        const query = 'DELETE FROM zoo.favorite WHERE UserID = ? AND AnimalID = ?';
        connection.query(query, [UserID, AnimalID], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred while removing favorite' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Successfully removed from favorites' });
            } else {
                res.status(404).json({ message: 'Favorite not found' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while removing favorite' });
    }
});


routers.get('/animalFavorites/:AnimalId', (req, res) => {
    const animalId = req.params.AnimalId;

    const query = `
        SELECT 
            animals.AnimalID, 
            animals.Species, 
            animals.Nickname, 
            animals.Gender, 
            animals.ZoneID, 
            zones.ZoneName, 
            animals.Image
        FROM 
            animals
        JOIN 
            zones ON animals.ZoneID = zones.ZoneID
        JOIN 
            category ON animals.CategoryID = category.CategoryID
        WHERE 
            AnimalID = ?`;

    connection.execute(query, [animalId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length > 0) {
            const animal = results[0];
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';
            res.json({
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            });
        } else {
            res.status(404).json({ message: 'Animal not found' });
        }
    });
});




module.exports = routers;