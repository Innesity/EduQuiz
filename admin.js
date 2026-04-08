const STORAGE_KEY = "eduquiz:config:v1";
const API_CONFIG_URL = "/api/config";

/** @typedef {{ id: string, label: string, imageSrc?: string, description?: string }} Outcome */
/** @typedef {{ id: string, text: string, outcomeId: string }} Answer */
/** @typedef {{ id: string, prompt: string, answers: Answer[] }} Question */
/** @typedef {{ meta: { title: string, subtitle?: string, landingText?: string }, outcomes: Outcome[], questions: Question[] }} QuizConfig */

/** @returns {QuizConfig} */
function defaultConfig() {
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
    questions: [],
  };
}

/** @param {any} v */
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/** @param {any} config @returns {QuizConfig | null} */
function normalizeConfig(config) {
  try {
    if (!config || typeof config !== "object") return null;
    const meta = config.meta && typeof config.meta === "object" ? config.meta : {};
    const title = isNonEmptyString(meta.title) ? meta.title : "Quiz";
    const subtitle = typeof meta.subtitle === "string" ? meta.subtitle : "";
    const landingText = typeof meta.landingText === "string" ? meta.landingText : "";

    const outcomesRaw = Array.isArray(config.outcomes) ? config.outcomes : [];
    const outcomes = outcomesRaw
      .filter((o) => o && typeof o === "object" && isNonEmptyString(o.id) && isNonEmptyString(o.label))
      .map((o) => ({
        id: String(o.id),
        label: String(o.label),
        imageSrc: typeof o.imageSrc === "string" ? o.imageSrc : "",
        description: typeof o.description === "string" ? o.description : "",
      }));
    if (outcomes.length === 0) return null;
    const outcomeIds = new Set(outcomes.map((o) => o.id));

    const questionsRaw = Array.isArray(config.questions) ? config.questions : [];
    const questions = questionsRaw
      .filter((q) => q && typeof q === "object" && isNonEmptyString(q.id) && isNonEmptyString(q.prompt) && Array.isArray(q.answers))
      .map((q) => {
        const answers = q.answers
          .filter((a) => a && typeof a === "object" && isNonEmptyString(a.id) && isNonEmptyString(a.text) && isNonEmptyString(a.outcomeId))
          .map((a) => ({ id: String(a.id), text: String(a.text), outcomeId: String(a.outcomeId) }))
          .filter((a) => outcomeIds.has(a.outcomeId));
        return { id: String(q.id), prompt: String(q.prompt), answers };
      })
      .filter((q) => q.answers.length >= 2);

    return { meta: { title, subtitle, landingText }, outcomes, questions };
  } catch {
    return null;
  }
}

/** @returns {QuizConfig} */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw);
    return normalizeConfig(parsed) || defaultConfig();
  } catch {
    return defaultConfig();
  }
}

/** @param {QuizConfig} config */
function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config, null, 2));
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

let config = loadConfig();

function isStaticHost() {
  // GitHub Pages is a static host (no server-side /api/config).
  // Also treat file:// as static for local testing.
  try {
    if (window.location.protocol === "file:") return true;
    const host = String(window.location.hostname || "").toLowerCase();
    if (host.endsWith(".github.io")) return true;
    return false;
  } catch {
    return true;
  }
}

async function fetchServerConfig() {
  const res = await fetch(API_CONFIG_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Failed to fetch server config");
  return await res.json();
}

async function saveServerConfig(nextConfig) {
  const res = await fetch(API_CONFIG_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nextConfig),
  });
  if (!res.ok) throw new Error("Failed to save server config");
}

function setEditorStatus(msg) {
  const el = document.getElementById("editor-status");
  if (el) el.textContent = msg || "";
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("\n", " ");
}

function renderEditor() {
  const titleInput = document.getElementById("editor-title");
  const subtitleInput = document.getElementById("editor-subtitle");
  const landingTextInput = document.getElementById("editor-landingText");
  if (titleInput) titleInput.value = config.meta.title || "";
  if (subtitleInput) subtitleInput.value = config.meta.subtitle || "";
  if (landingTextInput) landingTextInput.value = config.meta.landingText || "";

  renderOutcomesEditor();
  renderQuestionsEditor();
}

