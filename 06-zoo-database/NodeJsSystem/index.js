const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const path = require('path'); 
require('dotenv').config({ path: '../.env' });;

app.use(express.static(path.join(__dirname, '..', 'code')));
app.use(express.static(path.join(__dirname, '..', 'code', 'html'))); 
app.use('/pic', express.static(path.join(__dirname, '..', 'pic')));
app.use('/UserDE', express.static(path.join(__dirname, '..', 'code', 'html', 'UserDE')));


app.use(cors({ origin: '*' }));
app.use(express.json()) 
const port = process.env.PORT;
const multer = require('multer');
const upload = multer();

//admin
const AnimalRouters = require('./Routers/Admin/animal');
const ZoneRouters = require('./Routers/Admin/zone');
const EmployeeRouters = require('./Routers/Admin/employee');
const CategoryRouters = require('./Routers/Admin/category');
const animalCareRouters = require('./Routers/Admin/animalCare');

//user
const UserRouters = require('./Routers/User/User');
const AnimalUserRouters =require('./Routers/User/animalUser');
const WildLifeRouters =require('./Routers/User/wildLife');
const FavoriteRouters = require('./Routers/User/Favorite');
const DashboardRouters = require('./Routers/Admin/Dashboard');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL successfully");
})

//admin
app.use('/animal', AnimalRouters);
app.use('/zone' , ZoneRouters);
app.use('/employee', EmployeeRouters);
app.use('/category' ,CategoryRouters);
app.use('/animalCare' ,animalCareRouters);
app.use('/dashboard',DashboardRouters);

//User
app.use('/User', UserRouters);
app.use('/animalUser', AnimalUserRouters);
app.use('/WildLife', WildLifeRouters);
app.use('/Favorite', FavoriteRouters);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'code', 'html', 'Home.html'));
});


app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    const open = await import('open');
    open.default(`http://localhost:${port}`);     
});
