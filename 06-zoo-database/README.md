# Zoo Database Web Application

งานกลุ่มรายวิชาฐานข้อมูล มี Node.js / Express / MySQL และหน้า HTML/CSS/JavaScript
พบ routes จัดการสัตว์ โซน หมวดหมู่ พนักงาน การดูแลสัตว์ ผู้ใช้ รายการโปรด และ dashboard
พบเอกสาร query แยกชื่อผู้จัดทำหลายคน รวมชื่อผู้ใช้; README นี้ไม่อ้างว่าสมาชิกคนเดียวเขียนทุกส่วน

## เปิดศึกษา / เตรียมรันในเครื่อง

1. ใช้ MySQL ในฐานข้อมูลทดลองเปล่า import `database/schema.sql`
2. คัดลอก `.env.example` เป็น `.env` ในโฟลเดอร์นี้แล้วกรอกค่า
3. เข้า NodeJsSystem แล้วใช้ `npm ci` และ `npm start`
4. เปิด http://localhost:3000

ยังไม่ได้รัน backend/ฐานข้อมูลใหม่หรือทดสอบ login ครบเส้นทาง
ชุดนี้เก็บเฉพาะ schema ไม่มีข้อมูลผู้ใช้ รหัสผ่าน seed, triggers หรือ stored routines เดิม
จึงต้องเติมข้อมูลทดสอบและตรวจ dependency กับฐานข้อมูลก่อนใช้ฟังก์ชันครบ
ไม่ได้รวมภาพจาก pic เพราะยังไม่ตรวจสิทธิ์และข้อมูลบุคคล รูปบางตำแหน่งจะไม่แสดง
JWT secret และ SMTP credentials ในโค้ดถูกย้ายไป environment variables

คัดจาก Database/MiniProject; อีกสำเนาใน MiniProject 1 มีไฟล์นอก node_modules ตรงกัน 138/139 ไฟล์
ไฟล์ที่ต่างคือ database dump จึงไม่รวมข้อมูลดิบจากทั้งสองชุด
เหมาะเป็นหลักฐานงานเรียน ยังไม่ได้ตรวจให้พร้อมเปิดบริการสาธารณะ
