import RadarChart from './RadarChart.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import {
  DIMENSION_LABELS_TH,
  DIMENSION_SUBLABELS_TH,
  SKILL_COLORS,
  UNICEF_REFERENCE,
  groupSkillsByDimension,
} from '../lib/scoring.js';

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-wizard-plum">{title}</h3>
      {subtitle ? <p className="text-xs text-wizard-ink/60 mt-1">{subtitle}</p> : null}
    </div>
  );
}

function ScoreBadge({ value, color }) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-9 rounded-full px-2 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {value.toFixed(1)} / 3
    </span>
  );
}

export default function OutcomeSummaryPanel({
  title = 'ภาพรวม Learning Outcome',
  subtitle,
  radarSeries,
  radarImageSrc,
  radarCaption,
  allSkills,
  allLearningFunctions,
  wolReadingLabels,
  confidence,
}) {
  const groupedSkills = groupSkillsByDimension().map((group) => ({
    ...group,
    items: group.skills
      .map((skillKey) => allSkills.find((item) => item.key === skillKey))
      .filter(Boolean),
  }));

  return (
    <section className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-6">
      <SectionTitle title={title} subtitle={subtitle} />

      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
        <div className="rounded-2xl bg-wizard-mist/40 border border-wizard-ink/8 p-4 space-y-3">
          {radarImageSrc ? (
            <img src={radarImageSrc} alt={title} className="w-full max-w-sm mx-auto" />
          ) : (
            <RadarChart series={radarSeries} axisColors={SKILL_COLORS} />
          )}
          <div className="space-y-1 text-center">
            {radarCaption ? <p className="text-xs text-wizard-ink/65">{radarCaption}</p> : null}
            <p className="text-[11px] text-wizard-ink/55">
              <a href={UNICEF_REFERENCE.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {UNICEF_REFERENCE.sourceText}
              </a>{' '}
              · {UNICEF_REFERENCE.shortLabel}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle title="12 Transferable Skills" subtitle="เรียงและจัดสีตามวงล้อ UNICEF เดียวกันทุกหน้า" />
          <div className="grid sm:grid-cols-2 gap-3">
            {groupedSkills.map((group) => (
              <div key={group.key} className="rounded-2xl border border-wizard-ink/10 p-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: group.color }}>
                      {DIMENSION_LABELS_TH[group.key]}
                    </div>
                    <div className="text-[11px] text-wizard-ink/55">{DIMENSION_SUBLABELS_TH[group.key]}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.key} className="rounded-xl bg-white/70 border border-wizard-ink/6 px-3 py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SKILL_COLORS[item.key] }} />
                        <span className="text-sm truncate">{item.label}</span>
                        <InfoTooltip text={item.tooltip} />
                      </div>
                      <ScoreBadge value={item.value} color={SKILL_COLORS[item.key]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="space-y-4">
          <SectionTitle title="WoL Learning Functions" subtitle="อีกเลนส์หนึ่งของ WoL ว่าเกมกำลังฝึกกระบวนการเรียนรู้แบบไหน" />
          <div className="grid sm:grid-cols-2 gap-3">
            {allLearningFunctions.map((item) => (
              <div key={item.key} className="rounded-2xl border border-wizard-ink/10 bg-white/70 px-3 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm truncate">{item.label}</span>
                  <InfoTooltip text={item.tooltip} />
                </div>
                <ScoreBadge value={item.value} color="#2f9b99" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle title="WoL Reading Labels" subtitle="สรุปผลแบบภาษาทำงาน เพื่อใช้คุยงาน ออกแบบ หรือ debrief ต่อได้เร็วขึ้น" />
          <div className="space-y-3">
            {wolReadingLabels.map((item) => (
              <div key={item.key} className="rounded-2xl border border-wizard-ink/10 bg-wizard-mist/35 px-4 py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-wizard-plum">{item.label}</div>
                  <InfoTooltip text={item.tooltip} />
                </div>
                <p className="text-sm leading-6">{item.summary}</p>
              </div>
            ))}
            {confidence ? (
              <div className="rounded-2xl border border-wizard-ink/10 bg-white/70 px-4 py-3">
                <div className="text-xs text-wizard-ink/55 mb-2">เหตุผลประกอบความมั่นใจ</div>
                <ul className="space-y-1 text-sm text-wizard-ink/80">
                  {confidence.reasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
