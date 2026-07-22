"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { OffPlanFAQ, OffPlanExtras } from "@/types/database";

interface Props {
  initialFaqs: OffPlanFAQ[];
  onSave: (extras: OffPlanExtras) => Promise<{ error?: string }>;
}

// Simple Q&A parser — supports several common formats
function parseText(raw: string): OffPlanFAQ[] {
  const text = raw.trim();

  // Format 1: Q: question \n A: answer
  const qaBlocks = text.split(/\n{2,}/);
  const fmt1: OffPlanFAQ[] = [];
  let i = 0;
  while (i < qaBlocks.length) {
    const qLine = qaBlocks[i].replace(/^(Q:|Question:)\s*/i, "").trim();
    const aBlock = qaBlocks[i + 1]?.replace(/^(A:|Answer:)\s*/i, "").trim();
    if (/^(Q:|Question:)/i.test(qaBlocks[i]) && aBlock) {
      fmt1.push({ question: qLine, answer: aBlock });
      i += 2;
    } else { i++; }
  }
  if (fmt1.length) return fmt1;

  // Format 2: Numbered  "1. Question?\nAnswer paragraph"
  const numbered = text.split(/\n(?=\d+[\.\)])/);
  const fmt2: OffPlanFAQ[] = [];
  for (const block of numbered) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      const question = lines[0].replace(/^\d+[\.\)]\s*/, "").trim();
      const answer = lines.slice(1).join(" ").trim();
      if (question && answer) fmt2.push({ question, answer });
    }
  }
  if (fmt2.length) return fmt2;

  // Format 3: Lines ending in "?" are questions, next paragraph is the answer
  const allLines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fmt3: OffPlanFAQ[] = [];
  let j = 0;
  while (j < allLines.length) {
    if (allLines[j].endsWith("?")) {
      const question = allLines[j];
      const answerLines: string[] = [];
      j++;
      while (j < allLines.length && !allLines[j].endsWith("?")) {
        answerLines.push(allLines[j]);
        j++;
      }
      if (answerLines.length) fmt3.push({ question, answer: answerLines.join(" ") });
    } else { j++; }
  }
  return fmt3;
}

const input = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors";
const lbl   = "block text-xs font-medium text-pg-body mb-1.5";

export default function OffPlanFaqsEditor({ initialFaqs, onSave }: Props) {
  const [faqs,       setFaqs]       = useState<OffPlanFAQ[]>(initialFaqs);
  const [parseMode,  setParseMode]  = useState(false);
  const [pasteText,  setPasteText]  = useState("");
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [saved,      setSaved]      = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setSaved(false);
  }

  function removeFaq(idx: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  function updateFaq(idx: number, field: keyof OffPlanFAQ, value: string) {
    setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
    setSaved(false);
  }

  function moveFaq(idx: number, dir: "up" | "down") {
    setFaqs((prev) => {
      const arr = [...prev];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  function handleParse() {
    const parsed = parseText(pasteText);
    if (!parsed.length) {
      setError("Could not detect Q&A pairs. Try the format: Q: question\\nA: answer (separated by blank line).");
      return;
    }
    setFaqs((prev) => [...prev, ...parsed]);
    setPasteText("");
    setParseMode(false);
    setError("");
    setSaved(false);
  }

  async function handleFileRead(file: File) {
    const text = await file.text();
    setPasteText(text);
    setParseMode(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const valid = faqs.filter((f) => f.question.trim() && f.answer.trim());
    const result = await onSave({ faqs: valid });
    setSaving(false);
    if (result.error) setError(result.error);
    else { setFaqs(valid); setSaved(true); }
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading font-semibold text-pg-dark text-sm">FAQs</h3>
          <p className="text-xs text-pg-muted mt-0.5">Add questions manually or paste text to auto-parse.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setParseMode(!parseMode); setError(""); }}
            className="flex items-center gap-1.5 text-sm text-pg-muted hover:text-pg-dark border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors">
            <FileText size={14} />
            {parseMode ? "Cancel" : "Paste / Upload"}
          </button>
          <input ref={fileRef} type="file" accept=".txt,.md" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileRead(e.target.files[0])} />
          <button type="button" onClick={addFaq}
            className="flex items-center gap-1.5 text-sm font-medium text-pg-gold hover:text-pg-gold-dark transition-colors">
            <Plus size={15} />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Paste / file parse panel */}
      {parseMode && (
        <div className="border border-pg-gold/20 bg-pg-gold/5 rounded-xl p-4 space-y-3">
          <p className="text-xs text-pg-muted">
            Paste FAQ text or{" "}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-pg-gold hover:underline">upload a .txt file</button>.
            Supported formats: <code className="bg-white px-1 rounded text-[11px]">Q: ... A: ...</code> or{" "}
            <code className="bg-white px-1 rounded text-[11px]">1. Question? Answer paragraph.</code> or lines ending in <code className="bg-white px-1 rounded text-[11px]">?</code>.
          </p>
          <textarea rows={8} value={pasteText} onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Q: What is the project?\nA: It is a luxury development...\n\nQ: Where is it located?\nA: In Dubai Marina..."}
            className={`${input} resize-none font-mono text-[12px]`} />
          <button type="button" onClick={handleParse} disabled={!pasteText.trim()}
            className="bg-pg-dark text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40">
            Parse & Add FAQs
          </button>
        </div>
      )}

      {/* FAQ list */}
      {faqs.length === 0 && !parseMode && (
        <p className="text-sm text-pg-muted text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No FAQs yet.
        </p>
      )}

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-pg-muted uppercase tracking-wider">FAQ {idx + 1}</span>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => moveFaq(idx, "up")} disabled={idx === 0}
                  className="p-1 text-pg-muted hover:text-pg-dark disabled:opacity-30 transition-colors">
                  <ChevronUp size={13} />
                </button>
                <button type="button" onClick={() => moveFaq(idx, "down")} disabled={idx === faqs.length - 1}
                  className="p-1 text-pg-muted hover:text-pg-dark disabled:opacity-30 transition-colors">
                  <ChevronDown size={13} />
                </button>
                <button type="button" onClick={() => removeFaq(idx)}
                  className="p-1 text-pg-muted hover:text-red-500 transition-colors ml-1">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div>
              <label className={lbl}>Question</label>
              <input type="text" value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)}
                placeholder="What is...?" className={input} />
            </div>
            <div>
              <label className={lbl}>Answer</label>
              <textarea rows={3} value={faq.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                placeholder="The answer to this question..." className={`${input} resize-none`} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}

      {faqs.length > 0 && (
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-pg-gold text-pg-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm disabled:opacity-70">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : saved ? "✓ Saved" : "Save FAQs"}
        </button>
      )}
    </section>
  );
}
