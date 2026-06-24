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

// One distinct accent color per skill so the target-setting list is easy to
// scan at a glance. Reuses WoL teal/gold for two skills to keep brand ties.
export const SKILL_COLORS = {
  problem_solving: '#4263eb',
  creativity: '#9c36b5',
  critical_thinking: '#1c7ed6',
  communication: '#1098ad',
  collaboration: '#50C2C0',
  empathy: '#e64980',
  self_management: '#f76707',
  resilience: '#e03131',
  negotiation: '#f08c00',
  decision_making: '#7048e8',
  respect_for_diversity: '#74b816',
  participation: '#d7a32a',
};

// One color per card category (4 CORE + 5 TASTE) so a deck's mechanic
// tiles are visually grouped by type, same idea as SKILL_COLORS above.
export const CATEGORY_COLORS = {
  Conflict: '#e03131',
  Order: '#1c7ed6',
  Reward: '#f08c00',
  Ending: '#7048e8',
  Twist: '#9c36b5',
  Asset: '#2f9e44',
  Strategy: '#1098ad',
  Touch: '#e64980',
  Engage: '#50C2C0',
};

// Play length is tied to TASTE card count, which in turn caps how many total
// skill points a target profile can spend — keeps short games focused on a
// few skills instead of maxing every axis to 3. Budgets are an estimate;
// revisit after a few playtests.
export const DURATION_OPTIONS = [
  { id: 'short', label: '10–20 นาที', tasteCount: 2, pointBudget: 8 },
  { id: 'medium', label: '30–40 นาที', tasteCount: 3, pointBudget: 12 },
  { id: 'long', label: '60–90 นาที', tasteCount: 4, pointBudget: 16 },
];

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
