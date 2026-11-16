# CLAUDE.md — meting.space

meting.space 是 Ting 的個人網站，從「航空體驗顧問」改版為**人生設計 cohort** 網站：用設計師的方法論教人把自己當公司經營。網站**唯一主要行動是加入第一期 cohort 的候補名單**；次要行動是讀 build in public 日誌、寄信洽談企業版或演講。

## 文件分工與優先順序

| 檔案 | 管什麼 |
| --- | --- |
| `CONTENT.md` | **文案與頁面架構**（英文上線文案、頁面、表單欄位、日誌格式） |
| `DESIGN-BRIEF.md` | **3D 節點圖、視覺、技術做法、驗收清單** |
| `reference/meting-space-v9-node-map.html` | v9 原型：視覺與動態的**參考**，只讀，不直接上線、不修改 |

兩份文件衝突時：

- **文案**以 `CONTENT.md` 為準。
- **視覺與技術**以 `DESIGN-BRIEF.md` 為準。Brief 明講：視覺以 v9 為準，**取代** CONTENT.md「視覺與技術規格」裡舊的 IBM Plex Mono／藍色品牌表（`#2A2FD8` 藍、`#D93B23` 紅、Georgia、米白格線紙、`me[TING]` 紅括號字標、尺規刻度）。
- Brief 的資料模型取代 CONTENT.md 的 `nodes.json` 欄位（`role`、`result`、`links[]`）與「五群」說法。
- 兩份文件沒涵蓋、或彼此矛盾又無法判斷的地方：**停下來問 Ting，不要自己決定**。

## 文案規則（最重要）

1. **英文文案一字不改**：照抄 `CONTENT.md`，不潤飾、不縮寫、不換詞、不補句。語氣（第一人稱、短句、只用數字和名字）已由文件定好。
2. 英文是上線文案；文件裡的中文只是給開發者對照的意思，**不上線**（`/zh/cohort` 除外，見下）。
3. 文件裡標明「備選」的 headline 不上線，只用主 headline。
4. `[TBD]` 一律保留，以**紅色標籤**顯示（價格、日期、人數、退款政策、第一期月份等）。不要自己填數字、不要刪。
5. 上線版**不出現**任何只寫給 Ting 看的內容：v9 的 `.todo` 說明、左下「Draft」徽章、`(P2)`／`(P13)` 這類代號、中文內部備註。這些內部備註不得進入送到瀏覽器的資料或 HTML。
6. **未查證的事實不上線**：專利數量（7 個）、Lufthansa +12%／+18%、SkyTeam 18 家航空、語言程度。不從 v9 原型把這些數字帶回來；不自行新增事實、數字、獎項、客戶名稱。
7. 文件沒寫到的介面小字（按鈕、提示、aria 標籤等）：優先沿用 v9 原型的字；必須新增時用最少的字，並在回報時列出，讓 Ting 逐條確認。
8. 中文頁 `/zh/cohort` 要等英文版定稿、且 Ting 說可以才寫；不要預先翻譯或寫中文文案。

## 網站架構

- 頁面：`/`、`/cohort`、`/minutes`、`/log`、`/log/[slug]`、`/zh/cohort`。
- 首頁六個段落 = 六個 3D 階段（`100svh`，Closing 內容較長時用 `min-height`）：Cover → (01) Why now → (02) The idea → (03) The agenda → (04) Why me → Closing。
- (05) From the log 併進 Closing：標題下方列最新 2–3 篇日誌連結（只列 `draft: false` 的；沒有就不要編造文章）。
- 所有頁面共用 footer：email、LinkedIn、「For teams and talks」一行連結、財稅免責聲明（文案見 CONTENT.md）。
- `/minutes` 的「Explore the map」連到 `/?explore=1`，首頁讀到參數直接進探索模式。
- 3D 只在首頁載入，其他頁面不背 three.js。
- 候補名單表單欄位照 CONTENT.md；送出端點讀 `NEXT_PUBLIC_WAITLIST_ENDPOINT`，沒設定時退回 `mailto:`；自動帶上 `lang` 與網址上的 `utm_source`（`linkedin`、`ns`、`nomad`、`log`）。送出後文案照 CONTENT.md。
- 日誌：`content/log/*.md`，frontmatter 為 `title`、`date`、`module`（Discover…Resilience，對應 01–06）、`summary`、`draft`；列表可依 module 篩選。

