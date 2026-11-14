/**
 * Cloudflare Worker — TOEIC Preposition Breakout
 *
 * 使用方式：
 * 1. 全選複製本檔案內容
 * 2. 前往 Cloudflare Dashboard -> Workers & Pages -> Create Worker -> Edit code
 * 3. 清空預設程式碼並貼上本檔案，點擊 Deploy 即可上線
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname === "/health") {
      return new Response("ok", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(request.method === "HEAD" ? null : HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff"
      }
    });
  }
};

const HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>多益介係詞彈珠打磚塊 — TOEIC Preposition Breakout</title>
  <meta name="description" content="針對多益高頻動詞與介係詞搭配設計的彈珠打磚塊復習遊戲，內含 48 題分級題庫、瞄準思考模式、即時浮動提示、右側複習面板與語音朗讀。" />
  <style>
    :root {
      --background: #f4f6f9;
      --card: #ffffff;
      --border: #d0d7de;
      --card-border: #e5e9f0;
      --foreground: #111827;
      --muted-foreground: #6b7280;
      --primary: #1d4ed8;
      --primary-foreground: #ffffff;
      --secondary: #eef2f7;
      --secondary-foreground: #1e293b;
      --link: #2563eb;
      --success: #15803d;
      --warning: #b45309;
      --error: #dc2626;
      --chart-1: #2563eb;
      --chart-2: #0d9488;
      --chart-3: #d97706;
      --chart-4: #0284c7;
      --chart-5: #16a34a;
      --chart-6: #e11d48;
      --overlay-bg: rgba(244, 246, 249, 0.88);
      --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
      --shadow-lg: 0 12px 30px rgba(15, 23, 42, 0.14);
    }

    html[data-theme="dark"] {
      --background: #0d1117;
      --card: #161b22;
      --border: #30363d;
      --card-border: #262c36;
      --foreground: #f0f6fc;
      --muted-foreground: #8b949e;
      --primary: #3b82f6;
      --primary-foreground: #ffffff;
      --secondary: #21262d;
      --secondary-foreground: #e6edf3;
      --link: #58a6ff;
      --success: #22c55e;
      --warning: #f59e0b;
      --error: #f87171;
      --chart-1: #3b82f6;
      --chart-2: #14b8a6;
      --chart-3: #f59e0b;
      --chart-4: #38bdf8;
      --chart-5: #22c55e;
      --chart-6: #fb7185;
      --overlay-bg: rgba(13, 17, 23, 0.88);
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.28);
      --shadow-lg: 0 14px 36px rgba(0, 0, 0, 0.45);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-color: var(--background);
      color: var(--foreground);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    button {
      font-family: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    .app-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Header */
    .header-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .brand-title {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge-pill {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--card-border);
    }

    .brand-subtitle {
      margin: 3px 0 0;
      font-size: 12px;
      color: var(--muted-foreground);
    }

    .controls-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .segmented {
      display: inline-flex;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--background);
      padding: 2px;
      gap: 2px;
    }

    .seg-btn {
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--muted-foreground);
      transition: background-color 0.15s, color 0.15s;
    }

    .seg-btn:hover { color: var(--foreground); }
    .seg-btn.active {
      background: var(--primary);
      color: var(--primary-foreground);
      font-weight: 600;
    }

    .ctrl-btn {
      padding: 6px 11px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--foreground);
      font-size: 12px;
      font-weight: 500;
      transition: background-color 0.15s;
    }

    .ctrl-btn:hover { background: var(--secondary); }

    .header-bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--card-border);
    }

    .level-tabs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      font-size: 12px;
    }

    .lvl-btn {
      padding: 6px 11px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--foreground);
      font-weight: 500;
      transition: background-color 0.15s;
    }

    .lvl-btn:hover { background: var(--secondary); }
    .lvl-btn.active {
      background: var(--primary);
      color: var(--primary-foreground);
      border-color: var(--primary);
      font-weight: 600;
    }
    .lvl-btn.drill-idle { color: var(--warning); }
    .lvl-btn.drill-active {
      background: var(--warning);
      color: #ffffff;
      border-color: var(--warning);
      font-weight: 600;
    }

    .stats-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-variant-numeric: tabular-nums;
    }

    .stat-item { display: flex; align-items: center; gap: 5px; }
    .stat-label { color: var(--muted-foreground); }
    .stat-val { font-weight: 700; color: var(--foreground); }
    .stat-val.accent { color: var(--primary); }

    /* Main Layout */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: start;
    }

    @media (min-width: 1024px) {
      .main-grid {
        grid-template-columns: minmax(0, 8fr) minmax(300px, 4fr);
      }
    }

    .arena-card, .panel-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
    }

    .arena-card {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .arena-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 2px;
      font-size: 12px;
    }

    .arena-meta-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .level-badge {
      padding: 2px 8px;
      border-radius: 5px;
      font-weight: 600;
      background: var(--primary);
      color: var(--primary-foreground);
    }

    .muted { color: var(--muted-foreground); }

    .canvas-wrap {
      position: relative;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--card-border);
      background: var(--background);
    }

    canvas {
      display: block;
      width: 100%;
      height: auto;
      cursor: crosshair;
      touch-action: none;
    }

    /* Overlay */
    .overlay-modal {
      position: absolute;
      inset: 0;
      background: var(--overlay-bg);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .overlay-modal.hidden { display: none; }

    .overlay-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: popIn 0.22s ease-out;
    }

    .ov-tag { font-size: 12px; font-weight: 700; color: var(--primary); letter-spacing: 0.04em; }
    .ov-title { margin: 2px 0 4px; font-size: 18px; font-weight: 700; }
    .ov-sub { margin: 0; font-size: 12px; color: var(--muted-foreground); }

    .ov-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
      background: var(--background);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 12px 8px;
      font-size: 12px;
    }

    .ov-stat-num {
      font-size: 15px;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      margin-top: 2px;
    }

    .ov-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      font-size: 12px;
    }

    .btn-primary {
      padding: 8px 14px;
      border-radius: 8px;
      background: var(--primary);
      color: var(--primary-foreground);
      font-weight: 600;
      font-size: 12px;
      transition: opacity 0.15s;
    }
    .btn-primary:hover { opacity: 0.9; }
    .btn-primary.hidden { display: none; }

    /* Ball Rack */
    .rack-section { display: flex; flex-direction: column; gap: 8px; }
    .rack-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 12px;
    }
    .rack-title { font-weight: 600; }

    .ball-rack { display: flex; flex-wrap: wrap; gap: 8px; }

    .ball-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--foreground);
      transition: background-color 0.15s, transform 0.12s;
    }
    .ball-btn:hover { background: var(--secondary); }
    .ball-btn.selected {
      font-weight: 700;
      border-width: 2px;
      background: var(--card);
      transform: scale(1.03);
      box-shadow: var(--shadow-sm);
    }

    .ball-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }

    /* Right Review Panel */
    .panel-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: 690px;
    }

    .panel-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-bottom: 1px solid var(--card-border);
      background: var(--background);
      font-size: 12px;
    }

    .tab-btn {
      padding: 10px 8px;
      font-weight: 500;
      color: var(--muted-foreground);
      border-bottom: 2px solid transparent;
      transition: color 0.15s;
    }
    .tab-btn:hover { color: var(--foreground); }
    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
      font-weight: 600;
      background: var(--card);
    }

    .panel-content {
      padding: 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      min-height: 380px;
    }

    .panel-content::-webkit-scrollbar { width: 6px; height: 6px; }
    .panel-content::-webkit-scrollbar-track { background: transparent; }
    .panel-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9999px; }

    .empty-state {
      text-align: center;
      padding: 40px 16px;
      font-size: 12px;
      color: var(--muted-foreground);
    }
    .empty-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--foreground);
      margin-bottom: 6px;
    }

    .review-card {
      padding: 11px 12px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      background: var(--background);
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .review-card.latest {
      border: 2px solid var(--success);
      animation: popIn 0.22s ease-out;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .card-head-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .card-phrase {
      font-size: 14px;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    .card-meaning {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 5px;
      background: var(--secondary);
      color: var(--secondary-foreground);
      font-weight: 500;
    }

    .card-example {
      margin: 0;
      font-size: 12px;
      color: var(--muted-foreground);
      line-height: 1.5;
    }

    .card-note {
      font-size: 12px;
      color: var(--foreground);
      opacity: 0.85;
    }

    .card-warn {
      font-size: 12px;
      color: var(--warning);
      line-height: 1.45;
    }

    .card-err {
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: var(--error);
      font-weight: 600;
    }

    .speak-btn {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--foreground);
      flex-shrink: 0;
    }
    .speak-btn:hover { background: var(--secondary); }

    .link-btn {
      font-size: 12px;
      color: var(--link);
    }
    .link-btn:hover { text-decoration: underline; }

    .panel-footer {
      padding: 10px 12px;
      border-top: 1px solid var(--card-border);
      background: var(--background);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .hidden { display: none !important; }

    @keyframes popIn {
      0% { opacity: 0; transform: translateY(-6px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
  </style>
</head>
<body>
  <div id="colorProbe" style="display:none;"></div>

  <div class="app-container">
    <header class="header-card">
      <div class="header-top">
        <div>
          <h1 class="brand-title">
            <span>TOEIC 介係詞打磚塊</span>
            <span class="badge-pill">48 題分級題庫</span>
          </h1>
          <p class="brand-subtitle">
            選好下方介係詞球，瞄準對應動詞／片語磚塊發射；擊中即時浮動提示、自動朗讀並收入右側複習筆記。
          </p>
        </div>

        <div class="controls-row">
          <div class="segmented" role="group" aria-label="操控模式">
            <button id="modeAimBtn" type="button" class="seg-btn active">瞄準思考</button>
            <button id="modeArcadeBtn" type="button" class="seg-btn">街機連彈</button>
          </div>
          <button id="ttsModeBtn" type="button" class="ctrl-btn" title="切換語音朗讀內容">語音：片語</button>
          <button id="sfxBtn" type="button" class="ctrl-btn" title="開啟或關閉音效">音效：開</button>
          <button id="themeBtn" type="button" class="ctrl-btn" title="切換深色／淺色主題">深色主題</button>
          <button id="resetBtn" type="button" class="ctrl-btn">重開本關</button>
        </div>
      </div>

      <div class="header-bottom">
        <div id="levelTabs" class="level-tabs"></div>

        <div class="stats-bar">
          <div class="stat-item"><span class="stat-label">進度</span><span id="statProgress" class="stat-val">0/12</span></div>
          <div class="stat-item"><span class="stat-label">準確率</span><span id="statAccuracy" class="stat-val">100%</span></div>
          <div class="stat-item"><span class="stat-label">連擊</span><span id="statCombo" class="stat-val accent">0</span></div>
          <div class="stat-item"><span class="stat-label">護盾</span><span id="statLives" class="stat-val">5</span></div>
        </div>
      </div>
    </header>

    <main class="main-grid">
      <section class="arena-card">
        <div class="arena-meta">
          <div class="arena-meta-left">
            <span id="levelBadge" class="level-badge">Lv.1</span>
            <span id="levelDesc" class="muted"></span>
          </div>
          <span id="modeHint" class="muted"></span>
        </div>

        <div class="canvas-wrap">
          <canvas id="gameCanvas"></canvas>

          <div id="overlayModal" class="overlay-modal hidden">
            <div class="overlay-box">
              <div>
                <div id="overlayTag" class="ov-tag">LEVEL COMPLETE</div>
                <h2 id="overlayTitle" class="ov-title">關卡完成！</h2>
                <p id="overlaySubtitle" class="ov-sub"></p>
              </div>
              <div class="ov-stats">
                <div>
                  <div class="muted">消除題數</div>
                  <div id="ovCleared" class="ov-stat-num">12/12</div>
                </div>
                <div>
                  <div class="muted">命中率</div>
                  <div id="ovAcc" class="ov-stat-num">92%</div>
                </div>
                <div>
                  <div class="muted">最高連擊</div>
                  <div id="ovCombo" class="ov-stat-num">8</div>
                </div>
              </div>
              <div class="ov-actions">
                <button id="ovReadAllBtn" type="button" class="ctrl-btn">依序朗讀本關</button>
                <button id="ovReplayBtn" type="button" class="ctrl-btn">再玩一次</button>
                <button id="ovNextBtn" type="button" class="btn-primary">下一關</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rack-section">
          <div class="rack-header">
            <span class="rack-title">選擇介係詞球（點擊、數字鍵 1–9 或滾輪切換）：</span>
            <span class="muted">A / D 或 ← / → 移動擋板・點擊或空白鍵發射</span>
          </div>
          <div id="ballRack" class="ball-rack"></div>
        </div>
      </section>

      <aside class="panel-card">
        <div class="panel-tabs">
          <button id="tabMatched" type="button" class="tab-btn active">已配對 (<span id="countMatched">0</span>)</button>
          <button id="tabMistakes" type="button" class="tab-btn">錯題本 (<span id="countMistakes">0</span>)</button>
          <button id="tabBank" type="button" class="tab-btn">本關詞表</button>
        </div>

        <div id="panelContent" class="panel-content"></div>

        <div id="panelFooter" class="panel-footer">
          <span class="muted">點擊按鈕可重聽發音</span>
          <button id="drillMistakesBtn" type="button" class="btn-primary hidden">用錯題開特訓局</button>
          <button id="toggleHideAnswerBtn" type="button" class="ctrl-btn hidden">遮蔽正解自測</button>
        </div>
      </aside>
    </main>
  </div>

  <script>
    // =========================================================================
    // 1. TOEIC Graded Collocation Bank (4 Levels x 12 Items = 48 Curated Items)
    // =========================================================================
    const LEVELS = [
      {
        id: "lv1",
        short: "Lv.1 基礎固定",
        title: "Lv.1 核心固定搭配（目標 450–600 分）",
        desc: "高頻單一介係詞搭配，建立動詞＋介係詞語塊直覺。",
        balls: ["with", "by", "in", "on", "for", "of", "from", "to"],
        items: [
          { id: "1-1", stem: "comply ___", zh: "遵守規定", prep: "with", full: "comply with", meaning: "遵守、依從（法規/指令）", example: "All staff must comply with the new safety regulations.", note: "常與 regulations / policies / guidelines 連用。" },
          { id: "1-2", stem: "deal ___", zh: "處理客訴", prep: "with", full: "deal with", meaning: "處理、應對", example: "Our support team is trained to deal with urgent complaints.", note: "多益聽力與閱讀高頻片語，意近 handle。" },
          { id: "1-3", stem: "abide ___", zh: "遵守條款", prep: "by", full: "abide by", meaning: "遵守（合約/規則）", example: "Contractors must abide by the terms of the agreement.", note: "語意與 comply with 相近，但介係詞固定為 by。" },
          { id: "1-4", stem: "participate ___", zh: "參加活動", prep: "in", full: "participate in", meaning: "參與、參加", example: "Employees are encouraged to participate in the training workshop.", note: "同義置換常考 take part in。" },
          { id: "1-5", stem: "specialize ___", zh: "專精領域", prep: "in", full: "specialize in", meaning: "專攻、專精於", example: "The firm specializes in commercial real estate law.", note: "公司介紹與履歷背景常見搭配。" },
          { id: "1-6", stem: "rely ___", zh: "仰賴供應商", prep: "on", full: "rely on", meaning: "依賴、信賴", example: "We rely on regional suppliers for timely deliveries.", note: "同義常考 depend on / count on。" },
          { id: "1-7", stem: "depend ___", zh: "視結果而定", prep: "on", full: "depend on", meaning: "取決於、依賴", example: "The launch date will depend on the final test results.", note: "Part 5 常考「視…而定」句型。" },
          { id: "1-8", stem: "apologize ___ a delay", zh: "為延誤道歉", prep: "for", full: "apologize for", meaning: "為（某事）道歉", example: "We apologize for any inconvenience caused by the delay.", note: "apologize to + 人 / apologize for + 事。" },
          { id: "1-9", stem: "consist ___", zh: "由…組成", prep: "of", full: "consist of", meaning: "由…組成（無被動式）", example: "The review committee consists of five senior directors.", note: "consist of 主動即表「由…組成」，不可寫成 is consisted of。" },
          { id: "1-10", stem: "refrain ___", zh: "克制／避免", prep: "from", full: "refrain from", meaning: "克制、避免做…", example: "Please refrain from using mobile phones during the briefing.", note: "公告與信件禮貌禁令極高頻，後接 V-ing。" },
          { id: "1-11", stem: "respond ___", zh: "回覆詢問", prep: "to", full: "respond to", meaning: "回覆、回應", example: "Customer service aims to respond to all inquiries within 24 hours.", note: "注意與 answer（及物，不加 to）區分。" },
          { id: "1-12", stem: "subscribe ___", zh: "訂閱電子報", prep: "to", full: "subscribe to", meaning: "訂閱、申請服務", example: "Over ten thousand clients subscribe to our monthly newsletter.", note: "數位行銷與客服常見搭配。" }
        ]
      },
      {
        id: "lv2",
        short: "Lv.2 多義對照",
        title: "Lv.2 同動詞多義對照組（目標 600–750 分）",
        desc: "同一動詞換不同介係詞即改變語意，請先辨識括號中文再射擊。",
        balls: ["for", "to", "into", "in", "from", "with", "on", "of"],
        items: [
          { id: "2-1", group: "apply", stem: "apply ___ a job", zh: "申請職位", prep: "for", full: "apply for", meaning: "申請（職位/補助/簽證）", example: "Candidates may apply for the position online until Friday.", note: "對比：apply for (申請) vs. apply to (適用於/向…申請)。", trapHints: { to: "apply to 指「適用於」或「向某機構申請」；「申請職位」用 apply for！" } },
          { id: "2-2", group: "apply", stem: "apply ___ all staff", zh: "適用於全體", prep: "to", full: "apply to", meaning: "適用於、應用於", example: "The revised travel policy applies to all full-time employees.", note: "人資政策與規範條文常見用法。", trapHints: { for: "apply for 是「申請」；表「規則適用於誰」要用 apply to！" } },
          { id: "2-3", group: "look", stem: "look ___ a venue", zh: "尋找場地", prep: "for", full: "look for", meaning: "尋找", example: "The event planner is looking for a larger conference venue.", note: "對比 look into (調查) 與 look forward to (期待)。", trapHints: { into: "look into 是「深入調查」；「尋找場地」是 look for！" } },
          { id: "2-4", group: "look", stem: "look ___ the issue", zh: "調查問題", prep: "into", full: "look into", meaning: "調查、探究", example: "Technicians are looking into the cause of the server outage.", note: "多益常作為 investigate 的同義置換。", trapHints: { for: "look for 是「尋找」；「調查原因/問題」用 look into！" } },
          { id: "2-5", group: "look", stem: "look forward ___", zh: "期待會面", prep: "to", full: "look forward to", meaning: "期待（後接 N / V-ing）", example: "We look forward to meeting your team next Tuesday.", note: "此處 to 為介係詞，後方動詞須用 V-ing（如 meeting）。", trapHints: { for: "固定片語為 look forward to，不可用 for！" } },
          { id: "2-6", group: "result", stem: "result ___ savings", zh: "導致節省", prep: "in", full: "result in", meaning: "導致、造成（後接結果）", example: "Automating invoices will result in significant cost savings.", note: "因果方向：原因 + result in + 結果。", trapHints: { from: "result from 是「起因於（原因）」；「導致節省（結果）」用 result in！" } },
          { id: "2-7", group: "result", stem: "result ___ an error", zh: "起因於失誤", prep: "from", full: "result from", meaning: "起因於（後接原因）", example: "The shipping delay resulted from a labeling error at the warehouse.", note: "因果方向：結果 + result from + 原因。", trapHints: { in: "result in 是「導致（結果）」；「起因於失誤（原因）」用 result from！" } },
          { id: "2-8", group: "agree", stem: "agree ___ the speaker", zh: "同意某人看法", prep: "with", full: "agree with", meaning: "同意（某人／看法）", example: "Most board members agree with the CFO's assessment.", note: "對象為人、想法或數據結果時用 with。", trapHints: { to: "agree to 通常接「提案/條件」；同意「某人/意見」用 agree with！" } },
          { id: "2-9", group: "agree", stem: "agree ___ the terms", zh: "同意條款", prep: "to", full: "agree to", meaning: "同意（計畫／條款／條件）", example: "Both parties agreed to the updated payment schedule.", note: "表示接受對方提出的條款、提案或建議。", trapHints: { with: "同意「人或想法」用 agree with；接受「條款/計畫」用 agree to！" } },
          { id: "2-10", group: "agree", stem: "agree ___ a date", zh: "就日期達成共識", prep: "on", full: "agree on", meaning: "就…達成共識", example: "The managers finally agreed on a launch date for the product.", note: "強調雙方協商後「達成一致決定」。", trapHints: { with: "雙方就某事項「達成共識」固定用 agree on！" } },
          { id: "2-11", group: "consist", stem: "consist ___ ten units", zh: "由十部門組成", prep: "of", full: "consist of", meaning: "由…組成", example: "The training program consists of four interactive modules.", note: "對比 consist in (關鍵在於)。", trapHints: { in: "consist in 是「在於」；表「由…組成」用 consist of！" } },
          { id: "2-12", group: "consist", stem: "consist ___ teamwork", zh: "關鍵在於合作", prep: "in", full: "consist in", meaning: "在於、本質上是", example: "Our competitive edge consists in reliable after-sales service.", note: "較進階書面用法，意近 lie in。", trapHints: { of: "consist of 是「由…組成」；表「關鍵在於…」用 consist in！" } }
        ]
      },
      {
        id: "lv3",
        short: "Lv.3 商業夾心",
        title: "Lv.3 進階商業與受詞夾心結構（目標 750–900 分）",
        desc: "Verb + A + Prep + B 結構與正式商業搭配（含 2 個干擾球 on / by）。",
        balls: ["to", "from", "of", "for", "with", "in", "on", "by"],
        items: [
          { id: "3-1", stem: "attribute A ___ B", zh: "把 A 歸因於 B", prep: "to", full: "attribute A to B", meaning: "把 A 歸因於 B", example: "Analysts attributed the revenue growth to strong overseas demand.", note: "多益財報與新聞閱讀高頻結構。" },
          { id: "3-2", stem: "adhere ___", zh: "嚴格遵守準則", prep: "to", full: "adhere to", meaning: "嚴守、遵循", example: "Every laboratory must adhere to strict quality standards.", note: "正式公文用語，比 follow 更正式。" },
          { id: "3-3", stem: "object ___", zh: "反對某計畫", prep: "to", full: "object to", meaning: "反對（後接 N / V-ing）", example: "Several residents objected to extending the parking hours.", note: "to 為介係詞，後接動名詞 extending。" },
          { id: "3-4", stem: "prevent A ___ V-ing", zh: "阻止 A 做某事", prep: "from", full: "prevent A from B", meaning: "阻止、預防", example: "Fire doors help prevent smoke from spreading between floors.", note: "同型結構：stop / keep / hinder A from V-ing。" },
          { id: "3-5", stem: "prohibit A ___ V-ing", zh: "明文禁止 A 做…", prep: "from", full: "prohibit A from B", meaning: "禁止", example: "Company rules prohibit staff from sharing client data externally.", note: "職場規章考點，常考被動語態 be prohibited from。" },
          { id: "3-6", stem: "deprive A ___ B", zh: "剝奪 A 的 B", prep: "of", full: "deprive A of B", meaning: "剝奪、使喪失", example: "Budget cuts deprived the research unit of essential equipment.", note: "極易與 prevent...from 混淆，deprive 固定配 of！", trapHints: { from: "小心！prevent 配 from，但 deprive 固定配 of！" } },
          { id: "3-7", stem: "dispose ___", zh: "處理／丟棄", prep: "of", full: "dispose of", meaning: "處理掉、丟棄", example: "Please dispose of confidential documents using the shredder.", note: "名詞為 disposal。" },
          { id: "3-8", stem: "compensate ___", zh: "彌補／賠償損失", prep: "for", full: "compensate for", meaning: "賠償、彌補", example: "The airline offered vouchers to compensate for the flight delay.", note: "常見被動：be compensated for。" },
          { id: "3-9", stem: "account ___", zh: "佔比例／解釋", prep: "for", full: "account for", meaning: "佔（比例）／解釋原因", example: "Online orders now account for sixty percent of total sales.", note: "圖表題與財報分析雙義高頻片語。" },
          { id: "3-10", stem: "associate A ___ B", zh: "將 A 聯想 B", prep: "with", full: "associate A with B", meaning: "將…與…聯想在一起", example: "Consumers associate this brand with durability and value.", note: "常以被動 be associated with 出現。" },
          { id: "3-11", stem: "equip A ___ B", zh: "為 A 配備 B", prep: "with", full: "equip A with B", meaning: "為…配備、裝備", example: "All conference rooms are equipped with high-speed Wi-Fi.", note: "辦公設施公告極常考 be equipped with。" },
          { id: "3-12", stem: "invest ___", zh: "投資某項目", prep: "in", full: "invest in", meaning: "投資於", example: "The firm plans to invest in automated warehouse systems.", note: "名詞 investment 同樣常搭配 in。" }
        ]
      },
      {
        id: "lv4",
        short: "Lv.4 陷阱專區",
        title: "Lv.4 及物動詞「零介係詞 Ø」陷阱與對照（衝刺 900+ 分）",
        desc: "6 個中文直譯陷阱（須用 Ø 球）混搭 6 個近義真介係詞，內含干擾球 about！",
        balls: ["Ø", "with", "to", "for", "at", "on", "about"],
        items: [
          { id: "4-1", stem: "discuss ___ the plan", zh: "討論計畫", prep: "Ø", full: "discuss + N", meaning: "討論（及物動詞，不加 about）", example: "Let us discuss the quarterly budget before Friday's meeting.", note: "discuss 本身含「談論關於」，加 about 為經典文法錯誤。", trapHints: { about: "陷阱！discuss 為及物動詞，不可加 about，請改用 Ø 球！" } },
          { id: "4-2", stem: "contact ___ the vendor", zh: "聯繫廠商", prep: "Ø", full: "contact + sb", meaning: "聯繫（作動詞不加 with）", example: "Please contact the regional manager if the shipment is late.", note: "名詞才說 have contact with；動詞直接用 contact + 人。", trapHints: { with: "陷阱！contact 作「動詞」直接接受詞，不可加 with，改用 Ø！" } },
          { id: "4-3", stem: "communicate ___ the vendor", zh: "與廠商溝通", prep: "with", full: "communicate with", meaning: "與…溝通（對照組：需加 with）", example: "We communicate with overseas partners via video calls.", note: "對比 contact：communicate 表雙向溝通需配 with。", trapHints: { "Ø": "communicate 表「與某人溝通」時為不及物動詞，須配 with！" } },
          { id: "4-4", stem: "attend ___ the briefing", zh: "出席簡報", prep: "Ø", full: "attend + 活動", meaning: "出席（直接接活動，不加 at/to）", example: "All department heads are required to attend the morning briefing.", note: "表「出席會議/課程」時為及物動詞。", trapHints: { to: "表「出席活動」直接用 attend + 活動（Ø 球）；attend to 才是「照料/處理」！" } },
          { id: "4-5", stem: "attend ___ urgent orders", zh: "處理急件", prep: "to", full: "attend to", meaning: "專心處理、照料（對照組）", example: "Ms. Lin will attend to urgent customer orders this afternoon.", note: "與 attend + 會議 區分：attend to 意指處理事務或服務賓客。", trapHints: { "Ø": "這裡是「處理急件」不是「出席」，固定片語為 attend to！" } },
          { id: "4-6", stem: "await ___ approval", zh: "靜候核准", prep: "Ø", full: "await + N", meaning: "等候（await = wait for，不加 for）", example: "The construction team is awaiting final city approval.", note: "正式書信常用 await + 名詞，不可重複加 for。", trapHints: { for: "陷阱！await 已包含 for 的語意（= wait for），不可加 for，用 Ø！" } },
          { id: "4-7", stem: "wait ___ approval", zh: "等待核准", prep: "for", full: "wait for", meaning: "等待（對照組：須配 for）", example: "Applicants must wait for written confirmation by email.", note: "對比 await：wait 後接等待對象須配 for。", trapHints: { "Ø": "wait 為不及物動詞，等待某事物須配 for！" } },
          { id: "4-8", stem: "reach ___ the venue", zh: "抵達會場", prep: "Ø", full: "reach + 地點", meaning: "抵達／達成（及物動詞，不加 at/to）", example: "Our delivery van should reach the warehouse before noon.", note: "reach a destination / reach an agreement 皆直接接受詞。", trapHints: { at: "陷阱！arrive 才配 at，reach 為及物動詞不加 at，改用 Ø！", to: "陷阱！reach 直接接受詞，不加 to，改用 Ø！" } },
          { id: "4-9", stem: "arrive ___ the venue", zh: "抵達會場", prep: "at", full: "arrive at", meaning: "抵達小地點（對照組：須配 at）", example: "Visitors should arrive at the reception desk fifteen minutes early.", note: "大城市/國家用 in，機場/車站/會場等點狀場所用 at。", trapHints: { "Ø": "arrive 為不及物動詞，抵達會場須配 at！", to: "arrive 絕不搭配 to！小地點請用 at。" } },
          { id: "4-10", stem: "emphasize ___ quality", zh: "強調品質", prep: "Ø", full: "emphasize + N", meaning: "強調（動詞不加 on）", example: "The CEO emphasized product quality during the annual speech.", note: "名詞 put emphasis on 才加 on，動詞 emphasize 直接接受詞！", trapHints: { on: "陷阱！名詞 emphasis 才配 on，動詞 emphasize 直接接受詞（Ø）！" } },
          { id: "4-11", stem: "insist ___ quality", zh: "堅持品質", prep: "on", full: "insist on", meaning: "堅持（對照組：須配 on）", example: "Our quality control team insists on inspecting every batch.", note: "後接名詞或動名詞，固定搭配 on。", trapHints: { "Ø": "insist 後接堅持的項目時為不及物，須搭配 on！" } },
          { id: "4-12", stem: "search ___ a supplier", zh: "尋找供應商", prep: "for", full: "search for", meaning: "尋找（不加 for 會變「搜查某人」）", example: "Procurement is searching for a more reliable packaging supplier.", note: "search + 場所/人 = 搜查；search for + 目標 = 尋找。", trapHints: { "Ø": "search + 某人/處是「搜查/搜身」；表「尋找」必須搭配 for！" } }
        ]
      }
    ];

    // =========================================================================
    // 2. Game State & Theme Color Resolution
    // =========================================================================
    const CANVAS_W = 760;
    const CANVAS_H = 540;
    const PADDLE_W = 112;
    const PADDLE_H = 14;
    const PADDLE_Y = CANVAS_H - 36;
    const BALL_R = 13;
    const BALL_SPEED = 540;

    const state = {
      levelIdx: 0,
      isMistakeDrill: false,
      mode: "aim",
      ttsMode: "phrase",
      sfxEnabled: true,
      theme: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      activeTab: "matched",
      hideBankAnswers: false,

      currentLevel: null,
      bricks: [],
      availableBalls: [],
      selectedBall: "with",

      paddleX: CANVAS_W / 2,
      aimAngle: -Math.PI / 2,
      ball: {
        x: CANVAS_W / 2,
        y: PADDLE_Y - BALL_R - 2,
        vx: 0,
        vy: 0,
        docked: true,
        cooling: false
      },
      arcadeCooldownUntil: 0,

      keys: { left: false, right: false },
      mouse: { x: CANVAS_W / 2, y: CANVAS_H / 2, inside: false },

      floaters: [],
      particles: [],

      matchedLog: [],
      mistakeLog: [],
      mistakeItemIds: new Set(),

      attempts: 0,
      combo: 0,
      maxCombo: 0,
      lives: 5,
      gameOver: false,
      levelCleared: false
    };

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const probe = document.getElementById("colorProbe");
    let themeColors = {};

    function resolveVar(varName, fallback) {
      probe.style.color = "";
      probe.style.color = \`var(\${varName})\`;
      const c = getComputedStyle(probe).color;
      return c && c !== "" ? c : fallback;
    }

    function applyTheme(theme) {
      state.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      document.getElementById("themeBtn").textContent = theme === "dark" ? "淺色主題" : "深色主題";
      refreshThemeColors();
      renderBallRack();
    }

    function refreshThemeColors() {
      const isDark = state.theme === "dark";
      themeColors = {
        bg: resolveVar("--background", isDark ? "#0d1117" : "#f4f6f9"),
        card: resolveVar("--card", isDark ? "#161b22" : "#ffffff"),
        border: resolveVar("--border", isDark ? "#30363d" : "#d0d7de"),
        fg: resolveVar("--foreground", isDark ? "#f0f6fc" : "#111827"),
        muted: resolveVar("--muted-foreground", isDark ? "#8b949e" : "#6b7280"),
        primary: resolveVar("--primary", isDark ? "#3b82f6" : "#1d4ed8"),
        success: resolveVar("--success", isDark ? "#22c55e" : "#15803d"),
        warning: resolveVar("--warning", isDark ? "#f59e0b" : "#b45309"),
        error: resolveVar("--error", isDark ? "#f87171" : "#dc2626"),
        charts: [
          resolveVar("--chart-1", "#2563eb"),
          resolveVar("--chart-2", "#0d9488"),
          resolveVar("--chart-3", "#d97706"),
          resolveVar("--chart-4", "#0284c7"),
          resolveVar("--chart-5", "#16a34a"),
          resolveVar("--chart-6", "#e11d48")
        ]
      };
    }

    function resizeCanvasHiDPI() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CANVAS_W * dpr;
      canvas.height = CANVAS_H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // =========================================================================
    // 3. Audio (Web Audio SFX + Web Speech API TTS)
    // =========================================================================
    let audioCtx = null;
    function getAudioCtx() {
      if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    function playSFX(type) {
      if (!state.sfxEnabled) return;
      try {
        const ac = getAudioCtx();
        if (!ac) return;
        const now = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);

        if (type === "hit") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.23);
        } else if (type === "wrong") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.linearRampToValueAtTime(135, now + 0.16);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.19);
        } else if (type === "bounce") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.07);
        }
      } catch (_) {}
    }

    function speakText(text, force = false) {
      if (!force && state.ttsMode === "off") return;
      if (!("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 0.96;
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find((v) => v.lang === "en-US") || voices.find((v) => v.lang.startsWith("en"));
        if (enVoice) utter.voice = enVoice;
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }

    function speakItem(item, forceSentence = false) {
      if (forceSentence) {
        speakText(item.example, true);
        return;
      }
      if (state.ttsMode === "off") return;
      if (state.ttsMode === "sentence") {
        speakText(item.example);
      } else {
        const filled = item.prep === "Ø"
          ? item.stem.replace(/\\s*___\\s*/g, " ").trim()
          : item.stem.replace("___", item.prep);
        const phrase = filled
          .replace(/\\bA\\b/g, "something")
          .replace(/\\bB\\b/g, "something")
          .replace(/V-ing/g, "doing something");
        speakText(phrase);
      }
    }

    // =========================================================================
    // 4. Level Loading & Brick Layout
    // =========================================================================
    const BALL_COLOR_MAP = {
      with: 0, to: 1, for: 2, in: 3, on: 4, of: 5, from: 0, by: 1, into: 2, at: 3, "Ø": 4, about: 5
    };

    function getBallColor(prep) {
      if (!themeColors.charts) return "#2563eb";
      if (prep === "Ø") return themeColors.warning;
      if (prep === "about") return themeColors.error;
      const idx = BALL_COLOR_MAP[prep] ?? 0;
      return themeColors.charts[idx % themeColors.charts.length];
    }

    function loadLevel(idx, mistakeItems = null) {
      state.isMistakeDrill = Boolean(mistakeItems);
      if (!mistakeItems) state.levelIdx = idx;

      const sourceLevel = mistakeItems
        ? {
            id: "drill",
            short: "錯題特訓",
            title: "錯題特訓局（針對先前錯配片語）",
            desc: "集中複習答錯過的介係詞搭配，消滅記憶盲區！",
            balls: Array.from(new Set(mistakeItems.map((i) => i.prep).concat(["to", "for", "with", "Ø"]))),
            items: mistakeItems.slice(0, 12)
          }
        : LEVELS[idx];

      state.currentLevel = sourceLevel;
      state.availableBalls = sourceLevel.balls;
      state.selectedBall = sourceLevel.balls[0];

      const cols = 4;
      const padX = 24;
      const padTop = 26;
      const gapX = 12;
      const gapY = 12;
      const brickW = (CANVAS_W - padX * 2 - gapX * (cols - 1)) / cols;
      const brickH = 66;

      const itemsCopy = [...sourceLevel.items];
      if (sourceLevel.id !== "lv2") {
        for (let i = itemsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [itemsCopy[i], itemsCopy[j]] = [itemsCopy[j], itemsCopy[i]];
        }
      }

      state.bricks = itemsCopy.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          item,
          x: padX + col * (brickW + gapX),
          y: padTop + row * (brickH + gapY),
          w: brickW,
          h: brickH,
          alive: true,
          shakeUntil: 0,
          flashUntil: 0
        };
      });

      state.paddleX = CANVAS_W / 2;
      state.aimAngle = -Math.PI / 2;
      dockBall();
      state.floaters = [];
      state.particles = [];
      state.matchedLog = [];
      state.attempts = 0;
      state.combo = 0;
      state.maxCombo = 0;
      state.lives = 5;
      state.gameOver = false;
      state.levelCleared = false;

      document.getElementById("overlayModal").classList.add("hidden");
      renderLevelTabs();
      renderBallRack();
      updateHeaderUI();
      renderPanel();
    }

    function dockBall() {
      state.ball.docked = true;
      state.ball.cooling = false;
      state.ball.vx = 0;
      state.ball.vy = 0;
      state.ball.x = state.paddleX;
      state.ball.y = PADDLE_Y - BALL_R - 2;
    }

    function launchBall() {
      if (!state.ball.docked || state.gameOver || state.levelCleared) return;
      getAudioCtx();
      const angle = state.aimAngle;
      state.ball.docked = false;
      state.ball.cooling = false;
      state.ball.vx = Math.cos(angle) * BALL_SPEED;
      state.ball.vy = Math.sin(angle) * BALL_SPEED;
      playSFX("bounce");
    }

    // =========================================================================
    // 5. Raycast Preview for Aim Laser (with 1 wall bounce)
    // =========================================================================
    function raycastSegment(ox, oy, dx, dy, bricks) {
      let bestT = Infinity;
      let hitType = null;
      let hitBrick = null;

      if (dx < -1e-6) {
        const t = (BALL_R - ox) / dx;
        if (t > 1 && t < bestT) { bestT = t; hitType = "wall"; }
      } else if (dx > 1e-6) {
        const t = (CANVAS_W - BALL_R - ox) / dx;
        if (t > 1 && t < bestT) { bestT = t; hitType = "wall"; }
      }
      if (dy < -1e-6) {
        const t = (BALL_R - oy) / dy;
        if (t > 1 && t < bestT) { bestT = t; hitType = "top"; }
      }

      for (const b of bricks) {
        if (!b.alive) continue;
        const minX = b.x - BALL_R;
        const maxX = b.x + b.w + BALL_R;
        const minY = b.y - BALL_R;
        const maxY = b.y + b.h + BALL_R;

        if (Math.abs(dx) < 1e-8 && (ox < minX || ox > maxX)) continue;

        const invX = Math.abs(dx) > 1e-8 ? 1 / dx : 1e9;
        const invY = Math.abs(dy) > 1e-8 ? 1 / dy : 1e9;
        const t1 = (minX - ox) * invX;
        const t2 = (maxX - ox) * invX;
        const t3 = (minY - oy) * invY;
        const t4 = (maxY - oy) * invY;

        const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
        const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

        if (tmax >= Math.max(0, tmin) && tmin > 1 && tmin < bestT) {
          bestT = tmin;
          hitType = "brick";
          hitBrick = b;
        }
      }

      return { x: ox + dx * bestT, y: oy + dy * bestT, hitType, hitBrick };
    }

    function computeAimPreview() {
      const dx = Math.cos(state.aimAngle);
      const dy = Math.sin(state.aimAngle);
      const seg1 = raycastSegment(state.ball.x, state.ball.y, dx, dy, state.bricks);
      const points = [{ x: state.ball.x, y: state.ball.y }, { x: seg1.x, y: seg1.y }];
      let targetBrick = seg1.hitBrick;

      if (seg1.hitType === "wall") {
        const seg2 = raycastSegment(seg1.x, seg1.y, -dx, dy, state.bricks);
        points.push({ x: seg2.x, y: seg2.y });
        targetBrick = seg2.hitBrick;
      }
      return { points, targetBrick };
    }

    // =========================================================================
    // 6. Physics & Collision Resolution
    // =========================================================================
    function addFloater(x, y, text, subtext, isSuccess) {
      state.floaters.push({
        x: Math.max(105, Math.min(CANVAS_W - 105, x)),
        y,
        text,
        subtext,
        isSuccess,
        born: performance.now(),
        duration: isSuccess ? 1450 : 1850
      });
    }

    function spawnParticles(cx, cy, color) {
      for (let i = 0; i < 14; i++) {
        const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const spd = 80 + Math.random() * 170;
        state.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          r: 2.5 + Math.random() * 3,
          color,
          born: performance.now(),
          duration: 460
        });
      }
    }

    function handleBrickHit(brick) {
      const now = performance.now();
      const item = brick.item;
      const chosen = state.selectedBall;

      if (state.mode === "aim" && state.ball.cooling) return;
      if (state.mode === "arcade" && now < state.arcadeCooldownUntil) return;

      if (state.mode === "aim") state.ball.cooling = true;
      else state.arcadeCooldownUntil = now + 260;

      state.attempts += 1;
      const isCorrect = chosen === item.prep;

      if (isCorrect) {
        brick.alive = false;
        state.combo += 1;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;

        const cx = brick.x + brick.w / 2;
        const cy = brick.y + brick.h / 2;
        spawnParticles(cx, cy, themeColors.success);
        addFloater(cx, cy, \`✓ \${item.full}\`, item.zh, true);
        playSFX("hit");
        speakItem(item);

        state.matchedLog.unshift({ item });
        renderPanel();

        if (state.bricks.every((b) => !b.alive)) {
          state.levelCleared = true;
          state.ball.vx = 0;
          state.ball.vy = 0;
          showOverlay(true);
        }
      } else {
        state.combo = 0;
        brick.shakeUntil = now + 320;
        brick.flashUntil = now + 380;

        const trapMsg = (item.trapHints && item.trapHints[chosen])
          ? item.trapHints[chosen]
          : \`\${item.stem.replace("___", "")} 不搭配 \${chosen}\`;

        const cx = brick.x + brick.w / 2;
        const cy = brick.y + brick.h / 2;
        addFloater(cx, cy, \`✗ 誤選 \${chosen}\`, trapMsg, false);
        playSFX("wrong");

        if (!state.mistakeItemIds.has(item.id)) {
          state.mistakeItemIds.add(item.id);
          state.mistakeLog.unshift({ item, wrongPrep: chosen, reason: trapMsg });
        } else {
          const existing = state.mistakeLog.find((m) => m.item.id === item.id);
          if (existing) {
            existing.wrongPrep = chosen;
            existing.reason = trapMsg;
          }
        }
        renderPanel();
      }

      updateHeaderUI();
    }

    function updatePhysics(dt) {
      const paddleSpeed = 520;
      if (state.keys.left) state.paddleX -= paddleSpeed * dt;
      if (state.keys.right) state.paddleX += paddleSpeed * dt;
      state.paddleX = Math.max(PADDLE_W / 2 + 8, Math.min(CANVAS_W - PADDLE_W / 2 - 8, state.paddleX));

      if (state.ball.docked) {
        state.ball.x = state.paddleX;
        state.ball.y = PADDLE_Y - BALL_R - 2;
        if (state.mouse.inside && state.mouse.y < PADDLE_Y - 12) {
          const dx = state.mouse.x - state.ball.x;
          const dy = state.mouse.y - state.ball.y;
          let ang = Math.atan2(dy, dx);
          ang = Math.max(-Math.PI + 0.24, Math.min(-0.24, ang));
          state.aimAngle = ang;
        }
        return;
      }

      if (state.gameOver || state.levelCleared) return;

      const steps = 3;
      const subDt = dt / steps;

      for (let s = 0; s < steps; s++) {
        state.ball.x += state.ball.vx * subDt;
        state.ball.y += state.ball.vy * subDt;

        if (state.ball.x - BALL_R <= 0) {
          state.ball.x = BALL_R;
          state.ball.vx = Math.abs(state.ball.vx);
          playSFX("bounce");
        } else if (state.ball.x + BALL_R >= CANVAS_W) {
          state.ball.x = CANVAS_W - BALL_R;
          state.ball.vx = -Math.abs(state.ball.vx);
          playSFX("bounce");
        }

        if (state.ball.y - BALL_R <= 0) {
          state.ball.y = BALL_R;
          state.ball.vy = Math.abs(state.ball.vy);
          playSFX("bounce");
        }

        for (const b of state.bricks) {
          if (!b.alive) continue;
          if (state.mode === "aim" && state.ball.cooling) continue;

          const closestX = Math.max(b.x, Math.min(state.ball.x, b.x + b.w));
          const closestY = Math.max(b.y, Math.min(state.ball.y, b.y + b.h));
          const dx = state.ball.x - closestX;
          const dy = state.ball.y - closestY;

          if (dx * dx + dy * dy <= BALL_R * BALL_R) {
            const overlapLeft = state.ball.x + BALL_R - b.x;
            const overlapRight = b.x + b.w - (state.ball.x - BALL_R);
            const overlapTop = state.ball.y + BALL_R - b.y;
            const overlapBottom = b.y + b.h - (state.ball.y - BALL_R);
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              state.ball.vx = -state.ball.vx;
            } else {
              state.ball.vy = -state.ball.vy;
            }

            if (state.mode === "aim" && state.ball.vy < 180) {
              const signX = state.ball.vx >= 0 ? 1 : -1;
              const ang = Math.PI / 2 - signX * 0.35;
              state.ball.vx = Math.cos(ang) * BALL_SPEED;
              state.ball.vy = Math.abs(Math.sin(ang) * BALL_SPEED);
            }

            handleBrickHit(b);
            break;
          }
        }

        if (
          state.ball.vy > 0 &&
          state.ball.y + BALL_R >= PADDLE_Y &&
          state.ball.y - BALL_R <= PADDLE_Y + PADDLE_H &&
          state.ball.x >= state.paddleX - PADDLE_W / 2 - BALL_R * 0.5 &&
          state.ball.x <= state.paddleX + PADDLE_W / 2 + BALL_R * 0.5
        ) {
          playSFX("bounce");
          if (state.mode === "aim") {
            dockBall();
            return;
          } else {
            const rel = (state.ball.x - state.paddleX) / (PADDLE_W / 2);
            const clamped = Math.max(-0.92, Math.min(0.92, rel));
            const bounceAngle = -Math.PI / 2 + clamped * (Math.PI / 3);
            state.ball.vx = Math.cos(bounceAngle) * BALL_SPEED;
            state.ball.vy = Math.sin(bounceAngle) * BALL_SPEED;
            state.ball.y = PADDLE_Y - BALL_R - 1;
          }
        }

        if (state.ball.y - BALL_R > CANVAS_H) {
          state.lives -= 1;
          state.combo = 0;
          playSFX("wrong");
          updateHeaderUI();

          if (state.lives <= 0) {
            state.gameOver = true;
            showOverlay(false);
            return;
          } else {
            dockBall();
            return;
          }
        }
      }
    }

    // =========================================================================
    // 7. Canvas Rendering
    // =========================================================================
    function drawRoundedRect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
      }
    }

    function draw() {
      const now = performance.now();
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = themeColors.bg;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      let aimPreview = null;
      if (state.ball.docked && !state.gameOver && !state.levelCleared) {
        aimPreview = computeAimPreview();
      }

      for (const b of state.bricks) {
        if (!b.alive) continue;

        const ox = now < b.shakeUntil ? Math.sin(now * 0.08) * 5 : 0;
        const bx = b.x + ox;
        const by = b.y;
        const isAimTarget = aimPreview && aimPreview.targetBrick === b;
        const isFlashing = now < b.flashUntil;

        ctx.save();
        drawRoundedRect(bx, by, b.w, b.h, 10);
        ctx.fillStyle = themeColors.card;
        ctx.fill();

        ctx.lineWidth = isAimTarget || isFlashing ? 2 : 1;
        ctx.strokeStyle = isFlashing
          ? themeColors.error
          : isAimTarget
          ? themeColors.primary
          : themeColors.border;
        ctx.stroke();

        if (b.item.group) {
          const groupColorMap = { apply: "for", look: "in", result: "on", agree: "to", consist: "of" };
          ctx.fillStyle = getBallColor(groupColorMap[b.item.group] || "with");
          drawRoundedRect(bx + 6, by + 10, 4, b.h - 20, 2);
          ctx.fill();
        }

        ctx.fillStyle = themeColors.fg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const stemLen = b.item.stem.length;
        ctx.font = \`700 \${stemLen > 20 ? 12.5 : 14}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\`;
        ctx.fillText(b.item.stem, bx + b.w / 2 + (b.item.group ? 2 : 0), by + b.h / 2 - 10, b.w - 18);

        ctx.fillStyle = themeColors.muted;
        ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif';
        ctx.fillText(\`(\${b.item.zh})\`, bx + b.w / 2 + (b.item.group ? 2 : 0), by + b.h / 2 + 13, b.w - 16);
        ctx.restore();
      }

      if (aimPreview) {
        ctx.save();
        ctx.strokeStyle = getBallColor(state.selectedBall);
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        aimPreview.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        const last = aimPreview.points[aimPreview.points.length - 1];
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(last.x, last.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = getBallColor(state.selectedBall);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      drawRoundedRect(state.paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 7);
      ctx.fillStyle = themeColors.fg;
      ctx.fill();
      drawRoundedRect(state.paddleX - 16, PADDLE_Y + 4, 32, 4, 2);
      ctx.fillStyle = themeColors.primary;
      ctx.fill();
      ctx.restore();

      if (!state.gameOver && !state.levelCleared) {
        const ballColor = getBallColor(state.selectedBall);
        const radius = state.selectedBall.length >= 4 ? BALL_R + 5 : BALL_R + 2;
        ctx.save();
        if (state.ball.cooling) ctx.globalAlpha = 0.62;

        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = ballColor;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = themeColors.card;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = \`700 \${state.selectedBall.length >= 4 ? 10 : 12}px ui-monospace, Menlo, monospace\`;
        ctx.fillText(state.selectedBall, state.ball.x, state.ball.y + 0.5);
        ctx.restore();
      }

      state.particles = state.particles.filter((p) => now - p.born < p.duration);
      for (const p of state.particles) {
        const t = (now - p.born) / p.duration;
        ctx.save();
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x + p.vx * (t * 0.45), p.y + p.vy * (t * 0.45), p.r * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      state.floaters = state.floaters.filter((f) => now - f.born < f.duration);
      for (const f of state.floaters) {
        const t = (now - f.born) / f.duration;
        const alpha = t < 0.72 ? 1 : 1 - (t - 0.72) / 0.28;
        const rise = t * 28;
        const fy = Math.max(26, f.y - rise);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        const w1 = ctx.measureText(f.text).width;
        ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif';
        const w2 = ctx.measureText(f.subtext).width;
        const boxW = Math.min(CANVAS_W - 32, Math.max(w1, w2) + 28);
        const boxH = 44;
        const fx = Math.max(16, Math.min(CANVAS_W - boxW - 16, f.x - boxW / 2));

        drawRoundedRect(fx, fy - boxH / 2, boxW, boxH, 8);
        ctx.fillStyle = themeColors.card;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = f.isSuccess ? themeColors.success : themeColors.error;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = f.isSuccess ? themeColors.success : themeColors.error;
        ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(f.text, fx + boxW / 2, fy - 8, boxW - 16);

        ctx.fillStyle = themeColors.fg;
        ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif';
        ctx.fillText(f.subtext, fx + boxW / 2, fy + 10, boxW - 16);
        ctx.restore();
      }
    }

    // =========================================================================
    // 8. UI Rendering & Controls
    // =========================================================================
    function renderLevelTabs() {
      const container = document.getElementById("levelTabs");
      container.innerHTML = "";

      LEVELS.forEach((lv, idx) => {
        const active = !state.isMistakeDrill && state.levelIdx === idx;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = lv.short;
        btn.className = active ? "lvl-btn active" : "lvl-btn";
        btn.addEventListener("click", () => loadLevel(idx));
        container.appendChild(btn);
      });

      if (state.mistakeLog.length > 0) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = \`錯題特訓 (\${state.mistakeLog.length})\`;
        btn.className = state.isMistakeDrill ? "lvl-btn drill-active" : "lvl-btn drill-idle";
        btn.addEventListener("click", () => loadLevel(0, state.mistakeLog.map((m) => m.item)));
        container.appendChild(btn);
      }
    }

    function renderBallRack() {
      const rack = document.getElementById("ballRack");
      rack.innerHTML = "";
      state.availableBalls.forEach((prep, idx) => {
        const selected = prep === state.selectedBall;
        const btn = document.createElement("button");
        btn.type = "button";
        const color = getBallColor(prep);
        btn.className = selected ? "ball-btn selected" : "ball-btn";
        if (selected) btn.style.borderColor = color;

        const dot = document.createElement("span");
        dot.className = "ball-dot";
        dot.style.backgroundColor = color;

        const keyBadge = document.createElement("span");
        keyBadge.className = "muted mono";
        keyBadge.textContent = \`\${idx + 1}.\`;

        const label = document.createElement("span");
        label.className = "mono";
        label.textContent = prep === "Ø" ? "Ø (無介係詞)" : prep;

        btn.append(dot, keyBadge, label);
        btn.addEventListener("click", () => selectBall(prep));
        rack.appendChild(btn);
      });
    }

    function selectBall(prep) {
      if (!state.availableBalls.includes(prep)) return;
      state.selectedBall = prep;
      renderBallRack();
    }

    function updateHeaderUI() {
      const total = state.bricks.length;
      const cleared = state.bricks.filter((b) => !b.alive).length;
      const acc = state.attempts === 0 ? 100 : Math.round((cleared / state.attempts) * 100);

      document.getElementById("statProgress").textContent = \`\${cleared}/\${total}\`;
      document.getElementById("statAccuracy").textContent = \`\${acc}%\`;
      document.getElementById("statCombo").textContent = \`\${state.combo}\`;
      document.getElementById("statLives").textContent = \`\${state.lives}\`;

      document.getElementById("levelBadge").textContent = state.currentLevel.short;
      document.getElementById("levelDesc").textContent = state.currentLevel.desc;

      const aimBtn = document.getElementById("modeAimBtn");
      const arcBtn = document.getElementById("modeArcadeBtn");
      if (state.mode === "aim") {
        aimBtn.className = "seg-btn active";
        arcBtn.className = "seg-btn";
        document.getElementById("modeHint").textContent = "瞄準模式：回板自動吸附，先選好介係詞再發射";
      } else {
        arcBtn.className = "seg-btn active";
        aimBtn.className = "seg-btn";
        document.getElementById("modeHint").textContent = "街機模式：球持續反彈，飛行中用 1–9 或滾輪換球";
      }

      const ttsLabels = { phrase: "語音：片語", sentence: "語音：例句", off: "語音：關" };
      document.getElementById("ttsModeBtn").textContent = ttsLabels[state.ttsMode];
      document.getElementById("sfxBtn").textContent = state.sfxEnabled ? "音效：開" : "音效：關";
    }

    function renderPanel() {
      document.getElementById("countMatched").textContent = state.matchedLog.length;
      document.getElementById("countMistakes").textContent = state.mistakeLog.length;

      const tabIds = { matched: "tabMatched", mistakes: "tabMistakes", bank: "tabBank" };
      Object.entries(tabIds).forEach(([key, id]) => {
        document.getElementById(id).className = key === state.activeTab ? "tab-btn active" : "tab-btn";
      });

      const content = document.getElementById("panelContent");
      const drillBtn = document.getElementById("drillMistakesBtn");
      const hideBtn = document.getElementById("toggleHideAnswerBtn");
      drillBtn.classList.add("hidden");
      hideBtn.classList.add("hidden");
      content.innerHTML = "";

      if (state.activeTab === "matched") {
        if (state.matchedLog.length === 0) {
          content.innerHTML = \`
            <div class="empty-state">
              <div class="empty-title">尚未消除任何磚塊</div>
              <div>在左側選擇正確介係詞球並擊中對應磚塊，完整配對、中文釋義與多益例句會即時收入這裡。</div>
            </div>\`;
          return;
        }
        state.matchedLog.forEach((entry, idx) => {
          const { item } = entry;
          const card = document.createElement("div");
          card.className = idx === 0 ? "review-card latest" : "review-card";
          card.innerHTML = \`
            <div class="card-head">
              <div class="card-head-left">
                <span class="card-phrase">\${item.full}</span>
                <span class="card-meaning">\${item.meaning}</span>
              </div>
              <button type="button" data-speak-sent class="speak-btn">朗讀例句</button>
            </div>
            <p class="card-example">\${item.example}</p>
            <div class="card-note">\${item.note}</div>
          \`;
          card.querySelector("[data-speak-sent]").addEventListener("click", () => speakItem(item, true));
          content.appendChild(card);
        });
      } else if (state.activeTab === "mistakes") {
        if (state.mistakeLog.length > 0) drillBtn.classList.remove("hidden");
        if (state.mistakeLog.length === 0) {
          content.innerHTML = \`
            <div class="empty-state">
              <div class="empty-title">目前沒有錯題紀錄</div>
              <div>答錯的片語與陷阱解析會自動收集在此，方便隨時開啟錯題特訓。</div>
            </div>\`;
          return;
        }
        state.mistakeLog.forEach(({ item, wrongPrep, reason }) => {
          const card = document.createElement("div");
          card.className = "review-card";
          card.innerHTML = \`
            <div class="card-head">
              <span class="card-phrase">\${item.full}</span>
              <span class="card-err">曾誤選 \${wrongPrep}</span>
            </div>
            <div style="font-size:12px; font-weight:600;">\${item.meaning}</div>
            <div class="card-warn">\${reason}</div>
            <div style="display:flex; justify-content:flex-end;">
              <button type="button" data-speak-sent class="speak-btn">聽例句</button>
            </div>
          \`;
          card.querySelector("[data-speak-sent]").addEventListener("click", () => speakItem(item, true));
          content.appendChild(card);
        });
      } else {
        hideBtn.classList.remove("hidden");
        hideBtn.textContent = state.hideBankAnswers ? "顯示正解介係詞" : "遮蔽正解自測";
        state.currentLevel.items.forEach((item) => {
          const card = document.createElement("div");
          card.className = "review-card";
          const titleText = state.hideBankAnswers ? item.stem : item.full;
          card.innerHTML = \`
            <div class="card-head">
              <span class="card-phrase" style="font-size:12px;">\${titleText}</span>
              <button type="button" data-speak-sent class="link-btn">朗讀</button>
            </div>
            <div class="muted" style="font-size:12px;">\${item.meaning}</div>
          \`;
          card.querySelector("[data-speak-sent]").addEventListener("click", () => speakItem(item, true));
          content.appendChild(card);
        });
      }
    }

    function showOverlay(isWin) {
      const modal = document.getElementById("overlayModal");
      const total = state.bricks.length;
      const cleared = state.bricks.filter((b) => !b.alive).length;
      const acc = state.attempts === 0 ? 100 : Math.round((cleared / state.attempts) * 100);

      document.getElementById("overlayTag").textContent = isWin ? "LEVEL COMPLETE" : "SHIELD DEPLETED";
      document.getElementById("overlayTitle").textContent = isWin
        ? \`\${state.currentLevel.short} 通關成功！\`
        : "護盾歸零，再接再厲！";
      document.getElementById("overlaySubtitle").textContent = isWin
        ? "建議先掃一眼右側複習清單或點擊「依序朗讀本關」強化聽覺記憶，再挑戰下一關。"
        : "別擔心！剛剛錯過的項目已收錄在右側「錯題本」，可重試本關或針對錯題複習。";

      document.getElementById("ovCleared").textContent = \`\${cleared}/\${total}\`;
      document.getElementById("ovAcc").textContent = \`\${acc}%\`;
      document.getElementById("ovCombo").textContent = \`\${state.maxCombo}\`;

      const nextBtn = document.getElementById("ovNextBtn");
      if (isWin && !state.isMistakeDrill && state.levelIdx < LEVELS.length - 1) {
        nextBtn.classList.remove("hidden");
      } else {
        nextBtn.classList.add("hidden");
      }
      modal.classList.remove("hidden");
    }

    // =========================================================================
    // 9. Event Listeners & Main Loop
    // =========================================================================
    function getCanvasCoords(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * CANVAS_W,
        y: ((clientY - rect.top) / rect.height) * CANVAS_H
      };
    }

    canvas.addEventListener("pointermove", (e) => {
      const pt = getCanvasCoords(e.clientX, e.clientY);
      state.mouse.x = pt.x;
      state.mouse.y = pt.y;
      state.mouse.inside = true;

      if (state.mode === "arcade" || !state.ball.docked || pt.y >= PADDLE_Y - 10) {
        state.paddleX = Math.max(PADDLE_W / 2 + 8, Math.min(CANVAS_W - PADDLE_W / 2 - 8, pt.x));
      }
    });

    canvas.addEventListener("pointerleave", () => { state.mouse.inside = false; });

    canvas.addEventListener("pointerdown", (e) => {
      const pt = getCanvasCoords(e.clientX, e.clientY);
      state.mouse.x = pt.x;
      state.mouse.y = pt.y;
      state.mouse.inside = true;
      if (state.ball.docked && pt.y < PADDLE_Y - 12) {
        const dx = pt.x - state.ball.x;
        const dy = pt.y - state.ball.y;
        state.aimAngle = Math.max(-Math.PI + 0.24, Math.min(-0.24, Math.atan2(dy, dx)));
        launchBall();
      } else if (state.ball.docked) {
        launchBall();
      }
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const idx = state.availableBalls.indexOf(state.selectedBall);
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = (idx + dir + state.availableBalls.length) % state.availableBalls.length;
      selectBall(state.availableBalls[next]);
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") state.keys.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") state.keys.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        launchBall();
      }
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < state.availableBalls.length) selectBall(state.availableBalls[idx]);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") state.keys.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") state.keys.right = false;
    });

    document.getElementById("modeAimBtn").addEventListener("click", () => {
      state.mode = "aim";
      updateHeaderUI();
    });
    document.getElementById("modeArcadeBtn").addEventListener("click", () => {
      state.mode = "arcade";
      if (state.ball.docked) launchBall();
      updateHeaderUI();
    });
    document.getElementById("ttsModeBtn").addEventListener("click", () => {
      const order = ["phrase", "sentence", "off"];
      state.ttsMode = order[(order.indexOf(state.ttsMode) + 1) % order.length];
      updateHeaderUI();
    });
    document.getElementById("sfxBtn").addEventListener("click", () => {
      state.sfxEnabled = !state.sfxEnabled;
      updateHeaderUI();
    });
    document.getElementById("themeBtn").addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (state.isMistakeDrill) loadLevel(0, state.mistakeLog.map((m) => m.item));
      else loadLevel(state.levelIdx);
    });

    document.getElementById("tabMatched").addEventListener("click", () => { state.activeTab = "matched"; renderPanel(); });
    document.getElementById("tabMistakes").addEventListener("click", () => { state.activeTab = "mistakes"; renderPanel(); });
    document.getElementById("tabBank").addEventListener("click", () => { state.activeTab = "bank"; renderPanel(); });

    document.getElementById("drillMistakesBtn").addEventListener("click", () => {
      if (state.mistakeLog.length > 0) {
        state.activeTab = "matched";
        loadLevel(0, state.mistakeLog.map((m) => m.item));
      }
    });
    document.getElementById("toggleHideAnswerBtn").addEventListener("click", () => {
      state.hideBankAnswers = !state.hideBankAnswers;
      renderPanel();
    });

    document.getElementById("ovReplayBtn").addEventListener("click", () => {
      if (state.isMistakeDrill) loadLevel(0, state.mistakeLog.map((m) => m.item));
      else loadLevel(state.levelIdx);
    });
    document.getElementById("ovNextBtn").addEventListener("click", () => {
      if (state.levelIdx < LEVELS.length - 1) loadLevel(state.levelIdx + 1);
    });
    document.getElementById("ovReadAllBtn").addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      state.currentLevel.items.forEach((item) => {
        const u = new SpeechSynthesisUtterance(item.example);
        u.lang = "en-US";
        u.rate = 0.96;
        window.speechSynthesis.speak(u);
      });
    });

    let lastTime = performance.now();
    function loop(now) {
      const dt = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;
      updatePhysics(dt);
      draw();
      requestAnimationFrame(loop);
    }

    applyTheme(state.theme);
    resizeCanvasHiDPI();
    loadLevel(0);
    requestAnimationFrame(loop);
  </script>
</body>
</html>
`;
