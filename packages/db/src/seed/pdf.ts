import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";
import PDFDocument from "pdfkit";

export interface PdfMeta {
  title: string;
  category: string;
  type: string;
  version: string;
  organisation: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

/**
 * Generates a real, branded sample PDF for a resource so the demo's downloads
 * open as genuine documents rather than dead links. Returns the byte size.
 */
export function generateResourcePdf(
  storageDir: string,
  fileName: string,
  meta: PdfMeta
): Promise<number> {
  return new Promise((resolve, reject) => {
    mkdirSync(storageDir, { recursive: true });
    const filePath = join(storageDir, fileName);
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const stream = createWriteStream(filePath);
    let bytes = 0;
    doc.on("data", (chunk: Buffer) => (bytes += chunk.length));
    stream.on("finish", () => resolve(bytes));
    stream.on("error", reject);
    doc.pipe(stream);

    // Header band
    doc.rect(0, 0, doc.page.width, 130).fill("#4f46e5");
    doc
      .fill("#ffffff")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(meta.organisation.toUpperCase(), 56, 44, { characterSpacing: 1 });
    doc
      .fontSize(22)
      .text(meta.title, 56, 64, { width: doc.page.width - 112 });

    doc.fill("#111827").font("Helvetica");
    let y = 160;
    doc.fontSize(10).fill("#6b7280");
    doc.text(
      `${meta.category}  ·  ${meta.type.toUpperCase()}  ·  Version ${meta.version}`,
      56,
      y
    );
    y += 28;

    doc.fill("#111827").fontSize(12).font("Helvetica-Oblique");
    doc.text(meta.summary, 56, y, { width: doc.page.width - 112 });
    y = doc.y + 20;

    for (const section of meta.sections) {
      if (y > doc.page.height - 140) {
        doc.addPage();
        y = 56;
      }
      doc
        .fill("#4f46e5")
        .fontSize(13)
        .font("Helvetica-Bold")
        .text(section.heading, 56, y);
      y = doc.y + 6;
      doc
        .fill("#374151")
        .fontSize(11)
        .font("Helvetica")
        .text(section.body, 56, y, { width: doc.page.width - 112, lineGap: 3 });
      y = doc.y + 16;
    }

    // Footer
    doc
      .fontSize(9)
      .fill("#9ca3af")
      .text(
        `${meta.organisation} · ResourceVault · Not for clinical use.`,
        56,
        doc.page.height - 60,
        { width: doc.page.width - 112, align: "center" }
      );

    doc.end();
  });
}