## 視覺規則（以 v9 為準）

- 色彩：背景深暖黑 `#0C0809`、墨色 `#F6EFE8`、杏桃強調 `#F4A58A`、珊瑚紅 `#FF5A4D`（階段 1 偏紅群、`[TBD]` 標籤）。v9 把杏桃命名為 `--blue`，移植時改名 `--accent`。
- 字體：Fraunces（標題、斜體強調、數字）＋ Inter（內文、介面）。中文備援 Noto Serif TC（僅 `/zh`）。
- 字標沿用 v9 的 `me/ting space`（斜體 Fraunces）。
- 括號編號 (01)–(06) 是簽名元素。
- 其他頁面沿用同一套暗色視覺與字體，但不載 3D。
- 手機優先：直式時節點圖往上移、文字在下、底部漸層遮罩；桌機節點圖往右移、文字在左、左側漸層遮罩。小螢幕粒子較少，DPR 上限 2。

## 3D 節點圖規則

**保留 v9 的行為（不要「改良」掉）：**

- 同一批節點在每個階段排成不同形狀：shell → 三個分開的群 cluster → sphere → sphere（高亮）→ sphere（另一組高亮）→ converge。
- 捲動時段落**前 45% 停住**（讓人讀字）、**後 55% 用 smoothstep 變形**，不是捲一點動一點。
- 節點三種：中心 `me`、關鍵字／模組、經歷。連線只在「經歷 → 它對應的模組」之間。模組用 Fibonacci 球面均分；經歷放在它所有模組方向的平均值再加固定抖動。**新增經歷只加資料，不改程式。**
- 探索模式：全螢幕、拖曳旋轉帶慣性、滾輪縮放、ESC 離開；點擊取 34px 內最近的可見節點；底部 chip 篩選（All ＋ 六個模組）；資訊卡片列出相連節點；進入時隱藏故事文字，離開時回到原捲動位置。
- 質感：自訂 shader 發光點（核心＋光暈、加法混色）、暖色粒子塵埃（約 6% 為大顆散景圓）、二次貝茲連線（兩端淡中間亮、輕微擺動）、DOM 膠囊標籤逐幀投影、探索模式依深度淡出。

**六階段對應（Brief §2）：**

| 階段 | 段落 | 形狀 | 顯示標籤 |
| --- | --- | --- | --- |
| 0 | Cover | shell | `me/ting` |
| 1 | (01) Why now | 3 群、偏紅 | `One skill`、`One income`、`One place` |
| 2 | (02) The idea | sphere、連線變亮 | 同三節點換字：`Stacked skills`、`More than one income`、`More than one place` |
| 3 | (03) The agenda | sphere | 六個模組 |
| 4 | (04) Why me | sphere | 證據節點（`proof: true`） |
| 5 | Closing | converge | `me/ting` |

三個主題節點只在階段 1、2 顯示，其他階段 alpha 為 0。

**資料（Brief §3）：** 資料放 `data/nodes`，程式只讀資料。`Node = { id, name, year?, group: "skill"|"income"|"place"|"free", modules: Module[], text, proof?, tbd? }`。只用 Brief 起始節點表與履歷已載明的事實。`tbd` 只決定卡片上是否顯示紅色 `[TBD]`，內部備註不進資料。

**技術要求（Brief §4）：**

1. three.js 用 npm `three`（不用 CDN r128）；client component，`useEffect` 初始化，卸載時 dispose geometry／material／renderer 並移除所有事件。
2. 佈局必須**確定性**：每次建佈局前重設種子或預先算好抖動值，resize 後節點不可跳位。
3. 段落位置在 `document.fonts.ready` 後與 `ResizeObserver` 時重新量，不只在 `load`。
4. `prefers-reduced-motion`：停止自轉與漂浮，階段切換改直接淡入淡出。
5. 探索模式 chip 與卡片可用鍵盤操作；canvas `aria-hidden`，另提供隱藏的節點清單給報讀器。
6. WebGL 失敗時顯示靜態圖，頁面不可空白。
7. 分頁不在畫面上時停止 `requestAnimationFrame`。
8. Safari 的 `100svh` 與網址列伸縮不可讓段落跳動。
9. 手機版不互動就能讀完整頁：故事文字是一般 DOM，3D 只是背景。

## 技術棧與指令

