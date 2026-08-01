const { chromium } = require("playwright");

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
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/ERR_CONNECTION|favicon|devtools|Download the React DevTools/.test(t)) {
        console.log(`  CONSOLE ERROR: ${t}`);
      }
    }
  });
  page.on("pageerror", (e) => console.log(`  PAGE ERROR: ${e.message}`));

  console.log("== Landing page ==");
  await page.goto(BASE, { waitUntil: "networkidle" });
  check("landing title", (await page.title()).includes("PicExtractor"));
  check("landing h1", (await page.locator("h1").first().textContent()).includes("Extract every frame"));
  await page.locator('a[href="/extractor"]').first().click();
  await page.waitForURL("**/extractor");

  console.log("== Extractor: no video state ==");
  check("placeholder shown", await page.getByText("Upload a video to get started").isVisible());
  check(
    "extract button not rendered before upload",
    (await page.getByRole("button", { name: "Extract All Frames" }).count()) === 0
  );

  console.log("== Upload ==");
  await page.setInputFiles('input[type="file"]', VIDEO);
  await page.waitForSelector("text=test-video.mp4", { timeout: 10000 });
  await page.waitForSelector("text=00:00:10.000", { timeout: 10000 });
  check("file badge shown", await page.getByText("test-video.mp4").isVisible());
  check("duration shown", await page.getByText("00:00:10.000").first().isVisible());
  check("resolution shown", await page.getByText("320 × 240").isVisible());
  check("interval estimate ~20 frames", await page.getByText("~20 frames").isVisible());
  check("extract now enabled", await page.getByRole("button", { name: "Extract All Frames" }).isEnabled());

  console.log("== Full extraction (PNG) ==");
  const t0 = Date.now();
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });
  const elapsed = Date.now() - t0;
  check("20 frames extracted", await page.getByText("Frames (20)").isVisible(), `(${elapsed}ms)`);
  check("extraction fast (<15s)", elapsed < 15000, `took ${elapsed}ms`);

  const mimes = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) => i.alt && i.alt.startsWith("Frame"));
    return [...new Set(imgs.map((i) => i.src.split(";")[0]))];
  });
  check("frames are PNG", JSON.stringify(mimes) === '["data:image/png"]', JSON.stringify(mimes));

  check("all 20 selected", await page.getByText("20 of 20 selected").isVisible());
  check("zip button shows 20", await page.getByRole("button", { name: "Download ZIP (20)" }).isVisible());
  check("first frame ts 00:00:00.000", await page.getByText("00:00:00.000").first().isVisible());
  check("last frame ts 00:00:09.500", await page.getByText("00:00:09.500").last().isVisible());

  console.log("== Selection ==");
  await page.getByRole("checkbox", { name: "Select frame 00:00:00.000" }).click();
  check("19 of 20 after deselect", await page.getByText("19 of 20 selected").isVisible());
  check("zip button shows 19", await page.getByRole("button", { name: "Download ZIP (19)" }).isVisible());
  await page.getByRole("button", { name: "All", exact: true }).click();
  check("20 of 20 after select all", await page.getByText("20 of 20 selected").isVisible());
  await page.getByRole("button", { name: "None" }).click();
  check("0 of 20 after select none", await page.getByText("0 of 20 selected").isVisible());
  check("zip button disabled at 0", !(await page.getByRole("button", { name: /Download ZIP/ }).isEnabled()));

  console.log("== ZIP download ==");
  await page.getByRole("button", { name: "All", exact: true }).click();
  const dl = page.waitForEvent("download", { timeout: 30000 });
  await page.getByRole("button", { name: /Download ZIP/ }).click();
  const zip = await dl;
  check("zip filename", zip.suggestedFilename() === "test-video-frames.zip", zip.suggestedFilename());
  const zipPath = await zip.path();
  const fs = require("fs");
  const size = fs.statSync(zipPath).size;
  check("zip non-empty", size > 1000, `${size} bytes`);

  console.log("== Time range extraction ==");
  await page.getByRole("textbox", { name: "Start time" }).fill("00:00:02.000");
  await page.getByRole("textbox", { name: "End time" }).fill("00:00:05.000");
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (6)", { timeout: 30000 });
  check("6 frames in range", await page.getByText("Frames (6)").isVisible());
  check("first in-range frame 00:00:02.000", await page.getByText("00:00:02.000").first().isVisible());
  await page.getByRole("textbox", { name: "Start time" }).fill("00:00:00.000");
  await page.getByRole("textbox", { name: "End time" }).fill("00:00:10.000");

  console.log("== JPEG format ==");
  await page.getByRole("button", { name: "JPEG" }).click();
  check("quality slider appears", await page.getByRole("slider", { name: "Quality slider" }).isVisible());
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });
  const jpegMimes = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) => i.alt && i.alt.startsWith("Frame"));
    return [...new Set(imgs.map((i) => i.src.split(";")[0]))];
  });
  check("frames are JPEG", JSON.stringify(jpegMimes) === '["data:image/jpeg"]', JSON.stringify(jpegMimes));

  console.log("== WebP format ==");
  await page.getByRole("button", { name: "WebP" }).click();
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });
  const webpMimes = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) => i.alt && i.alt.startsWith("Frame"));
    return [...new Set(imgs.map((i) => i.src.split(";")[0]))];
  });
  check("frames are WebP", JSON.stringify(webpMimes) === '["data:image/webp"]', JSON.stringify(webpMimes));

  console.log("== Cancel ==");
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "50");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~200 frames").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.getByRole("button", { name: /Extracting/ }).waitFor({ timeout: 5000 });
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Extract All Frames" }).waitFor({ timeout: 15000 });
  const cancelToast = await page.getByText(/cancelled/i).count();
  check("cancel toast shown", cancelToast > 0, `(${cancelToast})`);
  const keptFrames = await page.getByText(/Frames \(\d+\)/).count();
  check("partial frames kept", keptFrames > 0);

  console.log("== Capture frame ==");
  await page.getByRole("slider", { name: "Extraction interval slider" }).evaluate((el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "500");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.getByText("~20 frames").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "PNG" }).click();
  await page.locator("video").evaluate((v) => {
    v.currentTime = 3.5;
  });
  await page.waitForTimeout(800);
  const readCount = async () => {
    const text = await page.getByText(/Frames \(\d+\)/).first().textContent();
    return Number(text.match(/Frames \((\d+)\)/)[1]);
  };
  const before = await readCount();
  await page.getByRole("button", { name: "Capture Frame" }).click();
  await page.waitForTimeout(500);
  const after = await readCount();
  check("frame count increased after capture", after === before + 1, `before=${before} after=${after}`);
  const lastCard = page.locator("img[alt^='Frame at']").last();
  const src = await lastCard.getAttribute("src");
  check("captured frame is PNG", src.startsWith("data:image/png"), src.split(";")[0]);

  console.log("== Context menu ==");
  await page.locator("img[alt^='Frame at']").first().click({ button: "right" });
  await page.waitForTimeout(300);
  check("context menu shows Open in New Tab", await page.getByRole("button", { name: "Open in New Tab" }).isVisible());
  check("context menu shows Save Image As", await page.getByRole("button", { name: /Save Image As/ }).isVisible());
  check("context menu shows Copy Image", await page.getByRole("button", { name: "Copy Image" }).isVisible());

  console.log("== Per-frame download ==");
  await page.keyboard.press("Escape");
  await page.locator("img[alt^='Frame at']").first().hover();
  const firstSrc = await page.locator("img[alt^='Frame at']").first().getAttribute("src");
  const expectedExt = firstSrc.startsWith("data:image/jpeg") ? "jpg" : firstSrc.startsWith("data:image/webp") ? "webp" : "png";
  const singleDl = page.waitForEvent("download", { timeout: 15000 });
  await page.getByRole("button", { name: /Download frame/ }).first().click();
  const single = await singleDl;
  check(
    "single frame filename pattern",
    new RegExp(`^test-video_frame-\\d{5}_\\d{2}-\\d{2}-\\d{2}-\\d{3}\\.${expectedExt}$`).test(single.suggestedFilename()),
    single.suggestedFilename()
  );

  console.log("== Theme toggle ==");
  const themeBefore = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: "Toggle theme" }).click();
  const themeAfter = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  check("theme toggled", themeBefore !== themeAfter, `${themeBefore} -> ${themeAfter}`);

  console.log("== Touch/mobile ==");
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(`${BASE}/extractor`, { waitUntil: "networkidle" });
  await touchPage.setInputFiles('input[type="file"]', VIDEO);
  await touchPage.waitForSelector("text=test-video.mp4", { timeout: 10000 });
  await touchPage.getByRole("button", { name: "Extract All Frames" }).click();
  await touchPage.waitForSelector("text=Frames (20)", { timeout: 30000 });
  check(
    "touch: download button visible without hover",
    await touchPage.locator('[aria-label^="Download frame"]').first().isVisible()
  );
  check("touch: copy button visible without hover", await touchPage.locator('[aria-label^="Copy frame"]').first().isVisible());
  const touchOverflow = await touchPage.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("touch: no horizontal overflow", touchOverflow <= 0, `${touchOverflow}px`);
  await touchContext.close();

  await browser.close();

  console.log(`\n===== RESULT: ${pass} passed, ${fail} failed =====`);
  if (failures.length) {
    console.log("Failures:");
    failures.forEach((f) => console.log("  - " + f));
  }
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => {
  console.error("E2E run crashed:", e);
  process.exit(2);
});
