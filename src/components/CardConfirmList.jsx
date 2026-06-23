import { useMemo, useState } from 'react';
import { getAllCards } from '../lib/scoring.js';

const CATEGORY_ORDER = ['Conflict', 'Order', 'Ending', 'Reward', 'Twist', 'Asset', 'Strategy', 'Touch', 'Engage'];

export default function CardConfirmList({ detectedCardNos, onConfirm }) {
  const allCards = getAllCards();
  const [selected, setSelected] = useState(new Set(detectedCardNos.map(String)));

  const grouped = useMemo(() => {
    const g = {};
    for (const c of allCards) {
      if (!g[c.category]) g[c.category] = [];
      g[c.category].push(c);
    }
    return g;
  }, [allCards]);

  const categories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  function toggle(cardNo) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cardNo)) next.delete(cardNo);
      else next.add(cardNo);
      return next;
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl mb-1">ยืนยันการ์ดที่เลือก</h2>
      <p className="text-sm text-wizard-ink/70 mb-4">
        {detectedCardNos.length > 0
          ? 'ระบบอ่านการ์ดจากรูปไว้ให้แล้ว — ตรวจสอบและแก้ไขได้ก่อนดูผล'
          : 'เลือกการ์ดที่ใช้ในชุดนี้จากรายการด้านล่าง'}
      </p>

      <div className="space-y-4 mb-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-wizard-plum mb-2">{cat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {grouped[cat].map((c) => (
                <label
                  key={c.card_no}
                  className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/60 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(c.card_no)}
                    onChange={() => toggle(c.card_no)}
                  />
                  <span className="text-sm">
                    {c.nameTh} <span className="text-xs text-wizard-ink/50">({c.mechanic_name})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onConfirm(Array.from(selected))}
        disabled={selected.size === 0}
        className="w-full py-3 rounded-lg bg-wizard-teal text-white disabled:opacity-50"
      >
        ดูผลประเมิน ({selected.size} การ์ด)
      </button>
    </div>
  );
}
