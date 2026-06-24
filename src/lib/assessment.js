import cards from '../data/wizard_hat_learning_data.json';
import { SKILL_KEYS, SKILL_LABELS_TH } from './scoring.js';

export const LEARNING_FUNCTION_KEYS = [
  'classification',
  'comparison',
  'prioritization',
  'systems_thinking',
  'overlap_recognition',
  'perspective_taking',
  'consequence_awareness',
  'uncertainty_handling',
  'collaboration_under_constraint',
  'concrete_understanding',
];

export const LEARNING_FUNCTION_LABELS_TH = {
  classification: 'การจัดหมวดหมู่',
  comparison: 'การเปรียบเทียบทางเลือก',
  prioritization: 'การจัดลำดับความสำคัญ',
  systems_thinking: 'การคิดเชิงระบบ',
  overlap_recognition: 'การเห็นความซ้อนทับ',
  perspective_taking: 'การมองจากหลายมุมมอง',
  consequence_awareness: 'การมองเห็นผลกระทบ',
  uncertainty_handling: 'การรับมือความไม่แน่นอน',
  collaboration_under_constraint: 'การร่วมมือภายใต้ข้อจำกัด',
  concrete_understanding: 'การทำเรื่องนามธรรมให้จับต้องได้',
};

export const CONFIDENCE_LABELS_TH = {
  low: 'ต่ำ',
  medium: 'กลาง',
  high: 'สูง',
};

export const EXAMPLE_DECKS = [
  {
    id: 'nhrc-venn-hybrid',
    label: 'NHRC Venn Hybrid',
    description: 'ตัวอย่างด้านสิทธิและการเห็นความซ้อนทับ',
    cardNos: ['3', '5', '14', '44', '27', '42', '21', '10'],
  },
  {
    id: 'wishlist-tradeoffs',
    label: 'Wishlist Financial Trade-offs',
    description: 'ตัวอย่างด้านการเงินและการตัดสินใจเชิงผลกระทบ',
    cardNos: ['1', '5', '16', '9', '31', '36', '38', '22'],
  },
  {
    id: 'dialogue-starter',
    label: 'Social Issue Dialogue Starter',
    description: 'ตัวอย่างด้านการสนทนา มุมมอง และการเจรจา',
    cardNos: ['3', '12', '44', '49', '25', '26', '30'],
  },
];

export const CASE_STUDIES = [
  {
    id: 'nhrc-venn',
    sectionLabel: 'กรณีศึกษา 1',
    title: 'NHRC Venn Hybrid',
    subtitle: 'เกมแนวสิทธิและความซ้อนทับของประเด็น',
    gameNameTh: 'ต้นแบบ NHRC Venn',
    learningGoal:
      'ช่วยให้ผู้เล่นเห็นว่าปัญหาในชีวิตจริงหนึ่งเรื่องอาจเกี่ยวข้องกับสนธิสัญญาสิทธิมนุษยชนมากกว่าหนึ่งฉบับ และการวางผิดอาจทำให้ประเด็นนั้นหลุดออกจากการคุ้มครอง',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ classification, overlap recognition และ debrief ที่มีความหมาย',
    whyThisCase: 'กรณีนี้แสดงให้เห็นชัดว่า Touch และ pressure layer ช่วยทำให้ประเด็นสิทธิมนุษยชนที่นามธรรมกลายเป็นสิ่งที่จับต้องได้ในโต๊ะเกม',
    boxImage: null,
    cardNos: ['3', '5', '14', '44', '27', '42', '21', '10'],
  },
  {
    id: 'wishlist-finance',
    sectionLabel: 'กรณีศึกษา 2',
    title: 'Wishlist Financial Trade-offs',
    subtitle: 'เกมแนวการเงินและการตัดสินใจภายใต้ข้อจำกัด',
    gameNameTh: 'Wishlist',
    learningGoal:
      'ช่วยให้ผู้เล่นเปรียบเทียบการใช้เงิน การเก็บเงิน การกู้ และการลงทุน ภายใต้ข้อจำกัดจริง พร้อมเห็นผลของการตัดสินใจระยะสั้นและระยะยาว',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ critical thinking, decision-making และ consequence awareness',
    whyThisCase: 'กรณีนี้ช่วยยืนยันว่า Wizard Hat ไม่ได้ใช้ได้เฉพาะเกมสนทนาหรือประเด็นสังคม แต่ใช้กับเกมการเงินที่เน้น trade-off ได้ด้วย',
    boxImage: null,
    cardNos: ['1', '5', '16', '9', '31', '36', '38', '22'],
  },
  {
    id: 'dialogue-starter',
    sectionLabel: 'กรณีศึกษา 3',
    title: 'Social Issue Dialogue Starter',
    subtitle: 'โครงตั้งต้นสำหรับเกมสนทนา มุมมอง และการเจรจา',
    gameNameTh: 'Social Issue Dialogue Starter',
    learningGoal:
      'ช่วยให้ผู้เล่นตีความสถานการณ์จากหลายมุมมอง สื่อสารภายใต้ข้อจำกัด และต่อรองเพื่อหาทางออกที่แต่ละฝ่ายยอมรับได้',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ perspective-taking, participation และ negotiation',
    whyThisCase: 'กรณีนี้เป็นตัวแทนของเส้นทางที่ Wizard Hat ใช้สร้างเกมเพื่อบทสนทนาเชิงสังคมและการเรียนรู้จากมุมมองที่ต่างกัน',
    boxImage: null,
    cardNos: ['3', '12', '44', '49', '25', '26', '30'],
  },
];