Next.js 16（App Router）＋ TypeScript，`output: "export"` 靜態輸出（保持能在 Vercel 與 Cloudflare Pages 間搬）。three 走 npm，`HomeShell` 在 hydration 後才動態載入場景。字體用 `@fontsource-variable/fraunces`、`@fontsource-variable/inter` 自架。樣式是 `styles/global.css`（變數＋v9 移植），不用 Tailwind。

```bash
npm run dev          # 開發
npm run build        # 靜態輸出到 out/
npm run typecheck
npm test             # vitest：文案逐字比對 + 佈局確定性
node scripts/shots.cjs --out DIR --dpr 2 --pos top     # 手機390／桌機1440 截圖（需先 build）
node scripts/interact.cjs                              # 探索模式、點擊、鍵盤、錨點
node scripts/states.cjs --out DIR                      # reduced-motion、WebGL 失敗
```

無頭 Chromium 要帶 swiftshader 參數才有 WebGL（腳本已處理）。

`vercel.json` 把 framework 固定為 `nextjs`：Vercel 專案是在 `main` 只有文件、沒有 `package.json` 時建立的，Framework 可能被存成「Other」。

### 結構

- `content/copy/home.ts`：首頁英文文案，**必須逐字出自 CONTENT.md**，`tests/copy.test.ts` 會比對，改字就會失敗。`content/copy/ui.ts` 是 CONTENT.md 沒有的介面小字，每條標明來源（v9／新增／調整）。
- `data/nodes.ts`（節點，逐字出自 Brief）、`data/story.ts`（三個主題節點與兩種標籤）。
- `components/nodemap/`：`graph.ts`（資料→節點與連線）、`layout.ts`（純函式、確定性佈局）、`scene.ts`（three 場景與互動）。
- `components/home/`：`HomeStory`（六段落，server）、`HomeShell`（client，持有 canvas 與模式）、`ExploreUI`、`WaitlistForm`。

### 這輪定下的規則

- 每個 `section.s` 是一個階段；`scene.ts` 讀 `section.s` 的位置，**不要改 class 名**。
- 捲動換算的參考線是視窗 50%（v9 是 55%，會讓每段自己的階段偏離約 9%）。停留 45%／變形 55% 不變。
- 手機版 `.shade` 只蓋文字區（從 `38svh - 64px` 起），不要改回整段覆蓋，否則段落之間的圖會被蓋掉。
- 手機版不放固定的「Explore the map」按鈕（會蓋住正在讀的文字）：手機用封面裡的 inline 按鈕，桌機才固定在右下。
- 標籤有防碰撞與靠邊翻轉；新增節點或標籤後要看手機截圖確認沒有互疊或被切掉。
- 階段 1 的連線幾乎關閉（`LINE_BASE[1]`），讓三個籃子看起來「彼此不通」；階段 2 才亮起。
- 手機版籃子位置（`basketCenters(true)`）必須落在文字遮罩上方。
- 截圖取景用 `--pos top`（段落頂端對齊視窗，等同錨點跳轉看到的畫面）。

## 工作流程

- 開發 branch：`claude/gracious-allen-o3kejp`。不經 Ting 要求不開 PR、不推其他 branch。階段 A（首頁）已完成並待 Ting 確認截圖。
- 順序：先首頁（3D 節點圖＋六段落）→ 截圖給 Ting 確認 → 再做 `/cohort`、`/minutes`、`/log` → 最後接表單 → `/zh/cohort` 等 Ting 說可以才做。
- 每個階段完成都要在**手機 390px 與桌機 1440px**各截一張圖檢查（Playwright 內建 Chromium；無頭模式要開 swiftshader 才有 WebGL），文字不可被節點蓋住；截圖給 Ting 看之後才往下做。
- 收尾對照 Brief §6 驗收清單：六階段依序變形且每段停得住；階段 1 偏紅、階段 2 換字；探索模式全功能；resize 不跳位；reduced motion 與 WebGL 失敗有替代畫面；`[TBD]` 都是紅色標籤且無內部說明；Lighthouse 行動版效能 ≥ 80。

## 尚未決定（開發時照現有文案先做，不要自行拍板）

第一批客群（Cover 與「Who it is for」之後可能收窄）、語言策略、「two years, no salary」與 ledger／新加坡公司的公開程度、「awards as a founder」是哪個獎（沒有的話要改成「and founder programmes」）、專利數量／Lufthansa 數字／語言能力、第一期價格人數日期退款、email 工具、部署平台、LinkedIn 網址。
