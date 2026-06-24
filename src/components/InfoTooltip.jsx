export default function InfoTooltip({ text, align = 'right' }) {
  const alignClass =
    align === 'left'
      ? 'right-0'
      : align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'left-0';

  return (
    <details className="relative inline-block group">
      <summary className="list-none cursor-pointer inline-flex items-center justify-center w-4 h-4 rounded-full border border-wizard-ink/25 text-[10px] text-wizard-ink/65 bg-white/85 hover:text-wizard-plum hover:border-wizard-plum/40">
        i
      </summary>
      <div
        className={`absolute ${alignClass} top-6 z-20 w-56 rounded-xl border border-wizard-ink/10 bg-white px-3 py-2 text-xs leading-5 text-wizard-ink shadow-lg`}
      >
        {text}
      </div>
    </details>
  );
}
