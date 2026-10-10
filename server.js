const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { defaultConfig, normalizeConfig } = require("./quiz-config");

const app = express();

const PORT = Number(process.env.PORT || 5174);
const ADMIN_USER = process.env.ADMIN_USER || "edu";
// No hardcoded default password: if ADMIN_PASS isn't set, generate one per run and print it.
const ADMIN_PASS = process.env.ADMIN_PASS || crypto.randomBytes(9).toString("base64url");
const CONFIG_PATH = process.env.CONFIG_PATH || path.join(__dirname, "config.json");

// Only these files are served publicly. Serving the whole directory would expose
// server.js, package files, node_modules and .git.
const PUBLIC_FILES = new Set(["main.html", "index.html", "script.js", "quiz-config.js"]);
const PUBLIC_ASSET_RE = /^[\w-]+\.(png|jpe?g|gif|svg|ico|webp)$/i;
const ADMIN_FILES = new Set(["admin.html", "admin.js"]);

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

function ensureConfigFile() {
  try {
    if (fs.existsSync(CONFIG_PATH)) return;
    writeConfig(defaultConfig());
  } catch {
    // ignore; API will error if it can't read/write.
  }
}

function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}

function writeConfig(nextConfig) {
  // Write to a temp file and rename, so a crash mid-write can't leave a truncated config.json.
  const tmp = `${CONFIG_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(nextConfig, null, 2), "utf8");
  fs.renameSync(tmp, CONFIG_PATH);
}

function parseBasicAuth(header) {
  if (!header || typeof header !== "string") return null;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  if (idx < 0) return null;
  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function adminAuth(req, res, next) {
  const creds = parseBasicAuth(req.headers.authorization);
  // Evaluate both comparisons so timing doesn't reveal which one failed.
  const userOk = creds ? safeEqual(creds.user, ADMIN_USER) : false;
  const passOk = creds ? safeEqual(creds.pass, ADMIN_PASS) : false;
  if (userOk && passOk) return next();
  res.setHeader("WWW-Authenticate", 'Basic realm="EduQuiz Admin", charset="UTF-8"');
  return res.status(401).send("Authentication required.");
}

ensureConfigFile();

// Public: quiz reads shared config from server
app.get("/api/config", (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    return res.json(normalizeConfig(readConfig()) || defaultConfig());
  } catch {
    return res.status(500).json({ error: "Failed to read config.json" });
  }
});

// Protected: admin writes shared config
app.put("/api/config", adminAuth, (req, res) => {
  const normalized = normalizeConfig(req.body);
  if (!normalized) {
    return res.status(400).json({ error: "Invalid config: need at least 1 outcome and 1 question with 2+ valid answers." });
  }
  try {
    writeConfig(normalized);
    return res.json({ ok: true, config: normalized });
  } catch {
    return res.status(500).json({ error: "Failed to write config.json" });
  }
});

app.get("/", (req, res) => res.redirect("/main.html"));
app.get("/admin", (req, res) => res.redirect("/admin.html"));

// Static files. req.path is already URL-decoded by Express, so encoded tricks like
// /%61dmin.html resolve to the same name and still hit the admin check.
app.get("/:file", (req, res, next) => {
  const file = req.params.file;
  const send = () => res.sendFile(path.join(__dirname, file), { dotfiles: "deny" }, (err) => err && next());
  if (ADMIN_FILES.has(file.toLowerCase())) return adminAuth(req, res, send);
  if (PUBLIC_FILES.has(file) || PUBLIC_ASSET_RE.test(file)) return send();
  return next();
});

app.use((req, res) => res.status(404).send("Not found."));

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`EduQuiz running on http://localhost:${PORT}/main.html`);
    if (!process.env.ADMIN_PASS) {
      // eslint-disable-next-line no-console
      console.log(`ADMIN_PASS not set. Admin login for this run: ${ADMIN_USER} / ${ADMIN_PASS}`);
    }
  });
}

module.exports = { app };
