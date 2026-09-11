const express = require('express');
const routers = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
routers.use(express.json());



routers.post('/verifyPassword/:id', (req, res) => {
    const userId = req.params.id;
    const { currentPassword } = req.body;

    connection.query('SELECT Password FROM users WHERE UserID = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้งาน" });
        }

        const hashedPassword = results[0].Password;
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน" });
            }
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
            }

            res.json({ success: true, message: "ยืนยันรหัสผ่านสำเร็จ" });
        });
    });
});

routers.put('/changePassword/:id', (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    const newHashedPassword = bcrypt.hashSync(newPassword, 10);
    connection.query('UPDATE users SET Password = ? WHERE UserID = ?', [newHashedPassword, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน" });
        }
        res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    });
});



routers.put('/updateUser/:id', async (req, res) => {
    const userId = req.params.id;
    const { Firstname, Lastname, Email, DateOfBirth, Gender } = req.body;

    try {
        let updates = [];
        let values = [];

        if (Firstname) {
            updates.push("Firstname = ?");
            values.push(Firstname);
        }
        if (Lastname) {
            updates.push("Lastname = ?");
            values.push(Lastname);
        }
        if (Email) {
            updates.push("Email = ?");
            values.push(Email);
        }
        if (DateOfBirth) {
            updates.push("DateOfBirth = ?");
            values.push(DateOfBirth);
        }
        if (Gender) {
            updates.push("Gender = ?");
            values.push(Gender);
        }
        if (updates.length === 0) {
            return res.status(400).json({ error: "ไม่มีข้อมูลที่ต้องอัปเดต" });
        }
        const query = `
            UPDATE users 
            SET ${updates.join(', ')} 
            WHERE UserID = ?
        `;
        values.push(userId);
        connection.query(query, values, (err, results) => {
            if (err) {
                let errorMessage = "";
                if (err.sqlMessage.includes('unique_name')) {
                    errorMessage = "Duplicate name detected. Please use a different name.";
                    return res.status(400).json({ error: errorMessage });
                } else {
                    console.error("Error updating data:", err.sqlMessage);
                    return res.status(500).json({ error: err.sqlMessage });
                }

            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "ไม่พบผู้ใช้นี้" });
            }
            res.json({
                msg: "อัปเดตข้อมูลสำเร็จ",
                UpdatedId: userId
            });
        });
    } catch (err) {
        console.error("Error during update:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});



routers.get('/getAllUser', (req, res) => {
    const query = 'SELECT UserID, Firstname, Lastname, Username, Email, DateOfBirth, Gender, Role FROM zoo.users;';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: "No users found" });
        }
    });
});

routers.post('/updateRole', (req, res) => {
    const { userId, role } = req.body;
    if (!['Admin', 'User'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Role must be Admin or User." });
    }
    const query = 'UPDATE zoo.users SET Role = ? WHERE UserID = ?';
    connection.query(query, [role, userId], (err, result) => {
        if (err) {
            let errorMessage = "";
            if(err.sqlMessage.includes('Admin role cannot be changed')){
                errorMessage = "Admin role cannot be changed";
                return res.status(400).json({ error: errorMessage });
            }
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Role updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});


routers.get('/getEmail/:email', (req, res) => {
    const email = req.params.email;
    const query = 'SELECT Email , UserID FROM zoo.users WHERE Email = ?';

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error Query:", err);
            return res.status(500).json({ success: false, message: "Error fetching Email" });
        }

        if (results.length > 0) {
            res.json({ success: true, email: results[0].Email, userId: results[0].UserID });
        } else {
            res.json({ success: false, message: "Email not found" });
        }
    });
});
routers.get('/getUsername/:username', (req, res) => {
    const username = req.params.username;
    const query = 'SELECT Username ,Email , UserID FROM zoo.users WHERE Username = ?';

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error("Error Query:", err);
            return res.status(500).json({ success: false, message: "Error fetching username" });
        }

        if (results.length > 0) {
            res.json({ success: true, username: results[0].Username, email: results[0].Email, userId: results[0].UserID });
        } else {
            res.json({ success: false, message: "Username not found" });
        }
    });
});

routers.get('/getRole/:userID', (req, res) => {
    const userID = req.params.userID;
    const query = 'SELECT UserID, Username,  Role FROM zoo.users WHERE UserID = ?';
    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ message: 'Error fetching profile' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
})

routers.get('/getProfile/:userID', (req, res) => {
    const userID = req.params.userID;

    const query = 'SELECT UserID, Firstname, Lastname, Username, Email, DateOfBirth, Gender, Role FROM zoo.users WHERE UserID = ?';

    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ message: 'Error fetching profile' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(results[0]);
    });
});


