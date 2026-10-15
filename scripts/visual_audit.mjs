import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const url = process.argv[2];
const out = process.argv[3] || "artifacts/design-review";
if (!url || !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url)) throw Error("Usage: node scripts/visual_audit.mjs http://localhost:5173/");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
 for (const width of [375,768,1440]) {
  const page = await browser.newPage({viewport:{width,height:900}});
  const errors=[]; page.on("pageerror", e=>errors.push(e.message));
  await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(700);
  const file=path.join(out,"viewport-"+width+".png");
  await page.screenshot({path:file,fullPage:true});
  const metric=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,missingAlt:document.querySelectorAll("img:not([alt])").length,title:document.title}));
  results.push({width,screenshot:file,overflow:metric.scrollWidth>metric.clientWidth,...metric,errors});
  await page.close();
 }
} finally {await browser.close();}
fs.writeFileSync(path.join(out,"audit.json"),JSON.stringify({url,results},null,2));
console.log(JSON.stringify({url,results},null,2));
