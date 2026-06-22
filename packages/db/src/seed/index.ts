import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";

import { parseServerEnv } from "@resourcevault/config/env";
import { connectToDatabase, disconnectFromDatabase, mongoose } from "../connection.ts";
import { User, Category, Tag, Resource, Bookmark, Activity } from "../models/index.ts";
import { categorySeeds } from "./categories.ts";
import { userSeeds } from "./users.ts";
import { resourceSeeds } from "./resources.ts";
import { resourceSeeds2 } from "./resources2.ts";
import { composeDescription, pdfSectionsFor } from "./compose.ts";
import { generateResourcePdf } from "./pdf.ts";
import { avatarByIndex, coverImageFor, ORG } from "./assets.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../..");
const STORAGE_DIR = resolve(REPO_ROOT, "apps/api/storage");

loadEnv({ path: resolve(REPO_ROOT, ".env") });
loadEnv({ path: resolve(REPO_ROOT, "apps/api/.env") });

const env = parseServerEnv();
const ALL_RESOURCE_SEEDS = [...resourceSeeds, ...resourceSeeds2];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Deterministic pseudo-random so re-seeding yields stable demo numbers.
function pseudo(n: number, salt = 1): number {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function readTimeFor(type: string): number {
  const map: Record<string, number> = {
    guide: 12,
    research: 18,
    toolkit: 15,
    template: 6,
    checklist: 4,
    policy: 9,
    video: 8,
    dataset: 5,
  };
  return map[type] ?? 8;
}

async function run() {
  console.log(`\n🌱 Seeding ResourceVault (${ORG.short}) ...`);
  console.log(`   MongoDB: ${env.MONGODB_URI}`);
  await connectToDatabase(env.MONGODB_URI);

  console.log("   Clearing existing collections ...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Tag.deleteMany({}),
    Resource.deleteMany({}),
    Bookmark.deleteMany({}),
    Activity.deleteMany({}),
  ]);

  // ---- Users ----
  // Distinct portrait per user (spread across pravatar's catalogue).
  const AVATAR_IMGS = [11, 5, 9, 12, 15, 25, 33, 47, 48, 52, 60, 3, 16, 26, 51, 65];
  const createdUsers = await Promise.all(
    userSeeds.map(async (u, idx) => {
      const passwordHash = await bcrypt.hash(u.password, 10);
      return User.create({
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        title: u.title,
        bio: u.bio,
        organisation: u.organisation,
        avatarUrl: avatarByIndex(AVATAR_IMGS[idx % AVATAR_IMGS.length]),
        isVerified: u.isVerified,
        lastActiveAt: daysAgo(Math.floor(pseudo(u.name.length) * 14)),
      });
    })
  );
  console.log(`   ✓ ${createdUsers.length} users`);

  // Resources are authored by contributors (admins review rather than author),
  // so ownership is spread across many distinct people.
  const owners = createdUsers.filter((u) => u.role === "contributor");
  const demoContributor = createdUsers.find(
    (u) => u.email === "contributor@resourcevault.demo"
  )!;
  const demoMember = createdUsers.find(
    (u) => u.email === "member@resourcevault.demo"
  )!;
  const admin = createdUsers.find((u) => u.role === "admin")!;

  // ---- Categories ----
  const createdCategories = await Category.insertMany(
    categorySeeds.map((c) => ({
      ...c,
      coverImageUrl: coverImageFor(c.slug, 0),
    }))
  );
  const categoryBySlug = new Map(
    createdCategories.map((c) => [c.slug, c])
  );
  console.log(`   ✓ ${createdCategories.length} categories`);

  // ---- Resources ----
  const usedSlugs = new Set<string>();
  const tagCounts = new Map<string, number>();

  const resourceDocs = [];
  let pdfCount = 0;
  let publishedSoFar = 0;

  for (let i = 0; i < ALL_RESOURCE_SEEDS.length; i++) {
    const seed = ALL_RESOURCE_SEEDS[i];
    const category = categoryBySlug.get(seed.categorySlug)!;

    let slug = slugify(seed.title);
    while (usedSlugs.has(slug)) slug = `${slug}-${i}`;
    usedSlugs.add(slug);

    // Lifecycle distribution: mostly published, plus pending/draft/archived.
    const bucket = i % 12;
    let status: "draft" | "pending" | "published" | "archived";
    if (bucket === 3) status = "pending";
    else if (bucket === 7) status = "pending";
    else if (bucket === 5) status = "draft";
    else if (bucket === 10) status = "archived";
    else status = "published";

    // Ensure the demo contributor owns a spread of statuses for the demo.
    let owner = owners[i % owners.length];
    if (status === "pending" || status === "draft") {
      owner = i % 2 === 0 ? demoContributor : owner;
    }

    const updatedDays = Math.floor(5 + pseudo(i, 2) * 540);
    const updatedAt = daysAgo(updatedDays);
    const publishedAt =
      status === "published" || status === "archived"
        ? daysAgo(updatedDays + Math.floor(pseudo(i, 3) * 30))
        : undefined;

    // Feature roughly every 4th published resource so the featured rail is rich.
    if (status === "published") publishedSoFar++;
    const isFeatured = status === "published" && publishedSoFar % 4 === 1;
    const downloadCount =
      status === "published"
        ? Math.floor(40 + pseudo(i, 4) * 1800)
        : Math.floor(pseudo(i, 4) * 20);
    const viewCount = downloadCount * 3 + Math.floor(pseudo(i, 5) * 600);
    const description = composeDescription(seed, category.name);

    // Generate a real sample PDF for downloadable assets.
    const fileName = `${slug}.pdf`;
    let fileSize = 0;
    try {
      fileSize = await generateResourcePdf(STORAGE_DIR, fileName, {
        title: seed.title,
        category: category.name,
        type: seed.type,
        version: i % 5 === 0 ? "2.1" : "1.0",
        organisation: ORG.name,
        summary: seed.summary,
        sections: pdfSectionsFor(seed, category.name),
      });
      pdfCount++;
    } catch (err) {
      console.warn(`   ! Could not generate PDF for ${slug}:`, err);
    }

    for (const t of seed.tags) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }

    resourceDocs.push({
      title: seed.title,
      slug,
      summary: seed.summary,
      description,
      type: seed.type,
      status,
      category: category._id,
      tags: seed.tags,
      coverImageUrl: coverImageFor(seed.categorySlug, i),
      version: i % 5 === 0 ? "2.1" : "1.0",
      owner: owner._id,
      asset: {
        fileName,
        fileUrl: `${env.API_BASE_URL}/files/${fileName}`,
        fileType: "application/pdf",
        fileSize,
      },
      isFeatured,
      downloadCount,
      viewCount,
      readTimeMinutes: readTimeFor(seed.type),
      reviewNote:
        status === "published"
          ? "Approved by the review board."
          : undefined,
      reviewedBy: status === "published" ? admin._id : undefined,
      publishedAt,
      createdAt: daysAgo(updatedDays + 10),
      updatedAt,
    });
  }

  const createdResources = await Resource.insertMany(resourceDocs);
  console.log(`   ✓ ${createdResources.length} resources (${pdfCount} PDFs generated)`);

  // ---- Tags ----
  const tagDocs = [...tagCounts.keys()].map((name) => ({
    name: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: name,
  }));
  await Tag.insertMany(tagDocs);
  console.log(`   ✓ ${tagDocs.length} tags`);

  // ---- Bookmarks (for the demo member) ----
  const published = createdResources.filter((r) => r.status === "published");
  const bookmarkTargets = published
    .filter((_, idx) => idx % 5 === 0)
    .slice(0, 8);
  await Bookmark.insertMany(
    bookmarkTargets.map((r) => ({ user: demoMember._id, resource: r._id }))
  );
  console.log(`   ✓ ${bookmarkTargets.length} bookmarks for demo member`);

  // ---- Activity feed ----
  const activitySource = createdResources.slice(0, 12);
  const activities = activitySource.map((r, idx) => {
    const types = [
      "resource_published",
      "resource_submitted",
      "resource_approved",
      "resource_downloaded",
    ] as const;
    return {
      type: types[idx % types.length],
      actor: createdUsers[idx % createdUsers.length].name,
      actorId: createdUsers[idx % createdUsers.length]._id,
      target: r.title,
      resourceId: r._id,
      createdAt: daysAgo(idx),
    };
  });
  await Activity.insertMany(activities);
  console.log(`   ✓ ${activities.length} activity entries`);

  console.log("\n✅ Seed complete.\n");
  console.log("   Demo credentials (password for all: Demo1234!):");
  console.log("     • Admin       → admin@resourcevault.demo");
  console.log("     • Contributor → contributor@resourcevault.demo");
  console.log("     • Member      → member@resourcevault.demo\n");

  await disconnectFromDatabase();
}

run()
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error("\n❌ Seed failed:", err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