function renderOutcomesEditor() {
  const wrap = document.getElementById("editor-outcomes");
  if (!wrap) return;

  wrap.innerHTML = config.outcomes
    .map((o, idx) => {
      return `
        <div class="border border-gray-200 rounded-2xl p-3">
          <div class="flex items-center justify-between gap-2">
            <div class="font-semibold">${escapeHtml(o.label)}</div>
            <div class="flex gap-2">
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveOutcome(${idx}, -1)">↑</button>
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveOutcome(${idx}, 1)">↓</button>
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="deleteOutcome('${o.id}')">Delete</button>
            </div>
          </div>
          <div class="mt-2 grid grid-cols-1 gap-2">
            <div>
              <label class="block text-xs font-semibold mb-1">Label</label>
              <input class="w-full border border-gray-300 rounded-xl px-3 py-2" value="${escapeAttr(o.label)}"
                oninput="updateOutcome('${o.id}', 'label', this.value)">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Image src</label>
              <input class="w-full border border-gray-300 rounded-xl px-3 py-2" value="${escapeAttr(o.imageSrc || "")}"
                oninput="updateOutcome('${o.id}', 'imageSrc', this.value)">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Description</label>
              <textarea class="w-full border border-gray-300 rounded-xl px-3 py-2" rows="4"
                oninput="updateOutcome('${o.id}', 'description', this.value)">${escapeHtml(o.description || "")}</textarea>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderQuestionsEditor() {
  const wrap = document.getElementById("editor-questions");
  if (!wrap) return;
  const outcomeOptions = config.outcomes
    .map((o) => `<option value="${escapeAttr(o.id)}">${escapeHtml(o.label)}</option>`)
    .join("");

  wrap.innerHTML = config.questions
    .map((q, qIdx) => {
      return `
        <div class="border border-gray-200 rounded-2xl p-3">
          <div class="flex items-center justify-between gap-2">
            <div class="font-semibold">Q${qIdx + 1}</div>
            <div class="flex gap-2">
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveQuestion(${qIdx}, -1)">↑</button>
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveQuestion(${qIdx}, 1)">↓</button>
              <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="deleteQuestion('${q.id}')">Delete</button>
            </div>
          </div>

          <div class="mt-2">
            <label class="block text-xs font-semibold mb-1">Prompt</label>
            <textarea class="w-full border border-gray-300 rounded-xl px-3 py-2" rows="2"
              oninput="updateQuestionPrompt('${q.id}', this.value)">${escapeHtml(q.prompt)}</textarea>
          </div>

          <div class="mt-3">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm font-semibold">Answers</div>
              <button class="text-sm text-white px-3 py-1 rounded-xl shadow hover:opacity-90" style="background-color:#9E0B0F;" onclick="addAnswer('${q.id}')">
                + Add answer
              </button>
            </div>
            <div class="mt-2 space-y-2">
              ${q.answers
                .map((a, aIdx) => {
                  return `
                    <div class="border border-gray-200 rounded-2xl p-2">
                      <div class="flex items-center justify-between gap-2">
                        <div class="text-xs font-semibold">A${aIdx + 1}</div>
                        <div class="flex gap-2">
                          <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveAnswer('${q.id}', ${aIdx}, -1)">↑</button>
                          <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="moveAnswer('${q.id}', ${aIdx}, 1)">↓</button>
                          <button class="text-sm px-3 py-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onclick="deleteAnswer('${q.id}', '${a.id}')">Delete</button>
                        </div>
                      </div>
                      <div class="mt-2 grid grid-cols-1 gap-2">
                        <div>
                          <label class="block text-xs font-semibold mb-1">Text</label>
                          <input class="w-full border border-gray-300 rounded-xl px-3 py-2" value="${escapeAttr(a.text)}"
                            oninput="updateAnswer('${q.id}', '${a.id}', 'text', this.value)">
                        </div>
                        <div>
                          <label class="block text-xs font-semibold mb-1">Goes to outcome</label>
                          <select class="w-full border border-gray-300 rounded-xl px-3 py-2"
                            onchange="updateAnswer('${q.id}', '${a.id}', 'outcomeId', this.value)">
                            ${outcomeOptions.replace(
                              `value="${escapeAttr(a.outcomeId)}"`,
                              `value="${escapeAttr(a.outcomeId)}" selected`
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function saveFromEditor() {
  const titleInput = document.getElementById("editor-title");
  const subtitleInput = document.getElementById("editor-subtitle");
  const landingTextInput = document.getElementById("editor-landingText");
  const title = titleInput ? titleInput.value : config.meta.title;
  const subtitle = subtitleInput ? subtitleInput.value : config.meta.subtitle;
  const landingText = landingTextInput ? landingTextInput.value : config.meta.landingText;
  config.meta.title = isNonEmptyString(title) ? title : "Quiz";
  config.meta.subtitle = typeof subtitle === "string" ? subtitle : "";
  config.meta.landingText = typeof landingText === "string" ? landingText : "";

  const normalized = normalizeConfig(config);
  if (!normalized) {
    setEditorStatus("Config invalid. Make sure you have at least 1 outcome and each question has at least 2 answers mapped to valid outcomes.");
    return;
  }
  config = normalized;
  setEditorStatus("Saving...");
  if (isStaticHost()) {
    saveConfig(config);
    renderEditor();
    setEditorStatus("Saved locally (GitHub Pages).");
    return;
  }

  saveServerConfig(config)
    .then(() => {
      // keep local cache too (useful if server is temporarily offline)
      saveConfig(config);
      renderEditor();
      setEditorStatus("Saved on server.");
    })
    .catch(() => {
      setEditorStatus("Save failed (server).");
    });
}

function exportConfig() {
  const area = document.getElementById("editor-json");
  if (!area) return;
  area.value = JSON.stringify(config, null, 2);
  setEditorStatus("Exported to textarea.");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function exportTimestamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}`;
}

function downloadConfig() {
  try {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eduquiz-config_${exportTimestamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setEditorStatus("Downloaded JSON.");
  } catch {
    setEditorStatus("Download failed.");
  }
}

function importConfigFromTextarea() {
  const area = document.getElementById("editor-json");
  if (!area) return;
  try {
    const parsed = JSON.parse(area.value);
    const normalized = normalizeConfig(parsed);
    if (!normalized) {
      setEditorStatus("Import failed: invalid format (or missing outcomes/questions).");
      return;
    }
    config = normalized;
    setEditorStatus("Importing...");
    if (isStaticHost()) {
      saveConfig(config);
      renderEditor();
      setEditorStatus("Imported and saved locally (GitHub Pages).");
      return;
    }

    saveServerConfig(config)
      .then(() => {
        saveConfig(config);
        renderEditor();
        setEditorStatus("Imported and saved on server.");
      })
      .catch(() => {
        setEditorStatus("Import saved locally, but failed to save on server.");
      });
  } catch {
    setEditorStatus("Import failed: JSON parse error.");
  }
}

function resetToDefault() {
  config = defaultConfig();
  if (config.questions.length === 0) {
    // keep the quiz valid even after reset
    const fallbackOutcomeId = config.outcomes[0].id;
    config.questions = [
      {
        id: "q1",
        prompt: "New question",
        answers: [
          { id: "q1a1", text: "Answer 1", outcomeId: fallbackOutcomeId },
          { id: "q1a2", text: "Answer 2", outcomeId: fallbackOutcomeId },
        ],
      },
    ];
  }
  setEditorStatus("Resetting...");
  if (isStaticHost()) {
    saveConfig(config);
    renderEditor();
    setEditorStatus("Reset to default and saved locally (GitHub Pages).");
    return;
  }

  saveServerConfig(config)
    .then(() => {
      saveConfig(config);
      renderEditor();
      setEditorStatus("Reset to default and saved on server.");
    })
    .catch(() => {
      setEditorStatus("Reset saved locally, but failed to save on server.");
    });
}

function addOutcome() {
  const id = uid("outcome");
  config.outcomes.push({ id, label: "New outcome", imageSrc: "", description: "" });
  renderEditor();
  setEditorStatus("Outcome added (remember to Save).");
}

function moveOutcome(idx, delta) {
  const next = idx + delta;
  if (next < 0 || next >= config.outcomes.length) return;
  const copy = [...config.outcomes];
  const [item] = copy.splice(idx, 1);
  copy.splice(next, 0, item);
  config.outcomes = copy;
  renderEditor();
  setEditorStatus("Outcome moved (remember to Save).");
}

function updateOutcome(outcomeId, field, value) {
  const o = config.outcomes.find((x) => x.id === outcomeId);
  if (!o) return;
  if (field === "label") o.label = value;
  if (field === "imageSrc") o.imageSrc = value;
  if (field === "description") o.description = value;
}

function deleteOutcome(outcomeId) {
  if (config.outcomes.length <= 1) {
    setEditorStatus("You must keep at least 1 outcome.");
    return;
  }
  const used = config.questions.some((q) => q.answers.some((a) => a.outcomeId === outcomeId));
  if (used) {
    setEditorStatus("Can't delete: this outcome is used by at least one answer. Reassign answers first.");
    return;
  }
  config.outcomes = config.outcomes.filter((o) => o.id !== outcomeId);
  renderEditor();
  setEditorStatus("Outcome deleted (remember to Save).");
}

function addQuestion() {
  const qId = uid("q");
  const fallbackOutcomeId = config.outcomes[0]?.id;
  const answers = [
    { id: uid("a"), text: "Answer 1", outcomeId: fallbackOutcomeId },
    { id: uid("a"), text: "Answer 2", outcomeId: fallbackOutcomeId },
  ];
  config.questions.push({ id: qId, prompt: "New question", answers });
  renderEditor();
  setEditorStatus("Question added (remember to Save).");
}

function moveQuestion(idx, delta) {
  const next = idx + delta;
  if (next < 0 || next >= config.questions.length) return;
  const copy = [...config.questions];
  const [item] = copy.splice(idx, 1);
  copy.splice(next, 0, item);
  config.questions = copy;
  renderEditor();
  setEditorStatus("Question moved (remember to Save).");
}

function updateQuestionPrompt(questionId, value) {
  const q = config.questions.find((x) => x.id === questionId);
  if (!q) return;
  q.prompt = value;
}

function deleteQuestion(questionId) {
  if (config.questions.length <= 1) {
    setEditorStatus("You must keep at least 1 question.");
    return;
  }
  config.questions = config.questions.filter((q) => q.id !== questionId);
  renderEditor();
  setEditorStatus("Question deleted (remember to Save).");
}

function addAnswer(questionId) {
  const q = config.questions.find((x) => x.id === questionId);
  if (!q) return;
  const fallbackOutcomeId = config.outcomes[0]?.id;
  q.answers.push({ id: uid("a"), text: "New answer", outcomeId: fallbackOutcomeId });
  renderEditor();
  setEditorStatus("Answer added (remember to Save).");
}

function moveAnswer(questionId, idx, delta) {
  const q = config.questions.find((x) => x.id === questionId);
  if (!q) return;
  const next = idx + delta;
  if (next < 0 || next >= q.answers.length) return;
  const copy = [...q.answers];
  const [item] = copy.splice(idx, 1);
  copy.splice(next, 0, item);
  q.answers = copy;
  renderEditor();
  setEditorStatus("Answer moved (remember to Save).");
}

function updateAnswer(questionId, answerId, field, value) {
  const q = config.questions.find((x) => x.id === questionId);
  if (!q) return;
  const a = q.answers.find((x) => x.id === answerId);
  if (!a) return;
  if (field === "text") a.text = value;
  if (field === "outcomeId") a.outcomeId = value;
}

function deleteAnswer(questionId, answerId) {
  const q = config.questions.find((x) => x.id === questionId);
  if (!q) return;
  if (q.answers.length <= 2) {
    setEditorStatus("Each question must have at least 2 answers.");
    return;
  }
  q.answers = q.answers.filter((a) => a.id !== answerId);
  renderEditor();
  setEditorStatus("Answer deleted (remember to Save).");
}

document.addEventListener("DOMContentLoaded", () => {
  setEditorStatus("Loading...");
  if (isStaticHost()) {
    config = loadConfig();
    renderEditor();
    setEditorStatus("Loaded local config (GitHub Pages).");
    return;
  }

  fetchServerConfig()
    .then((cfg) => {
      const normalized = normalizeConfig(cfg) || loadConfig();
      config = normalized;
      saveConfig(config);
      renderEditor();
      setEditorStatus("");
    })
    .catch(() => {
      // fallback to local cache if server is unreachable
      config = loadConfig();
      renderEditor();
      setEditorStatus("Loaded local config (server unavailable).");
    });
});

