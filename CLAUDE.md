# CLAUDE.md — meting.space

meting.space 是 Ting 的個人網站，從「航空體驗顧問」改版為**人生設計 cohort** 網站：用設計師的方法論教人把自己當公司經營。網站**唯一主要行動是加入第一期 cohort 的候補名單**；次要行動是讀 build in public 日誌、寄信洽談企業版或演講。

## 文件分工與優先順序

| 檔案 | 管什麼 |
| --- | --- |
| `CONTENT.md` | **文案與頁面架構**（英文上線文案、頁面、表單欄位、日誌格式）。**v3 合併版（2026-11-17）**：以 Ting 的 v3 為底，首頁套用 11/16 核准的七拍故事線。Ting 原檔留在 `reference/CONTENT-v3-merged.md` |
| `DESIGN-BRIEF.md` | **3D 節點圖、視覺、技術做法、驗收清單** |
| `reference/meting-space-v9-node-map.html` | v9 原型：視覺與動態的**參考**，只讀，不直接上線、不修改 |

兩份文件衝突時：

- **文案**以 `CONTENT.md` 為準。
- **視覺與技術**以 `DESIGN-BRIEF.md` 為準。Brief 明講：視覺以 v9 為準，**取代** CONTENT.md「視覺與技術規格」裡舊的 IBM Plex Mono／藍色品牌表（`#2A2FD8` 藍、`#D93B23` 紅、Georgia、米白格線紙、`me[TING]` 紅括號字標、尺規刻度）。
- Brief 的資料模型取代 CONTENT.md 的 `nodes.json` 欄位（`role`、`result`、`links[]`）與「五群」說法。
- **首頁的階段與節點（七階段、五個支柱）以本檔「3D 節點圖規則」為準**：Ting 於 2026-11-16 核准新故事線，2026-11-17 決定與 v3 合併（標題用 B、副標用 v3、恆春區塊手動開關）。`DESIGN-BRIEF.md` §2 的六階段表與 `Group` 欄位已過時，**不要照 Brief 或 v3 的舊首頁結構改回去**。Brief 其餘（視覺、技術要求、驗收清單）仍有效。
- 兩份文件沒涵蓋、或彼此矛盾又無法判斷的地方：**停下來問 Ting，不要自己決定**。

## 文案規則（最重要）

1. **英文文案一字不改**：照抄 `CONTENT.md`，不潤飾、不縮寫、不換詞、不補句。語氣（第一人稱、短句、只用數字和名字）已由文件定好。**要改文案：先把新文案寫進 CONTENT.md 並經 Ting 核准，才能進程式**（`tests/copy.test.ts` 會逐字比對）。
2. 英文是上線文案；文件裡的中文只是給開發者對照的意思，**不上線**（`/zh/cohort` 除外，見下）。
3. 文件裡標明「備選」的 headline 不上線，只用主 headline。
4. `[TBD]` 一律保留，以**紅色標籤**顯示（價格、日期、人數、退款政策、第一期月份等）。不要自己填數字、不要刪。
5. 上線版**不出現**任何只寫給 Ting 看的內容：v9 的 `.todo` 說明、左下「Draft」徽章、`(P2)`／`(P13)` 這類代號、中文內部備註。這些內部備註不得進入送到瀏覽器的資料或 HTML。**唯一的中文例外**是 Ting 英文文案裡的專有名詞「花花生活節」（恆春區塊），測試只放行這一個。連結用的 `[TBD: booking link]`、`[TBD: Terminal Taiwan Luma link]` 是給開發者的備註，上線只顯示紅色 `[TBD]`；文案裡的 `[duration TBD]`、`[price TBD]`、`[TBD refund policy]` 等則照原樣以紅字顯示。
6. **未查證的事實不上線**：專利數量（7 個）、Lufthansa +12%／+18%、SkyTeam 18 家航空、語言程度。不從 v9 原型把這些數字帶回來；不自行新增事實、數字、獎項、客戶名稱。
7. 文件沒寫到的介面小字（按鈕、提示、aria 標籤等）：優先沿用 v9 原型的字；必須新增時用最少的字，並在回報時列出，讓 Ting 逐條確認。
8. 中文頁 `/zh/cohort` 要等英文版定稿、且 Ting 說可以才寫；不要預先翻譯或寫中文文案。

