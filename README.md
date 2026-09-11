# Digital Logic — 12-Bit Decimal (BCD) Adder System

มินิโปรเจกต์ออกแบบและพัฒนาวงจรบวกเลขฐานสิบ (Decimal / BCD Adder) ขนาด 12-bit จากการวางลอจิกและสร้างบล็อกวงจรย่อยด้วยตนเองทั้งหมด ออกแบบโดยใช้โปรแกรม Quartus II เพื่อลงบนชิป Altera FPGA (FLEX10K - EPF10K10LC84-4) พร้อมการจำลองสัญญาณ Waveform และการต่อทดสอบวงจรจริง

---

## 1. ภาพรวมสถาปัตยกรรมวงจรหลัก (Top-Level Circuit)

วงจรหลักทำหน้าที่รับข้อมูลอินพุตขนาด 12-bit ประมวลผลการบวกเลขฐานสิบข้ามหลัก พร้อมระบบควบคุมการเลือกส่งสัญญาณและการแสดงผลข้อมูล โดยเชื่อมโยงโมดูลย่อยและลอจิกเกตเข้าด้วยกันผ่านไฟล์ Block Diagram File (`miniProjectAdder.bdf`)

![วงจรหลัก Decimal Adder](preview.svg)

---

## 2. วงจรและโมดูลย่อยที่ออกแบบ (Sub-IC Modules)

วงจรนี้ถูกแบ่งออกเป็นโมดูลย่อย (Hierarchical Modular Design) โดยออกแบบลอจิกของแต่ละบล็อกขึ้นมาเฉพาะ เพื่อให้การประมวลผลและการจัดสรรสัญญาณทำงานได้อย่างถูกต้องและเป็นระบบ

### 2.1 วงจรบวกเลขฐานสิบ 12 บิต (12-Bit Adder Core — `12bit.bdf`)
แกนหลักของการคำนวณ ทำหน้าที่บวกตัวเลขฐานสิบขนาด 12-bit พร้อมวงจรลอจิกตรวจสอบผลบวกเมื่อค่าเกิน 9 (BCD Correction) เพื่อจัดการส่งต่อตัวทด (Carry Out) ข้ามหลักอย่างถูกต้อง

![วงจรบวก 12 บิต](12bit-preview.svg)

### 2.2 วงจรมัลติเพล็กเซอร์ 16-to-4 (`16mux4.bdf` & `Multiplex.bdf`)
วงจรเลือกส่งข้อมูลขนาด 16 ช่องสัญญาณออกเป็น 4 ช่องสัญญาณ ทำหน้าที่จัดระเบียบและสลับเลือกส่งชุดข้อมูลตัวเลขในแต่ละหลักเข้าสู่ขั้นตอนการประมวลผล

![วงจรมัลติเพล็กเซอร์ 16mux4](16mux4-preview.svg)

### 2.3 วงจรเลือกสัญญาณควบคุมและทดสอบ (`TestProSelect.bdf`)
โมดูลควบคุมการสลับโหมดและคัดเลือกสัญญาณทดสอบ ทำงานร่วมกับบล็อกจัดการสัญญาณระดับบิต (`LHHL.bdf`) เพื่อกำหนดค่าสถานะการคำนวณ

![วงจร TestProSelect](testproselect-preview.svg)

### 2.4 วงจรถอดรหัสสัญญาณ (`Decode2to4.bdf`)
วงจร 2-to-4 Binary Decoder สำหรับแปลงรหัสควบคุม 2 บิตเป็นสัญญาณเปิดใช้งาน 4 แชนเนล เพื่อเลือกเปิดการทำงานของโมดูลย่อยตามสเต็ปเวลา

![วงจรถอดรหัส Decode2to4](decode2to4-preview.svg)

### 2.5 วงจรตัวนับ 4 บิต (`Count4.bdf`)
วงจร 4-Bit Synchronous Counter สำหรับสร้างจังหวะการนับและควบคุมรอบการทำงานของระบบ

![วงจรตัวนับ Count4](count4-preview.svg)

---

## 3. การจำลองวงจรบน Breadboard (Simulation Prototype)

การต่อวงจรจำลองลอจิกพื้นฐานสำหรับการบวกและลบเลขฐานสอง (Adder / Subtractor) บนเบรดบอร์ดเสมือนจริง โดยใช้ไอซีลอจิก 74HC86 (XOR gates) สำหรับกลับบิตสัญญาณ และไอซี 74HC283 (4-Bit Binary Full Adder) พร้อมดิปสวิตช์อินพุตและหลอด LED แสดงผลลัพธ์การคำนวณ

![Breadboard Adder Subtractor Simulation](assets/breadboard-adder-simulation.png)

---

## 4. การต่อวงจรทดสอบบนบอร์ด FPGA จริง (Hardware Implementation)

การดาวน์โหลดวงจรที่ออกแบบจากโปรแกรม Quartus II ลงบนบอร์ดทดลอง FPGA จริง (ASTRON LOGIC WIZARD FLEXMAX-A01) ผ่านสายดาวน์โหลด USB Blaster เพื่อทดสอบการทำงานร่วมกับสวิตช์อินพุต ไฟแสดงสถานะ Logic Monitor และโมดูลแสดงผล 7-Segment Display

| การต่อสายและรันวงจรบนบอร์ดทดลอง | ชิป Altera FLEX 10K (EPF10K10LC84) | ส่วนควบคุม 7-Segment Multiplex |
|:---:|:---:|:---:|
| ![FPGA Trainer Board Setup](assets/fpga-trainer-board-setup.jpg) | ![Altera FLEX 10K FPGA](assets/fpga-altera-chip-closeup.jpg) | ![7-Segment Multiplex Display](assets/fpga-7segment-multiplex.jpg) |

---

## 5. การจำลองสัญญาณเวลา (Waveform Simulation)

ระบบผ่านการทดสอบและยืนยันความถูกต้องของการคำนวณด้วยไฟล์การจำลองสัญญาณ Waveform (`miniProjectAdder.vwf`) ใน Quartus II เพื่อตรวจสอบ:
- ความถูกต้องของการบวกเลขในทุกกรณีทดสอบ (รวมถึงกรณีมีตัวทดข้ามหลัก)
- Timing Diagram และสัญญาณหน่วงเวลา (Propagation Delay) ของแต่ละช่วงสัญญาณนาฬิกา

---

## 6. รายละเอียดไฟล์ในโปรเจกต์

| ไฟล์ | หน้าที่ |
|---|---|
| `miniProjectAdder.qpf` | ไฟล์โปรเจกต์ Quartus II หลัก (รองรับ Quartus II 9.0 Web Edition ขึ้นไป) |
| `miniProjectAdder.bdf` | บล็อกไดอะแกรมวงจรหลัก (Top-Level Schematic) |
| `miniProjectAdder.qsf` | การตั้งค่าโปรเจกต์และการกำหนด Pin Assignment สำหรับ FPGA |
| `miniProjectAdder.vwf` | การจำลองรูปคลื่นสัญญาณ (Timing Waveform Simulation) |
| `*.bdf` / `*.bsf` | ไฟล์วงจรและสัญลักษณ์ของแต่ละโมดูลย่อย (12bit, 16mux4, Count4, Decode2to4, TestProSelect, LHHL, Multiplex) |
| `assets/` | รูปภาพจำลองวงจรบน Breadboard และภาพการทดสอบบนบอร์ดฮาร์ดแวร์ FPGA จริง |
