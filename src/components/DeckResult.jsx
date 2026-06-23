import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { toPng } from 'html-to-image';
import RadarChart from './RadarChart.jsx';
import { SKILL_KEYS, SKILL_LABELS_TH } from '../lib/scoring.js';
import { getCardImages } from '../lib/api.js';

// html-to-image rasterizes its target via an SVG wrapper; a *nested* inline
// <svg> (our radar chart) inside that wrapper hangs in some browsers instead
// of failing cleanly. Rendering the radar to a static <img> data URI for the
// exported view sidesteps the nested-SVG case entirely.
function svgToDataUri(svgElement) {
  const markup = renderToStaticMarkup(svgElement);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(markup)))}`;
}

const CORE_CATEGORIES = ['Conflict', 'Order', 'Reward', 'Ending'];

export default function DeckResult({ result, target, onRerun, onRestart }) {
  const { selected, skills } = result;
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const coreCards = selected.filter((c) => CORE_CATEGORIES.includes(c.category));
  const tasteCards = selected.filter((c) => !CORE_CATEGORIES.includes(c.category));

  const gaps = SKILL_KEYS.filter((k) => (target[k] ?? 0) > skills[k].achieved);

  const caveats = selected.filter(
    (c) => c.skill_confidence === 'low' || c.skill_confidence === 'medium'
  );

  const radarSeries = [
    { values: target, color: '#FEC566', fillOpacity: 0, label: 'เป้าหมาย' },
    {
      values: Object.fromEntries(SKILL_KEYS.map((k) => [k, skills[k].achieved])),
      color: '#50C2C0',
      fillOpacity: 0.45,
      label: 'ได้จริง',
    },
  ];
  const radarImgSrc = svgToDataUri(<RadarChart series={radarSeries} />);

  const [cardImages, setCardImages] = useState({});
  useEffect(() => {
    let cancelled = false;
    getCardImages(selected.map((c) => c.card_no))
      .then((byId) => {
        if (!cancelled) setCardImages(byId);
      })
      .catch(() => {
        // images are decoration here — a failed fetch just leaves the
        // text-only card tile, never blocks seeing the result.
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const [exportError, setExportError] = useState(false);

  async function exportPng() {
    if (!cardRef.current || exporting) return;
    setExporting(true);
    setExportError(false);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      // skipFonts: the Google Fonts <link> isn't crossorigin, so html-to-image
      // can't read its cssRules to inline them — that hangs instead of failing
      // cleanly. Fonts are already loaded in the page (awaited above), so the
      // canvas render picks them up regardless; we just skip the broken inlining step.
      // A hard timeout guards against any other environment where the
      // image-decode step inside html-to-image never resolves.
      const dataUrl = await Promise.race([
        toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#d9f1f0', cacheBust: true, skipFonts: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('export_timeout')), 8000)),
      ]);
      const a = document.createElement('a');
      a.download = 'wizard-hat-learning-outcome.png';
      a.href = dataUrl;
      a.click();
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div ref={cardRef} className="rounded-2xl bg-wizard-mist p-6 space-y-5">
        <h2 className="text-xl">ชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุด</h2>

        <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4">
          <img src={radarImgSrc} alt="ผลเทียบ learning outcome" className="w-full max-w-xs mx-auto" />
          <p className="text-center text-xs text-wizard-ink/60 mt-1">เส้นทอง = เป้าหมาย · พื้นเขียว = ชุดการ์ดนี้ให้จริง</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-wizard-plum mb-2">CORE (4 ใบ)</h3>
          <div className="grid grid-cols-2 gap-3">
            {coreCards.map((c) => (
              <div key={c.card_no} className="bg-white/70 rounded-lg p-2 text-sm flex flex-col items-center">
                {cardImages[c.card_no] && (
                  <img
                    src={cardImages[c.card_no]}
                    alt={c.nameTh}
                    crossOrigin="anonymous"
                    className="w-full h-40 object-contain bg-white rounded mb-2"
                  />
                )}
                <span className="text-xs text-wizard-ink/50 self-start">{c.category}</span>
                <div className="font-medium self-start">{c.nameTh}</div>
                <div className="text-xs text-wizard-ink/60 self-start">{c.mechanic_name}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-wizard-plum mb-2">TASTE ({tasteCards.length} ใบ)</h3>
          <div className="grid grid-cols-2 gap-3">
            {tasteCards.map((c) => (
              <div key={c.card_no} className="bg-white/70 rounded-lg p-2 text-sm flex flex-col items-center">
                {cardImages[c.card_no] && (
                  <img
                    src={cardImages[c.card_no]}
                    alt={c.nameTh}
                    crossOrigin="anonymous"
                    className="w-full h-40 object-contain bg-white rounded mb-2"
                  />
                )}
                <span className="text-xs text-wizard-ink/50 self-start">{c.category}</span>
                <div className="font-medium self-start">{c.nameTh}</div>
                <div className="text-xs text-wizard-ink/60 self-start">{c.mechanic_name}</div>
              </div>
            ))}
          </div>
        </div>

        {gaps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-wizard-plum mb-1">🎯 ยังไม่ถึงเป้า</h3>
            <p className="text-sm">{gaps.map((k) => SKILL_LABELS_TH[k]).join(', ')}</p>
          </div>
        )}

        {caveats.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-wizard-plum mb-1">⚠️ ข้อควรระวัง</h3>
            <ul className="text-sm space-y-1">
              {caveats.map((c) => (
                <li key={c.card_no} className="bg-white/70 rounded-lg p-2">
                  <span className="font-medium">{c.nameTh}</span>{' '}
                  <span className="text-xs text-wizard-ink/50">(ความมั่นใจ: {c.skill_confidence})</span>
                  <div className="text-xs text-wizard-ink/70 mt-0.5">{c.skill_rationale}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 border-t border-wizard-ink/10 text-[10px] text-wizard-ink/50 text-center">
          Wizard Hat Learning Outcome · Wizards of Learning
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onRerun} className="flex-1 py-3 rounded-lg bg-wizard-teal text-white">
          ลองชุดใหม่
        </button>
        <button onClick={exportPng} disabled={exporting} className="flex-1 py-3 rounded-lg bg-wizard-gold text-wizard-ink font-semibold disabled:opacity-50">
          {exporting ? 'กำลังบันทึก...' : 'บันทึกภาพสรุป'}
        </button>
      </div>
      {exportError && (
        <p className="text-sm text-red-600 text-center mt-2">บันทึกภาพไม่สำเร็จ — ลองใหม่อีกครั้ง</p>
      )}
      <button onClick={onRestart} className="w-full py-2 mt-2 text-sm text-wizard-plum underline">
        ตั้งเป้าหมายใหม่
      </button>
    </div>
  );
}
