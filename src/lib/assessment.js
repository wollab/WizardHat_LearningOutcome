import cards from '../data/wizard_hat_learning_data.json';
import {
  DIMENSION_COLORS,
  DIMENSION_KEYS,
  DIMENSION_LABELS_TH,
  DIMENSION_SUBLABELS_TH,
  SKILL_DIMENSIONS,
  SKILL_KEYS,
  SKILL_LABELS_TH,
  SKILL_TOOLTIPS_TH,
} from './scoring.js';
import wishlistImage from '../assets/cases/wishlist.png';
import localElectionImage from '../assets/cases/local-election.png';
import richmanGameImage from '../assets/cases/richman-game.png';

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

export const LEARNING_FUNCTION_TOOLTIPS_TH = {
  classification: 'ผู้เล่นต้องแยกประเภทหรือจัดวางสิ่งต่าง ๆ ตามเกณฑ์ที่มีความหมาย',
  comparison: 'ผู้เล่นต้องเทียบทางเลือกหลายแบบก่อนเลือกสิ่งที่เหมาะที่สุด',
  prioritization: 'ผู้เล่นต้องจัดลำดับว่าอะไรสำคัญกว่าเมื่อทรัพยากรหรือเวลามีจำกัด',
  systems_thinking: 'ผู้เล่นต้องมองความเชื่อมโยงของหลายองค์ประกอบ ไม่ใช่มองจุดเดียวแยกขาด',
  overlap_recognition: 'ผู้เล่นต้องเห็นว่าสถานการณ์หนึ่งอาจเกี่ยวข้องกับหลายหมวดหรือหลายประเด็นพร้อมกัน',
  perspective_taking: 'ผู้เล่นต้องมองจากมุมของผู้เล่นอื่น บทบาทอื่น หรือผู้มีส่วนได้ส่วนเสียอื่น',
  consequence_awareness: 'ผู้เล่นต้องเห็นผลกระทบของการตัดสินใจทั้งระยะสั้นและระยะยาว',
  uncertainty_handling: 'ผู้เล่นต้องตัดสินใจหรือปรับตัวเมื่อข้อมูลไม่ครบหรือผลลัพธ์คาดเดาไม่ได้',
  collaboration_under_constraint: 'ผู้เล่นต้องร่วมมือกันภายใต้ข้อจำกัดด้านข้อมูล เวลา หรือทรัพยากร',
  concrete_understanding: 'กลไกช่วยทำให้เรื่องยากหรือ abstract กลายเป็นสิ่งที่เห็นและเข้าใจได้ง่ายขึ้น',
};

export const CONFIDENCE_LABELS_TH = {
  low: 'ต่ำ',
  medium: 'กลาง',
  high: 'สูง',
};

