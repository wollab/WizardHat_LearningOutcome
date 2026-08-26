const SHOPEE_URL = 'https://shopee.co.th/wizards.of.learning/46454897531';
const TAROT_URL = 'https://wollab.github.io/WoL_Tarot_of_Learning/?utm_source=wizardhat&utm_medium=website&utm_campaign=learning_outcome';

export default function PurchaseCta() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl border border-wizard-teal/20 bg-[#f4fbf9] px-6 py-10 text-center shadow-sm md:py-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: 'repeating-conic-gradient(from 270deg at 50% 108%, rgba(254, 197, 102, 0.22) 0deg 8deg, transparent 8deg 24deg), radial-gradient(circle at 50% 110%, rgba(80, 194, 192, 0.18), transparent 48%)',
        }}
      />
      <div className="relative mx-auto max-w-2xl">
        <p className="mb-5 text-sm text-wizard-ink/70 md:text-base">
          อยากได้สำรับจริงไว้ใช้คิด หรือเป็นเกมจริง?
        </p>
        <h2 className="mb-5 text-2xl md:text-3xl">สั่งซื้อ Wizard Hat</h2>
        <a
          href={SHOPEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-wizard-teal px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,155,153,0.25)] transition hover:-translate-y-0.5 hover:bg-wizard-plum focus:outline-none focus:ring-2 focus:ring-wizard-teal focus:ring-offset-2"
          data-wol-event="purchase_link"
          data-wol-source="wizardhat-learning-outcome"
          data-wol-target="shopee-wizard-hat"
        >
          <svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="20" r="1" />
            <circle cx="19" cy="20" r="1" />
            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
          </svg>
          สั่งซื้อ Wizard Hat ผ่าน Shopee
          <span aria-hidden="true" className="ml-2">↗</span>
        </a>
        <a
          href={TAROT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-sm font-medium text-wizard-plum underline decoration-wizard-teal/50 underline-offset-4 hover:text-wizard-teal"
          data-wol-event="ecosystem_link"
          data-wol-source="wizardhat-learning-outcome"
          data-wol-target="tarot-of-learning"
        >
          หรือสำรวจคำถามต่อด้วย Tarot of Learning ↗
        </a>
      </div>
    </section>
  );
}
