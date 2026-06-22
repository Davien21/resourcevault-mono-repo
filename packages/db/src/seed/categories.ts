export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export const categorySeeds: CategorySeed[] = [
  {
    name: "Clinical Guidelines",
    slug: "clinical-guidelines",
    description:
      "Evidence-based clinical pathways, referral criteria, and standards of care reviewed by our clinical advisory panel.",
    icon: "stethoscope",
    color: "#4f46e5",
    order: 1,
  },
  {
    name: "Community Outreach",
    slug: "community-outreach",
    description:
      "Field-tested playbooks for community engagement, health promotion campaigns, and reaching underserved populations.",
    icon: "users",
    color: "#0ea5e9",
    order: 2,
  },
  {
    name: "Research & Evidence",
    slug: "research-evidence",
    description:
      "Peer-reviewed studies, rapid evidence reviews, and methodological briefings to keep your practice grounded in data.",
    icon: "flask-conical",
    color: "#0d9488",
    order: 3,
  },
  {
    name: "Professional Development",
    slug: "professional-development",
    description:
      "CPD-accredited learning, competency frameworks, and career pathways for practitioners at every stage.",
    icon: "graduation-cap",
    color: "#d97706",
    order: 4,
  },
  {
    name: "Policy & Advocacy",
    slug: "policy-advocacy",
    description:
      "Position statements, consultation responses, and advocacy toolkits to help members influence health policy.",
    icon: "landmark",
    color: "#db2777",
    order: 5,
  },
  {
    name: "Templates & Toolkits",
    slug: "templates-toolkits",
    description:
      "Ready-to-use forms, planning templates, and operational toolkits that save your team hours of setup.",
    icon: "layout-template",
    color: "#7c3aed",
    order: 6,
  },
  {
    name: "Safeguarding & Ethics",
    slug: "safeguarding-ethics",
    description:
      "Guidance on consent, confidentiality, safeguarding duties, and the ethical foundations of public health practice.",
    icon: "shield-check",
    color: "#dc2626",
    order: 7,
  },
  {
    name: "Data & Digital Health",
    slug: "data-digital-health",
    description:
      "Practical guidance on health data, surveillance dashboards, information governance, and digital service design.",
    icon: "line-chart",
    color: "#059669",
    order: 8,
  },
];
