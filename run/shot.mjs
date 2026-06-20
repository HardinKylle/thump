// shot.mjs — capture a screenshot of the running app so the orchestrator can
// actually SEE the rendered UI (lesson #1: verify behavior, not just builds).
// Usage: node run/shot.mjs <name> [clickSelector] [waitMs]
import { chromium } from 'playwright';

const name = process.argv[2] ?? 'shot';
const clickSelector = process.argv[3] ?? '';
const waitMs = Number(process.argv[4] ?? 1500);
const url = process.env.THUMP_URL ?? 'http://localhost:5173/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle' });
if (clickSelector) {
  try { await page.click(clickSelector, { timeout: 3000 }); } catch { /* ignore */ }
}
await page.waitForTimeout(waitMs);
await page.screenshot({ path: `shots/${name}.png` });
await browser.close();

if (errors.length) {
  console.log('CONSOLE_ERRORS:\n' + errors.join('\n'));
  process.exit(0);
}
console.log(`OK shots/${name}.png`);
