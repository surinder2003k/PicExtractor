const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE = "http://localhost:3000";
const VIDEO = "D:\\Work\\React\\Antigreavity\\PicExtractor\\test-video.mp4";

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    failures.push(`${name} ${extra}`);
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`  PAGE ERROR: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      if (!/ERR_CONNECTION|favicon|React DevTools/.test(t)) console.log(`  CONSOLE ERROR: ${t}`);
    }
  });

  console.log("== Timestamp precision (50ms interval) ==");
  await page.goto(`${BASE}/extractor`, { waitUntil: "networkidle" });
  await page.setInputFiles('input[type="file"]', VIDEO);
  await page.waitForSelector("text=~20 frames", { timeout: 10000 });
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "50");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~200 frames").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (200)", { timeout: 30000 });
  const timestamps = await page.evaluate(() => {
    return [...document.querySelectorAll("img[alt^='Frame at']")].map((i) => i.getAttribute("alt"));
  });
  const expected = new Set([
    "Frame at 00:00:00.400",
    "Frame at 00:00:00.450",
    "Frame at 00:00:00.500",
    "Frame at 00:00:00.550",
  ]);
  check("clean timestamps (no drift)", [...expected].every((e) => timestamps.includes(e)), timestamps.slice(0, 12).join(", "));
  const drift = timestamps.filter((t) => /\.\d{3}$/.test(t)).length;
  check("all timestamps clean ms", drift === 200, `${drift} clean of 200`);

  console.log("== Settings persistence ==");
  await page.getByRole("button", { name: "JPEG" }).click();
  await page.getByRole("slider", { name: "Quality slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "60");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const saved = await page.evaluate(() => localStorage.getItem("picsnap-settings"));
  const parsed = JSON.parse(saved);
  check("settings saved to localStorage", parsed.format === "jpeg" && parsed.quality === 60, saved);
  await page.reload({ waitUntil: "networkidle" });
  await page.setInputFiles('input[type="file"]', VIDEO);
  await page.waitForSelector("text=test-video.mp4", { timeout: 10000 });
  check("JPEG persists after reload", (await page.getByRole("button", { name: "JPEG" }).getAttribute("aria-pressed")) === "true");
  check("quality 60 persists", (await page.getByText("60%").first().isVisible()));

  console.log("== Remove video ==");
  await page.getByRole("button", { name: "Remove video" }).click();
  check("dropzone placeholder back", await page.getByText("Upload a video to get started").isVisible());
  check("file badge gone", (await page.getByText("test-video.mp4").count()) === 0);

  console.log("== Global drag-drop ==");
  const input = page.locator('input[type="file"]');
  const buf = await fs.readFileSync(VIDEO);
  const dt = await page.evaluateHandle((b) => {
    const file = new File([new Uint8Array(b)], "test-video.mp4", { type: "video/mp4" });
    const dt = new DataTransfer();
    dt.items.add(file);
    return dt;
  }, Array.from(buf));
  await page.dispatchEvent("body", "drop", { dataTransfer: dt });
  await page.waitForSelector("text=test-video.mp4", { timeout: 10000 });
  check("drop anywhere loads video", await page.getByText("test-video.mp4").isVisible());

  console.log("== ETA in progress ==");
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "500");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~20 frames").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=ETA", { timeout: 10000 });
  check("ETA shown in progress", await page.getByText(/ETA \d/).isVisible());
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });
  check("completion toast", (await page.getByText(/Extracted 20 frames in/).count()) > 0);

  console.log("== Memory guard ==");
  await page.getByRole("button", { name: "Remove video" }).click();
  const LONG_VIDEO = "C:\\Users\\sunny\\AppData\\Local\\Temp\\opencode\\long-video.mp4";
  await page.setInputFiles('input[type="file"]', LONG_VIDEO);
  await page.waitForSelector("text=00:01:10.000", { timeout: 10000 });
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "50");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~1400 frames").waitFor({ timeout: 5000 });
  check("memory warning for 1400 frames", (await page.getByText(/will use a lot of memory/).count()) > 0);
  await page.getByRole("button", { name: "Remove video" }).click();

  console.log("== Format-switch ZIP integrity ==");
  await page.setInputFiles('input[type="file"]', VIDEO);
  await page.waitForSelector("text=test-video.mp4", { timeout: 10000 });
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "500");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~20 frames").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "PNG" }).click();
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });
  await page.getByRole("button", { name: "JPEG" }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 20000 }),
    page.getByRole("button", { name: /Download ZIP/ }).click(),
  ]);
  const zipPath = path.join(__dirname, "_format-switch.zip");
  await download.saveAs(zipPath);
  const JSZip = require("jszip");
  const zipData = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(zipData);
  const entries = Object.values(zip.files).filter((f) => !f.dir);
  const names = entries.map((e) => e.name);
  const magic = [];
  for (const e of entries) {
    const content = await e.async("uint8array");
    if (content[0] === 0x89 && content[1] === 0x50) magic.push("png");
    else if (content[0] === 0xff && content[1] === 0xd8) magic.push("jpeg");
    else magic.push("other");
  }
  const pngExt = names.filter((n) => n.endsWith(".png")).length;
  const pngMagic = magic.filter((m) => m === "png").length;
  const jpgExt = names.filter((n) => n.endsWith(".jpg")).length;
  check("zip has png filenames", pngExt === 20, `png names: ${pngExt}`);
  check("zip has zero jpg names", jpgExt === 0, `jpg names: ${jpgExt}`);
  check("png files contain png magic bytes", pngMagic === 20, `png magic: ${pngMagic}`);
  try { fs.unlinkSync(zipPath); } catch {}
  await page.getByRole("button", { name: "Remove video" }).click();

  await browser.close();

  console.log(`\n===== RESULT: ${pass} passed, ${fail} failed =====`);
  if (failures.length) {
    console.log("Failures:");
    failures.forEach((f) => console.log("  - " + f));
  }
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => {
  console.error("Improvement test crashed:", e);
  process.exit(2);
});
