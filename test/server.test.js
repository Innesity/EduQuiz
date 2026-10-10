const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "eduquiz-"));
process.env.CONFIG_PATH = path.join(tmpDir, "config.json");
process.env.ADMIN_USER = "admin";
process.env.ADMIN_PASS = "secret";

const { app } = require("../server");
const { defaultConfig, normalizeConfig } = require("../quiz-config");

let server;
let base;
const auth = "Basic " + Buffer.from("admin:secret").toString("base64");

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test("public quiz files and images are served", async () => {
  for (const p of ["/main.html", "/script.js", "/quiz-config.js", "/CONSILIERE.png"]) {
    assert.equal((await fetch(base + p)).status, 200, p);
  }
});

test("server source, package files and .git are not served", async () => {
  for (const p of ["/server.js", "/package.json", "/config.json", "/.git/config", "/node_modules/express/package.json", "/README.md"]) {
    assert.equal((await fetch(base + p)).status, 404, p);
  }
});

test("admin page requires auth, including encoded and case variants", async () => {
  for (const p of ["/admin.html", "/admin.js", "/%61dmin.html", "/ADMIN.html"]) {
    assert.equal((await fetch(base + p)).status, 401, p);
  }
  assert.equal((await fetch(base + "/admin.html", { headers: { Authorization: auth } })).status, 200);
});

test("wrong password is rejected", async () => {
  const bad = "Basic " + Buffer.from("admin:nope").toString("base64");
  const res = await fetch(base + "/api/config", { method: "PUT", headers: { Authorization: bad, "Content-Type": "application/json" }, body: "{}" });
  assert.equal(res.status, 401);
});

test("PUT rejects invalid config and leaves the stored one intact", async () => {
  const before = await (await fetch(base + "/api/config")).json();
  const res = await fetch(base + "/api/config", {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ outcomes: [], questions: [] }),
  });
  assert.equal(res.status, 400);
  assert.deepEqual(await (await fetch(base + "/api/config")).json(), before);
});

test("PUT saves a valid config", async () => {
  const cfg = defaultConfig();
  cfg.meta.title = "Titlu nou";
  const res = await fetch(base + "/api/config", {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(cfg),
  });
  assert.equal(res.status, 200);
  assert.equal((await (await fetch(base + "/api/config")).json()).meta.title, "Titlu nou");
});

test("normalizeConfig drops answers pointing to unknown outcomes and duplicate ids", () => {
  const cfg = defaultConfig();
  cfg.questions[0].answers.push({ id: "x", text: "x", outcomeId: "nope" });
  cfg.questions.push({ ...cfg.questions[1] });
  const n = normalizeConfig(cfg);
  assert.equal(n.questions.length, defaultConfig().questions.length);
  assert.equal(n.questions[0].answers.length, 3);
});

test("default config is valid", () => {
  assert.deepEqual(normalizeConfig(defaultConfig()), defaultConfig());
});
