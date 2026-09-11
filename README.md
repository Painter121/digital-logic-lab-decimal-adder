# Digital Logic Lab — Decimal Adder

มินิโปรเจกต์ออกแบบวงจรบวกเลขฐานสิบ (Decimal Adder) ในรายวิชา Digital Logic โดยใช้โปรแกรม Quartus II

วงจรนี้ออกแบบโดยใช้ Block Diagram File (.bdf) เชื่อมต่อวงจรลอจิกระดับเกตและบล็อกการทำงานต่าง ๆ เข้าด้วยกัน พร้อมจำลองการทำงานและตรวจสอบสัญญาณเวลาด้วย Waveform (.vwf)

![วงจรหลักจากไฟล์ BDF](preview.svg)

## จุดเด่นและโครงสร้างวงจร

- **การประมวลผล:** วงจรบวกเลขฐานสิบ รองรับสัญญาณอินพุต 12-bit
- **โมดูลย่อยภายใน:** ประกอบด้วยวงจรมัลติเพล็กเซอร์ (Multiplexer 16mux4), ตัวนับ (Counter Count4), วงจรถอดรหัส (Decoder Decode2to4) และบล็อกควบคุมสลับโหมด
- **เป้าหมายฮาร์ดแวร์:** กำหนด Pin Assignment สำหรับชิป Altera FPGA (FLEX10K - EPF10K10LC84-4)

## โครงสร้างไฟล์ในโปรเจกต์

- `miniProjectAdder.qpf`: ไฟล์โปรเจกต์หลักของ Quartus II (รองรับ Quartus II 9.0 Web Edition ขึ้นไป)
- `miniProjectAdder.bdf`: บล็อกไดอะแกรมวงจรหลัก (ดับเบิลคลิกบล็อกเพื่อดูบล็อกย่อยข้างใน)
- `miniProjectAdder.vwf`: การจำลองรูปคลื่นสัญญาณ (Simulation Waveform)
- `preview.svg`: แผนผังวงจรหลักสำหรับเปิดดูผ่านเบราว์เซอร์
