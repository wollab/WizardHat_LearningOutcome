import { useEffect, useMemo, useState } from 'react';
import OutcomeSummaryPanel from './OutcomeSummaryPanel.jsx';
import { CASE_STUDIES, assessDeck } from '../lib/assessment.js';
import { CATEGORY_COLORS, SKILL_LABELS_TH } from '../lib/scoring.js';
import { getCardImages } from '../lib/api.js';

const CATEGORY_LABELS_TH = {
  Conflict: 'รูปแบบความขัดแย้ง',
  Order: 'ลำดับการเล่น',
  Reward: 'เงื่อนไขชัยชนะ',
  Ending: 'เงื่อนไขจบเกม',
  Twist: 'ตัวพลิกสถานการณ์',
  Asset: 'ทรัพยากรและมูลค่า',
  Strategy: 'กลยุทธ์',
  Touch: 'การทำให้จับต้องได้',
  Engage: 'ปฏิสัมพันธ์',
};

function SectionCard({ title, children, subtitle }) {
  return (
    <section className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-wizard-plum">{title}</h3>
        {subtitle ? <p className="text-sm text-wizard-ink/60 mt-1">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BoxPlaceholder({ title }) {
  return (
    <div className="aspect-[4/5] rounded-2xl border border-dashed border-wizard-ink/20 bg-wizard-mist/70 flex items-center justify-center p-4 text-center">
      <div>
        <div className="text-xs uppercase tracking-wide text-wizard-ink/40 mb-2">Game Box</div>
        <div className="font-semibold text-wizard-ink">{title}</div>
        <div className="text-sm text-wizard-ink/60 mt-2">ยังไม่ใส่ภาพกล่องเกมใน repo</div>
      </div>
    </div>
  );
}

function BoxImage({ title, src, caption }) {
  if (!src) return <BoxPlaceholder title={title} />;

  return (
    <div className="space-y-3">
      <div className="aspect-[4/5] rounded-2xl border border-wizard-ink/10 bg-white overflow-hidden flex items-center justify-center p-4">
        <img src={src} alt={title} className="max-h-full max-w-full object-contain" />
      </div>
      {caption ? <p className="text-xs text-wizard-ink/60 leading-5">{caption}</p> : null}
    </div>
  );
}

function CardChip({ card, imgSrc }) {
  const accent = CATEGORY_COLORS[card.category] ?? '#414141';
  return (
    <div className="rounded-2xl bg-white border p-3 space-y-2 shadow-sm" style={{ borderColor: accent, borderWidth: 3 }}>
      <div
        className="text-[11px] font-semibold inline-flex items-center rounded-full px-2 py-1"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {CATEGORY_LABELS_TH[card.category] ?? card.category}
      </div>
      <div className="aspect-[4/3] rounded-xl bg-wizard-mist/60 overflow-hidden flex items-center justify-center">
        {imgSrc ? (
          <img src={imgSrc} alt={card.nameTh} className="w-full h-full object-contain" crossOrigin="anonymous" />
        ) : (
          <div className="text-xs text-wizard-ink/40 px-3 text-center">ภาพการ์ดยังโหลดไม่สำเร็จ</div>
        )}
      </div>
      <div>
        <div className="font-medium text-sm">{card.nameTh}</div>
        <div className="text-xs text-wizard-ink/60">{card.mechanic_name}</div>
      </div>
    </div>
  );
}

function SkillHighlights({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.key} className="rounded-xl bg-white/70 px-3 py-2 text-sm flex items-center justify-between gap-3">
          <span>{item.label}</span>
          <span className="text-xs text-wizard-ink/60">{item.value.toFixed(1)} / 3</span>
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudyGallery() {
  const studies = useMemo(
    () => CASE_STUDIES.map((study) => ({ ...study, result: assessDeck(study.cardNos) })),
    []
  );

  const [cardImages, setCardImages] = useState({});
  const [activeId, setActiveId] = useState(CASE_STUDIES[0]?.id ?? null);

  useEffect(() => {
    let cancelled = false;
    const cardNos = [...new Set(studies.flatMap((study) => study.cardNos))];
    getCardImages(cardNos)
      .then((images) => {
        if (!cancelled) setCardImages(images);
      })
      .catch(() => {
        // keep text-first fallback if images are unavailable
      });
    return () => {
      cancelled = true;
    };
  }, [studies]);

  const activeStudy = studies.find((study) => study.id === activeId) ?? studies[0];

  if (!activeStudy) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs text-wizard-plum border border-wizard-teal/30">
          กรณีศึกษาและการอ่านผลลัพธ์
        </div>
        <h2 className="text-2xl">ตัวอย่างการประเมิน Learning Outcome ของชุดการ์ด Wizard Hat</h2>
        <p className="text-sm text-wizard-ink/70">
          หน้านี้เป็นกรณีศึกษาแบบอ่านอย่างเดียว เพื่อให้เห็นว่าชุดการ์ดแต่ละแบบให้ผลการเรียนรู้ต่างกันอย่างไร
          โดยตั้งใจให้ใช้คุยงาน อธิบาย method และเปรียบเทียบแนวคิดได้ง่ายกว่าหน้า interactive
        </p>
      </header>

      <div className="rounded-[28px] bg-white/80 border border-wizard-ink/10 p-3 md:p-4">
        <div className="grid md:grid-cols-3 gap-3">
          {studies.map((study) => {
            const isActive = study.id === activeStudy.id;
            return (
              <button
                key={study.id}
                onClick={() => setActiveId(study.id)}
                className={`text-left rounded-2xl border p-4 transition ${
                  isActive
                    ? 'bg-wizard-plum text-white border-wizard-plum shadow-sm'
                    : 'bg-white text-wizard-ink border-wizard-ink/10 hover:border-wizard-teal/50'
                }`}
              >
                <div className="text-sm font-semibold">{study.tabLabel}</div>
                <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-wizard-ink/55'}`}>{study.domain}</div>
                <div className={`text-xs mt-3 leading-5 ${isActive ? 'text-white/90' : 'text-wizard-ink/70'}`}>
                  {study.evidenceSummary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <section className="rounded-[28px] bg-white/80 border border-wizard-ink/10 p-6 space-y-6">
        <div className="grid lg:grid-cols-[0.65fr_1.35fr] gap-6 items-start">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-wizard-plum font-semibold">Selected Case</div>
              <h3 className="text-2xl mt-1">{activeStudy.title}</h3>
              <p className="text-sm text-wizard-ink/60 mt-1">{activeStudy.subtitle}</p>
            </div>
            <BoxImage title={activeStudy.gameNameTh} src={activeStudy.boxImage} caption={activeStudy.imageCaption} />
          </div>

          <div className="space-y-4">
            <SectionCard title="เหตุผลที่เลือกเคสนี้ขึ้นหน้า public">
              <p className="text-sm leading-6">{activeStudy.publicReason}</p>
              <p className="text-sm text-wizard-ink/70 mt-2">{activeStudy.evidenceSummary}</p>
            </SectionCard>
            <SectionCard title="โจทย์การเรียนรู้">
              <p className="text-sm leading-6">{activeStudy.learningGoal}</p>
            </SectionCard>
            <SectionCard title="ทำไมกรณีนี้น่าสนใจ">
              <p className="text-sm leading-6">{activeStudy.whyThisCase}</p>
              <p className="text-sm text-wizard-ink/70">{activeStudy.keyUse}</p>
            </SectionCard>
          </div>
        </div>

        <OutcomeSummaryPanel
          title="ภาพรวม Learning Outcome"
          subtitle="ใช้วงล้อ UNICEF เป็นแกนหลัก และอ่านเสริมด้วย learning functions กับ WoL labels"
          radarSeries={[{ values: activeStudy.result.skillProfile, color: '#50C2C0', fillOpacity: 0.45, label: 'ผลลัพธ์ที่คาด' }]}
          radarCaption="พื้นที่สีเขียวแสดงระดับผลลัพธ์ที่ชุดการ์ดนี้มีแนวโน้มกระตุ้น"
          allSkills={activeStudy.result.allSkills}
          allLearningFunctions={activeStudy.result.allLearningFunctions}
          wolReadingLabels={activeStudy.result.wolReadingLabels}
          confidence={activeStudy.result.confidence}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <SectionCard title="พฤติกรรมผู้เล่นที่น่าจะเกิดขึ้น">
            <ul className="space-y-2 text-sm text-wizard-ink/80">
              {activeStudy.result.actionSummaries.slice(0, 5).map((item) => (
                <li key={`${activeStudy.id}-${item.nameTh}`} className="rounded-xl bg-white/70 p-3">
                  <div className="font-medium">{item.nameTh}</div>
                  <div className="text-xs text-wizard-ink/55 mb-1">{item.mechanic}</div>
                  <div>{item.action}</div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="ภาพที่ยังควรเพิ่ม">
            <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
              {activeStudy.missingAssets.map((note) => (
                <li key={`${activeStudy.id}-${note}`}>{note}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="คำแนะนำและข้อควรระวัง">
            <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
              {activeStudy.result.blindSpots.map((note) => (
                <li key={`${activeStudy.id}-${note}`}>{note}</li>
              ))}
            </ul>
            <div className="pt-3 border-t border-wizard-ink/10">
              <div className="text-sm font-semibold text-wizard-plum mb-2">คำแนะนำต่อยอด</div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-wizard-ink/80">
                {activeStudy.result.recommendations.map((note) => (
                  <li key={`${activeStudy.id}-${note}`}>{note}</li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="กลไกเด่นของกรณีศึกษา" subtitle="ตัวอย่างการ์ดที่เป็นหัวใจของการอ่านผลลัพธ์">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {activeStudy.result.selectedCards.slice(0, 8).map((card) => (
              <CardChip key={`${activeStudy.id}-${card.card_no}`} card={card} imgSrc={cardImages[card.card_no]} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="สรุปสั้นสำหรับใช้คุยงาน">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">จุดเด่น:</span>{' '}
              {activeStudy.result.topLearningFunctions.map((item) => item.label).join(', ')}
            </p>
            <p>
              <span className="font-medium">ทักษะที่เด่น:</span>{' '}
              {activeStudy.result.topSkills.map((item) => SKILL_LABELS_TH[item.key]).join(', ')}
            </p>
            <p>
              <span className="font-medium">คำแนะนำสั้นที่สุด:</span> {activeStudy.result.recommendations[0]}
            </p>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
