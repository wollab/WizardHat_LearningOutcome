import { useRef, useState } from 'react';
import { identifyCardsFromImage } from '../lib/api.js';

export default function CardCapture({ onDetected, onSkip }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    try {
      const result = await identifyCardsFromImage(imageBase64);
      onDetected(result.detected_cards || []);
    } catch (err) {
      setError('วิเคราะห์รูปไม่สำเร็จ — เลือกการ์ดเองได้จากขั้นต่อไป');
      onDetected([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-xl mb-3">ถ่ายรูปชุดการ์ด Wizard Hat</h2>
      <p className="text-sm text-wizard-ink/70 mb-4">
        วางการ์ดที่เลือกให้เห็นชื่อกลไกชัดเจน แล้วถ่ายรูปหรืออัปโหลด
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <img src={preview} alt="preview" className="rounded-lg mb-4 max-h-72 mx-auto object-contain" />
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-10 border-2 border-dashed border-wizard-teal rounded-lg text-wizard-plum mb-4"
        >
          แตะเพื่อถ่ายรูป / เลือกรูป
        </button>
      )}

      {preview && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 rounded-lg border border-wizard-teal text-wizard-plum"
          >
            ถ่ายใหม่
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-wizard-teal text-white disabled:opacity-50"
          >
            {loading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์รูป'}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <button onClick={onSkip} className="text-sm text-wizard-plum underline">
        ข้าม — เลือกการ์ดเองจากรายการ
      </button>
    </div>
  );
}
