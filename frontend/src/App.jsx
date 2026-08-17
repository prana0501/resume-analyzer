import { useState } from 'react'
import axios from 'axios'
import InputPanel from './components/InputPanel.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import './App.css'

export default function App() {
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const loadingMessages = [
    'Reading your resume and job description...',
    'Identifying matching and missing keywords...',
    'Scoring your fit against the role...',
    'Writing your tailored resume summary...',
    'Crafting your cover letter opening...',
  ]
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0])

  async function analyze() {
    if (!jd.trim() || !resume.trim()) { setError('Please paste both the job description and your resume.'); return }
    if (jd.trim().length < 100) { setError('Job description seems too short. Paste the full JD for accurate analysis.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    setStep(2)

    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[idx])
    }, 2800)

    try {
      const BASE = import.meta.env.VITE_API_URL || ''
      const { data } = await axios.post(`${BASE}/analyze`, { job_description: jd, resume })
      setResult(data)
      setStep(3)
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Check your API key and try again.')
      setStep(1)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  function reset() {
    setJd(''); setResume(''); setResult(null); setError(''); setStep(1)
    setLoadingMsg(loadingMessages[0])
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span className="logo-text">Resume Analyzer</span>
          </div>
          <div className="tagline">AI-powered fit scoring & tailored resume rewrite</div>
        </div>
      </header>

      <main className="main">
        <StepIndicator step={step} />

        {!result && (
          <InputPanel
            jd={jd} setJd={setJd}
            resume={resume} setResume={setResume}
            loading={loading}
            loadingMsg={loadingMsg}
            error={error}
            onAnalyze={analyze}
          />
        )}

        {result && (
          <ResultPanel result={result} onReset={reset} />
        )}
      </main>

      <footer className="footer">
        Built with Claude API · Your data is never stored
      </footer>
    </div>
  )
}

function StepIndicator({ step }) {
  const steps = ['Job description', 'Analyzing', 'Results']
  return (
    <div className="steps">
      {steps.map((label, i) => {
        const num = i + 1
        const isDone = step > num
        const isActive = step === num
        return (
          <div key={label} className="step-item">
            <div className={`step-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
              {isDone ? '✓' : num}
            </div>
            <span className={`step-label ${isActive ? 'active' : ''}`}>{label}</span>
            {i < steps.length - 1 && <div className={`step-line ${step > num ? 'done' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}
