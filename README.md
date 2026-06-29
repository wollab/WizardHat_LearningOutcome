# Wizard Hat Learning Outcome

เว็บต้นแบบสำหรับอ่านและประเมินว่า “ชุดการ์ด Wizard Hat” มีแนวโน้มกระตุ้นการเรียนรู้ด้านใดบ้าง โดยใช้ 2 มุมหลักร่วมกัน

- `UNICEF 12 Transferable Skills`
- `WoL Learning Functions / WoL Reading Labels`

ลิงก์ใช้งาน:

- Public site: https://wollab.github.io/WizardHat_LearningOutcome/

## หน้าใช้งานหลัก

1. `ตั้งเป้าหมายแล้วหา deck`
   ใช้กำหนด outcome ที่อยากได้ แล้วให้ระบบสุ่มชุดการ์ดที่ใกล้เคียงที่สุด

2. `กรณีศึกษา`
   ใช้อ่านตัวอย่างเกมของ WoL แบบไม่ต้องกด interact เพื่ออธิบาย method, เปรียบเทียบเคส, และคุยงานได้ง่ายขึ้น

## หลักการสำคัญของการอ่านผล

เราไม่ map จาก “ชื่อ mechanic -> skill” ตรง ๆ  
แต่ใช้ตรรกะประมาณนี้:

`การ์ด / mechanic -> ผู้เล่นต้องทำอะไร -> พฤติกรรมที่สังเกตได้ -> ตีความเป็น learning outcome`

ดังนั้นผลลัพธ์ในระบบนี้ควรอ่านเป็น:

- `interpretation layer`
- `design support tool`
- `conversation tool for game design / debrief / proposal`

ไม่ควรอ่านเป็น:

- ผลวิจัยยืนยันสำเร็จรูป
- หลักฐาน impact แทน playtest หรือ pre-post study

## แนวทางการสื่อสารของหน้า public

หน้า public ของโปรเจกต์นี้ตั้งใจให้:

- ใช้ภาษาไทยเป็นหลัก
- อ่านง่ายสำหรับทีมออกแบบ ผู้สอน พาร์ตเนอร์ และผู้สนใจทั่วไป
- ลดข้อความ internal ที่ยังไม่ควรโชว์บนเว็บ เช่นรายการ “ภาพที่ยังควรเพิ่ม”

## สถานะปัจจุบัน

- หน้า case study ถูกปรับให้ใช้คำอธิบายพฤติกรรมผู้เล่นเป็นภาษาไทยมากขึ้น
- หน้า export กำลังถูกปรับให้เหมาะกับการแชร์เป็นภาพสรุป

## Dev

```bash
npm install
npm run build
npm run dev
```

## Deploy

โปรเจกต์นี้ deploy ผ่าน GitHub Pages จาก branch `master`

- workflow: `.github/workflows/deploy-pages.yml`

