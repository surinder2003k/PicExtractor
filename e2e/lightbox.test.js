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
  page.on("pageerror", (e) => console.log(`  PAGE ERROR: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      if (!/ERR_CONNECTION|favicon|React DevTools/.test(t)) console.log(`  CONSOLE ERROR: ${t}`);
    }
  });

  console.log("== Lightbox: open on click ==");
  await page.goto(`${BASE}/extractor`, { waitUntil: "networkidle" });
  await page.setInputFiles('input[type="file"]', VIDEO);
  await page.waitForSelector("text=~20 frames", { timeout: 10000 });
  await page.getByRole("button", { name: "Extract All Frames" }).click();
  await page.waitForSelector("text=Frames (20)", { timeout: 30000 });

  // Click the first frame image (not a download button)
  await page.locator("img[alt^='Frame at']").first().click();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  check("lightbox opens on image click", await page.locator('[role="dialog"]').isVisible());
  check("shows 1 / 20", await page.getByText("1 / 20").isVisible());
  check("viewing image present", await page.locator("img[alt^='Viewing frame at']").isVisible());
  check("lightbox has download button", await page.getByRole("button", { name: "Download frame from viewer" }).isVisible());

  console.log("== Lightbox: next/prev via buttons ==");
  await page.getByRole("button", { name: "Next frame" }).click();
  check("next -> 2 / 20", await page.getByText("2 / 20").isVisible());
  await page.getByRole("button", { name: "Previous frame" }).click();
  check("prev -> 1 / 20", await page.getByText("1 / 20").isVisible());

  console.log("== Lightbox: keyboard navigation ==");
  await page.keyboard.press("ArrowRight");
  check("ArrowRight -> 2 / 20", await page.getByText("2 / 20").isVisible());
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  check("ArrowRight x3 -> 4 / 20", await page.getByText("4 / 20").isVisible());
  await page.keyboard.press("ArrowLeft");
  check("ArrowLeft -> 3 / 20", await page.getByText("3 / 20").isVisible());
  await page.keyboard.press("Escape");
  check("Escape closes lightbox", (await page.locator('[role="dialog"]').count()) === 0);

  console.log("== Lightbox: no download on click ==");
  // Click an image and verify no download event fires
  await page.locator("img[alt^='Frame at']").nth(1).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  const downloadRace = Promise.race([
    page.waitForEvent("download", { timeout: 1500 }).then(() => "downloaded").catch(() => "no-download"),
    page.waitForTimeout(1500).then(() => "no-download"),
  ]);
  check("image click does not trigger download", (await downloadRace) === "no-download");

  console.log("== Lightbox: download button works ==");
  const dl = page.waitForEvent("download", { timeout: 15000 });
  await page.getByRole("button", { name: "Download frame from viewer" }).click();
  const zip = await dl;
  check("viewer download has filename", /^test-video_frame-\d{5}_\d{2}-\d{2}-\d{2}-\d{3}\.(png|jpg|webp)$/.test(zip.suggestedFilename()), zip.suggestedFilename());
  await page.getByRole("button", { name: "Close viewer" }).click();
  check("close button closes", (await page.locator('[role="dialog"]').count()) === 0);

  console.log("== Lightbox: keyboard navigation not needed after close ==");
  await page.keyboard.press("ArrowRight");
  check("lightbox stays closed after ArrowRight", (await page.locator('[role="dialog"]').count()) === 0);

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
