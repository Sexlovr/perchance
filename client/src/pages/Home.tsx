/* Flux Studio design reminder: Carbon Editorial Console — graphite workspace, signal-lime actions, editorial metadata, and no layout surprises. */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Layers3,
  Loader2,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Plus,
  RefreshCw,
  Settings2,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";

type View = "create" | "gallery" | "models";
type Mode = "native" | "external";
type Result = {
  id: string;
  src: string;
  prompt: string;
  style: string;
  mode: Mode;
  createdAt: string;
};

type ExternalConfig = {
  endpoint: string;
  model: string;
  apiKey: string;
  size: string;
  count: number;
  headers: string;
};

const HERO_IMAGE = "/manus-storage/flux-studio-hero-reference_364a5ba8.jpg";
const MARK_IMAGE = "/manus-storage/flux-studio-mark_b221fbec.png";

const galleryAssets = [
  { src: "/manus-storage/flux-studio-gallery-portrait_b7f6ac0c.jpg", label: "Glass / botanical" },
  { src: "/manus-storage/flux-studio-gallery-landscape_a74d0939.jpg", label: "Concrete / signal" },
  { src: "/manus-storage/flux-studio-gallery-square_fc80ddfc.jpg", label: "Desk / crop marks" },
];

const stylePresets = [
  { id: "editorial", label: "Editorial", detail: "Controlled light · tactile grain", prompt: "high-end editorial photography, tactile film grain, controlled softbox light" },
  { id: "cinematic", label: "Cinematic", detail: "Deep shadow · wide atmosphere", prompt: "cinematic still, dramatic atmosphere, rich shadow detail, wide lens composition" },
  { id: "graphic", label: "Graphic", detail: "Shape · color · clean edges", prompt: "graphic art direction, clean geometry, considered negative space, crisp color blocking" },
  { id: "dreamlike", label: "Dreamlike", detail: "Soft bloom · unexpected detail", prompt: "dreamlike visual language, soft bloom, subtle surreal detail, poetic composition" },
];

const sizes = [
  { value: "1024x1024", label: "Square", ratio: "1:1" },
  { value: "1024x1536", label: "Portrait", ratio: "2:3" },
  { value: "1536x1024", label: "Landscape", ratio: "3:2" },
];

