# Student Projects Portfolio

คัดจากคลังงานระหว่างเรียน เพื่อแสดงทักษะที่เคยฝึกผ่าน mini project และ lab ที่มีโค้ดหรือวงจรจริง
เอกสารนี้จัดทำใหม่เพื่ออธิบายงานเดิม ไม่ใช่หลักฐานว่าโปรเจกต์ทั้งหมดผ่านการทดสอบใหม่

| รายวิชา / ทักษะ | งานที่เลือก | เปิดดู |
|---|---|---|
| Digital Logic / Quartus II | **Decimal Adder** วงจรบวกฐานสิบพร้อมวงจรย่อย | [วงจรและวิธีเปิด](01-decimal-adder/README.md) |
| Microcontroller / MicroPython | พัดลมควบคุมเวลา อุณหภูมิ ความเร็ว และทิศทาง | [โค้ดและการต่อขา](02-fan-controller/README.md) |
| IoT / ESP8266 | วัดความชื้นดิน ส่ง Blynk และควบคุม relay | [โปรเจกต์](03-soil-moisture/README.md) |
| OOP / Java Swing | Store, Bank, Cafe และอ่านเขียนไฟล์ | [4 labs](04-java-oop/README.md) |
| Data Structures / C++ | กราฟ ลิสต์ สแตก ต้นไม้ และ sorting | [labs](05-data-structures/README.md) |
| Database / Web | ระบบสวนสัตว์ — งานกลุ่ม | [source และ schema](06-zoo-database/README.md) |

## Featured: Decimal Adder

![วงจรบวกฐานสิบ](01-decimal-adder/preview.svg)

เริ่มดูจากงานนี้: มีไฟล์ .qpf/.qsf/.bdf/.bsf/.vwf และรายงานต้นฉบับระบุ compile สำเร็จเมื่อ 18 ต.ค. 2024
ภาพข้างต้นแปลงจาก BDF เพื่อให้อ่านบน GitHub ได้; เปิด QPF ใน Quartus เพื่อดู/แก้ไขวงจรจริง

## การคัดเลือกและเครดิต

- เก็บผลงานที่มี implementation และคำอธิบายสิ่งที่เรียน ไม่รวมสไลด์ หนังสือ คู่มือโจทย์ และโปรแกรมติดตั้ง
- คงเครดิตงานกลุ่มใน source; ไฟล์ที่ไม่ยืนยันผู้เขียนไม่อ้างว่าเป็นงานเดี่ยวทั้งหมด
- ไม่รวมไฟล์ build, cache, dependencies, ข้อมูลบัญชีหรือ database rows เดิม
- source ต้นฉบับไม่ถูกแก้ไข ดูที่มาและ SHA-256 ของไฟล์คัดลอกใน [manifest](provenance.json)
- ยังไม่กำหนด license ครอบทั้งคลัง เพราะมีงานกลุ่มและข้อความสิทธิ์ของเครื่องมือเดิม
- ดู [ผลตรวจ](VALIDATION.md) และ [รายการคัดออก](SELECTION.md)

## ลง Git

Repository: https://github.com/Painter121/student-projects-portfolio

```sh
git clone https://github.com/Painter121/student-projects-portfolio.git
```

เลือกหมวดงานจากตารางด้านบนเพื่อดู source และวิธีเปิดของแต่ละโปรเจกต์
