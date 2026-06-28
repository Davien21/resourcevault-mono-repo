import type { ResourceType } from "@resourcevault/types";
import type { ResourceSeed } from "./resources.ts";

const WHATS_INSIDE: Record<ResourceType, string[]> = {
  guide: [
    "A plain-language overview you can read in one sitting",
    "Step-by-step guidance with decision points called out",
    "Worked examples drawn from real community practice",
    "A one-page summary to keep at your desk",
  ],
  template: [
    "A fully structured, editable document ready to localise",
    "Pre-filled prompts so you start from substance, not a blank page",
    "Guidance notes explaining what belongs in each section",
    "A completed worked example for reference",
  ],
  research: [
    "A clear summary of the evidence and its strength",
    "Key findings translated into practical implications",
    "An honest appraisal of limitations and gaps",
    "A full reference list for further reading",
  ],
  toolkit: [
    "A set of practical tools you can use independently or together",
    "Checklists and templates for each stage of the work",
    "Facilitation notes for running sessions with your team",
    "An evaluation plan so you can measure impact",
  ],
  checklist: [
    "A concise, scannable checklist for the moment it is needed",
    "Clear thresholds and trigger points",
    "Immediate actions and escalation routes",
    "Space to record decisions and rationale",
  ],
  policy: [
    "The formal position and the principles behind it",
    "Model wording you can adapt for your organisation",
    "The supporting evidence base, referenced in full",
    "Implementation and review expectations",
  ],
  video: [
    "A produced walkthrough you can watch at your own pace",
    "Chaptered segments so you can jump to what you need",
    "Accompanying slides and speaker notes",
    "A short knowledge check to confirm learning",
  ],
  dataset: [
    "A curated, documented collection of sources",
    "Notes on coverage, update frequency, and limitations",
    "Guidance on responsible interpretation",
    "Links to the underlying data and licences",
  ],
};

const HOW_TO_USE: Record<ResourceType, string> = {
  guide:
    "Read it through once to orient yourself, then return to the relevant section when you need it. Share the one-page summary with colleagues who need the headlines rather than the detail.",
  template:
    "Make a copy, replace the prompts with your own content, and delete the guidance notes before you circulate the finished document. Keep the original as a master so future projects start from the same baseline.",
  research:
    "Use the implications section to inform planning and commissioning conversations, and cite the references directly when you need to evidence a decision. Treat the limitations section as honestly as the findings.",
  toolkit:
    "Pick the tools that fit your context rather than working through everything mechanically. Run the facilitation sessions with the people who will deliver the work, and build the evaluation in from the start.",
  checklist:
    "Keep it within easy reach and use it in the moment rather than from memory. Record the decisions you make against it so your reasoning is documented if it is ever reviewed.",
  policy:
    "Adapt the model wording to your local context, take it through your governance route for sign-off, and diarise the review date so it does not quietly go out of date.",
  video:
    "Watch it solo for your own CPD or play it in a team session as a shared starting point for discussion. Use the knowledge check to confirm the key points have landed.",
  dataset:
    "Start from the coverage notes to confirm a source fits your question before you analyse it. Always carry the stated limitations through into how you present your findings.",
};

const AUDIENCE: Record<string, string> = {
  "clinical-guidelines":
    "primary care teams, community nurses, and immunisation services who need clear, defensible standards at the point of care",
  "community-outreach":
    "outreach coordinators, health promotion practitioners, and anyone planning community-facing health activity",
  "research-evidence":
    "practitioners, commissioners, and analysts who want their decisions grounded in robust evidence",
  "professional-development":
    "practitioners planning their CPD, and the managers who support their development",
  "policy-advocacy":
    "members influencing local and national policy on behalf of population health",
  "templates-toolkits":
    "teams who would rather adapt a proven structure than build one from scratch",
  "safeguarding-ethics":
    "frontline staff and their managers who carry safeguarding and confidentiality duties",
  "data-digital-health":
    "analysts, digital leads, and information governance colleagues building data-driven services",
};

export function composeDescription(
  seed: ResourceSeed,
  categoryName: string
): string {
  const inside = WHATS_INSIDE[seed.type]
    .map((line) => `- ${line}`)
    .join("\n");
  const audience =
    AUDIENCE[seed.categorySlug] ??
    "members of the Institute and their wider teams";

  return [
    seed.intro,
    "",
    "## What's inside",
    inside,
    "",
    "## Who it's for",
    `This ${seed.type} sits within our **${categoryName}** collection and is written for ${audience}.`,
    "",
    "## How to use it",
    HOW_TO_USE[seed.type],
    "",
    "## Review & assurance",
    "Every resource in the library is reviewed before publication and carries a version number so you can be confident you are working from the current edition. If you spot something that needs updating, use the feedback option on this page to let the knowledge team know.",
  ].join("\n");
}

export function pdfSectionsFor(
  seed: ResourceSeed,
  categoryName: string
): { heading: string; body: string }[] {
  return [
    { heading: "Overview", body: seed.intro },
    {
      heading: "What's inside",
      body: WHATS_INSIDE[seed.type].join("\n• "),
    },
    {
      heading: "How to use it",
      body: HOW_TO_USE[seed.type],
    },
    {
      heading: "About this collection",
      body: `This document belongs to the ${categoryName} collection of the ResourceVault library.`,
    },
  ];
}
