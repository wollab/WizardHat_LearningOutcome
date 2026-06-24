import cards from '../data/wizard_hat_learning_data.json';

export const SKILL_KEYS = [
  'participation',
  'creativity',
  'critical_thinking',
  'problem_solving',
  'collaboration',
  'negotiation',
  'decision_making',
  'self_management',
  'resilience',
  'communication',
  'respect_for_diversity',
  'empathy',
];

export const SKILL_LABELS_TH = {
  participation: 'การมีส่วนร่วม',
  creativity: 'ความคิดสร้างสรรค์',
  critical_thinking: 'การคิดวิเคราะห์',
  problem_solving: 'การแก้ปัญหา',
  collaboration: 'การทำงานร่วมกัน',
  negotiation: 'การต่อรอง',
  decision_making: 'การตัดสินใจ',
  self_management: 'การจัดการตนเอง',
  resilience: 'ความยืดหยุ่น/อดทน',
  communication: 'การสื่อสาร',
  respect_for_diversity: 'การเคารพความหลากหลาย',
  empathy: 'ความเข้าใจผู้อื่น',
};

export const UNICEF_REFERENCE = {
  label: 'อิงกรอบ UNICEF Transferable Skills',
  shortLabel: 'UNICEF 12 skills / 4 dimensions',
  url: 'https://www.unicef.org/lac/en/reports/12-transferable-skills',
  sourceText: 'UNICEF (2022), The 12 Transferable Skills',
};

export const DIMENSION_KEYS = [
  'active_citizenship',
  'learning',
  'employability',
  'personal_empowerment',
];

export const DIMENSION_LABELS_TH = {
  active_citizenship: 'Active Citizenship',
  learning: 'Learning',
  employability: 'Employability',
  personal_empowerment: 'Personal Empowerment',
};

export const DIMENSION_SUBLABELS_TH = {
  active_citizenship: 'มิติทางสังคม · learning to live together',
  learning: 'มิติการเรียนรู้ · learning to know',
  employability: 'มิติการลงมือทำ · learning to do',
  personal_empowerment: 'มิติรายบุคคล · learning to be',
};

export const DIMENSION_COLORS = {
  active_citizenship: '#A75BA8',
  learning: '#5A7FC0',
  employability: '#FF6B4A',
  personal_empowerment: '#9AC75A',
};

export const SKILL_DIMENSIONS = {
  participation: 'active_citizenship',
  creativity: 'learning',
  critical_thinking: 'learning',
  problem_solving: 'learning',
  collaboration: 'employability',
  negotiation: 'employability',
  decision_making: 'employability',
  self_management: 'personal_empowerment',
  resilience: 'personal_empowerment',
  communication: 'personal_empowerment',
  respect_for_diversity: 'active_citizenship',
  empathy: 'active_citizenship',
};

export const SKILL_COLORS = {
  participation: '#A75BA8',
  creativity: '#4F76BB',
  critical_thinking: '#7CA2DA',
  problem_solving: '#AAC1E8',
  collaboration: '#FF774D',
  negotiation: '#FFA06E',
  decision_making: '#FFC5A3',
  self_management: '#C7E49A',
  resilience: '#AAD174',
  communication: '#8FC055',
  respect_for_diversity: '#BE8CC7',
  empathy: '#D9A6DC',
};

export const SKILL_TOOLTIPS_TH = {
  participation: 'การเข้าไปมีบทบาท ลงมือร่วม และส่งผลต่อทิศทางของกิจกรรมหรือการตัดสินใจร่วมกัน',
  creativity: 'การสร้างทางเลือกใหม่ วิธีคิดใหม่ หรือการใช้ทรัพยากรเดิมอย่างไม่ตรงสูตรเดิม',
  critical_thinking: 'การวิเคราะห์ข้อมูล เงื่อนไข และเหตุผล ก่อนสรุปหรือตัดสินใจ',
  problem_solving: 'การหาวิธีรับมือโจทย์หรือข้อจำกัดเพื่อไปต่อให้ได้',
  collaboration: 'การทำงานร่วมกับผู้อื่นเพื่อให้ผลลัพธ์โดยรวมดีขึ้น',
  negotiation: 'การต่อรองผลประโยชน์ เงื่อนไข หรือข้อตกลงระหว่างผู้เล่นหรือฝ่ายต่าง ๆ',
  decision_making: 'การเลือกทางเลือกภายใต้ข้อจำกัด ผลกระทบ หรือความไม่แน่นอน',
  self_management: 'การคุมตนเอง จัดลำดับสิ่งสำคัญ และบริหารทรัพยากรหรือความเสี่ยงของตน',
  resilience: 'การฟื้นตัว ปรับตัว และเดินหน้าต่อเมื่อเจอสถานการณ์เสียเปรียบหรือพลิกผัน',
  communication: 'การถ่ายทอดข้อมูล ความหมาย หรือเจตนาให้ผู้อื่นเข้าใจและตอบสนองได้',
  respect_for_diversity: 'การยอมรับความแตกต่างของคน มุมมอง หรือบทบาท โดยไม่ลดคุณค่าของอีกฝ่าย',
  empathy: 'การพยายามเข้าใจมุมมอง ความรู้สึก หรือแรงจูงใจของผู้อื่นจากสถานการณ์ที่เขาเผชิญ',
};

export function groupSkillsByDimension() {
  return DIMENSION_KEYS.map((dimensionKey) => ({
    key: dimensionKey,
    label: DIMENSION_LABELS_TH[dimensionKey],
    sublabel: DIMENSION_SUBLABELS_TH[dimensionKey],
    color: DIMENSION_COLORS[dimensionKey],
    skills: SKILL_KEYS.filter((skillKey) => SKILL_DIMENSIONS[skillKey] === dimensionKey),
  }));
}

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
