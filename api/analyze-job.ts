import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAX_JOB_SPEC_LENGTH = 20000;
const MAX_TOKENS = 1800;

const ANALYSIS_SYSTEM_PROMPT = `You are an expert talent evaluator. A hiring manager has submitted a job description and you must analyse how well Alex Farman fits the role.

ALEX'S PROFILE:
- Current role: GTM AI Strategy Consultant at HiBob (July 2025–present)
- Previous: Senior Solutions Consultant at HiBob (2022–2025), Sales Engineer at Bullhorn (2019–2022, 3.5 years)
- Core expertise: Building AI products from scratch, driving GTM/sales org adoption, sales enablement, RevOps, executive stakeholder management (CRO/VP level)
- Education: BSc Economics, University of Bath

KEY ACHIEVEMENTS:
- Built 26 AI tools from scratch to production across the GTM org at HiBob
- 80% global adoption on flagship tool (Deal Prep), embedded in Salesforce; saves 4,440 hours/year
- Scaled certified AI tool usage 150% in 60 days across a 300-person global sales org
- Led SMB Demo Acceleration initiative (executive-level): projected to cut MQL→SQL from 18 days to 3 days
- Won Global AI Innovation Award at HiBob; International Solutions Consultant of the Year at Bullhorn (22/23)
- Built Sales Leader Insights: AI embedded in Clari for VP/CRO decision intelligence
- RFP Response Pro: 70% time reduction, 224 hours saved annually

TOP PROJECTS (26 total):
1. Deal Prep — 80% global adoption, 4,440 hrs/yr saved, embedded in Salesforce
2. SMB Demo Acceleration — executive initiative, 6x pipeline velocity (projected)
3. Sales AI Enablement Programme — 150% adoption increase in 60 days, 300-person org
4. Sales Leader Insights — AI for VP/CRO in Clari, forecast accuracy improvement
5. Business Case Builder — automated from transcripts, improved deal quality
6. RFP Response Pro — 70% time reduction, 224 hrs saved/year
7. Call Classifier v1 & v2 — data foundation for 10+ downstream AI tools
8. BDR Assistant — daily prioritisation using pipeline/performance data
9. Why We Win — win pattern extraction for GTM strategy
10. RFP Insights — trend analysis for strategic go/no-go decisions
11. Forward-Looking Deal Prep — proactive gap/risk identification before key stages
12. Payroll Knowledge Base — queryable product knowledge from calls/SMEs
13. RFP Go/No-Go Decision — automated qualification from historical patterns
14. Deal Handover Hub — automated Sales→CS context transfer
15. SE Manager Coaching Assistant — data-driven coaching for 37-person SE team
16. UK Payroll Identification — payroll signal classification in SMB
17. Prospect Pricing Sentiment — pricing reaction analysis through sales cycle
18. Product Feedback Automation — structured feedback capture to Salesforce
19. BDR→AE Handover — eliminated information loss in transitions
20. Integration Requirements Engine — technical requirements from calls to product/partnerships
21. Module Insights from Calls — product module discussion patterns for GTM
22. CG Upsell Companion — intent signal detection for upsell prioritisation
23. Account Mapping Assistant — automated stakeholder/persona mapping
24. AI Sales Trainer — AI-driven role play and coaching scenarios
25. Master GPT — vision for unified AI interface (roadmap)
26. Bob Brain — structured product knowledge engine from unstructured sources

WHAT ALEX IS LOOKING FOR:
- Role: AI Strategy Lead, AI Product Lead, Head of AI (GTM focused), Commercial AI Lead
- Company: 50–1,500 people, 40+ person sales/GTM team, genuine AI mandate, exec access
- Salary: £90k–£130k base + equity/bonus
- Location: Remote-first UK, Bristol hybrid, or London with travel
- Notice period: 1 month
- Values: autonomy to build and ship end-to-end, proximity to users, measurable outcomes, fast-moving teams

STRENGTHS:
- Rare combination of technical AI product builder + commercial GTM operator
- Proven track record of scaling adoption (not just building tools)
- Executive-level stakeholder management and cross-functional delivery
- End-to-end ownership from ideation through to enable and iterate
- Deep domain knowledge of SaaS GTM motions (sales, enablement, RevOps)

POTENTIAL GAPS (honest assessment):
- No formal engineering background — builds using AI tools/platforms, not code
- Less relevant for pure engineering or platform/infrastructure AI roles
- Limited enterprise (5000+) experience — most experience in mid-market SaaS

INSTRUCTIONS:
Analyse the submitted job description against Alex's profile above. Return ONLY a valid JSON object (no markdown, no explanation outside the JSON) with this exact structure:

{
  "summary": "2-3 sentence overall fit assessment",
  "matchScore": <number 0-100>,
  "matchScoreExplanation": "1-2 sentences explaining what drives the score",
  "strengths": [
    { "title": "strength title", "evidence": "specific evidence from Alex's background" }
  ],
  "gaps": [
    { "title": "gap or lower-confidence area", "note": "framed as an observation, not a verdict" }
  ],
  "relevantProjects": [
    { "name": "project name", "relevance": "why it's relevant to this specific role" }
  ],
  "positioning": "2-3 sentence tailored positioning statement for this specific role",
  "interviewTalkingPoints": ["talking point 1", "talking point 2", "..."],
  "suggestedQuestions": ["question the employer could ask Alex 1", "question 2", "..."]
}

Rules:
- Only reference experience and projects listed above — do not invent
- Strengths: include 3-5 items with specific evidence
- Gaps: include 1-3 items, framed constructively
- Relevant projects: include 3-5 of the most directly applicable
- Interview talking points: 3-5 specific points Alex should emphasise
- Suggested questions: 4-6 questions the employer could ask based on the role
- Match score: be honest — 90+ means exceptional fit, 70-89 means strong, 50-69 means moderate, below 50 means weak`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const { jobSpecText } = req.body;

  if (!jobSpecText || typeof jobSpecText !== 'string' || jobSpecText.trim().length < 50) {
    return res.status(400).json({ error: 'Job spec text is too short or missing' });
  }

  const clampedSpec = jobSpecText.slice(0, MAX_JOB_SPEC_LENGTH);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: MAX_TOKENS,
        system: ANALYSIS_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Here is the job description to analyse:\n\n${clampedSpec}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, JSON.stringify(data));
      return res.status(response.status).json({ error: 'AI analysis failed', detail: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Analyze job error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: String(err) });
  }
}
