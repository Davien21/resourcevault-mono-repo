export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  section: string;
  icon: string;
  body: string;
}

export const DOC_SECTIONS = [
  "Getting started",
  "Using the library",
  "Contributing",
  "Administration",
];

export const DOC_ARTICLES: DocArticle[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "A two-minute tour of ResourceVault and what you can do here.",
    section: "Getting started",
    icon: "book-open",
    body: `ResourceVault is your organisation's single, trusted home for shared knowledge — the guides, templates, research, toolkits, checklists, and policies your members rely on.

This help centre explains how to get the most out of it, whether you're browsing for the first time or curating the whole library.

## What you can do
- **Browse and search** the entire published library, free, from any device.
- **Save** the resources that matter to you into a personal collection.
- **Download** verified files in a click.
- **Contribute** your own resources for review (if you're a contributor or admin).
- **Curate and approve** content and manage members (if you're an admin).

## Your first five minutes
- Create a free account, or use one of the one-click demo logins on the sign-in page.
- Open the **Library** and try a search — for example, "immunisation" or "evaluation".
- Filter by category or resource type using the controls at the top.
- Open any resource and hit **Save** to add it to your library.

## How content stays trustworthy
Every resource has an owner, a version number, and a lifecycle status. Nothing reaches the public library without passing through review, so what you find is current and signed off.`,
  },
  {
    slug: "creating-an-account",
    title: "Creating an account",
    description: "How to register, sign in, and what email verification means here.",
    section: "Getting started",
    icon: "users",
    body: `Anyone can create a ResourceVault account with an email address and a password.

## Registering
- Select **Create free account** from the top navigation.
- Enter your name, email, an optional organisation, and a password of at least 8 characters.
- You'll be signed in immediately and land in the library.

New public sign-ups join as **Members**, which gives full access to browse, search, save, and download everything in the published library.

## Email verification
In a production deployment, new accounts would receive a verification email. For this demonstration, **email verification is stubbed** — your account is active straight away so you can explore without waiting.

## Demo logins
The sign-in page offers one-click access to pre-seeded **Admin**, **Contributor**, and **Member** accounts. These are the fastest way to experience every role. All demo accounts share the password \`Demo1234!\`.

## Signing out
Open the avatar menu in the top-right corner and choose **Sign out** at any time.`,
  },
  {
    slug: "roles",
    title: "Roles explained",
    description: "The difference between members, contributors, and admins.",
    section: "Getting started",
    icon: "shield-check",
    body: `ResourceVault has three roles. Public sign-ups are always members; contributors and admins are granted by an administrator.

## Members
Members are the heart of the community. As a member you can:
- Browse and search the full published library.
- Save resources into your personal collection.
- Download files and view full resource details.
- Maintain your own profile.

## Contributors
Contributors do everything members can, and also:
- Submit new resources to the library.
- Track the review status of their submissions.
- Edit and archive the resources they own.

Contributor submissions don't go live immediately — they enter the review queue first.

## Admins
Admins are the custodians of the library. In addition to everything above, they can:
- Approve or send back resources in the review queue.
- Publish their own resources instantly.
- Manage members and change roles.
- Create and curate categories.
- See analytics across the whole library.

## Changing roles
Only an admin can change someone's role, from **Members** in the admin console. Admins can't change their own role, to prevent accidentally locking themselves out.`,
  },
  {
    slug: "finding-resources",
    title: "Finding resources",
    description: "Search, filters, sorting, and saving — get to the right resource fast.",
    section: "Using the library",
    icon: "line-chart",
    body: `The library is built to get you to the right resource in seconds.

## Search
Use the search box at the top of the library to search across resource titles, summaries, descriptions, and tags. Results update as you type.

## Filters
Narrow things down with:
- **Categories** — pick a collection from the sidebar.
- **Type** — filter to guides, templates, research, toolkits, checklists, policies, and more.
- **Tags** — click any popular tag, or a tag on a resource, to see everything related.

Active filters show as chips you can remove individually, or clear all at once.

## Sorting
Order results by **recently updated**, **most downloaded**, **featured first**, or **title (A–Z)**.

## Grid and list views
Switch between a visual grid and a compact list using the toggle on the right of the toolbar — whichever suits how you're scanning.

## Saving for later
Hit the bookmark icon on any card, or **Save** on a resource page, to add it to your personal library. Find everything you've saved under **Saved resources** in your workspace.`,
  },
  {
    slug: "contributing",
    title: "Contributing a resource",
    description: "How to submit a high-quality resource for review.",
    section: "Contributing",
    icon: "layout-template",
    body: `If you're a contributor or admin, you can add resources to the library.

## Submitting
- Go to **Submit a resource** from your workspace or the avatar menu.
- Give it a clear **title** and a specific one-or-two-sentence **summary** — this is what people see on cards and in search.
- Choose a **type** and a **category**.
- Write a full **description**. Markdown is supported: use \`##\` for headings and \`-\` for bullet lists.
- Add a few comma-separated **tags** to help people find it.
- A **live preview** on the right shows how your resource card will look.

## What happens next
- If you're a **contributor**, your resource is submitted to the review queue with a *Pending review* status. An admin will approve it before it's published.
- If you're an **admin**, your resource is published immediately.

## Writing a great resource
- Be specific in your summary — say what it is and who it helps.
- Structure the description with **What's inside**, **Who it's for**, and **How to use it**.
- Keep tags focused; 3–5 relevant tags beat a long, vague list.

## Managing your contributions
Track everything you've authored under **My contributions**, grouped by status. From there you can submit drafts for review or archive resources that are no longer current.`,
  },
  {
    slug: "workflow",
    title: "The approval & lifecycle workflow",
    description: "How a resource moves from draft to published to archived.",
    section: "Contributing",
    icon: "list-checks",
    body: `Every resource moves through a clear lifecycle. This is what keeps the library trustworthy.

## The four states
- **Draft** — a work in progress, visible only to its owner and admins.
- **Pending review** — submitted and waiting for an admin decision.
- **Published** — approved and visible to everyone in the library.
- **Archived** — retired from the library but retained for the record.

## The flow
- A contributor creates a resource (**Draft**) and submits it (**Pending review**).
- An admin reviews it and either **approves** it (**Published**) or **sends it back** with feedback (returns to **Draft**).
- When a resource is out of date, its owner or an admin can **archive** it.

## Reviewing as an admin
The **Review queue** lists every pending submission with a preview, the contributor, and approve / send-back actions. Sending something back lets you add a note explaining what needs to change.

## Versioning
Each resource carries a version number so members always know they're looking at the current edition. Bump the version when you make a meaningful update.`,
  },
  {
    slug: "admin-tasks",
    title: "Admin tasks",
    description: "Managing members, categories, tags, and the review queue.",
    section: "Administration",
    icon: "landmark",
    body: `Admins keep the library healthy. Everything below lives in the **Admin console**.

## Analytics
The analytics view gives you an at-a-glance health check: total members and resources, how many are awaiting review, total downloads, a breakdown by category and type, the most-downloaded resources, and a live activity feed.

## The review queue
Approve submissions to publish them, or send them back to contributors with feedback. Clearing the queue promptly keeps contributors engaged.

## Managing members
Search members by name, email, or organisation, filter by role, and change anyone's role with a single dropdown. You can't change your own role, which prevents accidental lockouts.

## Categories
Create new categories with a name, description, icon, and colour. Categories that still contain resources can't be deleted until those resources are moved — a guardrail against orphaning content.

## Tags
Tags are created automatically from the tags contributors add to resources, and surface as filters across the library. The most-used tags appear in the library sidebar.`,
  },
  {
    slug: "faq",
    title: "Frequently asked questions",
    description: "Quick answers to the most common questions.",
    section: "Administration",
    icon: "graduation-cap",
    body: `## Is it really free to explore?
Yes. Anyone can create an account and immediately browse, search, save, and download the entire published library at no cost.

## Do I need an account to look around?
You can browse and search the published library without signing in. An account is needed to save resources and to download files reliably.

## Who can add resources?
Contributors and admins can add resources. Everything passes through a review step before publication, so members only ever see verified content.

## How do I become a contributor?
An admin can upgrade your role from the Members area of the admin console.

## What file types are supported?
Resources in this demo ship with generated sample PDF documents so every download opens as a real file.

## Is my data safe?
This is a demonstration product seeded with fictional content and demo accounts. Don't store real or sensitive information in it.

## What happens to outdated resources?
Owners and admins can archive resources that are no longer current. Archived resources leave the public library but are retained for the record.

## Can I use it on my phone?
Yes — ResourceVault is fully responsive and works across phone, tablet, and desktop, with light and dark modes.`,
  },
];

export function getArticle(slug: string): DocArticle | undefined {
  return DOC_ARTICLES.find((a) => a.slug === slug);
}
