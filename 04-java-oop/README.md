# Java OOP & Swing Labs

| งาน | เนื้อหา | Main class |
|---|---|---|
| Store | สินค้า สต็อก ตะกร้า และคำนวณยอดผ่าน Swing | Main |
| Bank | Account, ฝากถอน, exception และ GUI | Main |
| Lab8 | PainterCafe เมนูเครื่องดื่มและ event handling | PainterCafe |
| Lab10-File | GUI อ่านเขียนไฟล์ | FileReadWriteGUI |

ใช้ JDK เปิดแต่ละโฟลเดอร์เป็นโปรเจกต์แยก เพราะชื่อคลาส Main ซ้ำกัน
ตัวอย่างจากโฟลเดอร์ Store:

```powershell
New-Item -ItemType Directory -Force out
javac -encoding UTF-8 -d out src/*.java
java -cp out Main
```

ยังไม่ได้ compile ใหม่: เครื่องที่ตรวจพบมี JRE แต่ไม่พบ javac ใน PATH
คัดออก Calculator (GUI ยังว่าง) และ KVL (พิมพ์ข้อความอย่างเดียว)