## 網站架構

- 頁面：`/`、`/cohort`、`/minutes`、`/log`、`/log/[slug]`、`/zh/cohort`。
- 首頁段落（`100svh`，內容較長的用 `min-height`）：Cover → (01) What is happening? → (02) The real problem → (03) The idea → Is this for you? → (04) The method → (05) Meet your mentor → (06) From the log（有已發佈日誌才顯示）→ Starter kit → Meet me in Hengchun（限時，手動開關）→ Closing。
- 每個 `section.s` 用 `data-stage` 指定所屬的 3D 階段（0–6），**相鄰段落可共用一個階段**（Is this for you? 與 The idea 同為 3；Starter kit、Hengchun、Closing 同為 6）。場景在段落之間從前一段的階段平滑變到下一段的階段，同階段則不動。新增段落時只要設 `data-stage`，不必改場景。
- 恆春區塊的開關與兩個待補連結在 `content/config.ts`（`SHOW_HENGCHUN`、`HENGCHUN_BOOKING_URL`、`TERMINAL_TAIWAN_URL`）。連結為空時按鈕停用並顯示紅色 `[TBD]`。活動結束後由 Ting 說了才把 `SHOW_HENGCHUN` 改成 false。
- Starter kit 是「第二道門」：只收 email、標籤 `kit`、同一份名單。候補名單與 starter kit 的表單目前都**尚未送出**（待接線）。
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

- 同一批節點在每個階段排成不同形狀（七階段，見下表）。
- 捲動時段落**前 45% 停住**（讓人讀字）、**後 55% 用 smoothstep 變形**，不是捲一點動一點。
- 節點五種：中心 `me`、支柱 `pillar`、模組 `module`、經歷 `exp`、焦慮 `worry`。結構連線只在「經歷 → 它對應的模組」之間；另有一層「保護網」連線（`buildMesh`：網上每個節點連最近的三個鄰居）。模組用 Fibonacci 球面均分；經歷放在它所有模組方向的平均值再加固定抖動。**新增經歷只加資料，不改程式。**
- 探索模式：全螢幕、拖曳旋轉帶慣性、滾輪縮放、ESC 離開；點擊取 34px 內最近的可見節點；底部 chip 篩選（All ＋ 六個模組）；資訊卡片列出相連節點；進入時隱藏故事文字，離開時回到原捲動位置。
- 質感：自訂 shader 發光點（核心＋光暈、加法混色）、暖色粒子塵埃（約 6% 為大顆散景圓）、二次貝茲連線（兩端淡中間亮、輕微擺動）、DOM 膠囊標籤逐幀投影、探索模式依深度淡出。

**七階段對應（Ting 2026-11-16 核准，取代 Brief §2）：**

| 階段 | 段落 | 形狀 | 顯示標籤 | 連線 |
| --- | --- | --- | --- | --- |
| 0 | Cover | 外殼：一張已經織好的保護網包住 `me/ting` | `me/ting` ＋ 五個支柱名（Skills、Income、Places、People、Money） | 結構＋網 |
| 1 | (01) What is happening? | 鬆散的雲；**中心節點寫 `The world today`**，周圍的焦慮節點輪流亮起 | `The world today`＋亮著的焦慮標籤（一次 3 個、各 2–3 秒） | 關閉 |
| 2 | (02) The real problem | 五個互不相通的籃子，偏紅 | `One skill`、`One income`、`One place`、`One circle`、`One pot` | 關閉 |
| 3 | (03) The idea、Is this for you? | 球，網成形、連線變亮 | 同五個節點換字：`Stacked skills`、`More than one income/place/circle/pot` | 結構亮、網淡 |
| 4 | (04) The method | 球 | 六個模組 | 結構＋網 |
| 5 | (05) Meet your mentor | 球 | 證據節點（`proof: true`） | 結構＋網 |
| 6 | Starter kit、Hengchun、Closing | 同一張網收緊（半徑 0.5R）包住你 | `me/ting` | 結構＋網（網較亮） |

