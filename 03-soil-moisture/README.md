# ESP8266 Soil Moisture Monitor

อ่าน analog A0 ส่งค่าขึ้น Blynk V0 และควบคุม relay D0 ด้วย threshold 700
เปิด `soil_moisture/soil_moisture.ino` ใน Arduino IDE ตั้งบอร์ด ESP8266 และติดตั้ง Blynk
ใส่ template/token ของตนเองและ Wi-Fi ก่อนใช้ ค่า token และ Wi-Fi เดิมถูกแทนด้วย placeholder แล้ว

เป็นโค้ดงานเรียนที่ยังไม่ได้ compile หรือทดลองบอร์ดใหม่ มีข้อจำกัดเดิม: ใน loop ใช้ val ควบคุม relay ก่อนอ่านค่าใหม่ จึงใช้ค่าจากรอบก่อน
ยังไม่รวม CAD/STL เพราะไม่ยืนยันว่าชิ้นใดเป็นส่วนของโครงงานนี้
