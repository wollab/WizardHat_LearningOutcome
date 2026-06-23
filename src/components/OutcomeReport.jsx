import { SKILL_KEYS, SKILL_LABELS_TH } from '../lib/scoring.js';

const LEVEL_WIDTH = ['w-0', 'w-1/3', 'w-2/3', 'w-full'];

function SkillBar({ achieved, target }) {
  return (
    <div className="relative h-3 bg-white/70 rounded-full overflow-hidden">
      <div className={`h-full bg-wizard-teal rounded-full ${LEVEL_WIDTH[achieved]}`} />
      {target != null && target > 0 && (
        <div
          className="absolute top-0 h-full w-0.5 bg-wizard-gold"
          style={{ left: `${(target / 3) * 100}%` }}
        />
      )}
    </div>
  );
}

export default function OutcomeReport({ result, onRestart }) {
  const { selected, skills, demandsByCategory } = result;
  const hasTarget = SKILL_KEYS.some((k) => skills[k].target != null);

  const strengths = SKILL_KEYS.filter((k) => {
    const s = skills[k];
    return s.target != null ? s.achieved >= s.target && s.target > 0 : s.achieved >= 2;
  });
  const gaps = SKILL_KEYS.filter((k) => skills[k].target != null && skills[k].gap > 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl mb-1">ผลประเมิน Learning Outcome</h2>
      <p className="text-sm text-wizard-ink/70 mb-6">
        จากชุดการ์ด {selected.length} ใบ: {selected.map((c) => c.nameTh).join(', ')}
      </p>

      <div className="space-y-3 mb-6">
        {SKILL_KEYS.map((key) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span>{SKILL_LABELS_TH[key]}</span>
              <span className="text-wizard-ink/50">
                {skills[key].achieved}/3{skills[key].target != null ? ` (เป้า ${skills[key].target})` : ''}
              </span>
            </div>
            <SkillBar achieved={skills[key].achieved} target={skills[key].target} />
          </div>
        ))}
      </div>

      {strengths.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-wizard-plum mb-1">จุดเด่น</h3>
          <p className="text-sm">{strengths.map((k) => SKILL_LABELS_TH[k]).join(', ')}</p>
        </div>
      )}

      {hasTarget && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-wizard-plum mb-1">จุดที่ยังไม่ครอบคลุมเป้าหมาย</h3>
          <p className="text-sm">
            {gaps.length > 0 ? gaps.map((k) => SKILL_LABELS_TH[k]).join(', ') : 'ไม่มี — ชุดการ์ดนี้ครอบคลุมเป้าหมายที่ตั้งไว้ทั้งหมด'}
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-wizard-plum">รายละเอียดตามการ์ด (สำหรับวิทยากร)</h3>
        {Object.entries(demandsByCategory).map(([cat, items]) => (
          <div key={cat}>
            <h4 className="text-sm font-medium mb-1">{cat}</h4>
            <ul className="text-sm space-y-1">
              {items.map((it) => (
                <li key={it.card_no} className="bg-white/60 rounded p-2">
                  <span className="font-medium">{it.nameTh}</span> ({it.mechanic_name})
                  <div className="text-xs text-wizard-ink/70 mt-0.5">
                    cognitive: {it.demands.cognitive || '—'} · social: {it.demands.social || '—'} · emotional: {it.demands.emotional || '—'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="w-full py-3 rounded-lg border border-wizard-teal text-wizard-plum">
        เริ่มใหม่
      </button>
    </div>
  );
}
