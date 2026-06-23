import cards from '../data/wizard_hat_learning_data.json';

export const SKILL_KEYS = [
  'problem_solving',
  'creativity',
  'critical_thinking',
  'communication',
  'collaboration',
  'empathy',
  'self_management',
  'resilience',
  'negotiation',
  'decision_making',
  'respect_for_diversity',
  'participation',
];

export const SKILL_LABELS_TH = {
  problem_solving: 'การแก้ปัญหา',
  creativity: 'ความคิดสร้างสรรค์',
  critical_thinking: 'การคิดวิเคราะห์',
  communication: 'การสื่อสาร',
  collaboration: 'การทำงานร่วมกัน',
  empathy: 'ความเข้าใจผู้อื่น',
  self_management: 'การจัดการตนเอง',
  resilience: 'ความยืดหยุ่น/อดทน',
  negotiation: 'การต่อรอง',
  decision_making: 'การตัดสินใจ',
  respect_for_diversity: 'การเคารพความหลากหลาย',
  participation: 'การมีส่วนร่วม',
};

const cardsByNo = new Map(cards.map((c) => [c.card_no, c]));

export function getCard(cardNo) {
  return cardsByNo.get(String(cardNo));
}

export function getAllCards() {
  return cards;
}

// Aggregate by max level per skill across selected cards: a combination "activates"
// a skill at the strongest level any single card in it activates, rather than summing
// (summing would overstate — levels are already a 0-3 cap of a single card's pull).
export function scoreCombination(selectedCardNos, targetProfile = null) {
  const selected = selectedCardNos.map(getCard).filter(Boolean);

  const skills = {};
  for (const key of SKILL_KEYS) {
    const achieved = selected.reduce((max, c) => Math.max(max, c.skills[key] ?? 0), 0);
    const target = targetProfile ? targetProfile[key] ?? null : null;
    skills[key] = {
      achieved,
      target,
      gap: target != null ? Math.max(0, target - achieved) : null,
    };
  }

  const demandsByCategory = {};
  for (const c of selected) {
    if (!demandsByCategory[c.category]) demandsByCategory[c.category] = [];
    demandsByCategory[c.category].push({
      card_no: c.card_no,
      nameTh: c.nameTh,
      mechanic_name: c.mechanic_name,
      demands: c.demands,
    });
  }

  return { selected, skills, demandsByCategory };
}
