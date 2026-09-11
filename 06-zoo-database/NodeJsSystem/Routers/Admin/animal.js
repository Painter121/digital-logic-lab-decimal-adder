const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

router.get('/getAnimals', (req, res) => {
    const query = `
        SELECT 
            animals.AnimalID, 
            animals.Species, 
            animals.Nickname, 
            animals.Gender, 
            animals.ZoneID, 
            zones.ZoneName 
        FROM 
            animals
        JOIN 
            zones ON animals.ZoneID = zones.ZoneID
        ORDER BY 
            animals.AnimalID;`;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(results);
    });
});



router.get('/getAnimalDetails/:id', (req, res) => {
    const animalID = req.params.id;

    const query = `
        SELECT 
            animals.AnimalID, 
            animals.Species, 
            animals.Nickname, 
            animals.Subspecies, 
            animals.Gender, 
            animals.DateOfBirth, 
            animals.Origin, 
            animals.Details, 
            animals.Image, 
            animals.ZoneID,     
            animals.CategoryID,  
            zones.ZoneName,
            category.DietType,
            category.HabitatType
        FROM 
            animals
        JOIN 
            zones ON animals.ZoneID = zones.ZoneID
        JOIN 
            category ON animals.CategoryID = category.CategoryID
        WHERE 
            animals.AnimalID = ?;
        `;
    
    connection.query(query, [animalID], (err, results) => {
        if (err) {
            console.log("Error fetching animal details:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            const animal = results[0];


            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            res.json({
                AnimalID: animal.AnimalID,
                Species: animal.Species,
                Nickname: animal.Nickname,
                Subspecies: animal.Subspecies,
                Gender: animal.Gender,
                DateOfBirth: animal.DateOfBirth,
                Origin: animal.Origin,
                Details: animal.Details,
                ZoneID: animal.ZoneID,     
                CategoryID : animal.CategoryID,
                Image: imageUrl,
                ZoneName: animal.ZoneName,
                DietType: animal.DietType,
                HabitatType: animal.HabitatType
            });
        } else {
            res.status(404).json({ error: "Animal not found" });
        }
    });
});

router.get('/getAnimalImage/:id', (req, res) => {
    const animalID = req.params.id;

    const query = `
        SELECT animals.Image
        FROM animals
        WHERE animals.AnimalID = ?;
    `;
    
    connection.query(query, [animalID], (err, results) => {
        if (err) {
            console.log("Error fetching animal image:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            const animal = results[0];
            const imageBase64 = animal.Image ? Buffer.from(animal.Image).toString('base64') : null;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';

            res.json({
                Image: imageUrl
            });
        } else {
            res.status(404).json({ error: "Animal not found" });
        }
    });
});



router.post('/insertAnimal', upload.single('image'), (req, res) => {
    const { species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.status(400).json({ error: "Image is required" });
    }

    let imageBuffer = imageFile.buffer;

    const query = "INSERT INTO animals (Species, Nickname, Subspecies, Gender, DateOfBirth, Origin, Details, CategoryID, ZoneID, Image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID, imageBuffer], (err, results) => {
        if (err) {
            let errorMessage ="";
            console.error(err);
            if(err.sqlMessage.includes('Nickname_UNIQUE')){
                errorMessage = "Duplicate Nickname detected. Please use a different Nickname.";
                return res.status(400).json({ error: errorMessage });
            }else{
                console.log("Error inserting data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
        res.status(201).json({
            message: "Animal added successfully",
            AnimalID: results.insertId,
            Species: species,
            Nickname: nickname,
            Subspecies: subspecies,
            Gender: gender,
            DateOfBirth: dateOfBirth,
            Origin: origin,
            Details: details,
            CategoryID: categoryID,
            ZoneID: zoneID
        });
    });
});


router.patch('/updateAnimal/:animalID', upload.single('image'), (req, res) => {
    const animalID = req.params.animalID;
    const { species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID } = req.body;
    const imageFile = req.file;

    if (!species || !nickname || !subspecies || !gender || !dateOfBirth || !origin || !details || !categoryID || !zoneID) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    let imageBuffer = null;
    if (imageFile) {
        imageBuffer = imageFile.buffer;
    } else {
        const getImageQuery = 'SELECT Image FROM animals WHERE AnimalID = ?';
        connection.query(getImageQuery, [animalID], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching current image", details: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Animal not found" });
            }
            imageBuffer = result[0].Image;
            updateAnimalDetails(animalID, species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID, imageBuffer, res);
        });
        return;
    }
    updateAnimalDetails(animalID, species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID, imageBuffer, res);
});
function updateAnimalDetails(animalID, species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID, imageBuffer, res) {
    const updateQuery = `
        UPDATE animals
        SET Species = ?, Nickname = ?, Subspecies = ?, Gender = ?, DateOfBirth = ?, Origin = ?, Details = ?, CategoryID = ?, ZoneID = ?, Image = ?
        WHERE AnimalID = ?
    `;
    
    connection.query(updateQuery, [species, nickname, subspecies, gender, dateOfBirth, origin, details, categoryID, zoneID, imageBuffer, animalID], (err, results) => {
        if (err) {
            let errorMessage ="";
            // console.error(err);
            if(err.sqlMessage.includes('Nickname_UNIQUE')){
                errorMessage = "Duplicate Nickname detected. Please use a different Nickname.";
                return res.status(400).json({ error: errorMessage });
            }else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
                errorMessage = "Cannot move zone due to existing data in the Animal_care table.";
                return res.status(400).json({ error: errorMessage });
            }
            else{
                console.log("Error updating data:", err);
                return res.status(500).json({ error: "Internal Server Error", details: err.message });
            }
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Animal not found" });
        }

        res.status(200).json({ message: "Animal updated successfully" });
    });
}







router.delete('/deleteAnimal/:id', (req, res) => {
    const animalID = req.params.id;

    const query = "DELETE FROM animals WHERE AnimalID = ?";
    connection.query(query, [animalID], (err, results) => {
        if (err) {
            // console.error(err);
            let errorMessage = "";
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                errorMessage = "Cannot delete due to existing data in the Animal_care table";
                return res.status(400).json({ error: errorMessage})
            }else{
                console.log("Error deleting data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        if (results.affectedRows === 0) {
            console.error(err);
            return res.status(404).json({ message: "Animal not found" });
        }

        res.status(200).json({ message: "Animal deleted successfully" });
    });
});

module.exports = router;