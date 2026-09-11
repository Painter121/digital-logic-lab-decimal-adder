const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


routers.get('/getAnimals', (req, res) => {
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
    ORDER BY 
        animals.AnimalID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            };
        });
        res.json(modifiedResults);
    });
});


routers.get('/getTerrestrial', (req, res) => {
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
        category.HabitatType = 'สัตว์บก'
    ORDER BY 
        animals.AnimalID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            };
        });

        res.json(modifiedResults);
    });
});

routers.get('/getAquatic', (req, res) => {
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
        category.HabitatType = 'สัตว์น้ำ'
    ORDER BY 
        animals.AnimalID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            };
        });

        res.json(modifiedResults);
    });
});

routers.get('/getAerial', (req, res) => {
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
        category.HabitatType = 'สัตว์ปีก'
    ORDER BY 
        animals.AnimalID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            };
        });

        res.json(modifiedResults);
    });
});

routers.get('/getAmphibious', (req, res) => {
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
        category.HabitatType = 'สัตว์สะเทินน้ำสะเทินบก'
    ORDER BY 
        animals.AnimalID;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Gender: animal.Gender,
                ZoneID: animal.ZoneID,
                ZoneName: animal.ZoneName,
                Image: imageUrl
            };
        });

        res.json(modifiedResults);
    });
});


routers.get('/getType/:habitatType', (req, res) => {
    const habitatType = req.params.habitatType;
    const query = `
        SELECT  AnimalID,  
		Species,
        Nickname, 
        Subspecies, 
        Gender, 
        DateOfBirth, 
        Origin, 
        Details,        
        Image, 
        c.HabitatType,
		z.ZoneName
        FROM zoo.animals AS a
        JOIN zoo.category AS c
        ON a.CategoryID = c.CategoryID
        JOIN zoo.zones AS z
        ON z.ZoneID = a.ZoneID
        WHERE c.HabitatType = ?`;

    connection.query(query, [habitatType], (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const modifiedResults = results.map(animal => {
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            return {
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Subspecies: animal.Subspecies,
                Gender: animal.Gender,
                DateOfBirth: animal.DateOfBirth,
                Origin: animal.Origin,
                Details: animal.Details,
                Image: imageUrl,
                HabitatType: animal.HabitatType,
                ZoneName: animal.ZoneName
            };
        });

        res.json(modifiedResults);
    });
});


routers.get('/getAnimalDetails/:id', (req, res) => {
    const animalID = req.params.id;

    const query = `
        SELECT 
            a.AnimalID,
            a.Species,
            a.Nickname,
            a.Subspecies,
            a.Gender,
            a.DateOfBirth,
            a.Origin,
            a.Details,
            a.Image, 
            c.DietType,
            c.HabitatType,
            z.ZoneName
        FROM 
            animals a
        JOIN 
            category c ON a.CategoryID = c.CategoryID
        JOIN 
            zones z ON a.ZoneID = z.ZoneID
        WHERE a.AnimalID = ?;
    `;

    connection.query(query, [animalID], (err, result) => {
        if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        const animal = result[0];
        const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
        const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

        res.status(200).json({
            AnimalID: animal.AnimalID,
            Species: animal.Species,
            Nickname: animal.Nickname,
            Subspecies: animal.Subspecies,
            Gender: animal.Gender,
            DateOfBirth: animal.DateOfBirth,
            Origin: animal.Origin,
            Details: animal.Details,
            Image: imageUrl,
            DietType: animal.DietType,
            HabitatType: animal.HabitatType,
            ZoneName: animal.ZoneName
        });
    });
});

routers.get('/RandomAnimals', (req, res) => {
    const query = 'SELECT AnimalID,Species,Nickname,Image FROM animals ORDER BY RAND() LIMIT 5;';

    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err });
        }
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'ไม่พบข้อมูลสัตว์' });
        }
    });
});


module.exports = routers;