import { SKILL_KEYS, SKILL_LABELS_TH } from '../lib/scoring.js';

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 36;
const MAX_LEVEL = 3;

function pointFor(index, value) {
  const angle = (Math.PI * 2 * index) / SKILL_KEYS.length - Math.PI / 2;
  const r = (value / MAX_LEVEL) * MAX_RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(values) {
  return SKILL_KEYS.map((key, i) => pointFor(i, values[key] ?? 0).join(',')).join(' ');
}

// series: [{ values: {skill: level}, color: '#hex', fillOpacity: 0-1, label }]
export default function RadarChart({ series }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-xs mx-auto">
      <rect x="0" y="0" width={SIZE} height={SIZE} fill="#ffffff" />

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

      {SKILL_KEYS.map((key, i) => {
        const [x, y] = pointFor(i, MAX_LEVEL + 0.55);
        const align = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
        return (
          <text key={key} x={x} y={y} fontSize="9" textAnchor={align} dominantBaseline="middle" fill="#414141">
            {SKILL_LABELS_TH[key]}
          </text>
        );
      })}
    </svg>
  );
}
