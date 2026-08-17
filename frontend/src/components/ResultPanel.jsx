import { useState } from 'react'
import './ResultPanel.css'

export default function ResultPanel({ result, onReset }) {
  const score = result.overall_score
  const color = score >= 7 ? 'var(--success)' : score >= 5 ? 'var(--warning)' : 'var(--danger)'

  return (
    <div className="result-wrap">
      <div className="result-header">
        <h2 className="result-title">Analysis results</h2>
        <button className="btn-reset" onClick={onReset}>↺ Analyze another</button>
      </div>

      {/* Score row */}
      <div className="score-row">
        <div className="overall-card">
          <div className="overall-number" style={{ color }}>{score}/10</div>
          <div className="overall-label">Overall fit</div>
        </div>
        <div className="verdict-text">{result.verdict}</div>
      </div>

      {/* Sub-scores */}
      <div className="subscores-grid">
        {[
          { label: 'Skills match', val: result.skill_score },
          { label: 'Experience level', val: result.exp_score },
          { label: 'Keyword density', val: result.keyword_score },
          { label: 'Impact framing', val: result.impact_score },
        ].map(s => (
          <div key={s.label} className="subscore-card">
            <div className="subscore-val">{s.val}</div>
            <div className="subscore-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div className="panel">
        <div className="panel-label">Keyword analysis</div>
        <div className="kw-section">
          <div className="kw-head kw-green">✓ Matching ({result.matching_keywords.length})</div>
          <div className="tag-wrap">
            {result.matching_keywords.map(k => <span key={k} className="tag tag-match">{k}</span>)}
          </div>
        </div>
        <div className="divider" />
        <div className="kw-section">
          <div className="kw-head kw-red">✗ Missing ({result.missing_keywords.length})</div>
          <div className="tag-wrap">
            {result.missing_keywords.map(k => <span key={k} className="tag tag-miss">{k}</span>)}
          </div>
        </div>
      </div>

      {/* Gaps */}
      <div className="panel">
        <div className="panel-label">Gaps & recommendations</div>
        <ul className="gap-list">
          {result.gaps.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>

      {/* Resume summary rewrite */}
      <CopyPanel
        label="Tailored resume summary"
        hint="Replace your current summary with this — written to match this specific JD."
        text={result.resume_summary}
      />

      {/* Cover letter */}
      <CopyPanel
        label="Cover letter opening"
        hint="First 3 paragraphs tailored to this role. Add company-specific details to finish it."
        text={result.cover_letter}
      />

      <button className="btn-bottom-reset" onClick={onReset}>↺ Analyze a new role</button>
    </div>
  )
}

function CopyPanel({ label, hint, text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="panel">
      <div className="panel-label">{label}</div>
      {hint && <div className="panel-hint">{hint}</div>}
      <div className="copy-box">
        <button className="copy-btn" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        <p className="copy-text">{text}</p>
      </div>
    </div>
  )
}