routers.post('/registerUser', async (req, res) => {
    const { Firstname, Lastname, Username, Password, Email, DateOfBirth, Gender } = req.body;

    try {
        const passwordHash = await bcrypt.hash(Password, 10);
        const query = "INSERT INTO Users(Firstname, Lastname, Username, Password, Email, DateOfBirth, Gender) VALUES(?,?,?,?,?,?,?)";

        connection.query(query, [Firstname, Lastname, Username, passwordHash, Email, DateOfBirth, Gender], (err, results) => {
            if (err) {
                let errorMessage = "";
                if (err.sqlMessage.includes('Email_UNIQUE')) {
                    errorMessage = "Duplicate email detected. Please use a different email.";
                    return res.status(400).json({ error: errorMessage });
                } if (err.sqlMessage.includes('unique_name')) {
                    errorMessage = "Duplicate Name detected. Please use a different Name.";
                    return res.status(400).json({ error: errorMessage });
                } if (err.sqlMessage.includes('Username')) {
                    errorMessage = "Duplicate Username detected. Please use a different Username.";
                    return res.status(400).json({ error: errorMessage });
                }
                else {
                    console.error("Error inserting data:", err);
                    return res.status(500).json({ error: "Internal Server Error!!" });
                }

            }
            res.json({
                msg: "Data inserted successfully",
                InsertedId: results.insertId
            });
        });
    } catch (err) {
        console.error("Error during password hashing:", err);
        res.status(500).json({ error: "Internal Server Error!!" });
    }
});

routers.post('/loginUser', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }
        connection.query('SELECT * FROM Users WHERE Username = ?', [username], async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
            const userData = results[0];

            const match = await bcrypt.compare(password, userData.Password);

            if (match) {
                // สร้าง JWT Token
                const token = jwt.sign(
                    { userId: userData.UserID, username: userData.Username, Role: userData.Role },
                    JWT_SECRET,
                    { expiresIn: '2h' }
                );

                res.json({
                    msg: "Login successful",
                    token: token // ส่ง token กลับไปที่ client
                });
            } else {
                res.status(401).json({ error: "Invalid username or password" });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

routers.post('/loginEmail', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }
        connection.query('SELECT * FROM Users WHERE Email = ?', [email], async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const userData = results[0];

            const match = await bcrypt.compare(password, userData.Password);

            if (match) {
                const token = jwt.sign(
                    { userId: userData.UserID, email: userData.Email, Role: userData.Role },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({
                    msg: "Login successful",
                    token: token,
                    username: userData.Username
                });
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};
routers.get('/checkToken', authenticateToken, (req, res) => {
    res.json({
        message: "Token is valid",
        user: req.user
    });
});


const otpData = {};
const OTP_EXPIRATION_TIME = (3 * 60 + 10) * 1000; // 3 นาที 10 วินาที

// ส่ง OTP
routers.post('/send-otp', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'กรุณากรอกอีเมล' });
    }

    // สร้าง OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // สร้าง OTP แบบ 6 หลัก
    const timestamp = Date.now(); // เวลาปัจจุบัน

    // เก็บ OTP และเวลาที่สร้าง
    otpData[email] = { otp, timestamp };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'OTP สำหรับการยืนยันตัวตน',
        html: `
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        background-color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        box-sizing: border-box;
                    }
                    .header {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .otp-box {
                        display: inline-block;
                        background-color: #007bff;
                        color: white;
                        font-size: 24px;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .footer {
                        font-size: 12px;
                        color: #777;
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">Zoo Nature's Paradise </div>
                    <div class="header">กรุณากรอก OTP เพื่อยืนยันตัวตน</div>
                    <div class="otp-box">${otp}</div>
                    <div class="footer">OTP จะหมดอายุใน 3 นาที</div>
                </div>
            </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            return res.status(500).json({ message: 'ไม่สามารถส่ง OTP ได้', error: error.message });
        }
        res.status(200).json({ message: 'OTP ถูกส่งไปที่อีเมลของคุณ' });
    });
});

// ตรวจสอบ OTP
routers.post('/verify-otp', (req, res) => {
    const { otp, email } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'ข้อมูล OTP หรือ email ไม่ถูกต้อง' });
    }
    const userOtpData = otpData[email];
    if (!userOtpData) {
        return res.status(400).json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' });
    }
    const { otp: storedOtp, timestamp } = userOtpData;
    const currentTime = Date.now();
    // ตรวจสอบ OTP ว่ายังไม่หมดอายุ
    if (currentTime - timestamp > OTP_EXPIRATION_TIME) {
        delete otpData[email]; // ลบ OTP ที่หมดอายุ
        return res.status(400).json({ message: 'OTP หมดอายุ กรุณาขอใหม่' });
    }
    // ตรวจสอบ OTP ถูกต้องหรือไม่
    if (storedOtp !== parseInt(otp, 10)) {
        return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
    }
    // ลบ OTP หลังการใช้งาน
    delete otpData[email];
    res.status(200).json({ message: 'OTP ยืนยันตัวตนสำเร็จ' });
});

routers.post('/ContactAdmin', async (req, res) => {
    const { FirstName, LastName, Age, Subject } = req.body;

    if (!FirstName || !LastName || !Age || !Subject) {
        return res.status(400).send({ error: 'All fields are required: FirstName, LastName, Age, Subject' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: "User Contact",
        text: `FirstName: ${FirstName}\nLastName: ${LastName}\nAge: ${Age}\n\n${Subject}`
    };


    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to send email' });
    }
});





module.exports = routers;