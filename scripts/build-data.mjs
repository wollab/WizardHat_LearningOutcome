// Merges the 3 source CSVs from WoL_Transferable_Skills_Game_Framework into one
// JSON file the app reads at runtime. Re-run this whenever the source CSVs change:
//   node scripts/build-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMEWORK_DIR = path.resolve(
  __dirname,
  '../../03_Documents/02_Internal_Projects/WoL_Transferable_Skills_Game_Framework'
);
const OUTCOME_DIR = path.resolve(
  __dirname,
  '../../03_Documents/02_Internal_Projects/WoL_Wizard_Hat_Learning_Outcome_System'
);

const CARDS_RAW = path.join(FRAMEWORK_DIR, '01_source/wizard_hat_cards_raw.csv');
const SKILLS_CSV = path.join(FRAMEWORK_DIR, '02_working/wizard_hat_to_transferable_skills.csv');
const DEMANDS_CSV = path.join(FRAMEWORK_DIR, '02_working/wizard_hat_to_player_demands.csv');
const LEARNING_FUNCTIONS_CSV = path.join(OUTCOME_DIR, '02_working/wizard_hat_to_learning_functions.csv');

const OUT_FILE = path.resolve(__dirname, '../src/data/wizard_hat_learning_data.json');

// Minimal CSV parser: handles quoted fields with embedded commas, no embedded newlines in fields.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    if (line === '' && !inQuotes) continue;
    let i = 0;
    if (!inQuotes) {
      row = [];
      field = '';
    }
    while (i < line.length) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i += 1;
          continue;
        }
        field += ch;
        i += 1;
        continue;
      }
      if (ch === '"') {
        inQuotes = true;
        i += 1;
        continue;
      }
      if (ch === ',') {
        row.push(field);
        field = '';
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
    }
    if (inQuotes) {
      field += '\n';
      continue;
    }
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = r[idx] ?? '';
    });
    return obj;
  });
}

const SKILL_KEYS = [
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

const LEARNING_FUNCTION_KEYS = [
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

const cardsRaw = parseCsv(readFileSync(CARDS_RAW, 'utf-8'));
const skillsRows = parseCsv(readFileSync(SKILLS_CSV, 'utf-8'));
const demandsRows = parseCsv(readFileSync(DEMANDS_CSV, 'utf-8'));
const learningFunctionRows = parseCsv(readFileSync(LEARNING_FUNCTIONS_CSV, 'utf-8'));

const skillsByCardNo = new Map(skillsRows.map((r) => [r.card_no, r]));
const demandsByCardNo = new Map(demandsRows.map((r) => [r.card_no, r]));
const learningFunctionsByCardNo = new Map(learningFunctionRows.map((r) => [r.card_no, r]));

const data = cardsRaw.map((r) => {
  const cardNo = r['No'];
  const skillRow = skillsByCardNo.get(cardNo);
  const demandRow = demandsByCardNo.get(cardNo);
  const learningFunctionRow = learningFunctionsByCardNo.get(cardNo);

  const skills = {};
  for (const key of SKILL_KEYS) {
    const levelKey = `${key}_level`;
    const raw = skillRow ? skillRow[levelKey] : undefined;
    const n = raw !== undefined ? parseInt(raw, 10) : NaN;
    skills[key] = Number.isFinite(n) ? n : 0;
  }

  const learningFunctions = {};
  for (const key of LEARNING_FUNCTION_KEYS) {
    const levelKey = `${key}_level`;
    const raw = learningFunctionRow ? learningFunctionRow[levelKey] : undefined;
    const n = raw !== undefined ? parseInt(raw, 10) : NaN;
    learningFunctions[key] = Number.isFinite(n) ? n : 0;
  }

  return {
    card_no: cardNo,
    category: r['ประเภทการ์ด'],
    nameTh: r['ชื่อการ์ด'],
    mechanic_name: r['ชื่อกลไก'],
    mechanic_description: r['คำอธิบาย'],
    examples: (r['ตัวอย่างเกม'] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    skills,
    learning_functions: learningFunctions,
    top_learning_functions: learningFunctionRow?.top_functions ?? '',
    learning_function_rationale: learningFunctionRow?.rationale ?? '',
    learning_function_notes: learningFunctionRow?.notes ?? '',
    skill_rationale: skillRow ? skillRow.rationale : '',
    skill_confidence: skillRow ? skillRow.confidence : '',
    demands: {
      cognitive: demandRow ? demandRow.cognitive_demands : '',
      social: demandRow ? demandRow.social_demands : '',
      emotional: demandRow ? demandRow.emotional_demands : '',
      observable_behaviors: demandRow ? demandRow.observable_behaviors : '',
      reward_mindset_effect: demandRow ? demandRow.reward_mindset_effect : '',
      ending_pressure_effect: demandRow ? demandRow.ending_pressure_effect : '',
      touch_concretization_effect: demandRow ? demandRow.touch_concretization_effect : '',
    },
  };
});

writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Wrote ${data.length} cards to ${OUT_FILE}`);
