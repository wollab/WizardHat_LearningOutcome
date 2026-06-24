import OutcomeSummaryPanel from './OutcomeSummaryPanel.jsx';

function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl bg-white border border-wizard-ink/10 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-wizard-plum">{title}</h3>
      {children}
    </section>
  );
}

export default function OutcomeReport({ result, onRestart }) {
  const { selectedCards, skillProfile } = result;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-5">
      <div>
        <h2 className="text-xl mb-1">ผลประเมิน Learning Outcome</h2>
        <p className="text-sm text-wizard-ink/70">
          จากชุดการ์ด {selectedCards.length} ใบ: {selectedCards.map((card) => card.nameTh).join(', ')}
        </p>
      </div>

      <OutcomeSummaryPanel
        title="ภาพรวมผลลัพธ์จากชุดการ์ดที่ตรวจพบ"
        subtitle="ใช้มุมมองเดียวกับหน้ากรณีศึกษาและหน้าหา deck เพื่อให้อ่านผลต่อเนื่องกันได้"
        radarSeries={[{ values: skillProfile, color: '#50C2C0', fillOpacity: 0.45, label: 'ผลลัพธ์ที่คาด' }]}
        radarCaption="พื้นที่สีเขียวแสดงระดับผลลัพธ์ที่ชุดการ์ดนี้มีแนวโน้มกระตุ้น"
        allSkills={result.allSkills}
        allLearningFunctions={result.allLearningFunctions}
        wolReadingLabels={result.wolReadingLabels}
        confidence={result.confidence}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="พฤติกรรมผู้เล่นที่น่าจะเกิดขึ้น">
          <ul className="space-y-2 text-sm text-wizard-ink/80">
            {result.actionSummaries.slice(0, 6).map((item) => (
              <li key={`${item.nameTh}-${item.mechanic}`} className="rounded-xl bg-white/70 p-3">
                <div className="font-medium">{item.nameTh}</div>
                <div className="text-xs text-wizard-ink/55 mb-1">{item.mechanic}</div>
                <div>{item.action}</div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="คำแนะนำและข้อควรระวัง">
          <div>
            <div className="text-sm font-semibold text-wizard-plum mb-2">จุดบอดที่ควรเฝ้าดู</div>
            <ul className="space-y-1 text-sm text-wizard-ink/80">
              {result.blindSpots.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
          <div className="pt-3 border-t border-wizard-ink/10">
            <div className="text-sm font-semibold text-wizard-plum mb-2">คำแนะนำต่อยอด</div>
            <ul className="space-y-1 text-sm text-wizard-ink/80">
              {result.recommendations.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>

      <button onClick={onRestart} className="w-full py-3 rounded-lg border border-wizard-teal text-wizard-plum">
        เริ่มใหม่
      </button>
    </div>
  );
}
