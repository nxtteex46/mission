import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the M Card mission prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="th"/i);
  assert.match(html, /<title>M Card Mission Prototype<\/title>/i);
  assert.match(html, /Shop Mission/);
  assert.match(html, /ทั้งหมด/);
  assert.match(html, /เข้าร่วมแล้ว \((?:<!-- -->)?0(?:<!-- -->)?\)/);
  assert.match(html, /SABINA STAR CATCHER/);
  assert.match(html, /GOURMET EATS/);
  assert.match(html, /STOP FOOD WASTE/);
  assert.match(html, /THE MALL LIFESTORE EATVENTURE/);
  assert.match(html, /ของรางวัลคงเหลือรวม 3,777 สิทธิ์/);
  assert.match(html, /จำกัดสิทธิ์ 3,777 สิทธิ์/);
  assert.match(html, /จำกัดสิทธิ์ 80 สิทธิ์/);
  assert.doesNotMatch(html, /3 ดวง/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("keeps the prototype free of starter preview scaffolding", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /more-tiers-inline/);
  assert.match(page, /MissionListPage/);
  assert.match(page, /ProgressCard/);
  assert.match(layout, /title:\s*"M Card Mission Prototype"/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});
