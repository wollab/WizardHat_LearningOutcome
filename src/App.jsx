import { useState } from 'react';
import TargetProfileForm from './components/TargetProfileForm.jsx';
import DeckResult from './components/DeckResult.jsx';
import CardCapture from './components/CardCapture.jsx';
import CardConfirmList from './components/CardConfirmList.jsx';
import OutcomeReport from './components/OutcomeReport.jsx';
import { runSearch } from './lib/cardSearch.js';
import { scoreCombination, DURATION_OPTIONS } from './lib/scoring.js';

const MODE = { TARGET: 'target', RESULT: 'result' };
const PHOTO_STEP = { CAPTURE: 'capture', CONFIRM: 'confirm', REPORT: 'report' };

export default function App() {
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
              setPhotoResult(scoreCombination(cardNos, null));
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
