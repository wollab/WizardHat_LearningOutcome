import { useState } from 'react';
import TargetProfileForm from './components/TargetProfileForm.jsx';
import DeckResult from './components/DeckResult.jsx';
import CardCapture from './components/CardCapture.jsx';
import CardConfirmList from './components/CardConfirmList.jsx';
import OutcomeReport from './components/OutcomeReport.jsx';
import CaseStudyGallery from './components/CaseStudyGallery.jsx';
import { runSearch } from './lib/cardSearch.js';
import { DURATION_OPTIONS } from './lib/scoring.js';
import { assessDeck } from './lib/assessment.js';

const MODE = { TARGET: 'target', RESULT: 'result' };
const PHOTO_STEP = { CAPTURE: 'capture', CONFIRM: 'confirm', REPORT: 'report' };
const EXPERIENCE = { V1: 'v1', V2: 'v2' };

export default function App() {
  const [experience, setExperience] = useState(EXPERIENCE.V1);
  const [usePhotoMode, setUsePhotoMode] = useState(false);

  const [mode, setMode] = useState(MODE.TARGET);
  const [target, setTarget] = useState(null);
  const [tasteCount, setTasteCount] = useState(null);
  const [result, setResult] = useState(null);

  const [photoStep, setPhotoStep] = useState(PHOTO_STEP.CAPTURE);
  const [detectedCardNos, setDetectedCardNos] = useState([]);
  const [photoResult, setPhotoResult] = useState(null);

  function handleTargetSubmit({ targets, tasteCount: count }) {
    setTarget(targets);
    setTasteCount(count);
    setResult(runSearch(targets, count));
    setMode(MODE.RESULT);
  }

  function handleRerun() {
    setResult(runSearch(target, tasteCount));
  }

  // Changing duration on the result screen swaps TASTE count only — the
  // skill profile the deck is being matched against stays untouched.
  function handleChangeDuration(count) {
    setTasteCount(count);
    setResult(runSearch(target, count));
  }

  // "ตั้งเป้าหมายใหม่" keeps target/tasteCount around so the form reopens
  // pre-filled instead of resetting every skill back to 0.
  function handleRestart() {
    setResult(null);
    setMode(MODE.TARGET);
  }

  function renderClassicFlow() {
    if (usePhotoMode) {
      return (
        <div className="min-h-screen py-8">
          <header className="text-center mb-6">
            <h1 className="text-2xl">Wizard Hat — Learning Outcome (โหมดถ่ายรูป — ทดลอง)</h1>
          </header>
          {photoStep === PHOTO_STEP.CAPTURE && (
            <CardCapture
              onDetected={(d) => {
                setDetectedCardNos(d.map((x) => String(x.card_no)));
                setPhotoStep(PHOTO_STEP.CONFIRM);
              }}
              onSkip={() => {
                setDetectedCardNos([]);
                setPhotoStep(PHOTO_STEP.CONFIRM);
              }}
            />
          )}
          {photoStep === PHOTO_STEP.CONFIRM && (
            <CardConfirmList
              detectedCardNos={detectedCardNos}
              onConfirm={(cardNos) => {
                setPhotoResult(assessDeck(cardNos));
                setPhotoStep(PHOTO_STEP.REPORT);
              }}
            />
          )}
          {photoStep === PHOTO_STEP.REPORT && photoResult && (
            <OutcomeReport result={photoResult} onRestart={() => setPhotoStep(PHOTO_STEP.CAPTURE)} />
          )}
          <p className="text-center mt-6">
            <button onClick={() => setUsePhotoMode(false)} className="text-sm text-wizard-plum underline">
              กลับไปโหมดตั้งเป้าหมาย
            </button>
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-8">
        <header className="text-center mb-6">
          <h1 className="text-2xl">Wizard Hat — Learning Outcome</h1>
        </header>

        {mode === MODE.TARGET && (
          <TargetProfileForm
            onSubmit={handleTargetSubmit}
            initialTargets={target ?? undefined}
            initialDurationIdx={
              tasteCount != null ? DURATION_OPTIONS.findIndex((d) => d.tasteCount === tasteCount) : undefined
            }
          />
        )}
        {mode === MODE.RESULT && result && (
          <DeckResult
            result={result}
            target={target}
            tasteCount={tasteCount}
            onRerun={handleRerun}
            onChangeDuration={handleChangeDuration}
            onRestart={handleRestart}
          />
        )}

        {mode === MODE.TARGET && (
          <p className="text-center mt-2">
            <button onClick={() => setUsePhotoMode(true)} className="text-sm text-wizard-plum underline">
              ใช้โหมดถ่ายรูป (ทดลอง)
            </button>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-white/80 border border-wizard-ink/10 p-2 inline-flex gap-2 mb-6">
          <button
            onClick={() => setExperience(EXPERIENCE.V1)}
            className={`rounded-xl px-4 py-2 text-sm ${
              experience === EXPERIENCE.V1 ? 'bg-wizard-teal text-white' : 'text-wizard-ink'
            }`}
          >
            เวอร์ชันเดิม: ตั้งเป้าทักษะแล้วหา deck
          </button>
          <button
            onClick={() => setExperience(EXPERIENCE.V2)}
            className={`rounded-xl px-4 py-2 text-sm ${
              experience === EXPERIENCE.V2 ? 'bg-wizard-plum text-white' : 'text-wizard-ink'
            }`}
          >
            กรณีศึกษา: อ่านผลลัพธ์ภาษาไทย
          </button>
        </div>
      </div>

      {experience === EXPERIENCE.V1 ? renderClassicFlow() : <CaseStudyGallery />}
    </div>
  );
}
