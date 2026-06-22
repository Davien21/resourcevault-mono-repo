import type { ResourceType } from "@resourcevault/types";

export interface ResourceSeed {
  title: string;
  summary: string;
  intro: string;
  type: ResourceType;
  categorySlug: string;
  tags: string[];
}

/**
 * Curated, sector-specific resources for a public & community health
 * membership body. Summaries and intros are bespoke; the full description
 * is composed at seed time with real, type-appropriate sections.
 */
export const resourceSeeds: ResourceSeed[] = [
  // ---- Clinical Guidelines ----
  {
    title: "Adult Immunisation Schedule & Catch-Up Pathways",
    summary:
      "The complete adult immunisation schedule with decision support for incomplete or uncertain vaccination histories.",
    intro:
      "This guideline consolidates the recommended adult immunisation schedule into a single reference, with clear catch-up pathways for people whose vaccination history is incomplete or unknown. It is written for primary care and community immunisation teams who need fast, defensible decisions at the point of care.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["immunisation", "primary-care", "adults"],
  },
  {
    title: "Hypertension Detection & Management in Community Settings",
    summary:
      "Standardised blood pressure measurement, diagnostic thresholds, and stepped management for non-clinical settings.",
    intro:
      "Built for community health workers running opportunistic blood pressure checks, this guideline standardises measurement technique, diagnostic thresholds, and onward referral. It reduces unwarranted variation and helps teams identify undiagnosed hypertension earlier.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["cardiovascular", "screening", "primary-care"],
  },
  {
    title: "Type 2 Diabetes Risk Stratification Pathway",
    summary:
      "A practical pathway for identifying, scoring, and triaging people at risk of type 2 diabetes.",
    intro:
      "This pathway brings validated risk scores together with referral criteria so teams can move people from a community screening event into structured prevention programmes. It includes worked examples and a one-page clinician summary.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["diabetes", "prevention", "screening"],
  },
  {
    title: "Childhood Immunisation Referral Criteria",
    summary:
      "Referral thresholds and contraindication guidance for the routine childhood immunisation programme.",
    intro:
      "A concise reference for health visitors and practice nurses covering contraindications, deferral criteria, and when to escalate to specialist immunisation advice. Designed to sit next to the clinic computer.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["immunisation", "children-young-people", "primary-care"],
  },
  {
    title: "Tuberculosis Contact Tracing Standard",
    summary:
      "Standard operating guidance for prioritising and managing TB contacts after an index case is confirmed.",
    intro:
      "This standard sets out the concentric-circle approach to TB contact tracing, prioritisation of close contacts, and the timelines members are expected to work to. It aligns local practice with national communicable disease control expectations.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["communicable-disease", "contact-tracing", "tuberculosis"],
  },
  {
    title: "Wound Care Formulary for Community Nursing",
    summary:
      "A rationalised wound care formulary with dressing selection guidance by wound type and exudate level.",
    intro:
      "Developed with tissue viability specialists, this formulary helps community nurses select appropriate dressings, reduce product variation, and control cost without compromising healing outcomes.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["community-nursing", "wound-care", "formulary"],
  },
  {
    title: "Sexual Health Screening Standards",
    summary:
      "Recommended screening intervals, testing pathways, and partner notification standards for sexual health services.",
    intro:
      "This guideline harmonises screening intervals and partner notification practice across community sexual health services, with particular attention to confidentiality and access for young people.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["sexual-health", "screening", "young-people"],
  },
  {
    title: "Falls Prevention Assessment Pathway",
    summary:
      "A multifactorial falls risk assessment pathway for older adults living independently.",
    intro:
      "This pathway equips community teams to deliver a structured, multifactorial falls assessment and to commission the right onward interventions, from strength-and-balance programmes to home hazard reviews.",
    type: "guide",
    categorySlug: "clinical-guidelines",
    tags: ["older-adults", "falls", "prevention"],
  },

  // ---- Community Outreach ----
  {
    title: "Hard-to-Reach Communities Engagement Playbook",
    summary:
      "A practical playbook for building trust and sustained engagement with communities that services struggle to reach.",
    intro:
      "Drawing on field experience across multiple boroughs, this playbook moves beyond leaflets and pop-ups to a relationship-led model of engagement. It covers community mapping, trusted-messenger recruitment, and measuring genuine reach rather than footfall.",
    type: "toolkit",
    categorySlug: "community-outreach",
    tags: ["health-equity", "engagement", "health-promotion"],
  },
  {
    title: "Vaccination Pop-Up Clinic Operations Toolkit",
    summary:
      "Everything a team needs to plan, staff, and run a safe community vaccination pop-up clinic.",
    intro:
      "From venue risk assessment to cold-chain logistics and queue management, this toolkit turns the ambition of a community pop-up into an operational plan. It includes a staffing calculator and a same-day debrief template.",
    type: "toolkit",
    categorySlug: "community-outreach",
    tags: ["immunisation", "operations", "engagement"],
  },
  {
    title: "Community Health Champion Recruitment Guide",
    summary:
      "How to recruit, train, and retain volunteer health champions who reflect their communities.",
    intro:
      "This guide sets out a repeatable model for building a network of volunteer health champions, including role descriptions, a light-touch training curriculum, and a recognition framework that keeps volunteers engaged.",
    type: "guide",
    categorySlug: "community-outreach",
    tags: ["volunteers", "engagement", "workforce"],
  },
  {
    title: "Health Messaging in Multiple Languages: Style Guide",
    summary:
      "Principles and a workflow for producing accurate, culturally appropriate translated health materials.",
    intro:
      "Poor translation undermines trust and can be unsafe. This style guide establishes a quality workflow for translated materials, including back-translation, community review, and plain-language principles that survive translation.",
    type: "guide",
    categorySlug: "community-outreach",
    tags: ["health-equity", "communications", "accessibility"],
  },
  {
    title: "Smoking Cessation Outreach Campaign Kit",
    summary:
      "Campaign assets, scripts, and an evaluation plan for a community smoking cessation drive.",
    intro:
      "A ready-to-localise campaign kit covering message framing, conversation scripts for brief interventions, and a simple evaluation plan so teams can demonstrate quit-attempt conversion.",
    type: "toolkit",
    categorySlug: "community-outreach",
    tags: ["smoking-cessation", "behaviour-change", "campaign"],
  },
  {
    title: "Working with Faith & Community Leaders",
    summary:
      "Guidance on partnering authentically with faith and community leaders on health initiatives.",
    intro:
      "Faith and community settings are powerful venues for health promotion when partnerships are built on genuine reciprocity. This guide covers first approaches, co-design, and avoiding the pitfalls of transactional engagement.",
    type: "guide",
    categorySlug: "community-outreach",
    tags: ["partnerships", "engagement", "health-equity"],
  },
  {
    title: "Outreach Event Risk Assessment Template",
    summary:
      "A reusable risk assessment template tailored to community health events and street outreach.",
    intro:
      "This editable template covers the hazards specific to community events, from lone working to adverse weather and medical incidents, with pre-filled controls you can adapt for your setting.",
    type: "template",
    categorySlug: "community-outreach",
    tags: ["operations", "safety", "events"],
  },
  {
    title: "Measuring Reach & Equity in Outreach",
    summary:
      "A framework and indicators for measuring whether outreach is genuinely reaching underserved groups.",
    intro:
      "Counting contacts is easy; proving you reached the people who need you most is harder. This framework offers equity-weighted indicators and a simple dashboard layout to track them.",
    type: "toolkit",
    categorySlug: "community-outreach",
    tags: ["evaluation", "health-equity", "data"],
  },

  // ---- Research & Evidence ----
  {
    title: "Rapid Evidence Review: Social Prescribing Outcomes",
    summary:
      "A rapid synthesis of the current evidence base on social prescribing and its measurable health outcomes.",
    intro:
      "This rapid review summarises what the evidence does and does not tell us about social prescribing, with an honest appraisal of study quality. It is intended to inform commissioning conversations rather than to overstate the case.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["social-prescribing", "evidence-review", "commissioning"],
  },
  {
    title: "The Social Determinants of Health: Briefing",
    summary:
      "An accessible briefing on the social determinants of health and what they mean for local action.",
    intro:
      "A clear, referenced briefing that translates the social determinants framework into the levers local teams can actually pull, from housing referrals to employment support pathways.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["health-equity", "social-determinants", "policy"],
  },
  {
    title: "Evaluating Public Health Interventions: Methods Primer",
    summary:
      "A practical primer on choosing robust evaluation methods when randomised trials are not feasible.",
    intro:
      "Most public health interventions cannot be evaluated with a randomised trial. This primer walks through quasi-experimental and theory-based methods so teams can still produce credible evidence of impact.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["evaluation", "methods", "research"],
  },
  {
    title: "Mental Health & Loneliness in Older Adults: Evidence Summary",
    summary:
      "A summary of the evidence linking social isolation, loneliness, and mental health in older adults.",
    intro:
      "This evidence summary brings together the research on loneliness and mental health in later life, and highlights which community interventions have the strongest supporting evidence.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["mental-health", "older-adults", "loneliness"],
  },
  {
    title: "Qualitative Methods for Community Health Research",
    summary:
      "A field guide to designing and analysing qualitative research in community health settings.",
    intro:
      "Practical guidance on interview and focus-group design, sampling, and thematic analysis, written for practitioners who need rigorous qualitative evidence without a full academic team.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["qualitative", "methods", "research"],
  },
  {
    title: "Health Inequalities Data Atlas: Interpretation Guide",
    summary:
      "How to read and responsibly interpret local health inequalities data without drawing the wrong conclusions.",
    intro:
      "Inequalities data is easy to misread. This guide explains confidence intervals, small-number suppression, and the ecological fallacy in plain terms, with worked local examples.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["data", "health-equity", "statistics"],
  },
  {
    title: "Behaviour Change Techniques: Evidence Map",
    summary:
      "An evidence map linking common behaviour change techniques to the outcomes they reliably influence.",
    intro:
      "This evidence map cuts through the jargon of behaviour change frameworks to show which techniques have robust support for which outcomes, helping teams design interventions that are more likely to work.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["behaviour-change", "evidence-review", "prevention"],
  },
  {
    title: "Climate Change & Population Health: Local Briefing",
    summary:
      "A briefing on the local population health risks of climate change and adaptation priorities.",
    intro:
      "From heat-health planning to air quality and flooding, this briefing summarises the population health risks of a changing climate and the adaptation actions within local teams' control.",
    type: "research",
    categorySlug: "research-evidence",
    tags: ["climate", "population-health", "policy"],
  },

  // ---- Professional Development ----
  {
    title: "Public Health Practitioner Competency Framework",
    summary:
      "The full competency framework underpinning ICPH professional registration and CPD planning.",
    intro:
      "This framework defines the knowledge, skills, and behaviours expected of public health practitioners at each career stage. It anchors appraisal, CPD planning, and the Institute's registration standards.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["cpd", "competency", "workforce"],
  },
  {
    title: "CPD Portfolio Builder & Reflective Log",
    summary:
      "A structured template for building a CPD portfolio with reflective practice prompts.",
    intro:
      "An editable portfolio that makes CPD revalidation painless, with reflective prompts that turn everyday work into recorded, evidenced learning.",
    type: "template",
    categorySlug: "professional-development",
    tags: ["cpd", "reflective-practice", "revalidation"],
  },
  {
    title: "Health Needs Assessment: Step-by-Step Course",
    summary:
      "A self-paced learning module that walks practitioners through a full health needs assessment.",
    intro:
      "This module takes learners from defining the population through to prioritisation and recommendations, using a realistic worked example throughout. It is accredited for CPD hours.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["needs-assessment", "cpd", "commissioning"],
  },
  {
    title: "Leadership for Population Health: Reading List",
    summary:
      "A curated, annotated reading list on systems leadership for population health.",
    intro:
      "A carefully annotated reading list for practitioners stepping into systems leadership roles, with a short note on why each item earns its place.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["leadership", "systems", "cpd"],
  },
  {
    title: "Writing for Impact: Briefings & Board Papers",
    summary:
      "A craft guide to writing concise, persuasive board papers and policy briefings.",
    intro:
      "Public health influence often lives or dies on a single board paper. This guide teaches the structure, framing, and editing discipline that gets recommendations approved.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["communications", "leadership", "writing"],
  },
  {
    title: "Mentoring in Public Health: Handbook",
    summary:
      "A handbook for setting up and sustaining effective mentoring relationships across the workforce.",
    intro:
      "Practical guidance for both mentors and mentees on contracting, structuring sessions, and getting genuine value from the relationship, with sample agreements included.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["mentoring", "workforce", "leadership"],
  },
  {
    title: "Statistics Refresher for Practitioners",
    summary:
      "A jargon-free refresher on the statistics public health practitioners use most.",
    intro:
      "Rates, ratios, confidence intervals, and significance explained in plain language with public health examples, for practitioners who want to read evidence with confidence.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["statistics", "cpd", "methods"],
  },
  {
    title: "Career Pathways in Community & Public Health",
    summary:
      "A map of career routes, entry points, and progression across the public health workforce.",
    intro:
      "This guide demystifies the many routes into and through public health careers, from apprenticeships to specialist training, with honest notes on what each path involves.",
    type: "guide",
    categorySlug: "professional-development",
    tags: ["careers", "workforce", "cpd"],
  },
];
