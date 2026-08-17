import './InputPanel.css'

export default function InputPanel({ jd, setJd, resume, setResume, loading, loadingMsg, error, onAnalyze }) {
  return (
    <div className="input-panel">
      <div className="input-grid">
        <div className="panel">
          <label className="panel-label">Job description</label>
          <textarea
            className="textarea"
            rows={10}
            placeholder="Paste the full job description here — role, requirements, responsibilities, tech stack..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            disabled={loading}
          />
          <div className="char-count">{jd.length} characters</div>
        </div>

        <div className="panel">
          <label className="panel-label">Your resume</label>
          <textarea
            className="textarea"
            rows={10}
            placeholder="Paste your resume text here — experience, skills, education, projects..."
            value={resume}
            onChange={e => setResume(e.target.value)}
            disabled={loading}
          />
          <div className="char-count">{resume.length} characters</div>
        </div>
      </div>

      {error && <div className="error-box">⚠ {error}</div>}

      {loading ? (
        <div className="loading-wrap">
          <div className="loading-bar"><div className="loading-fill" /></div>
          <div className="loading-msg">{loadingMsg}</div>
        </div>
      ) : (
        <button className="btn-analyze" onClick={onAnalyze} disabled={!jd.trim() || !resume.trim()}>
          ✦ Analyze fit
        </button>
      )}

      <p className="hint">Analysis takes ~15 seconds · Powered by Claude Sonnet</p>
    </div>
  )
}
