from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import json
import re
import os

app = FastAPI(title="AI Resume Analyzer", version="1.0.0")

# CORS fix — allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

class AnalyzeRequest(BaseModel):
    job_description: str
    resume: str

class AnalyzeResponse(BaseModel):
    overall_score: int
    skill_score: str
    exp_score: str
    keyword_score: str
    impact_score: str
    verdict: str
    matching_keywords: list[str]
    missing_keywords: list[str]
    gaps: list[str]
    resume_summary: str
    cover_letter: str

@app.get("/")
def root():
    return {"status": "AI Resume Analyzer API is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    if len(req.job_description.strip()) < 100:
        raise HTTPException(status_code=400, detail="Job description is too short.")
    if len(req.resume.strip()) < 100:
        raise HTTPException(status_code=400, detail="Resume is too short.")

    prompt = f"""You are an expert career coach and ATS specialist. Analyze how well this resume matches the job description.

JOB DESCRIPTION:
{req.job_description}

RESUME:
{req.resume}

Respond with ONLY a valid JSON object (no markdown, no backticks, no extra text) in exactly this format:
{{
  "overall_score": <number 1-10>,
  "skill_score": "<X/10>",
  "exp_score": "<X/10>",
  "keyword_score": "<X/10>",
  "impact_score": "<X/10>",
  "verdict": "<2-3 sentence honest assessment of fit>",
  "matching_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "gaps": ["gap 1", "gap 2", "gap 3", "gap 4", "gap 5"],
  "resume_summary": "<rewritten resume summary of 80-100 words tailored to match this JD, impact-driven, first person>",
  "cover_letter": "<3 paragraphs opening a cover letter for this specific role, referencing company needs, candidate's relevant experience, and genuine enthusiasm. End with a transition sentence.>"
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text
    clean = re.sub(r"```json|```", "", raw).strip()
    data = json.loads(clean)
    return AnalyzeResponse(**data)