- 五個支柱節點只在階段 0、2、3 顯示；焦慮節點只在階段 1 顯示（其他階段 alpha 為 0）。
- 開啟 reduced-motion：焦慮標籤不閃，固定亮其中 4 個。沒有 WebGL：`.worry-list` 以文字標籤列出。
- 中心節點的字在階段 1 是 `The world today`（`data/story.ts` 的 `ME_NOW_LABEL`），其餘階段是 `me/ting`。2026-11-17 Ting 把原本的「訪客當天日期」改成這句。

**資料（Brief §3）：** 資料放 `data/nodes`，程式只讀資料。`Node = { id, name, year?, pillar: "skill"|"income"|"place"|"people"|"money", modules: Module[], text, proof?, tbd? }`（Brief 的 `group` 已改名為 `pillar` 並擴成五個）。支柱歸屬由 Ting 核准，改動前先問。只用 Brief 起始節點表與履歷已載明的事實。`tbd` 只決定卡片上是否顯示紅色 `[TBD]`，內部備註不進資料。

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
node scripts/shots.cjs --out DIR --dpr 2 --pos top     # 手機390／桌機1440 截圖，每段一張，檔名含段落 id（需先 build）
node scripts/interact.cjs                              # 探索模式、點擊、鍵盤、錨點
node scripts/states.cjs --out DIR                      # reduced-motion、WebGL 失敗
node scripts/pages.cjs --out DIR --dpr 2               # /cohort /minutes /log 整頁截圖，檢查溢出與 console 錯誤
```

無頭 Chromium 要帶 swiftshader 參數才有 WebGL（腳本已處理）。

`vercel.json` 把 framework 固定為 `nextjs`：Vercel 專案是在 `main` 只有文件、沒有 `package.json` 時建立的，Framework 可能被存成「Other」。

### 結構

- `content/copy/home.ts`：首頁英文文案，**必須逐字出自 CONTENT.md**，`tests/copy.test.ts` 會比對，改字就會失敗。`content/copy/ui.ts` 是 CONTENT.md 沒有的介面小字，每條標明來源（v9／新增／調整）。
- `data/nodes.ts`（節點與支柱歸屬，文字逐字出自 Brief）、`data/story.ts`（五個支柱與三種標籤、九個焦慮詞，逐字出自 CONTENT.md）。
- `components/nodemap/`：`graph.ts`（資料→節點與連線）、`layout.ts`（純函式、確定性佈局，含保護網 `shellPositions`／`buildMesh`、五個籃子）、`scene.ts`（three 場景、中心節點「The world today」、焦慮閃現、互動）。
- `content/config.ts`：Ting 手動改的開關與連結（不是文案）。`content/copy/log.ts`：`/log` 的開場白。
- `components/home/`：`HomeStory`（所有首頁段落，server）、`StarterKitForm`、`MentorPillars`（依支柱列事證，直接讀節點資料，未確認的帶紅色 [TBD]）、`HomeShell`（client，持有 canvas 與模式）、`ExploreUI`、`WaitlistForm`。
- 內頁：`app/cohort`、`app/minutes`、`app/log`、`app/log/[slug]`；文案在 `content/copy/cohort.ts`、`minutes.ts`（同樣逐字比對）；樣式在 `styles/pages.css`；`components/Rich.tsx` 把文案裡的 `[TBD]` 轉成紅色標籤；`components/page/LogList.tsx` 是依 module 篩選的日誌列表。
- 日誌：`lib/log.ts` 讀 `content/log/*.md`（`draft: true` 不會出現在任何地方；缺 title／date／module 會讓 build 失敗而不是半成品上線；module 可寫名稱或 1–6）。`lib/markdown.ts` 渲染並 sanitize。測試與預覽可用環境變數 `LOG_DIR` 指到別的資料夾（`tests/fixtures/log`），**不要把假文章放進 `content/log`**。

### 內頁規則

- 內頁沿用暗色視覺，**不載 3D**（`scripts/pages.cjs` 會檢查沒有 `#gl`）。不要在內頁用 `section.s`（那是首頁階段的 class）。
- 候補名單表單只在首頁 Closing。內頁的「Join the waitlist」都連到 `/#waitlist`。
- Footer 導覽的 `/log` 連結只在有已發佈文章時顯示，與首頁 (05) 同一個規則。沒有文章時 `/log` 只有標題、lead 與 CTA，不編造內容。
- `output: "export"` 不接受空的 `generateStaticParams`：沒有文章時 `/log/[slug]` 會產出一個不收錄、不被連結的佔位頁 `/log/_`，造訪時轉到 `/log`；有第一篇文章後自動消失。
- `[TBD]` 一律用 `Rich` 渲染。CONTENT.md 的「[TBD 退款政策]」只上線 `[TBD]`（中文是給 Ting 的備註）。
- 「Teams and talks → email」照 CONTENT.md 逐字上線，待 Ting 確認「email」是否只是連結去向的備註。

### 這輪定下的規則

- 每個 `section.s` 是一個階段；`scene.ts` 讀 `section.s` 的位置，**不要改 class 名**。
- 捲動換算的參考線是視窗 50%（v9 是 55%，會讓每段自己的階段偏離約 9%）。停留 45%／變形 55% 不變。
- 手機版 `.shade` 只蓋文字區（從 `38svh - 64px` 起），不要改回整段覆蓋，否則段落之間的圖會被蓋掉。
- 手機版不放固定的「Explore the map」按鈕（會蓋住正在讀的文字）：手機用封面裡的 inline 按鈕，桌機才固定在右下。
- 標籤有防碰撞與靠邊翻轉；新增節點或標籤後要看手機截圖確認沒有互疊或被切掉。
- 階段 1、2 的連線全關（`EDGE_K`），讓一切看起來「沒有網」；階段 3 才亮起，封面與 Closing 是完成的網。
- 手機版五個籃子位置（`basketCenter(_, true, _)`）必須落在文字遮罩上方（有測試）。新增或搬動支柱後要看手機截圖確認標籤沒有互疊。
- 截圖取景用 `--pos top`（段落頂端對齊視窗，等同錨點跳轉看到的畫面）。

## 工作流程

- 開發 branch：`claude/gracious-allen-o3kejp`。不經 Ting 要求不開 PR、不推其他 branch。首頁、`/cohort`、`/minutes`、`/log` 已完成；表單接線待做。**推 `main` 會直接更新正式網站（Vercel Production），只有 Ting 明說 merge 才推。**
- 順序：首頁（七拍故事線＋v3 新區塊）與內頁已完成，待 Ting 確認截圖 → 接表單（候補名單、starter kit，`/log` 訂閱表單的欄位與按鈕文字尚未定）→ `/cohort` 對齊新故事線（暫定，見 CONTENT.md 最後的 Open items）→ `/zh/cohort` 等 Ting 說可以才做。
- 每個階段完成都要在**手機 390px 與桌機 1440px**各截一張圖檢查（Playwright 內建 Chromium；無頭模式要開 swiftshader 才有 WebGL），文字不可被節點蓋住；截圖給 Ting 看之後才往下做。
- 收尾對照 Brief §6 驗收清單（階段數以七階段為準）：七階段依序變形且每段停得住；階段 1 有 The world today 與閃現、階段 2 五個籃子、階段 3 換字；探索模式全功能；resize 不跳位；reduced motion 與 WebGL 失敗有替代畫面；`[TBD]` 都是紅色標籤且無內部說明；Lighthouse 行動版效能 ≥ 80。

## 尚未決定（開發時照現有文案先做，不要自行拍板）

`/cohort` 的六週標題是否換成方法名、與首頁新故事線的呼應（Ting 說之後討論，已記在 CONTENT.md 的 Open items）；三個我加的焦慮詞（Rising rent、Stale skills、Borders and visas）與各經歷的支柱歸屬待 Ting 過目；首頁 (01) 結尾與 (02) 銜接句的「not behind」是否重複；Hengchun 預約連結與 Terminal Taiwan Luma 連結；

第一批客群（Cover 與「Who it is for」之後可能收窄）、語言策略、「two years, no salary」與 ledger／新加坡公司的公開程度、「awards as a founder」是哪個獎（沒有的話要改成「and founder programmes」）、專利數量／Lufthansa 數字／語言能力、第一期價格人數日期退款、email 工具、部署平台、LinkedIn 網址。