const cardsByNo = new Map(cards.map((card) => [String(card.card_no), card]));
const CATEGORY_ORDER = ['Conflict', 'Order', 'Reward', 'Ending', 'Twist', 'Asset', 'Strategy', 'Touch', 'Engage'];

function aggregateByAccumulation(selectedCards, keys, fieldName) {
  const result = {};
  for (const key of keys) {
    const levels = selectedCards
      .map((card) => card[fieldName]?.[key] ?? 0)
      .filter((value) => value > 0)
      .sort((a, b) => b - a);

    if (levels.length === 0) {
      result[key] = 0;
      continue;
    }

    const strongest = levels[0];
    const supportBonus = Math.min(1, (levels.length - 1) * 0.2);
    result[key] = Math.min(3, Number((strongest + supportBonus).toFixed(1)));
  }
  return result;
}

function rankSignals(profile, labelMap, limit = 5, threshold = 1) {
  return Object.entries(profile)
    .filter(([, value]) => value >= threshold)
    .sort((a, b) => b[1] - a[1] || labelMap[a[0]].localeCompare(labelMap[b[0]], 'th'))
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: labelMap[key], value }));
}

function confidenceSummary(selectedCards) {
  const counts = { high: 0, medium: 0, low: 0 };
  for (const card of selectedCards) {
    const bucket = card.skill_confidence || 'medium';
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }

  const total = selectedCards.length || 1;
  const score = (counts.high * 1 + counts.medium * 0.6 + counts.low * 0.3) / total;
  const level = score >= 0.85 ? 'high' : score >= 0.55 ? 'medium' : 'low';

  const reasons = [];
  if (counts.low > 0) reasons.push(`มีการ์ดความมั่นใจต่ำ ${counts.low} ใบ`);
  if (counts.medium > counts.high) reasons.push('ผลส่วนหนึ่งยังอาศัย default mapping ระดับกลาง');
  if (counts.high >= Math.max(3, Math.ceil(total / 2))) reasons.push('หลายการ์ดมีเหตุผลเชิง mechanic ค่อนข้างชัด');
  if (reasons.length === 0) reasons.push('ผลนี้เป็นการอ่านจากโครง mechanic เบื้องต้น ยังไม่ใช่หลักฐานจาก playtest');

  return {
    level,
    labelTh: CONFIDENCE_LABELS_TH[level],
    reasons,
  };
}

function collectActionSummaries(selectedCards) {
  return selectedCards
    .map((card) => ({
      nameTh: card.nameTh,
      mechanic: card.mechanic_name,
      action: card.demands?.observable_behaviors || card.demands?.cognitive || '',
    }))
    .filter((item) => item.action);
}

function summarizeLayer(selectedCards, category, fieldName, fallback) {
  const lines = selectedCards
    .filter((card) => card.category === category && card.demands?.[fieldName] && card.demands[fieldName] !== 'none')
    .map((card) => `${card.nameTh}: ${card.demands[fieldName]}`);

  return lines.length > 0 ? lines : [fallback];
}

function buildBlindSpots(selectedCards, learningProfile, skillProfile) {
  const mechanicNames = new Set(selectedCards.map((card) => card.mechanic_name));
  const notes = [];

  if (!selectedCards.some((card) => card.category === 'Touch')) {
    notes.push('ยังไม่มีการ์ด Touch จึงเสี่ยงที่เรื่องนามธรรมจะยังเป็นคำอธิบายมากกว่าประสบการณ์ที่จับต้องได้');
  }
  if (mechanicNames.has('Race') || mechanicNames.has('Real-Time')) {
    notes.push('แรงกดดันด้านความเร็วอาจกลบการอธิบายเหตุผลและการสะท้อนคิด');
  }
  if (mechanicNames.has('Competitive') && skillProfile.collaboration < 1.5) {
    notes.push('โครงแข่งขันอาจดันผู้เล่นไปทางเอาชนะมากกว่าทำความเข้าใจร่วมกัน');
  }
  if (learningProfile.perspective_taking < 1 && skillProfile.empathy < 1) {
    notes.push('ผลด้านการเข้าใจมุมมองผู้อื่นยังอ่อน จึงไม่ควรอ้าง empathy สูงเกินจริง');
  }
  if (learningProfile.consequence_awareness < 1.5) {
    notes.push('ผลด้าน consequence ยังไม่แรงมาก หากโจทย์เน้นผลกระทบควรเพิ่ม pressure หรือ scarcity');
  }
  if (notes.length === 0) {
    notes.push('ไม่เห็นจุดบอดเชิงโครงสร้างเด่นจากชุดการ์ด แต่ยังควรยืนยันด้วยการสังเกตพฤติกรรมจริงระหว่าง playtest');
  }
  return notes;
}

