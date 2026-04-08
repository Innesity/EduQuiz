const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = Number(process.env.PORT || 5174);
const ADMIN_USER = process.env.ADMIN_USER || "edu";
const ADMIN_PASS = process.env.ADMIN_PASS || "edu";
const CONFIG_PATH = path.join(__dirname, "config.json");

app.use(express.json({ limit: "1mb" }));

function defaultConfig() {
  // Keep this in sync with the public quiz expectations (meta/outcomes/questions).
  return {
    meta: { title: "Descoperă care este super puterea ta EDU!", subtitle: "", landingText: "" },
    outcomes: [
      {
        id: "reprezentare",
        label: "Reprezentare",
        imageSrc: "REPREZENTARE.png",
        description:
          "🔴 Ajută la comunicarea cu șefii de an și șefii de subgrupă\n🔴 Facilitează comunicarea dintre studenți și Conducerea Facultății\n🔴 Centralizează problemele sesizate de studenți",
      },
      {
        id: "consiliere",
        label: "Consiliere",
        imageSrc: "CONSILIERE.png",
        description:
          "🔵 Monitorizează grupurile de an de WhatsApp\n🔵 Răspunde la întrebările studenților venite pe pagina Ligii și pe grupurile de an\n🔵 Identifică nevoile studenților și ia măsuri pentru a le îndeplini",
      },
      {
        id: "informare",
        label: "Informare",
        imageSrc: "INFORMARE.png",
        description:
          "🟣 Se ocupă cu generarea de conținut edu pentru articole / emailuri de pe Campus Virtual / postări ale Ligii\n🟣 Ajută studenții să descopere oportunități educaționale\n🟣 Realizează sesiuni de informare(întâlniri) cu studenții",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "Care dintre aceste opțiuni te reprezintă cel mai bine?",
        answers: [
          { id: "q1a1", text: "Să transmiți informații clar și organizat", outcomeId: "informare" },
          { id: "q1a2", text: "Să vorbești și să reprezinți grupul", outcomeId: "reprezentare" },
          { id: "q1a3", text: "Să asculți și să ajuți oamenii", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q2",
        prompt: "Dacă ai fi super-erou, ai vrea să ai puterea de…",
        answers: [
          { id: "q2a1", text: "A liniști și încuraja", outcomeId: "consiliere" },
          { id: "q2a2", text: "A inspira mulțimi", outcomeId: "reprezentare" },
          { id: "q2a3", text: "A face mesajele clare și vizibile pentru toată lumea", outcomeId: "informare" },
        ],
      },
      {
        id: "q3",
        prompt: "Ce compliment te-ar face cel mai fericit?",
        answers: [
          { id: "q3a1", text: "„Datorită ție, anul nostru a rezolvat în sfârșit acea problemă.”", outcomeId: "reprezentare" },
          { id: "q3a2", text: "„Ești mereu acolo să ne ajuți când suntem pierduți.”", outcomeId: "consiliere" },
          { id: "q3a3", text: "„Postările tale mă învață întotdeauna ceva nou.”", outcomeId: "informare" },
        ],
      },
      {
        id: "q4",
        prompt: "Care întâlnire ți-ar plăcea cel mai mult?",
        answers: [
          { id: "q4a1", text: "Orientare pentru studenții din primul an", outcomeId: "consiliere" },
          { id: "q4a2", text: "Workshop despre tehnici de învățare", outcomeId: "informare" },
          { id: "q4a3", text: "Ședință a Consiliului Facultății despre modificări de curriculum", outcomeId: "reprezentare" },
        ],
      },
      {
        id: "q5",
        prompt: "Ce ai corecta prima dată dacă ai avea bagheta magică?",
        answers: [
          {
            id: "q5a1",
            text: "Să faci facultatea să asculte și să acționeze mai rapid la nevoile studenților",
            outcomeId: "reprezentare",
          },
          { id: "q5a2", text: "Să fie toate informațiile disponibile într-un loc clar și accesibil", outcomeId: "informare" },
          { id: "q5a3", text: "Să nu mai existe niciun student pierdut sau nesprijinit", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q6",
        prompt: "Primești un anunț de la facultate. Care este reacția ta?",
        answers: [
          { id: "q6a1", text: "Oferi să răspunzi întrebărilor studenților care nu au înțeles", outcomeId: "consiliere" },
          {
            id: "q6a2",
            text: "Distribui mesajul către șefii de an pentru a te asigura că toți primesc informația",
            outcomeId: "reprezentare",
          },
          { id: "q6a3", text: "Rescrii clar anunțul pentru studenți și îl postezi online", outcomeId: "informare" },
        ],
      },
      {
        id: "q7",
        prompt: "Care sarcină ți se pare cea mai interesantă?",
        answers: [
          { id: "q7a1", text: "Colectarea feedback-ului studenților despre desfășurarea unui examen", outcomeId: "reprezentare" },
          { id: "q7a2", text: "Moderarea grupurilor WhatsApp și asigurarea că toată lumea se simte sprijinită", outcomeId: "consiliere" },
          { id: "q7a3", text: "Crearea unei postări despre oportunități Erasmus și distribuirea ei online", outcomeId: "informare" },
        ],
      },
      {
        id: "q8",
        prompt: "Ce proiect ai alege să conduci?",
        answers: [
          { id: "q8a1", text: "Crearea unui newsletter despre burse, workshop-uri și internship-uri", outcomeId: "informare" },
          {
            id: "q8a2",
            text: "Colaborarea cu liderii de an pentru a realiza un raport formal privind problemele cursurilor",
            outcomeId: "reprezentare",
          },
          { id: "q8a3", text: "Organizarea unui eveniment de integrare pentru studenții noi", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q9",
        prompt: "Când lucrezi cu alții, preferi să…",
        answers: [
          { id: "q9a1", text: "Îi ajuți pe rând și răspunzi cu răbdare la întrebările lor", outcomeId: "consiliere" },
          { id: "q9a2", text: "Pregătești materialele astfel încât să aibă totul disponibil de la început", outcomeId: "informare" },
          { id: "q9a3", text: "Reprezinți grupul în întâlniri și vorbești în numele lor", outcomeId: "reprezentare" },
        ],
      },
    ],
  };
}

function ensureConfigFile() {
  try {
    if (fs.existsSync(CONFIG_PATH)) return;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig(), null, 2), "utf8");
  } catch {
    // ignore; API will error if it can't read/write.
  }
}

function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}

function writeConfig(nextConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(nextConfig, null, 2), "utf8");
}

function parseBasicAuth(header) {
  if (!header || typeof header !== "string") return null;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;
  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return null;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return null;
  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

function adminAuth(req, res, next) {
  const creds = parseBasicAuth(req.headers.authorization);
  if (creds && creds.user === ADMIN_USER && creds.pass === ADMIN_PASS) return next();
  res.setHeader("WWW-Authenticate", 'Basic realm="EduQuiz Admin"');
  return res.status(401).send("Authentication required.");
}

// Protect admin assets
app.get("/admin.html", adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});
app.get("/admin.js", adminAuth, (req, res) => {
  res.type("application/javascript").sendFile(path.join(__dirname, "admin.js"));
});

// Config API
ensureConfigFile();

// Public: quiz reads shared config from server
app.get("/api/config", (req, res) => {
  try {
    const cfg = readConfig();
    return res.json(cfg);
  } catch {
    return res.status(500).json({ error: "Failed to read config.json" });
  }
});

// Protected: admin writes shared config
app.put("/api/config", adminAuth, (req, res) => {
  try {
    writeConfig(req.body);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to write config.json" });
  }
});

// Public assets (quiz)
app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`EduQuiz running on http://localhost:${PORT}/main.html`);
});

