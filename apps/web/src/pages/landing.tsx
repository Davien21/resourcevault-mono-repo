import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Sparkles,
  Layers,
  Users,
  Download,
  FileCheck2,
  Star,
  Quote,
  CheckCircle2,
  Upload,
  BadgeCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CountUp } from "@/components/count-up";
import { GradientCover } from "@/components/brand/gradient-cover";
import { CategoryIcon } from "@/components/brand/icon";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource/resource-card";
import { formatNumber } from "@/lib/utils";

export function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ValueProps />
      <FeaturedSection />
      <HowItWorks />
      <CategoriesSection />
      <RolesSection />
      <Testimonials />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}

/* ----------------------------------------------------------------- Hero */

function Hero() {
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: api.stats });

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-grid opacity-60" />

      <div className="container-page pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-success" />
              Trusted knowledge for membership organisations
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-display text-display-lg sm:text-display-xl"
            >
              The resource library your members{" "}
              <span className="text-gradient">actually use.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
            >
              ResourceVault gives your organisation one beautiful, searchable home
              for every guide, template, research paper, and toolkit — with a review
              workflow that keeps it accurate and a search that actually finds things.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" variant="gradient">
                <Link to="/register">
                  Create free account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/library">Browse the library</Link>
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6"
            >
              <Stat
                value={stats?.resources ?? 64}
                label="Resources"
                suffix="+"
              />
              <Stat value={stats?.categories ?? 8} label="Categories" />
              <Stat
                value={stats?.downloads ?? 38000}
                label="Downloads"
                formatK
              />
            </motion.dl>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  suffix,
  formatK,
}: {
  value: number;
  label: string;
  suffix?: string;
  formatK?: boolean;
}) {
  return (
    <div>
      <div className="font-display text-3xl font-bold tracking-tight">
        {formatK && value >= 1000 ? (
          <>
            <CountUp value={Math.round(value / 1000)} />k+
          </>
        ) : (
          <CountUp value={value} suffix={suffix} />
        )}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const HERO_IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

const HERO_CARDS = [
  { title: "Adult Immunisation Schedule", cat: "Clinical Guidelines", icon: "stethoscope", token: HERO_IMG("1576091160550-2173dba999ef"), type: "Guide" },
  { title: "Community Engagement Playbook", cat: "Community Outreach", icon: "users", token: HERO_IMG("1517048676732-d65bc937f952"), type: "Toolkit" },
  { title: "Social Prescribing: Evidence", cat: "Research & Evidence", icon: "flask-conical", token: HERO_IMG("1532094349884-543bc11b234d"), type: "Research" },
  { title: "Service Evaluation Plan", cat: "Templates & Toolkits", icon: "layout-template", token: HERO_IMG("1454165804606-c3d57bc86b40"), type: "Template" },
];

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
        {/* faux browser chrome */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/60" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
          <div className="ml-3 flex h-7 flex-1 items-center gap-2 rounded-lg border bg-background px-3 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Search 64 resources…
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {HERO_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <GradientCover
                token={card.token}
                icon={card.icon}
                label={card.type}
                className="aspect-[16/10] w-full"
                compact
              />
              <div className="p-3">
                <p className="text-[11px] font-medium text-primary">{card.cat}</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
                  {card.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute -left-5 bottom-12 hidden rounded-xl border bg-card p-3 shadow-lg sm:flex sm:items-center sm:gap-2.5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-success/12 text-success">
          <BadgeCheck className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Peer reviewed</p>
          <p className="text-xs text-muted-foreground">Every resource, verified</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --------------------------------------------------------- Trust strip */

const ORGS = [
  "Northbridge Health",
  "Eastvale Council",
  "Riverside Collaborative",
  "ICPH",
  "Public Health Forum",
  "Care Network",
];

function TrustStrip() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="container-page">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams across the public &amp; community health sector
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ORGS.map((org) => (
            <span
              key={org}
              className="font-display text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {org}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Value props */

const VALUES = [
  {
    icon: Search,
    title: "Search that finds things",
    body: "Full-text search across titles, summaries, and tags, with filters for category, type, and freshness. Members stop emailing you for the link.",
  },
  {
    icon: ShieldCheck,
    title: "A review workflow built in",
    body: "Draft → pending → published → archived. Contributors submit, admins approve, and members only ever see content that's been signed off.",
  },
  {
    icon: Layers,
    title: "Organised by how people think",
    body: "Categories, a topic taxonomy, and free tagging keep a growing library navigable — not a dumping ground of PDFs nobody can find.",
  },
  {
    icon: Sparkles,
    title: "A product, not a portal",
    body: "Considered typography, dark mode, and micro-interactions throughout. The kind of polish that makes members trust what's inside.",
  },
];

function ValueProps() {
  return (
    <section className="container-page py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Why ResourceVault"
          title="Everything a knowledge team needs, nothing it doesn't"
          subtitle="The boring-but-essential parts of running a resource library, designed properly for once."
        />
      </ScrollReveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, i) => (
          <ScrollReveal key={value.title} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {value.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Featured rail */

function FeaturedSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: api.featured,
  });

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="container-page">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Featured"
              title="Handpicked from the library"
              subtitle="A taste of what's inside — fully browsable before you ever sign up."
            />
            <Button asChild variant="outline">
              <Link to="/library">
                View all resources <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))
            : data?.items
                .slice(0, 6)
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- How it works */

const STEPS = [
  {
    icon: Users,
    title: "Create your free account",
    body: "Sign up in seconds with an email and password. New members get instant access to the full published library.",
  },
  {
    icon: Search,
    title: "Find what you need",
    body: "Search and filter across every resource, save the ones that matter, and download verified files in a click.",
  },
  {
    icon: Upload,
    title: "Contribute back",
    body: "Submit your own resources for review. Once an admin approves them, they're published for the whole community.",
  },
];

function HowItWorks() {
  return (
    <section className="container-page py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="How it works"
          title="From sign-up to published in three steps"
        />
      </ScrollReveal>
      <div className="relative mt-14 grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-7 -z-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 0.1}>
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border bg-card text-primary shadow-sm">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Categories grid */

function CategoriesSection() {
  const { data } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const categories = data?.categories ?? [];

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="container-page">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Explore"
            title="Browse by category"
            subtitle="Eight curated collections spanning the breadth of community and public health practice."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={(i % 4) * 0.06}>
              <Link
                to={`/library?category=${cat.slug}`}
                className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold leading-snug transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-muted-foreground">
                  {cat.description}
                </p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {cat.resourceCount ?? 0} resources
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Roles */

const ROLES = [
  {
    name: "Members",
    icon: Search,
    points: ["Browse & search everything", "Save and organise resources", "Download verified files"],
  },
  {
    name: "Contributors",
    icon: Upload,
    points: ["Submit new resources", "Track review status", "Maintain your contributions"],
  },
  {
    name: "Admins",
    icon: ShieldCheck,
    points: ["Approve the review queue", "Manage members & roles", "Curate categories & tags"],
  },
];

function RolesSection() {
  return (
    <section className="container-page py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Built for every role"
          title="One library, three ways to work"
          subtitle="Public sign-ups join as members. Contributors and admins unlock the tools they need."
        />
      </ScrollReveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {ROLES.map((role, i) => (
          <ScrollReveal key={role.name} delay={i * 0.08}>
            <div className="h-full rounded-2xl border bg-card p-7 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <role.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{role.name}</h3>
              <ul className="mt-4 space-y-2.5">
                {role.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Testimonials */

const TESTIMONIALS = [
  {
    quote:
      "We replaced a chaotic shared drive and three out-of-date intranet pages with ResourceVault. Our members finally find what they need without emailing the team.",
    name: "Dr. Amara Okafor",
    role: "Director of Knowledge & Standards, ICPH",
  },
  {
    quote:
      "The review workflow is the part I didn't know I needed. Contributors submit, I approve, and I never worry about an outdated guideline slipping through.",
    name: "Marcus Bell",
    role: "Consultant in Public Health Medicine",
  },
  {
    quote:
      "It looks like a product we'd pay a fortune for. The search and the saved library have genuinely changed how our outreach team works day to day.",
    name: "Priya Nair",
    role: "Health Promotion Practitioner",
  },
];

function Testimonials() {
  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="container-page">
        <ScrollReveal>
          <SectionHeading eyebrow="In their words" title="Loved by the people who run libraries" />
        </ScrollReveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-7 shadow-sm">
                <Quote className="h-7 w-7 text-primary/30" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- FAQ teaser */

const FAQS = [
  {
    q: "Is it really free to explore?",
    a: "Yes. Anyone can create an account with an email and password and immediately browse, search, save, and download the entire published library.",
  },
  {
    q: "Who can add resources?",
    a: "Contributors and admins can submit resources. Everything goes through a review step before it's published, so members only see verified content.",
  },
  {
    q: "How is quality kept up?",
    a: "Every resource has an owner, a version number, and a lifecycle status. Admins manage a review queue and can archive anything that's gone out of date.",
  },
];

function FaqTeaser() {
  return (
    <section className="container-page py-24">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <ScrollReveal>
          <SectionHeading
            align="left"
            eyebrow="Questions"
            title="Frequently asked"
            subtitle="Everything you need to know to get started."
          />
          <Button asChild variant="outline" className="mt-6">
            <Link to="/docs/faq">
              Read the full FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </ScrollReveal>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 0.06}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="font-display text-base font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Final CTA */

function FinalCta() {
  return (
    <section className="container-page pb-24">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-accent px-8 py-16 text-center shadow-xl sm:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
          <h2 className="relative font-display text-display-md text-primary-foreground">
            Give your members a library worth visiting
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Create a free account and explore everything ResourceVault offers —
            browse, save, contribute, and curate.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/register">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* --------------------------------------------------------- shared */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-display-md">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
