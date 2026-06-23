import { useState } from 'react';
import { SKILL_KEYS, SKILL_LABELS_TH } from '../lib/scoring.js';
import RadarChart from './RadarChart.jsx';

export default function TargetProfileForm({ onSubmit }) {
  const [targets, setTargets] = useState(() =>
    Object.fromEntries(SKILL_KEYS.map((k) => [k, 0]))
  );

  function setLevel(key, level) {
    setTargets((prev) => ({ ...prev, [key]: level }));
  }

  const hasAnyTarget = Object.values(targets).some((v) => v > 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl mb-1">ตั้งเป้าหมาย Learning Outcome</h2>
      <p className="text-sm text-wizard-ink/70 mb-4">
        เติมค่าพลังลงกราฟแมงมุมตามที่โจทย์ต้องการ แล้วกด "ดูซิว่าได้อะไร" — ระบบจะสุ่มชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุดมาให้
      </p>

      <div className="grid sm:grid-cols-2 gap-6 items-center mb-6">
        <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4">
          <RadarChart series={[{ values: targets, color: '#FEC566', fillOpacity: 0.45 }]} />
        </div>

        <div className="space-y-2">
          {SKILL_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-sm">{SKILL_LABELS_TH[key]}</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(key, lvl)}
                    className={`w-7 h-7 rounded text-xs ${
                      targets[key] === lvl ? 'bg-wizard-teal text-white' : 'bg-white/70 text-wizard-ink/60'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit(targets)}
        disabled={!hasAnyTarget}
        className="w-full py-3 rounded-lg bg-wizard-gold text-wizard-ink font-semibold disabled:opacity-50"
      >
        ดูซิว่าได้อะไร
      </button>
    </div>
  );
}
