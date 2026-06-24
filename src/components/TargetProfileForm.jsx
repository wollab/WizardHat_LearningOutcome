import { useState } from 'react';
import { SKILL_KEYS, SKILL_LABELS_TH, SKILL_COLORS, DURATION_OPTIONS } from '../lib/scoring.js';
import RadarChart from './RadarChart.jsx';

const DEFAULT_DURATION_IDX = 1; // 30–40 นาที / 3 ใบ TASTE

export default function TargetProfileForm({ onSubmit, initialTargets, initialDurationIdx }) {
  const [durationIdx, setDurationIdx] = useState(initialDurationIdx ?? DEFAULT_DURATION_IDX);
  const duration = DURATION_OPTIONS[durationIdx];

  const [targets, setTargets] = useState(() =>
    initialTargets ?? Object.fromEntries(SKILL_KEYS.map((k) => [k, 0]))
  );

  const pointsUsed = Object.values(targets).reduce((sum, v) => sum + v, 0);

  function setLevel(key, level) {
    setTargets((prev) => {
      const used = Object.values(prev).reduce((sum, v) => sum + v, 0);
      const nextUsed = used - prev[key] + level;
      if (nextUsed > duration.pointBudget) return prev;
      return { ...prev, [key]: level };
    });
  }

  // Switching to a shorter duration can leave a target over the new, smaller
  // budget — scale every level down proportionally so it's never invalid.
  function selectDuration(idx) {
    const next = DURATION_OPTIONS[idx];
    setDurationIdx(idx);
    setTargets((prev) => {
      const used = Object.values(prev).reduce((sum, v) => sum + v, 0);
      if (used <= next.pointBudget) return prev;
      const scale = next.pointBudget / used;
      return Object.fromEntries(SKILL_KEYS.map((k) => [k, Math.floor(prev[k] * scale)]));
    });
  }

  const hasAnyTarget = Object.values(targets).some((v) => v > 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl mb-1">ตั้งเป้าหมาย Learning Outcome</h2>
      <p className="text-sm text-wizard-ink/70 mb-4">
        เติมค่าพลังลงกราฟแมงมุมตามที่โจทย์ต้องการ แล้วกด "ดูซิว่าได้อะไร" — ระบบจะสุ่มชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุดมาให้
      </p>

      <div className="mb-5">
        <p className="text-sm font-medium mb-2">อยากให้เกมเล่นนานแค่ไหน?</p>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => selectDuration(idx)}
              className={`flex-1 py-2 rounded-lg text-sm ${
                idx === durationIdx ? 'bg-wizard-teal text-white' : 'bg-white/70 text-wizard-ink/60'
              }`}
            >
              {d.label}
              <div className="text-[10px] opacity-80">{d.tasteCount} TASTE</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-center mb-4">
        <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4">
          <RadarChart
            series={[{ values: targets, color: '#74c0fc', fillOpacity: 0.4 }]}
            axisColors={SKILL_COLORS}
          />
        </div>

        <div className="space-y-2">
          {SKILL_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-sm flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SKILL_COLORS[key] }}
                />
                {SKILL_LABELS_TH[key]}
              </span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((lvl) => {
                  const wouldExceed = pointsUsed - targets[key] + lvl > duration.pointBudget;
                  const isActive = targets[key] === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(key, lvl)}
                      disabled={wouldExceed && !isActive}
                      className="w-7 h-7 rounded text-xs disabled:opacity-30"
                      style={
                        isActive
                          ? { backgroundColor: SKILL_COLORS[key], color: '#fff' }
                          : { backgroundColor: 'rgba(255,255,255,0.7)', color: '#41414199' }
                      }
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-center text-wizard-ink/60 mb-4">
        แต้มที่ใช้: <span className="font-semibold text-wizard-plum">{pointsUsed}</span> / {duration.pointBudget}
      </p>

      <button
        onClick={() => onSubmit({ targets, tasteCount: duration.tasteCount })}
        disabled={!hasAnyTarget}
        className="w-full py-3 rounded-lg bg-wizard-gold text-wizard-ink font-semibold disabled:opacity-50"
      >
        ดูซิว่าได้อะไร
      </button>
    </div>
  );
}