function buildRecommendations(selectedCards, learningProfile) {
  const recommendations = [];
  const hasReward = selectedCards.some((card) => card.category === 'Reward');
  const hasEnding = selectedCards.some((card) => card.category === 'Ending');
  const hasTouch = selectedCards.some((card) => card.category === 'Touch');

  if (!hasReward) {
    recommendations.push('เพิ่มการ์ดในหมวด Reward เพื่อกำหนด mindset ที่ผู้เล่นจะถูกฝึกอย่างชัดเจน');
  }
  if (!hasEnding) {
    recommendations.push('เพิ่มการ์ดในหมวด Ending เพื่อให้เกิดแรงกดดันและผลของการตัดสินใจชัดขึ้น');
  }
  if (!hasTouch) {
    recommendations.push('เพิ่มการ์ดในหมวด Touch เพื่อช่วยให้ concept ซับซ้อนเข้าใจง่ายขึ้นและสังเกต outcome ได้ง่ายขึ้น');
  }
  if (learningProfile.consequence_awareness >= 2.5) {
    recommendations.push('ชุดนี้เด่นเรื่องผลกระทบอยู่แล้ว ควรเพิ่มคำถาม debrief ว่า “ผู้เล่นเรียนรู้อะไรจากผลของการตัดสินใจ”');
  }
  if (learningProfile.perspective_taking >= 2) {
    recommendations.push('ควรมีช่วงสะท้อนมุมมองหลังเล่น เพื่อเปลี่ยนจากการ “แสดงบทบาท” ไปสู่การ “เข้าใจเหตุผลของอีกฝ่าย”');
  }
  if (recommendations.length === 0) {
    recommendations.push('ชุดนี้พอใช้ได้ในรอบแรก ควรเอาไปลองเล่นแล้วบันทึกว่าพฤติกรรมจริงตรงกับที่ระบบคาดไว้หรือไม่');
  }
  return recommendations;
}

export function getCardsForAssessment(cardNos) {
  return cardNos
    .map((cardNo) => cardsByNo.get(String(cardNo)))
    .filter(Boolean)
    .sort((a, b) => {
      const categoryGap = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
      return categoryGap !== 0 ? categoryGap : Number(a.card_no) - Number(b.card_no);
    });
}

export function assessDeck(cardNos) {
  const selectedCards = getCardsForAssessment(cardNos);
  const learningProfile = aggregateByAccumulation(selectedCards, LEARNING_FUNCTION_KEYS, 'learning_functions');
  const skillProfile = aggregateByAccumulation(selectedCards, SKILL_KEYS, 'skills');

  const topLearningFunctions = rankSignals(learningProfile, LEARNING_FUNCTION_LABELS_TH, 5, 1);
  const topSkills = rankSignals(skillProfile, SKILL_LABELS_TH, 5, 1);
  const confidence = confidenceSummary(selectedCards);

  return {
    selectedCards,
    learningProfile,
    skillProfile,
    topLearningFunctions,
    topSkills,
    actionSummaries: collectActionSummaries(selectedCards),
    rewardSummary: summarizeLayer(selectedCards, 'Reward', 'reward_mindset_effect', 'ยังไม่มีการ์ด Reward จึงยังไม่ชัดว่าระบบกำลังฝึก mindset แบบไหน'),
    endingSummary: summarizeLayer(selectedCards, 'Ending', 'ending_pressure_effect', 'ยังไม่มีการ์ด Ending จึงยังไม่ชัดว่าแรงกดดันภายนอกมาจากอะไร'),
    touchSummary: summarizeLayer(selectedCards, 'Touch', 'touch_concretization_effect', 'ยังไม่มีการ์ด Touch จึงเสี่ยงที่เรื่องยากจะยังไม่เป็นรูปธรรมพอ'),
    confidence,
    blindSpots: buildBlindSpots(selectedCards, learningProfile, skillProfile),
    recommendations: buildRecommendations(selectedCards, learningProfile),
    interpretationNotes: [
      'ผลนี้เป็นการประเมินจาก default mechanic mapping ของชุดการ์ด ไม่ใช่ผลลัพธ์ยืนยันจาก playtest จริง',
      'การ์ด Reward, Ending และ Touch ควรอ่านเป็น mindset, pressure และ concretization support มากกว่าจะตีเป็น skill ตรง ๆ',
      'หากจะใช้กับเกมจริง ควรปรับเพิ่มตาม frequency, consequence, complexity และ reflection ของเกมนั้น',
    ],
  };
}
