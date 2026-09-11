const express = require('express');
const routers = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

routers.get('/getEmployee', (req, res) => {
    const query =
        `SELECT 
        employees.EmployeeID, 
        employees.FirstName, 
        employees.LastName, 
        employees.Position, 
        employees.PhoneNumber, 
        employees.Email, 
        employees.DateOfBirth, 
        employees.Address, 
        employees.Gender, 
        employees.Nationality, 
        employees.ZoneID,
        zones.ZoneName
    FROM 
        employees
    JOIN 
        zones
    ON 
        employees.ZoneID = zones.ZoneID
    ORDER BY 
        employees.EmployeeID ASC;`;

    connection.query(query, (err, results) => {
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


routers.get('/getEmployee/:id', (req, res) => {
    const employeeID = req.params.id;

    // ตรวจสอบว่ามีการส่ง id มาหรือไม่
    if (!employeeID) {
        return res.status(400).json({ error: "EmployeeID is required" });
    }

    const query = `
    SELECT 
        employees.EmployeeID, 
        employees.FirstName, 
        employees.LastName, 
        employees.Position, 
        employees.PhoneNumber, 
        employees.Email, 
        employees.DateOfBirth, 
        employees.Address, 
        employees.Gender, 
        employees.Nationality, 
        employees.ZoneID,
        zones.ZoneName
    FROM 
        employees
    JOIN 
        zones
    ON 
        employees.ZoneID = zones.ZoneID
    WHERE 
        employees.EmployeeID = ?`;

    connection.query(query, [employeeID], (err, results) => {
        if (err) {
            console.log("Error fetching Employee:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: "Employee not found" });
        }
    });
});

//get หา zoneid ที่เหมือนกัน
routers.get('/getEmployeeZoneID/:id', (req, res) => {
    const employeeID = req.params.id;

    const query = `
        SELECT 
	        employees.EmployeeID,
            employees.FirstName,
            employees.LastName,
            employees.Position,
            employees.PhoneNumber,
            employees.Email,
            employees.DateOfBirth,
            employees.Address,
            employees.Gender,
            employees.Nationality,
            zones.ZoneID,
            zones.ZoneName
        FROM
            employees
        JOIN 
            zones ON employees.ZoneID = zones.ZoneID
        WHERE 
            zones.ZoneID = ?;
        `;
    connection.query(query, [employeeID], (err, results) => {
        if (err) {
            console.log("Error fetching employee details:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(404).json({ error: "Employee not found" });
        }
    });
});


routers.post('/insertEmployee', (req, res) => {
    const { FirstName, LastName, Position, PhoneNumber, Email, DateOfBirth, Address, Gender, Nationality, ZoneID } = req.body;

    if (!FirstName || !LastName || !Position || !PhoneNumber || !Email || !DateOfBirth || !Address || !Gender || !Nationality || !ZoneID) {
        return res.status(400).json({ error: "All fields are required" });
    }

    //ตรวจสอบจำนวนพนักงานใน Zone ที่เลือก
    const checkCapacityQuery = `
        SELECT EmployeeCapacity, 
            (SELECT COUNT(*) FROM employees WHERE ZoneID = ?) AS CurrentEmployeeCount
        FROM zones WHERE ZoneID = ?
    `;

    connection.query(checkCapacityQuery, [ZoneID, ZoneID], (err, results) => {
        if (err) {
            console.log("Error checking capacity:", err);
            return res.status(500).json({ error: "Internal Server Error!!!!" });
        }

        const { EmployeeCapacity, CurrentEmployeeCount } = results[0];

        //ความจุพนักงานใน Zone พอไหม
        if (CurrentEmployeeCount < EmployeeCapacity) {
            // ถ้ามีพื้นที่เพียงพอ ให้เพิ่มพนักงาน
            const query = `
                INSERT INTO employees(FirstName, LastName, Position, PhoneNumber, Email, DateOfBirth, Address, Gender, Nationality, ZoneID) 
                VALUES(?,?,?,?,?,?,?,?,?,?)
            `;
            connection.query(query, [FirstName, LastName, Position, PhoneNumber, Email, DateOfBirth, Address, Gender, Nationality, ZoneID], (err, results) => {
                if (err) {
                    console.error(err);
                    let errorMessage = "";
                    if (err.code === 'ER_DUP_ENTRY') {
                        if (err.sqlMessage.includes('Email_UNIQUE')) {
                            errorMessage = "Duplicate email detected. Please use a different email."
                        } else if (err.sqlMessage.includes('FirstName')) {
                            errorMessage = "Duplicate Name detected. Please use a different Name."
                        } else if (err.sqlMessage.includes('PhoneNumber_UNIQUE')) {
                            errorMessage = "Duplicate PhoneNumber detected. Please use a different PhoneNumber."
                        }
                    }
                    return res.status(400).json({ error: errorMessage });
                }

                res.status(201).json({ message: "Employee added successfully", EmployeeID: results.insertId });
            });
        }
        else {
            res.status(400).json({ error: "Zone is full, cannot assign employee" });
        }
    });
});




routers.patch('/updateEmployee/:id', (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Position, PhoneNumber, Email, DateOfBirth, Address, Gender, Nationality, ZoneID } = req.body;

    // ตรวจสอบว่ามี ID และข้อมูลที่ต้องการอัปเดตหรือไม่
    if (!id) {
        return res.status(400).json({ error: "Employee ID is required" });
    }
    if (!FirstName && !LastName && !Position && !PhoneNumber && !Email && !DateOfBirth && !Address && !Gender && !Nationality && !ZoneID) {
        return res.status(400).json({ error: "At least one field is required to update" });
    }

    // สร้าง query สำหรับการอัปเดต
    const updates = [];
    const values = [];
    if (FirstName) {
        updates.push("FirstName = ?");
        values.push(FirstName);
    }
    if (LastName) {
        updates.push("LastName = ?");
        values.push(LastName);
    }
    if (Position) {
        updates.push("Position = ?");
        values.push(Position);
    }
    if (PhoneNumber) {
        updates.push("PhoneNumber = ?");
        values.push(PhoneNumber);
    }
    if (Email) {
        updates.push("Email = ?");
        values.push(Email);
    }
    if (DateOfBirth) {
        updates.push("DateOfBirth = ?");
        values.push(DateOfBirth);
    }
    if (Address) {
        updates.push("Address = ?");
        values.push(Address);
    }
    if (Gender) {
        updates.push("Gender = ?");
        values.push(Gender);
    }
    if (Nationality) {
        updates.push("Nationality = ?");
        values.push(Nationality);
    }
    if (ZoneID) {
        updates.push("ZoneID = ?");
        values.push(ZoneID);
    }

    // เพิ่ม Employee ID ใน values
    values.push(id);

    const query = `UPDATE employees SET ${updates.join(", ")} WHERE EmployeeID = ?`;

    // รันคำสั่ง SQL
    connection.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            let errorMessage = "";
            if (err.sqlMessage.includes('FirstName')) {
                errorMessage = "Duplicate Name detected. Please use a different Name.";
                return res.status(400).json({ error: errorMessage });
            } else if (err.sqlMessage.includes('Email_UNIQUE')) {
                errorMessage = "Duplicate Email detected. Please use a different Email.";
                return res.status(400).json({ error: errorMessage });
            } else if (err.sqlMessage.includes('PhoneNumber_UNIQUE')) {
                errorMessage = "Duplicate PhoneNumber detected. Please use a different PhoneNumber.";
                return res.status(400).json({ error: errorMessage });
            } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                errorMessage = "Cannot move zone due to existing data in the Animal_care table.";
                return res.status(400).json({ error: errorMessage });
            }
            else {
                console.log("Error updating Employee:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json({ message: "Employee updated successfully" });
    });
});

routers.delete('/deleteEmployee/:id', (req, res) => {
    const employeeID = req.params.id;

    const query = "DELETE FROM employees WHERE EmployeeID = ?";
    connection.query(query, [employeeID], (err, results) => {
        if (err) {
            let errorMessage = "";
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                errorMessage = "Cannot delete due to existing data in the Animal_care table";
                return res.status(400).json({ error: errorMessage });
            } else {
                console.log("Error deleting data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });

        }
        res.status(200).json({ message: "Employee deleted successfully" });
    })
})


module.exports = routers;