import { SKILL_KEYS, SKILL_LABELS_TH } from '../lib/scoring.js';

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 36;
const MAX_LEVEL = 3;
const LABEL_LINES_TH = {
  problem_solving: ['การแก้', 'ปัญหา'],
  creativity: ['ความคิด', 'สร้างสรรค์'],
  critical_thinking: ['การคิด', 'วิเคราะห์'],
  communication: ['การ', 'สื่อสาร'],
  collaboration: ['การทำงาน', 'ร่วมกัน'],
  empathy: ['ความเข้า', 'ใจผู้อื่น'],
  self_management: ['การจัดการ', 'ตนเอง'],
  resilience: ['ความยืดหยุ่น', '/อดทน'],
  negotiation: ['การ', 'ต่อรอง'],
  decision_making: ['การตัดสิน', 'ใจ'],
  respect_for_diversity: ['การเคารพ', 'ความหลากหลาย'],
  participation: ['การมี', 'ส่วนร่วม'],
};

function pointFor(index, value) {
  const angle = (Math.PI * 2 * index) / SKILL_KEYS.length - Math.PI / 2;
  const r = (value / MAX_LEVEL) * MAX_RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(values) {
  return SKILL_KEYS.map((key, i) => pointFor(i, values[key] ?? 0).join(',')).join(' ');
}

// series: [{ values: {skill: level}, color: '#hex', fillOpacity: 0-1, label }]
// Long Thai skill labels ("การเคารพความหลากหลาย") are wider than the 36px ring
// margin and get clipped at the viewBox edge — pad the visible canvas well
// beyond the 0–SIZE drawing area so label text always has room to extend.
const PAD = 78;

// axisColors: optional { skillKey: '#hex' } — colors the vertex dot + label
// per skill instead of the uniform ink gray (used on the target-setting page
// so each axis is easy to pick out; omitted on the result page where
// gold/teal already carry the target-vs-achieved meaning).
export default function RadarChart({
  series,
  axisColors,
  className = 'w-full max-w-xs mx-auto',
  labelFontSize = 8.5,
  multilineLabels = false,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${-PAD} ${-PAD} ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}
      className={className}
    >
      <rect x={-PAD} y={-PAD} width={SIZE + PAD * 2} height={SIZE + PAD * 2} fill="#ffffff" />

      {[1, 2, 3].map((lvl) => (
        <polygon
          key={lvl}
          points={polygonPoints(Object.fromEntries(SKILL_KEYS.map((k) => [k, lvl])))}
          fill="none"
          stroke="#414141"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      ))}

      {SKILL_KEYS.map((key, i) => {
        const [x, y] = pointFor(i, MAX_LEVEL);
        return (
          <line key={key} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#414141" strokeOpacity={0.2} strokeWidth={1} />
        );
      })}

      {series.map((s, idx) => (
        <polygon
          key={idx}
          points={polygonPoints(s.values)}
          fill={s.color}
          fillOpacity={s.fillOpacity ?? 0.25}
          stroke={s.color}
          strokeWidth={2}
        />
      ))}

      {axisColors &&
        SKILL_KEYS.map((key, i) => {
          const [x, y] = pointFor(i, series[0]?.values[key] ?? 0);
          return <circle key={key} cx={x} cy={y} r={3.5} fill={axisColors[key]} />;
        })}

      {SKILL_KEYS.map((key, i) => {
        const [x, y] = pointFor(i, MAX_LEVEL + 0.55);
        const align = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
        const lines = multilineLabels ? LABEL_LINES_TH[key] ?? [SKILL_LABELS_TH[key]] : [SKILL_LABELS_TH[key]];
        const lineHeight = labelFontSize + 1.5;
        const startDy = lines.length > 1 ? -((lines.length - 1) * lineHeight) / 2 : 0;
        return (
          <text
            key={key}
            x={x}
            y={y}
            fontSize={labelFontSize}
            textAnchor={align}
            dominantBaseline="middle"
            fill={axisColors ? axisColors[key] : '#414141'}
          >
            {lines.map((line, index) => (
              <tspan key={`${key}-${index}`} x={x} dy={index === 0 ? startDy : lineHeight}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
