import { getAllCards, SKILL_KEYS, scoreCombination, DURATION_OPTIONS } from './scoring.js';

const CORE_CATEGORIES = ['Conflict', 'Order', 'Reward', 'Ending'];
const CANDIDATE_POOL_SIZE = 5;
const DEFAULT_TASTE_COUNT = DURATION_OPTIONS[1].tasteCount;

function cartesianProduct(arrays) {
  return arrays.reduce(
    (acc, arr) => acc.flatMap((combo) => arr.map((item) => [...combo, item])),
    [[]]
  );
}

function distance(achievedSkills, target) {
  let sum = 0;
  for (const key of SKILL_KEYS) {
    const diff = (target[key] ?? 0) - achievedSkills[key].achieved;
    if (diff > 0) sum += diff * diff; // only penalize under-shooting the target
  }
  return sum;
}

function buildCoreCombos(allCards) {
  const byCategory = CORE_CATEGORIES.map((cat) =>
    allCards.filter((c) => c.category === cat).map((c) => c.card_no)
  );
  return cartesianProduct(byCategory);
}

// Greedily layer exactly `tasteCount` TASTE cards onto a CORE combo, each step
// picking whichever remaining card reduces distance-to-target the most.
// tasteCount is now a deliberate user choice (tied to play length), so unlike
// the old min/max-range version this always fills to the exact count.
function greedyAddTaste(coreCardNos, tastePool, target, tasteCount) {
  let selected = [...coreCardNos];
  let remaining = [...tastePool];
  let currentDist = distance(scoreCombination(selected, target).skills, target);

  for (let i = 0; i < tasteCount; i++) {
    if (remaining.length === 0) break;

    let best = null;
    let bestDist = Infinity;
    for (const candidate of remaining) {
      const trial = [...selected, candidate];
      const d = distance(scoreCombination(trial, target).skills, target);
      if (d < bestDist) {
        bestDist = d;
        best = candidate;
      }
    }
    if (best == null) break;

    selected.push(best);
    remaining = remaining.filter((c) => c !== best);
    currentDist = bestDist;
  }

  return { cardNos: selected, finalDistance: currentDist };
}

// Pure search: returns the top-N closest decks to `target` (no randomness).
export function findCandidateDecks(target, tasteCount = DEFAULT_TASTE_COUNT, poolSize = CANDIDATE_POOL_SIZE) {
  const allCards = getAllCards();
  const tastePool = allCards
    .filter((c) => !CORE_CATEGORIES.includes(c.category))
    .map((c) => c.card_no);

  const coreCombos = buildCoreCombos(allCards);

  const results = coreCombos.map((core) => greedyAddTaste(core, tastePool, target, tasteCount));
  results.sort((a, b) => a.finalDistance - b.finalDistance);

  return results.slice(0, poolSize);
}

// Picks one deck from the top-N closest matches — "run again" gives a
// different deck each time. Weighted (not uniform) by closeness, so the
// closest matches are picked far more often than the pool's tail — variety
// without regularly handing back a noticeably-off-target deck.
export function runSearch(target, tasteCount = DEFAULT_TASTE_COUNT) {
  const candidates = findCandidateDecks(target, tasteCount);
  const weights = candidates.map((c) => 1 / (1 + c.finalDistance));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let roll = Math.random() * totalWeight;
  let pick = candidates[0];
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      pick = candidates[i];
      break;
    }
  }

  return scoreCombination(pick.cardNos, target);
}
