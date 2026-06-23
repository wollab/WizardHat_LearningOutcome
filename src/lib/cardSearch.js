import { getAllCards, SKILL_KEYS, scoreCombination } from './scoring.js';

const CORE_CATEGORIES = ['Conflict', 'Order', 'Reward', 'Ending'];
const MIN_TASTE = 2;
const MAX_TASTE = 4;
const CANDIDATE_POOL_SIZE = 8;
const MIN_IMPROVEMENT = 0.05; // stop adding TASTE past MIN_TASTE if gain is this small

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

// Greedily layer TASTE cards onto a CORE combo, picking whichever remaining
// card reduces distance-to-target the most each step.
function greedyAddTaste(coreCardNos, tastePool, target) {
  let selected = [...coreCardNos];
  let remaining = [...tastePool];
  let currentDist = distance(scoreCombination(selected, target).skills, target);

  for (let i = 0; i < MAX_TASTE; i++) {
    if (remaining.length === 0) break;

    // Below the floor, always add the least-bad remaining card (even with zero
    // improvement) so a deck never ends up with fewer than MIN_TASTE TASTE cards.
    const forceFill = i < MIN_TASTE;
    let best = null;
    let bestDist = forceFill ? Infinity : currentDist;

    for (const candidate of remaining) {
      const trial = [...selected, candidate];
      const d = distance(scoreCombination(trial, target).skills, target);
      if (d < bestDist) {
        bestDist = d;
        best = candidate;
      }
    }
    if (best == null) break;

    if (!forceFill) {
      const improvement = currentDist - bestDist;
      if (improvement < MIN_IMPROVEMENT) break;
    }

    selected.push(best);
    remaining = remaining.filter((c) => c !== best);
    currentDist = bestDist;
  }

  return { cardNos: selected, finalDistance: currentDist };
}

// Pure search: returns the top-N closest decks to `target` (no randomness).
export function findCandidateDecks(target, poolSize = CANDIDATE_POOL_SIZE) {
  const allCards = getAllCards();
  const tastePool = allCards
    .filter((c) => !CORE_CATEGORIES.includes(c.category))
    .map((c) => c.card_no);

  const coreCombos = buildCoreCombos(allCards);

  const results = coreCombos.map((core) => greedyAddTaste(core, tastePool, target));
  results.sort((a, b) => a.finalDistance - b.finalDistance);

  return results.slice(0, poolSize);
}

// Picks one deck at random from the top-N closest matches — "run again" gives
// a different deck each time while staying close to the target.
export function runSearch(target) {
  const candidates = findCandidateDecks(target);
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return scoreCombination(pick.cardNos, target);
}
