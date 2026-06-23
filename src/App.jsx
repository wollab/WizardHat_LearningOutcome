import { useState } from 'react';
import TargetProfileForm from './components/TargetProfileForm.jsx';
import DeckResult from './components/DeckResult.jsx';
import CardCapture from './components/CardCapture.jsx';
import CardConfirmList from './components/CardConfirmList.jsx';
import OutcomeReport from './components/OutcomeReport.jsx';
import { runSearch } from './lib/cardSearch.js';
import { scoreCombination } from './lib/scoring.js';

const MODE = { TARGET: 'target', RESULT: 'result' };
const PHOTO_STEP = { CAPTURE: 'capture', CONFIRM: 'confirm', REPORT: 'report' };

export default function App() {
  const [usePhotoMode, setUsePhotoMode] = useState(false);

  const [mode, setMode] = useState(MODE.TARGET);
  const [target, setTarget] = useState(null);
  const [result, setResult] = useState(null);

  const [photoStep, setPhotoStep] = useState(PHOTO_STEP.CAPTURE);
  const [detectedCardNos, setDetectedCardNos] = useState([]);
  const [photoResult, setPhotoResult] = useState(null);

  function handleTargetSubmit(t) {
    setTarget(t);
    setResult(runSearch(t));
    setMode(MODE.RESULT);
  }

  function handleRerun() {
    setResult(runSearch(target));
  }

  function handleRestart() {
    setTarget(null);
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

      {mode === MODE.TARGET && <TargetProfileForm onSubmit={handleTargetSubmit} />}
      {mode === MODE.RESULT && result && (
        <DeckResult result={result} target={target} onRerun={handleRerun} onRestart={handleRestart} />
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
