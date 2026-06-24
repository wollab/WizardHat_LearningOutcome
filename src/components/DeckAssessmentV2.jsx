import { useMemo, useState } from 'react';
import { getAllCards } from '../lib/scoring.js';
import {
  EXAMPLE_DECKS,
  assessDeck,
  LEARNING_FUNCTION_LABELS_TH,
  getCardsForAssessment,
} from '../lib/assessment.js';
import { SKILL_LABELS_TH, CATEGORY_COLORS } from '../lib/scoring.js';

const CATEGORY_ORDER = ['Conflict', 'Order', 'Reward', 'Ending', 'Twist', 'Asset', 'Strategy', 'Touch', 'Engage'];

function scoreTone(value) {
  if (value >= 2.8) return 'สูงมาก';
  if (value >= 2) return 'สูง';
  if (value >= 1) return 'กลาง';
  return 'ต่ำ';
}

function SignalList({ items, emptyText }) {
  if (!items?.length) {
    return <p className="text-sm text-wizard-ink/60">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.key} className="rounded-xl bg-white/70 px-3 py-2 text-sm flex items-center justify-between gap-3">
          <span>{item.label}</span>
          <span className="text-xs text-wizard-ink/60">{item.value.toFixed(1)} / 3 · {scoreTone(item.value)}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl bg-white border border-wizard-ink/10 p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-wizard-plum">{title}</h3>
        {subtitle && <p className="text-xs text-wizard-ink/60 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function DeckAssessmentV2() {
  const allCards = getAllCards();
  const grouped = useMemo(() => {
    const map = {};
    for (const card of allCards) {
      if (!map[card.category]) map[card.category] = [];
      map[card.category].push(card);
    }
    return map;
  }, [allCards]);

  const [selectedCardNos, setSelectedCardNos] = useState(EXAMPLE_DECKS[0].cardNos);
  const [activeExample, setActiveExample] = useState(EXAMPLE_DECKS[0].id);

  const result = useMemo(() => assessDeck(selectedCardNos), [selectedCardNos]);

  function toggleCard(cardNo) {
    setActiveExample(null);
    setSelectedCardNos((prev) => {
      const value = String(cardNo);
      return prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
    });
  }

  function applyExample(exampleId) {
    const example = EXAMPLE_DECKS.find((item) => item.id === exampleId);
    if (!example) return;
    setActiveExample(example.id);
    setSelectedCardNos(example.cardNos);
  }

  const selectedCards = getCardsForAssessment(selectedCardNos);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs text-wizard-plum border border-wizard-teal/30">
          เวอร์ชัน 2: วิเคราะห์ outcome และคำแนะนำภาษาไทย
        </div>
        <h2 className="text-2xl">เลือกการ์ดแล้วอ่านผลลัพธ์เชิงการเรียนรู้</h2>
        <p className="text-sm text-wizard-ink/70 max-w-3xl">
          หน้านี้เน้นการอ่านชุดการ์ดเป็นภาษาไทย โดยแยกให้เห็น `พฤติกรรมผู้เล่น`, `learning function`,
          `transferable skill`, `จุดบอด`, และ `คำแนะนำการปรับชุดการ์ด` ชัดกว่าหน้าเดิม
        </p>
      </header>

      <SectionCard title="ตัวอย่างพร้อมใช้" subtitle="เลือกชุดตัวอย่างเพื่อดูว่า app อ่านเกมแต่ละแนวอย่างไร">
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_DECKS.map((example) => (
            <button
              key={example.id}
              onClick={() => applyExample(example.id)}
              className={`rounded-full px-3 py-2 text-sm border ${
                activeExample === example.id
                  ? 'bg-wizard-teal text-white border-wizard-teal'
                  : 'bg-white text-wizard-ink border-wizard-ink/10'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <SectionCard title="เลือกการ์ด" subtitle="เลือกเองได้ หรือเริ่มจากชุดตัวอย่างแล้วค่อยปรับ">
          <div className="space-y-4">
            {CATEGORY_ORDER.map((category) => {
              const cards = grouped[category] ?? [];
              if (cards.length === 0) return null;
              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium" style={{ color: CATEGORY_COLORS[category] ?? '#414141' }}>
                    {category}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cards.map((card) => {
                      const active = selectedCardNos.includes(String(card.card_no));
                      return (
                        <button
                          key={card.card_no}
                          onClick={() => toggleCard(card.card_no)}
                          className={`text-left rounded-xl border px-3 py-2 transition ${
                            active
                              ? 'bg-wizard-mist border-wizard-teal'
                              : 'bg-white border-wizard-ink/10'
                          }`}
                        >
                          <div className="text-sm font-medium">{card.nameTh}</div>
                          <div className="text-xs text-wizard-ink/60 mt-1">{card.mechanic_name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="สรุปชุดการ์ด" subtitle={`เลือกอยู่ ${selectedCards.length} ใบ`}>
            <div className="flex flex-wrap gap-2">
              {selectedCards.map((card) => (
                <span
                  key={card.card_no}
                  className="rounded-full px-3 py-1 text-xs border"
                  style={{ borderColor: CATEGORY_COLORS[card.category] ?? '#ccc', color: CATEGORY_COLORS[card.category] ?? '#414141' }}
                >
                  {card.nameTh}
                </span>
              ))}
            </div>
            <div className="rounded-xl bg-wizard-mist/70 p-3 text-sm">
              <div className="font-medium mb-1">ระดับความมั่นใจโดยรวม: {result.confidence.labelTh}</div>
              <ul className="list-disc pl-5 space-y-1 text-wizard-ink/70">
                {result.confidence.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="ผลการเรียนรู้ที่เด่น" subtitle="ชั้นกลางที่ควรอ่านก่อน skill">
            <SignalList items={result.topLearningFunctions} emptyText="ยังไม่พบ learning function เด่นจากชุดการ์ดนี้" />
          </SectionCard>

          <SectionCard title="Transferable skills ที่มีแนวโน้มถูกกระตุ้น" subtitle="อ่านเป็น hypothesis จาก mechanic ไม่ใช่ผลยืนยันสุดท้าย">
            <SignalList items={result.topSkills} emptyText="ยังไม่พบ skill เด่นจากชุดการ์ดนี้" />
          </SectionCard>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <SectionCard title="พฤติกรรมผู้เล่นที่น่าจะเกิดขึ้น" subtitle="ใช้เป็น observation checklist ระหว่าง playtest">
          <ul className="space-y-2">
            {result.actionSummaries.map((item) => (
              <li key={`${item.nameTh}-${item.mechanic}`} className="rounded-xl bg-white/70 p-3 text-sm">
                <div className="font-medium">{item.nameTh}</div>
                <div className="text-xs text-wizard-ink/50 mb-1">{item.mechanic}</div>
                <div>{item.action}</div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Mindset / Pressure / Touch" subtitle="หมวดพิเศษควรอ่านแยกจาก skill score">
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium text-wizard-plum">Reward</div>
              <ul className="list-disc pl-5 text-wizard-ink/70 space-y-1">
                {result.rewardSummary.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-medium text-wizard-plum">Ending</div>
              <ul className="list-disc pl-5 text-wizard-ink/70 space-y-1">
                {result.endingSummary.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-medium text-wizard-plum">Touch</div>
              <ul className="list-disc pl-5 text-wizard-ink/70 space-y-1">
                {result.touchSummary.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="ข้อควรระวังในการตีความ" subtitle="ช่วยกันจับจุดบอดของผลประเมิน">
          <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
            {result.blindSpots.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="คำแนะนำในการปรับชุดการ์ด" subtitle="ระบบเสนอจากโครง mechanic ปัจจุบัน">
          <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
            {result.recommendations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="หมายเหตุการใช้ผลประเมิน" subtitle="ช่วยป้องกันการ overclaim">
          <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
            {result.interpretationNotes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="อ่านผลแบบเร็ว" subtitle="ข้อความสรุปที่พร้อมเอาไปใช้คุยต่อ">
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">ชุดนี้เด่นเรื่อง:</span>{' '}
            {result.topLearningFunctions.map((item) => `${item.label} (${item.value.toFixed(1)})`).join(', ')}
          </p>
          <p>
            <span className="font-medium">ถ้าจะอ้างเป็น transferable skill ควรอ้างว่า:</span>{' '}
            {result.topSkills.map((item) => `${SKILL_LABELS_TH[item.key]} (${item.value.toFixed(1)})`).join(', ')}
          </p>
          <p>
            <span className="font-medium">ข้อเสนอแนะสั้นที่สุด:</span> {result.recommendations[0]}
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
