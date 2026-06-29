import { useState } from 'react';
import {
  DURATION_OPTIONS,
  SKILL_COLORS,
  SKILL_KEYS,
  SKILL_LABELS_TH,
  SKILL_TOOLTIPS_TH,
  UNICEF_REFERENCE,
  groupSkillsByDimension,
} from '../lib/scoring.js';
import RadarChart from './RadarChart.jsx';
import InfoTooltip from './InfoTooltip.jsx';

const DEFAULT_DURATION_IDX = 1; // 30–40 นาที / 3 ใบ TASTE

export default function TargetProfileForm({ onSubmit, initialTargets, initialDurationIdx, initialIssue = '' }) {
  const [durationIdx, setDurationIdx] = useState(initialDurationIdx ?? DEFAULT_DURATION_IDX);
  const duration = DURATION_OPTIONS[durationIdx];

  const [targets, setTargets] = useState(() =>
    initialTargets ?? Object.fromEntries(SKILL_KEYS.map((k) => [k, 0]))
  );
  const [issue, setIssue] = useState(initialIssue);

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
  const groupedSkills = groupSkillsByDimension();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl mb-1">ตั้งเป้าหมาย Learning Outcome</h2>
      <p className="text-sm text-wizard-ink/70 mb-4">
        เติมค่าพลังลงกราฟแมงมุมตามที่โจทย์ต้องการ แล้วกด "ดูซิว่าได้อะไร" — ระบบจะสุ่มชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุดมาให้
      </p>

      <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4 mb-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-wizard-plum">กราฟเป้าหมาย</h3>
          <div className="text-xs text-wizard-ink/55">
            แต้มที่ใช้ <span className="font-semibold text-wizard-plum">{pointsUsed}</span> / {duration.pointBudget}
          </div>
        </div>
        <div className="max-w-xl mx-auto">
          <RadarChart
            series={[{ values: targets, color: '#74c0fc', fillOpacity: 0.4 }]}
            axisColors={SKILL_COLORS}
            className="w-full max-w-xl mx-auto"
            labelFontSize={11.5}
            multilineLabels
          />
        </div>
        <p className="text-[11px] text-center text-wizard-ink/55 mt-3">
          <a href={UNICEF_REFERENCE.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {UNICEF_REFERENCE.sourceText}
          </a>{' '}
          · {UNICEF_REFERENCE.shortLabel}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4 mb-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-wizard-plum mb-1">เลือกระยะเวลา</h3>
          <p className="text-xs text-wizard-ink/60">ยิ่งเวลาเล่นยาว ระบบยิ่งอนุญาตให้ตั้งเป้าทักษะรวมได้มากขึ้น</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => selectDuration(idx)}
              className={`rounded-lg px-2 py-3 text-sm ${
                idx === durationIdx ? 'bg-wizard-teal text-white' : 'bg-wizard-mist/45 text-wizard-ink/70'
              }`}
            >
              <div>{d.label}</div>
              <div className="text-[10px] opacity-80 mt-1">{d.tasteCount} TASTE</div>
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-wizard-mist/45 border border-wizard-teal/15 px-3 py-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-wizard-ink/70">limit คะแนนที่เลือกได้</span>
          <span className="font-semibold text-wizard-plum">{duration.pointBudget} คะแนน</span>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <h3 className="text-sm font-semibold text-wizard-plum">หัวข้อการเลือกต่าง ๆ</h3>
        <div className="space-y-3">
          {groupedSkills.map((group) => (
            <div key={group.key} className="rounded-2xl bg-white border border-wizard-ink/10 p-3 space-y-2">
              <div className="text-sm font-semibold" style={{ color: group.color }}>
                {group.label}
              </div>
              <div className="space-y-2">
                {group.skills.map((key) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-sm flex items-center gap-2 min-w-0">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: SKILL_COLORS[key] }}
                      />
                      <span className="truncate">{SKILL_LABELS_TH[key]}</span>
                      <InfoTooltip text={SKILL_TOOLTIPS_TH[key]} />
                    </span>
                    <div className="flex gap-1 shrink-0">
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
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4 mb-5">
        <label htmlFor="issue-input" className="block text-sm font-semibold text-wizard-plum mb-2">
          ประเด็นหรือหัวข้อที่อยากใช้กับเกม (ไม่บังคับ)
        </label>
        <textarea
          id="issue-input"
          value={issue}
          onChange={(event) => setIssue(event.target.value)}
          rows={3}
          placeholder="เช่น การเงินในชีวิตจริง, สิทธิแรงงาน, ความหลากหลายทางเพศ, civic participation"
          className="w-full rounded-xl border border-wizard-ink/10 bg-white px-3 py-3 text-sm text-wizard-ink placeholder:text-wizard-ink/35 focus:outline-none focus:ring-2 focus:ring-wizard-teal/35"
        />
      </div>

      <button
        onClick={() => onSubmit({ targets, tasteCount: duration.tasteCount, issue: issue.trim() })}
        disabled={!hasAnyTarget}
        className="w-full py-3 rounded-lg bg-wizard-gold text-wizard-ink font-semibold disabled:opacity-50"
      >
        ดูซิว่าได้อะไร
      </button>

      <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4 mt-5">
        <h3 className="text-sm font-semibold text-wizard-plum mb-2">หมายเหตุ: ความหมายคะแนน 0–3</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-wizard-ink/75">
          <div><span className="font-medium">0</span> = ไม่ได้เน้นหรือแทบไม่เกิด</div>
          <div><span className="font-medium">1</span> = แตะเล็กน้อย ใช้ได้แต่ยังไม่ใช่แกนหลัก</div>
          <div><span className="font-medium">2</span> = เกิดค่อนข้างชัด มีผลต่อการเล่น</div>
          <div><span className="font-medium">3</span> = เป็นหัวใจของประสบการณ์และส่งผลสูงต่อ outcome</div>
        </div>
      </div>
    </div>
  );
}
