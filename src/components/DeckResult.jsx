import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { toPng } from 'html-to-image';
import RadarChart from './RadarChart.jsx';
import OutcomeSummaryPanel from './OutcomeSummaryPanel.jsx';
import { buildOutcomeLens } from '../lib/assessment.js';
import { SKILL_KEYS, SKILL_LABELS_TH, SKILL_COLORS, CATEGORY_COLORS, DURATION_OPTIONS } from '../lib/scoring.js';
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
const SHOPEE_URL = 'https://shopee.co.th/wizards.of.learning/46454897531';

function CardTile({ card, imgSrc, compact = false, exportMode = false }) {
  const accent = CATEGORY_COLORS[card.category] ?? '#414141';
  const sizeClass = exportMode
    ? compact
      ? 'p-3 text-sm'
      : 'p-4 text-base'
    : compact
      ? 'p-2 text-xs'
      : 'p-3 text-sm';
  const imageClass = exportMode
    ? compact
      ? 'h-24'
      : 'h-32'
    : compact
      ? 'h-20'
      : 'h-40';
  return (
    <div
      className={`bg-white rounded-xl ${sizeClass} flex flex-col items-center border shadow-sm`}
      style={{ borderColor: accent, borderWidth: 3 }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={card.nameTh}
          crossOrigin="anonymous"
          className={`w-full ${imageClass} object-contain bg-white rounded mb-2`}
        />
      )}
      <span className={`${exportMode ? 'text-sm' : 'text-xs'} self-start font-semibold`} style={{ color: accent }}>
        {card.category}
      </span>
      <div className={`font-medium self-start leading-5 ${exportMode ? 'text-base' : ''}`}>{card.nameTh}</div>
      <div className={`${exportMode ? 'text-sm' : 'text-xs'} text-wizard-ink/60 self-start`}>{card.mechanic_name}</div>
    </div>
  );
}

function ExportBadge({ value, tone = 'teal' }) {
  const palette = tone === 'gold'
    ? { bg: '#FCE5A6', text: '#8F5E0A' }
    : tone === 'rose'
      ? { bg: '#F7D8D8', text: '#8E3F3F' }
      : { bg: '#D7F0EF', text: '#227C7A' };
  return (
    <span
      className="inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-sm font-semibold leading-none whitespace-nowrap shrink-0"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      {value}
    </span>
  );
}