const defaultExternal: ExternalConfig = {
  endpoint: "https://api.openai.com/v1/images/generations",
  model: "gpt-image-1",
  apiKey: "",
  size: "1024x1024",
  count: 1,
  headers: "{}",
};

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function formatTime() {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function getImageFromData(item: { url?: string; b64_json?: string }) {
  if (item.url) return item.url;
  if (item.b64_json) return `data:image/png;base64,${item.b64_json}`;
  return null;
}

export default function Home() {
  const [view, setView] = useState<View>("create");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("native");
  const [prompt, setPrompt] = useState("A quiet architectural studio at first light, one vivid green door, tactile materials, deliberate negative space");
  const [negative, setNegative] = useState("blurry, cluttered, low contrast, unreadable text");
  const [styleId, setStyleId] = useState("editorial");
  const [size, setSize] = useState("1024x1024");
  const [count, setCount] = useState(1);
  const [seed, setSeed] = useState(2048);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [catboxOpen, setCatboxOpen] = useState(false);
  const [catboxUrls, setCatboxUrls] = useState("");
  const [catboxAlbum, setCatboxAlbum] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("Ready for a new frame");
  const [error, setError] = useState("");
  const [currentResult, setCurrentResult] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [external, setExternal] = useState<ExternalConfig>(defaultExternal);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("flux-studio-external-config");
      if (stored) setExternal({ ...defaultExternal, ...JSON.parse(stored) });
      const savedResults = localStorage.getItem("flux-studio-results");
      if (savedResults) setResults(JSON.parse(savedResults));
    } catch {
      setStatus("Local workspace storage unavailable");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("flux-studio-results", JSON.stringify(results.slice(0, 24)));
    } catch {
      // The workspace remains usable without local persistence.
    }
  }, [results]);

  const selectedStyle = useMemo(() => stylePresets.find((item) => item.id === styleId) ?? stylePresets[0], [styleId]);
  const selectedSize = useMemo(() => sizes.find((item) => item.value === size) ?? sizes[0], [size]);

  function addResult(src: string, resultPrompt = prompt, resultMode: Mode = mode) {
    const result: Result = { id: makeId(), src, prompt: resultPrompt, style: selectedStyle.label, mode: resultMode, createdAt: formatTime() };
    setCurrentResult(result);
    setResults((previous) => [result, ...previous.filter((item) => item.src !== src)].slice(0, 24));
    return result;
  }

  async function generateExternal() {
    const endpoint = external.endpoint.trim();
    if (!endpoint) throw new Error("Add an image-generation endpoint in Models first.");
    let extraHeaders: Record<string, string> = {};
    try {
      extraHeaders = external.headers.trim() ? JSON.parse(external.headers) : {};
      if (typeof extraHeaders !== "object" || Array.isArray(extraHeaders)) throw new Error("Headers must be a JSON object.");
    } catch {
      throw new Error("Additional headers must be valid JSON, for example {\"X-Org\":\"studio\"}.");
    }
    const headers: Record<string, string> = { "Content-Type": "application/json", ...extraHeaders };
    if (external.apiKey.trim()) headers.Authorization = `Bearer ${external.apiKey.trim()}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: external.model.trim() || undefined,
        prompt: `${prompt}. Style direction: ${selectedStyle.prompt}. Avoid: ${negative}`,
        size: external.size || size,
        n: Math.min(4, Math.max(1, external.count || count)),
        response_format: "b64_json",
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || `Endpoint returned ${response.status}. Check the URL, CORS policy, and model ID.`);
    const urls = Array.isArray(payload?.data) ? payload.data.map(getImageFromData).filter(Boolean) : [];
    if (!urls.length) throw new Error("The endpoint returned no image URL or b64_json data.");
    urls.forEach((url: string, index: number) => addResult(url, index ? `${prompt} · variation ${index + 1}` : prompt, "external"));
    setStatus(`${urls.length} external frame${urls.length === 1 ? "" : "s"} added`);
  }

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setError("");
    setIsGenerating(true);
    setStatus(mode === "external" ? "Connecting to external model" : "Composing a native Flux preview");
    try {
      if (mode === "external") {
        await generateExternal();
      } else {
        const asset = galleryAssets[(results.length + seed) % galleryAssets.length];
        addResult(asset.src, prompt, "native");
        setStatus("Native preview ready · connect a live adapter when your provider is available");
      }
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Generation failed. Check your settings and try again.");
      setStatus("Generation needs attention");
    } finally {
      setIsGenerating(false);
    }
  }

  function saveExternalSettings() {
    try {
      localStorage.setItem("flux-studio-external-config", JSON.stringify(external));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setError("Your browser blocked local settings storage. The values will still work for this session.");
    }
  }

  function importCatboxUrls() {
    const urls = catboxUrls.split(/[\n,]+/).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url));
    if (!urls.length) {
      setError("Paste one or more direct Catbox image URLs first.");
      return;
    }
    urls.forEach((url) => addResult(url, "Imported from Catbox", "native"));
    setCatboxUrls("");
    setCatboxOpen(false);
    setStatus(`${urls.length} Catbox image${urls.length === 1 ? "" : "s"} imported`);
  }

  function clearWorkspace() {
    setResults([]);
    setCurrentResult(null);
    localStorage.removeItem("flux-studio-results");
    setStatus("Workspace cleared");
  }

  function copyPrompt() {
    navigator.clipboard?.writeText(prompt);
    setStatus("Prompt copied to clipboard");
  }

  return (
    <div className="flux-app">
      <header className="topbar">
        <div className="brand-lockup">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}><Menu size={18} /></button>
          <img className="brand-mark" src={MARK_IMAGE} alt="" />
          <span className="brand-name">Flux <em>Studio</em></span>
          <span className={`signal-dot ${isGenerating ? "is-live" : ""}`} aria-label={isGenerating ? "Generating" : "Ready"} />
        </div>
        <nav className={`main-nav ${mobileNavOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {([ ["create", "Create"], ["gallery", "Gallery"], ["models", "Models"] ] as [View, string][]).map(([id, label]) => (
            <button key={id} className={view === id ? "nav-link is-active" : "nav-link"} onClick={() => { setView(id); setMobileNavOpen(false); }}>{label}</button>
          ))}
        </nav>
        <div className="topbar-actions">
          <span className="connection-status"><span className="status-led" /> Local workspace</span>
          <button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button>
        </div>
      </header>

      <main className="studio-shell">
        <section className="studio-heading">
          <div>
            <p className="eyebrow">IMAGE MAKING WORKSPACE <span>/</span> 01</p>
            <h1>Shape the frame. <span>Keep the signal.</span></h1>
          </div>
          <div className="heading-note"><span className="note-index">A1</span><p>Compose, render, and archive from one focused console. Your prompt and model settings stay in this browser.</p></div>
        </section>

        {view === "create" && <div className="workspace-grid">
          <aside className="control-rail">
            <div className="rail-header"><div><span className="panel-kicker">CONTROL RAIL</span><h2>Make a frame</h2></div><PanelLeft size={17} /></div>
            <div className="mode-switch" role="tablist" aria-label="Generation path">
              <button className={mode === "native" ? "mode-tab is-active" : "mode-tab"} onClick={() => setMode("native")}><Sparkles size={14} /> Native Flux</button>
              <button className={mode === "external" ? "mode-tab is-active" : "mode-tab"} onClick={() => setMode("external")}><Layers3 size={14} /> External</button>
            </div>
            <label className="field-label" htmlFor="prompt">Prompt <span>required</span></label>
            <div className="prompt-field-wrap"><textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the frame you want to see..." /><button className="copy-prompt" aria-label="Copy prompt" onClick={copyPrompt}><Copy size={15} /></button></div>
            <div className="field-row"><div><label className="field-label" htmlFor="negative">Avoid <span>optional</span></label><input id="negative" value={negative} onChange={(event) => setNegative(event.target.value)} /></div><button className="tiny-action" onClick={() => setNegative("")} aria-label="Clear negative prompt"><X size={14} /></button></div>
            <div className="section-rule" />
            <div className="field-label">Style direction <span>choose one</span></div>
            <div className="preset-list">{stylePresets.map((style) => <button key={style.id} className={styleId === style.id ? "preset-card is-selected" : "preset-card"} onClick={() => setStyleId(style.id)}><span className="preset-radio">{styleId === style.id && <span />}</span><span><strong>{style.label}</strong><small>{style.detail}</small></span></button>)}</div>
            <div className="section-rule" />
            <div className="parameter-grid">
              <div><label className="field-label" htmlFor="size">Canvas</label><select id="size" value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((item) => <option key={item.value} value={item.value}>{item.label} · {item.ratio}</option>)}</select></div>
              <div><label className="field-label" htmlFor="count">Frames</label><select id="count" value={count} onChange={(event) => setCount(Number(event.target.value))}><option value={1}>01 frame</option><option value={2}>02 frames</option><option value={3}>03 frames</option><option value={4}>04 frames</option></select></div>
            </div>
            <button className="advanced-toggle" onClick={() => setAdvancedOpen((open) => !open)}><span><Settings2 size={14} /> Advanced parameters</span><ChevronDown size={15} className={advancedOpen ? "rotate" : ""} /></button>
            {advancedOpen && <div className="advanced-panel"><label className="field-label" htmlFor="seed">Seed <span>repeatable composition</span></label><input id="seed" type="number" value={seed} onChange={(event) => setSeed(Number(event.target.value))} /><p>Use the same seed to explore prompt changes without losing the visual direction.</p></div>}
            <button className="generate-button" onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>{isGenerating ? <><Loader2 size={17} className="spin" /> Generating frame</> : <><WandSparkles size={17} /> Generate frame <span>↗</span></>}</button>
            <div className="rail-footer"><span className={`mini-led ${isGenerating ? "is-live" : ""}`} />{status}</div>
          </aside>

          <section className="canvas-column">
            <div className="canvas-toolbar"><div><span className="panel-kicker">OUTPUT CANVAS</span><h2>{currentResult ? "Latest frame" : "Ready for direction"}</h2></div><div className="canvas-actions"><button className="secondary-button" onClick={() => setSettingsOpen(true)}><Settings2 size={15} /> Model settings</button><button className="icon-button subtle" aria-label="Refresh preview" onClick={() => setCurrentResult(null)}><RefreshCw size={16} /></button></div></div>
            <div className={`output-canvas ${currentResult ? "has-result" : ""}`} style={!currentResult ? { backgroundImage: `linear-gradient(90deg, rgba(11,14,16,.78), rgba(11,14,16,.24)), url(${HERO_IMAGE})` } : undefined}>
              {currentResult ? <img src={currentResult.src} alt={currentResult.prompt} /> : <div className="canvas-empty"><div className="canvas-index">FRAME / 000 <span className="canvas-signal"><i /> SIGNAL READY</span></div><img className="canvas-mark" src={MARK_IMAGE} alt="" /><div><ImageIcon size={27} strokeWidth={1.2} /><h3>Your canvas is ready.</h3><p>Write a direction on the left, then let the image take the room.</p></div><span className="canvas-size">{selectedSize.value} · {selectedSize.ratio}</span></div>}
              {currentResult && <div className="result-overlay"><span>{currentResult.mode === "external" ? "External model" : "Native preview"}</span><span>{selectedSize.ratio} · {currentResult.createdAt}</span></div>}
            </div>
            <div className="canvas-meta"><span><i className="meta-dot" /> {currentResult ? "Frame rendered" : "Waiting for a prompt"}</span><span>{mode === "external" ? external.model || "External model not set" : "Flux native path"}</span><button className="text-button" onClick={() => setCatboxOpen(true)}>Catbox gallery <ArrowUpRight size={13} /></button></div>
            {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={15} /></button></div>}
            <div className="gallery-section"><div className="section-heading"><div><span className="panel-kicker">RECENT FRAMES</span><h2>Contact sheet</h2></div><div className="section-actions"><button className="text-button" onClick={() => setView("gallery")}>View all <ArrowUpRight size={13} /></button><button className="icon-button subtle" onClick={clearWorkspace} aria-label="Clear workspace"><Trash2 size={15} /></button></div></div>
              {results.length ? <div className="contact-sheet">{results.slice(0, 6).map((result, index) => <button className={`contact-card ${currentResult?.id === result.id ? "is-current" : ""}`} key={result.id} onClick={() => setCurrentResult(result)}><img src={result.src} alt={result.prompt} /><span className="contact-caption"><strong><i>{String(index + 1).padStart(2, "0")}</i>{result.style}</strong><small>{result.mode} · {result.createdAt}</small></span></button>)}</div> : <div className="sheet-empty"><div className="empty-frame-grid"><span><b>01</b><i /></span><span><b>02</b><i /></span><span><b>03</b><i /></span></div><div><strong>Contact sheet standing by.</strong><p>Your next frame will join the sheet here.</p></div></div>}
            </div>
          </section>
        </div>}

        {view === "gallery" && <section className="full-view"><div className="view-header"><div><span className="panel-kicker">ARCHIVE / CONTACT SHEET</span><h2>Every frame, in one place.</h2></div><button className="secondary-button" onClick={() => setCatboxOpen(true)}><Plus size={15} /> Import Catbox URLs</button></div>{results.length ? <div className="archive-grid">{results.map((result) => <button className="archive-card" key={result.id} onClick={() => { setCurrentResult(result); setView("create"); }}><img src={result.src} alt={result.prompt} /><div><strong>{result.style}</strong><span>{result.mode} · {result.createdAt}</span></div></button>)}</div> : <div className="large-empty"><ImageIcon size={30} /><h3>No frames archived yet.</h3><p>Generate a frame or import a direct Catbox image URL to start the sheet.</p><button className="generate-button compact" onClick={() => setView("create")}>Create the first frame <ArrowUpRight size={16} /></button></div>}</section>}

        {view === "models" && <section className="full-view models-view"><div className="view-header"><div><span className="panel-kicker">CONNECTIONS / 02</span><h2>Bring your own model.</h2><p>Use any OpenAI-compatible image endpoint. Keys stay in this browser and are never sent to Flux Studio.</p></div><button className="generate-button compact" onClick={() => setSettingsOpen(true)}><Settings2 size={15} /> Configure endpoint</button></div><div className="model-summary"><div className="summary-mark"><Layers3 size={25} /></div><div><strong>{external.model || "No external model configured"}</strong><span>{external.endpoint || "Add a POST /images/generations endpoint to begin."}</span></div><span className={`connection-pill ${external.endpoint && external.model ? "is-ready" : ""}`}><i /> {external.endpoint && external.model ? "Ready to test" : "Needs setup"}</span></div><div className="model-notes"><div><span>01</span><h3>OpenAI-compatible</h3><p>Flux Studio sends a standard JSON body with prompt, model, size, count, and response format.</p></div><div><span>02</span><h3>Local by default</h3><p>Configuration is stored in local browser storage. Use a server-side proxy before sharing a key with other people.</p></div><div><span>03</span><h3>Graceful failures</h3><p>HTTP errors, invalid JSON, CORS blocks, and empty responses are surfaced beside the canvas.</p></div></div></section>}
      </main>

      <footer className="site-footer"><span>FLUX STUDIO <b>·</b> A focused image-making workspace</span><span>Native preview + external endpoints <b>·</b> v0.1</span></footer>

      {settingsOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="modal-header"><div><span className="panel-kicker">MODEL CONNECTION</span><h2 id="settings-title">External image model</h2></div><button className="icon-button subtle" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={17} /></button></div><p className="modal-intro">Connect an OpenAI-compatible `POST /images/generations` endpoint. Your API key is kept locally in this browser.</p><label className="field-label" htmlFor="endpoint">Proxy or endpoint URL</label><input id="endpoint" value={external.endpoint} onChange={(event) => setExternal({ ...external, endpoint: event.target.value })} placeholder="https://your-proxy.example/v1/images/generations" /><div className="parameter-grid"><div><label className="field-label" htmlFor="model">Model ID</label><input id="model" value={external.model} onChange={(event) => setExternal({ ...external, model: event.target.value })} placeholder="flux-1.1-pro" /></div><div><label className="field-label" htmlFor="external-size">Size</label><select id="external-size" value={external.size} onChange={(event) => setExternal({ ...external, size: event.target.value })}>{sizes.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}</select></div></div><label className="field-label" htmlFor="api-key">API key <span>optional for local proxies</span></label><input id="api-key" type="password" value={external.apiKey} onChange={(event) => setExternal({ ...external, apiKey: event.target.value })} placeholder="sk-..." autoComplete="off" /><label className="field-label" htmlFor="headers">Additional headers <span>JSON object</span></label><textarea id="headers" className="short-textarea" value={external.headers} onChange={(event) => setExternal({ ...external, headers: event.target.value })} placeholder={'{"X-Organization":"studio"}'} /><div className="modal-actions"><button className="secondary-button" onClick={() => setSettingsOpen(false)}>Cancel</button><button className="generate-button compact" onClick={() => { saveExternalSettings(); setSettingsOpen(false); }}>{saved ? <><Check size={15} /> Saved locally</> : <><Check size={15} /> Save connection</>}</button></div></section></div>}

      {catboxOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCatboxOpen(false); }}><section className="modal-card small-modal" role="dialog" aria-modal="true" aria-labelledby="catbox-title"><div className="modal-header"><div><span className="panel-kicker">GALLERY IMPORT</span><h2 id="catbox-title">Bring in Catbox frames</h2></div><button className="icon-button subtle" onClick={() => setCatboxOpen(false)} aria-label="Close Catbox import"><X size={17} /></button></div><p className="modal-intro">Paste direct image URLs, one per line. Album pages can be opened for reference, while direct URLs import without a server dependency.</p><label className="field-label" htmlFor="catbox-urls">Direct image URLs</label><textarea id="catbox-urls" value={catboxUrls} onChange={(event) => setCatboxUrls(event.target.value)} placeholder="https://files.catbox.moe/example.png\nhttps://files.catbox.moe/another.jpg" /><label className="field-label" htmlFor="catbox-album">Album URL <span>optional</span></label><div className="inline-input"><input id="catbox-album" value={catboxAlbum} onChange={(event) => setCatboxAlbum(event.target.value)} placeholder="https://catbox.moe/c/album-id" /><button className="icon-button" onClick={() => catboxAlbum && window.open(catboxAlbum, "_blank", "noopener,noreferrer")} aria-label="Open album"><ExternalLink size={15} /></button></div><div className="modal-actions"><button className="secondary-button" onClick={() => setCatboxOpen(false)}>Cancel</button><button className="generate-button compact" onClick={importCatboxUrls}><ImageIcon size={15} /> Import frames</button></div></section></div>}
    </div>
  );
}