export const WOL_LABEL_TOOLTIPS_TH = {
  core_mode: 'สรุปว่าชุดนี้บังคับให้ผู้เล่นใช้วิธีคิดหรือวิธีประมวลผลแบบไหนเป็นหลัก',
  outcome_zone: 'สรุปว่าผลลัพธ์เด่นของชุดนี้กระจุกอยู่ในมิติการเรียนรู้แบบใดมากที่สุด',
  evidence_confidence: 'บอกระดับความมั่นใจของการอ่านผลลัพธ์นี้จากความชัดของ mechanic mapping ไม่ใช่หลักฐาน playtest',
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
    id: 'wishlist',
    tabLabel: 'Wishlist',
    title: 'Wishlist',
    subtitle: 'เกมการเงินที่เน้น trade-off การใช้เงิน การกู้ และการวางแผนเป้าหมาย',
    gameNameTh: 'Wishlist',
    domain: 'การเงิน',
    evidenceSummary: 'Impact card ปัจจุบันแข็งที่สุดในชุดนี้: E4 / R3 พร้อมงานวิจัย pre-post และการใช้งานวงกว้าง',
    publicReason: 'มี public evidence แข็งมากและเป็นตัวอย่างชัดของการใช้ Wizard Hat อ่านเกมที่ออกแบบเพื่อ financial decision-making',
    learningGoal:
      'ช่วยให้ผู้เล่นเปรียบเทียบการใช้เงิน การเก็บเงิน การกู้ และการลงทุน ภายใต้ข้อจำกัดจริง พร้อมเห็นผลของการตัดสินใจระยะสั้นและระยะยาว',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ critical thinking, decision-making และ consequence awareness',
    whyThisCase: 'กรณีนี้ยืนยันว่า Wizard Hat ใช้กับเกมที่มีโครงเศรษฐกิจและการตัดสินใจซับซ้อนได้ ไม่ได้จำกัดอยู่แค่เกมสนทนาหรือเกมทีม',
    boxImage: wishlistImage,
    imageCaption: 'ตอนนี้มีไฟล์โลโก้/ภาพหลักจาก WoL แล้ว แต่ยังควรเพิ่มภาพกล่องหรือภาพเล่นจริงเพื่อให้ case นี้เล่าเรื่องได้เต็มขึ้น',
    missingAssets: ['ภาพกล่องเกมหรือ box render', 'ภาพผู้เล่นกำลังตัดสินใจ/จัดการทรัพยากรบนโต๊ะ'],
    cardNos: ['1', '5', '16', '9', '31', '36', '38', '22'],
  },
  {
    id: 'local-election',
    tabLabel: 'Local Election',
    title: 'Local Election',
    subtitle: 'เกม civic learning ที่ทำให้ผลของการเลือกและการจัดสรรทรัพยากรเห็นเป็นรูปธรรม',
    gameNameTh: 'Local Election',
    domain: 'พลเมือง / การเมืองท้องถิ่น',
    evidenceSummary: 'มี impact card ระดับ E3 / R2 จาก KPI book และข้อมูลผู้เข้าร่วม N=45',
    publicReason: 'เป็นหนึ่งในเคส civic ที่แข็งที่สุดของ WoL ทั้งในเชิง public source และ institutional validation',
    learningGoal:
      'ช่วยให้ผู้เล่นเห็นว่าการเลือกผู้แทน นโยบาย และการจัดสรรทรัพยากรส่งผลต่อเมืองและชีวิตพลเมืองอย่างไร',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ participation, consequence awareness และ systems thinking เชิง civic',
    whyThisCase: 'กรณีนี้แสดงพลังของเกมที่เอาประเด็นนโยบายสาธารณะมาทำให้ผู้เล่นเห็น causal link ผ่านการลงคะแนนและผลลัพธ์ของเมือง',
    boxImage: localElectionImage,
    imageCaption: 'มีภาพกล่องจาก WoL แล้ว เหลือเติมภาพบอร์ดหรือภาพกิจกรรมจะช่วยให้คนเข้าใจวิธีเล่นและผลการเรียนรู้เร็วขึ้น',
    missingAssets: ['ภาพกระดาน/องค์ประกอบเมือง', 'ภาพกิจกรรมหรือผู้เล่นกำลังโหวต/ตัดสินใจ'],
    cardNos: ['1', '5', '16', '13', '39', '45', '21', '26'],
  },
  {
    id: 'richman-game',
    tabLabel: 'Richman Game',
    title: 'Richman Game',
    subtitle: 'เกมภาษีและการเงินสำหรับผู้เริ่มทำงาน ที่แปลงเรื่องยากให้เข้าใจผ่านการจำลองชีวิต',
    gameNameTh: 'Richman Game',
    domain: 'การเงิน / ภาษี',
    evidenceSummary: 'หลักฐานเชิงผลลัพธ์ยังอ่อนกว่า 2 เคสแรก แต่มี WoL public asset ชัดและเป็นเคสที่อธิบายการทำเรื่องยากให้จับต้องได้ดี',
    publicReason: 'เหมาะเป็น case ที่ 3 หากต้องการใช้เฉพาะงานที่ WoL เผยแพร่เองและมีภาพประกอบพร้อมใช้ได้ทันที',
    learningGoal:
      'ช่วยให้ผู้เล่นเข้าใจวงจรภาษี รายได้ รายจ่าย และผลของการวางแผนการเงินในช่วงปีแรกของการทำงาน',
    keyUse: 'เหมาะกับโจทย์ที่ต้องการ concrete understanding, self-management และ consequence awareness',
    whyThisCase: 'กรณีนี้ทำให้เห็นว่าบางโปรเจกต์ไม่ได้เด่นเรื่อง impact evidence สูงสุด แต่เด่นเรื่องการเปลี่ยนเรื่อง abstract ให้เป็นประสบการณ์ที่เรียนรู้ได้ง่ายมาก',
    boxImage: richmanGameImage,
    imageCaption: 'มีภาพกล่องจาก WoL แล้ว ถ้าเติมภาพกระดานจริงหรือ tax worksheet จะช่วยให้เห็นพลังของ Touch มากขึ้น',
    missingAssets: ['ภาพกระดานหรือองค์ประกอบเกมจริง', 'ภาพ tax worksheet / moment ที่ผู้เล่นคำนวณตัดสินใจ'],
    cardNos: ['1', '5', '16', '9', '38', '46', '22', '18'],
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

function normalizeConfidenceBucket(bucket) {
  if (bucket === 'high' || bucket === 'medium' || bucket === 'low') return bucket;
  if (bucket === 'medium-high') return 'medium';
  if (bucket === 'low-medium') return 'low';
  return 'medium';
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
    const bucket = normalizeConfidenceBucket(card.skill_confidence || 'medium');
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

function buildDimensionProfile(skillProfile) {
  return DIMENSION_KEYS.map((dimensionKey) => {
    const skills = SKILL_KEYS.filter((skillKey) => SKILL_DIMENSIONS[skillKey] === dimensionKey);
    const total = skills.reduce((sum, skillKey) => sum + (skillProfile[skillKey] ?? 0), 0);
    const average = Number((total / skills.length).toFixed(1));
    return {
      key: dimensionKey,
      label: DIMENSION_LABELS_TH[dimensionKey],
      sublabel: DIMENSION_SUBLABELS_TH[dimensionKey],
      color: DIMENSION_COLORS[dimensionKey],
      average,
      skills,
    };
  }).sort((a, b) => b.average - a.average);
}

function buildWolReadingLabels(learningProfile, dimensionProfile, confidence) {
  const topFunctions = rankSignals(learningProfile, LEARNING_FUNCTION_LABELS_TH, 2, 1);
  const topDimensions = dimensionProfile.filter((dimension) => dimension.average >= 1).slice(0, 2);

  return [
    {
      key: 'core_mode',
      label: 'วิธีคิดหลัก',
      summary:
        topFunctions.length > 0
          ? topFunctions.map((item) => item.label).join(' + ')
          : 'ยังไม่เห็นรูปแบบการคิดที่เด่นชัดพอ',
      tooltip: WOL_LABEL_TOOLTIPS_TH.core_mode,
    },
    {
      key: 'outcome_zone',
      label: 'มิติการเรียนรู้เด่น',
      summary:
        topDimensions.length > 0
          ? topDimensions.map((dimension) => dimension.label).join(' + ')
          : 'ยังไม่เห็นมิติผลลัพธ์ที่เด่นชัดพอ',
      tooltip: WOL_LABEL_TOOLTIPS_TH.outcome_zone,
    },
    {
      key: 'evidence_confidence',
      label: 'ความมั่นใจของผลลัพธ์',
      summary: `${confidence.labelTh} · ${confidence.reasons[0]}`,
      tooltip: WOL_LABEL_TOOLTIPS_TH.evidence_confidence,
    },
  ];
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

export function buildOutcomeLens(selectedCards, skillProfile) {
  const learningProfile = aggregateByAccumulation(selectedCards, LEARNING_FUNCTION_KEYS, 'learning_functions');
  const topLearningFunctions = rankSignals(learningProfile, LEARNING_FUNCTION_LABELS_TH, 5, 1);
  const topSkills = rankSignals(skillProfile, SKILL_LABELS_TH, 5, 1);
  const confidence = confidenceSummary(selectedCards);
  const dimensionProfile = buildDimensionProfile(skillProfile);
  const wolReadingLabels = buildWolReadingLabels(learningProfile, dimensionProfile, confidence);
  const allSkills = SKILL_KEYS.map((key) => ({
    key,
    label: SKILL_LABELS_TH[key],
    value: skillProfile[key] ?? 0,
    tooltip: SKILL_TOOLTIPS_TH[key],
    dimension: SKILL_DIMENSIONS[key],
  }));
  const allLearningFunctions = LEARNING_FUNCTION_KEYS.map((key) => ({
    key,
    label: LEARNING_FUNCTION_LABELS_TH[key],
    value: learningProfile[key] ?? 0,
    tooltip: LEARNING_FUNCTION_TOOLTIPS_TH[key],
  }));

  return {
    learningProfile,
    skillProfile,
    dimensionProfile,
    topLearningFunctions,
    topSkills,
    allSkills,
    allLearningFunctions,
    wolReadingLabels,
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

export function assessDeck(cardNos) {
  const selectedCards = getCardsForAssessment(cardNos);
  const skillProfile = aggregateByAccumulation(selectedCards, SKILL_KEYS, 'skills');

  return {
    selectedCards,
    ...buildOutcomeLens(selectedCards, skillProfile),
  };
}