function ExportListCard({ title, items, tone = 'teal' }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-3">
      <h3 className="text-lg font-semibold text-wizard-plum">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key ?? item.label ?? item} className="flex items-start justify-between gap-3 rounded-xl bg-wizard-mist/35 px-3 py-3">
            <div className="min-w-0 pr-1">
              <div className="text-base font-medium leading-6 break-words">{item.label ?? item}</div>
              {item.summary ? <div className="text-sm text-wizard-ink/75 mt-1 leading-5 break-words">{item.summary}</div> : null}
            </div>
            {item.value != null ? <ExportBadge value={`${item.value.toFixed(1)} / 3`} tone={tone} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeckResult({ result, target, tasteCount, issue, onRerun, onChangeDuration, onRestart }) {
  const { selected, skills } = result;
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const issueLabel = issue?.trim();

  const coreCards = selected.filter((c) => CORE_CATEGORIES.includes(c.category));
  const tasteCards = selected.filter((c) => !CORE_CATEGORIES.includes(c.category));

  const gaps = SKILL_KEYS.filter((k) => (target[k] ?? 0) > skills[k].achieved);
  const achievedProfile = Object.fromEntries(SKILL_KEYS.map((k) => [k, skills[k].achieved]));
  const outcomeLens = buildOutcomeLens(selected, achievedProfile);
  const topSkills = [...outcomeLens.allSkills]
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'th'))
    .slice(0, 5);
  const topLearningFunctions = [...outcomeLens.allLearningFunctions]
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'th'))
    .slice(0, 4);
  const topLabels = outcomeLens.wolReadingLabels.slice(0, 3);

  const caveats = selected.filter(
    (c) => ['low', 'medium', 'low-medium', 'medium-high'].includes(c.skill_confidence)
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
  const radarImgSrc = svgToDataUri(<RadarChart series={radarSeries} axisColors={SKILL_COLORS} />);

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
  const [isShaking, setIsShaking] = useState(false);

  function handleRerunClick() {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      onRerun();
      setIsShaking(false);
    }, 400);
  }

  function handleDurationClick(count) {
    if (count === tasteCount || isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      onChangeDuration(count);
      setIsShaking(false);
    }, 400);
  }

  async function exportPng() {
    if (!exportRef.current || exporting) return;
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
        toPng(exportRef.current, {
          pixelRatio: 2,
          backgroundColor: '#d9f1f0',
          cacheBust: true,
          skipFonts: true,
          filter: (node) => {
            if (node?.dataset?.exportIgnore === 'true') return false;
            if (node.tagName === 'DETAILS') return false;
            if (node instanceof HTMLImageElement && /^https?:/i.test(node.src)) return false;
            return true;
          },
        }),
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
      <div
        className={`rounded-2xl bg-wizard-mist p-6 space-y-5 transition-opacity duration-300 ${
          isShaking ? 'deck-shake opacity-50' : 'opacity-100'
        }`}
      >
        <h2 className="text-xl">ชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุด</h2>
        {issueLabel ? (
          <div className="rounded-xl bg-white/75 border border-wizard-ink/10 px-3 py-2 text-sm text-wizard-ink/80">
            ประเด็นที่ตั้งไว้: <span className="font-medium text-wizard-plum">{issueLabel}</span>
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-wizard-plum">CORE (4 ใบ)</h3>
            <div className="flex gap-1">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDurationClick(d.tasteCount)}
                  disabled={isShaking}
                  className={`px-2 py-1 rounded text-[10px] ${
                    d.tasteCount === tasteCount ? 'bg-wizard-teal text-white' : 'bg-white/70 text-wizard-ink/60'
                  }`}
                  title={`เปลี่ยนเป็น ${d.label} (TASTE ${d.tasteCount} ใบ) — ไม่กระทบ profile ทักษะที่ตั้งไว้`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {coreCards.map((c) => (
              <CardTile key={c.card_no} card={c} imgSrc={cardImages[c.card_no]} compact />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-wizard-plum mb-2">TASTE ({tasteCards.length} ใบ)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tasteCards.map((c) => (
              <CardTile key={c.card_no} card={c} imgSrc={cardImages[c.card_no]} />
            ))}
          </div>
        </div>

        <OutcomeSummaryPanel
          title="ผลลัพธ์ Learning Outcome"
          subtitle="อ่านผลลัพธ์ทั้งในมุม UNICEF transferable skills และ outcome layer ของ WoL ในกล่องเดียว"
          radarSeries={radarSeries}
          radarImageSrc={radarImgSrc}
          radarCaption="เส้นทอง = เป้าหมาย · พื้นเขียว = ชุดการ์ดนี้ให้จริง"
          allSkills={outcomeLens.allSkills}
          allLearningFunctions={outcomeLens.allLearningFunctions}
          wolReadingLabels={outcomeLens.wolReadingLabels}
          confidence={outcomeLens.confidence}
        />

        <div className="rounded-2xl bg-white border border-wizard-ink/10 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-wizard-plum">คำแนะนำและข้อควรระวัง</h3>

          {gaps.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-wizard-plum mb-1">ยังไม่ถึงเป้า</h4>
              <p className="text-sm">{gaps.map((k) => SKILL_LABELS_TH[k]).join(', ')}</p>
            </div>
          ) : null}

          <div>
            <h4 className="text-sm font-semibold text-wizard-plum mb-1">จุดบอดที่ควรเฝ้าดู</h4>
            <ul className="text-sm space-y-1 text-wizard-ink/80">
              {outcomeLens.blindSpots.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-wizard-plum mb-1">คำแนะนำต่อยอด</h4>
            <ul className="text-sm space-y-1 text-wizard-ink/80">
              {outcomeLens.recommendations.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>

          {caveats.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-wizard-plum mb-1">การ์ดที่ควรอ่านอย่างระมัดระวัง</h4>
              <ul className="text-sm space-y-1">
                {caveats.map((c) => (
                  <li key={c.card_no} className="bg-wizard-mist/60 rounded-lg p-2">
                    <span className="font-medium">{c.nameTh}</span>{' '}
                    <span className="text-xs text-wizard-ink/50">(ความมั่นใจ: {c.skill_confidence})</span>
                    <div className="text-xs text-wizard-ink/70 mt-0.5">{c.skill_rationale}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-wizard-ink/10 text-[10px] text-wizard-ink/50 text-center">
          Wizard Hat Learning Outcome · Wizards of Learning
        </div>

        {/* Promo footer — included in the exported PNG, same pattern as Tarot of Learning's shop-cta */}
        <div className="rounded-xl bg-white/70 p-3 flex items-center gap-3" data-export-ignore="true">
          <img
            src={`${import.meta.env.BASE_URL}wizardhat-box.png`}
            alt="Wizard Hat — Starter Pack"
            crossOrigin="anonymous"
            className="h-16 w-auto object-contain shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-wizard-ink/80">อยากได้สำรับจริงไว้ใช้ออกแบบเกมเอง?</p>
            <a
              href={SHOPEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-wizard-plum underline"
            >
              🛒 สั่งซื้อ Wizard Hat — Wizards of Learning
            </a>
          </div>
        </div>
      </div>

      <div className="fixed left-[-9999px] top-0 w-[1700px] pointer-events-none" aria-hidden="true">
        <div ref={exportRef} className="rounded-[28px] bg-wizard-mist p-10 space-y-6 text-wizard-ink" style={{ fontFamily: 'Kanit, sans-serif' }}>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 pr-4">
                <h2 className="text-3xl font-semibold">ชุดการ์ดที่ใกล้เคียงเป้าหมายที่สุด</h2>
                <p className="text-base text-wizard-ink/70 mt-1 leading-6">
                  สรุปผลในมุม transferable skills, WoL learning functions และคำแนะนำใช้งานในภาพเดียว
                </p>
              </div>
              <ExportBadge value={`${tasteCards.length} TASTE`} tone="gold" />
            </div>
            {issueLabel ? (
              <div className="rounded-xl bg-white/80 border border-wizard-ink/10 px-4 py-3 text-base text-wizard-ink/80">
                ประเด็นที่ตั้งไว้: <span className="font-medium text-wizard-plum">{issueLabel}</span>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-[0.78fr_1.22fr] gap-6 items-start">
            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-4">
                <h3 className="text-lg font-semibold text-wizard-plum">โปรไฟล์ทักษะ</h3>
                <img src={radarImgSrc} alt="ผลลัพธ์ Learning Outcome" className="w-full max-w-[360px] mx-auto" />
                <p className="text-sm text-center text-wizard-ink/70">เส้นทอง = เป้าหมาย · พื้นเขียว = ชุดการ์ดนี้ให้จริง</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-wizard-plum">CORE (4 ใบ)</h3>
                    <ExportBadge value="ชุดแกนหลัก" tone="teal" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {coreCards.map((c) => (
                      <CardTile key={`export-core-${c.card_no}`} card={c} compact exportMode />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-wizard-plum">TASTE ({tasteCards.length} ใบ)</h3>
                    <ExportBadge value="ชุดเสริมรสชาติ" tone="gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {tasteCards.map((c) => (
                      <CardTile key={`export-taste-${c.card_no}`} card={c} compact exportMode />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[0.92fr_1.08fr] gap-5 items-start">
              <div className="space-y-5">
                <ExportListCard title="Top Transferable Skills" items={topSkills} tone="teal" />
                <ExportListCard title="Top WoL Learning Functions" items={topLearningFunctions} tone="gold" />
              </div>

              <div className="space-y-5">
                <ExportListCard title="WoL Reading Labels" items={topLabels} tone="rose" />

                <div className="rounded-2xl bg-white border border-wizard-ink/10 p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-wizard-plum">คำแนะนำและข้อควรระวัง</h3>

                  <div>
                    <h4 className="text-base font-semibold text-wizard-plum mb-1">ยังไม่ถึงเป้า</h4>
                    <p className="text-sm leading-6 break-words">
                      {gaps.length > 0 ? gaps.map((k) => SKILL_LABELS_TH[k]).join(', ') : 'ไม่มีจุดที่ต่ำกว่าเป้าหมายหลัก'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-wizard-plum mb-1">จุดบอดที่ควรเฝ้าดู</h4>
                    <ul className="text-sm space-y-2 text-wizard-ink/80">
                      {outcomeLens.blindSpots.slice(0, 3).map((note) => (
                        <li key={`export-blind-${note}`} className="leading-5">• {note}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-wizard-plum mb-1">คำแนะนำต่อยอด</h4>
                    <ul className="text-sm space-y-2 text-wizard-ink/80">
                      {outcomeLens.recommendations.slice(0, 3).map((note) => (
                        <li key={`export-reco-${note}`} className="leading-5">• {note}</li>
                      ))}
                    </ul>
                  </div>

                  {caveats.length > 0 ? (
                    <div>
                      <h4 className="text-base font-semibold text-wizard-plum mb-1">การ์ดที่ควรอ่านอย่างระมัดระวัง</h4>
                      <ul className="text-sm space-y-2 text-wizard-ink/80">
                        {caveats.slice(0, 3).map((c) => (
                          <li key={`export-caveat-${c.card_no}`} className="rounded-xl bg-wizard-mist/35 px-3 py-2 leading-5">
                            <span className="font-medium">{c.nameTh}</span> ({c.skill_confidence})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-wizard-ink/10 text-[10px] text-wizard-ink/50 text-center">
            Wizard Hat Learning Outcome · Wizards of Learning
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={handleRerunClick} disabled={isShaking} className="flex-1 py-3 rounded-lg bg-wizard-teal text-white disabled:opacity-70">
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
