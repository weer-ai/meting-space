# meting.space — Design Brief for Claude Code

> 給 Claude Code 的設計說明。文案以 `CONTENT.md` 為準；本檔說明 **3D 節點圖要保留什麼、要改什麼、怎麼對應新的人生設計故事**。
> 參考原型：`reference/meting-space-v9-node-map.html`（Claude Design 做的 v9 原型，只當參考，不直接上線）。

---

## 1. 原型的優點：一定要保留

### 1.1 故事和幾何同步（最核心）
- 首頁是 6 個全螢幕段落（`100svh`），每個段落對應一個「階段」，**同一批節點在每個階段排成不同形狀**。
- 捲動時，段落前 45% 停在原形狀（讓人讀字），後 55% 用 smoothstep 平滑變到下一個形狀。不要改成捲一點就動一點。
- 形狀順序：外殼 shell → 三個分開的群 cluster → 球 sphere → 球（重點高亮）→ 球（另一組高亮）→ 收斂 converge。
- 這個順序剛好就是新故事：**分散 → 連起來 → 收斂成你自己**（見第 2 節）。

### 1.2 資料驅動的語意佈局
- 節點分三種：中心 `me`、關鍵字 `kw`、經歷 `p`。連線只在「經歷 → 它對應的關鍵字」之間。
- 關鍵字用 Fibonacci 球面平均分布；每個經歷放在「它所有關鍵字方向的平均值」再加一點抖動。所以**相關的經歷會自己靠在一起**，不用手排。
- 要新增經歷，只要加一筆資料，不用改程式。

### 1.3 探索模式（Explore the map）
- 全螢幕、拖曳旋轉帶慣性、滾輪縮放、ESC 離開。
- 點擊用「離手指最近的可見節點（34px 內）」判定，手機很好點。
- 底部關鍵字 chip 篩選、右下（手機在底部）資訊卡片，卡片上列出相連的節點。
- 進入探索時隱藏故事文字，離開時回到原本捲動位置。

### 1.4 視覺質感
- 自訂 shader 的發光點（核心 + 光暈，加法混色）。
- 暖色粒子塵埃，約 6% 是大顆淡淡的散景圓。
- 連線是二次貝茲曲線，兩端淡、中間亮，會輕微擺動。
- 標籤是 DOM 元素，用半透明模糊膠囊樣式，每一幀投影到 3D 位置；探索模式依深度淡出。
- 字體：Fraunces（標題、斜體強調）＋ Inter（內文、介面）。配色：深暖黑 `#0C0809`、杏桃 `#F4A58A`、珊瑚紅 `#FF5A4D`。
- **以 v9 的視覺為準**，取代 CONTENT.md 裡舊的 IBM Plex Mono／藍色品牌表。

### 1.5 手機優先
- 直式螢幕：節點圖往上移（`offY`），文字在下方，底部漸層遮罩。
- 桌機：節點圖往右移（`offX`），文字在左，左側漸層遮罩。
- 小螢幕粒子較少，DPR 上限 2。

### 1.6 草稿標記
- 紅色虛線框 `.todo` 標出待補資料。對應 CONTENT.md 的 `[TBD]`：上線版保留紅色標籤顯示 `[TBD]`，但**移除**左下角「Draft」徽章與只寫給 Ting 看的 todo 說明。

---

## 2. 新故事對應到 6 個階段

| 階段 | 首頁段落 | 節點形狀 | 顯示的標籤 | 意義 |
|---|---|---|---|---|
| 0 | Cover：Go long on yourself | shell | `me/ting` | 一個人，一堆散落的經歷 |
| 1 | (01) Why now | 3 群，偏紅 | `One skill`、`One income`、`One place` | 集中押注：三個彼此不通的籃子 |
| 2 | (02) The idea | sphere，連線變亮 | 同三個主題節點，**文字換成** `Stacked skills`、`More than one income`、`More than one place` | 分散＋連結＝像公司一樣經營 |
| 3 | (03) The agenda | sphere | 六個模組關鍵字 | 課程就是這張網的六個入口 |
| 4 | (04) Why me | sphere | 證據節點（`hi:true`） | 我是第一個用戶 |
| 5 | Closing：Take a seat at your own board | converge | `me/ting` | 一切收斂回你自己 |

- 首頁有 (05) From the log：把它併進 Closing 段落（標題下方列最新 2–3 篇日誌連結），維持 6 個階段。
- 階段 1 的三個主題節點只在階段 1、2 顯示；其他階段 alpha 為 0。
- 探索模式的 chip 用六個模組（All + 6）。

---

## 3. 資料模型

把資料抽出成 `data/nodes.json`（或 `.ts`），程式只讀資料：

```ts
type Module = "Discover" | "Define" | "Prototype" | "Fund" | "Environment" | "Resilience";
type Group = "skill" | "income" | "place" | "free";   // 階段 1 的三個群
type Node = {
  id: string; name: string; year?: string;
  group: Group; modules: Module[];   // 連線 = 經歷 → 模組
  text: string;                      // 卡片內文（英文）
  proof?: boolean;                   // 階段 4 高亮
  tbd?: string;                      // 有值就在卡片顯示紅色 [TBD]
};
```

### 模組說明（卡片內文）
- **Discover**：See where you really stand.
- **Define**：Design the to-be and size the gap.
- **Prototype**：Test the new life in small, cheap experiments.
- **Fund**：Make the experiments affordable.
- **Environment**：Put yourself where growth happens on its own.
- **Resilience**：Spread your risk across places, income and assets.

### 起始節點（只用履歷已載明的事實；Ting 可再增減）

| name | year | group | modules | text | proof | tbd |
|---|---|---|---|---|---|---|
| Industrial design, Taipei | 2010 | place | Discover | BA Industrial Product Design, Shih Chien University. | | |
| BMW, Munich | 2011 | place | Prototype, Environment | Design internship bridging Chinese market design preferences. | | |
| Designit, Munich | 2011–12 | place | Prototype | Service design helping Western brands bridge into China. | | |
| TU Delft | 2013–15 | place | Environment, Discover | MSc Integrated Product Design, 9/10. | | |
| Boeing 777X | 2014–15 | skill | Prototype, Define | Galley workspace +60%, toilet legroom +6 cm. US patents for the cabin. | ✓ | 專利數量 |
| Accenture Interactive | 2016–21 | skill | Prototype, Environment | 30+ design sprints, 10+ MVPs turned into full products. | ✓ | |
| Smartify | 2016–21 | skill | Prototype | Webby Winner and People's Voice; GSMA GLOMO Most Innovative Mobile App. | ✓ | 我的角色 |
| AI building | 2024– | skill | Prototype, Define | Building Weer's product with AI coding tools. | | |
| meting experience design | 2021– | income | Fund, Resilience | Independent practice: Rituals, gategroup, Philips, InterContinental Amstel. | | |
| Rituals | 2021– | income | Prototype | In-store sales +19%, membership sign-ups +14%. | ✓ | |
| gategroup | 2021 | income | Prototype, Resilience | A new digital business during COVID-19, $150M potential revenue. | ✓ | |
| Lufthansa Group | 2025 | income | Fund, Prototype | Remote contract: product strategy across five airlines. | ✓ | 數字可否公開 |
| Weer | 2023– | income | Define, Prototype, Fund | Founder. Startupbootcamp Top 10; Erasmus Entrepreneurship fellow. | ✓ | |
| Life ledger | 2026 | income | Fund | The spreadsheet behind two years without a salary. | | 公開程度 |
| Singapore company | 2023– | place | Resilience | A company in one country, a life in another. | | 公開程度 |
| Network School | 2026 | place | Environment | Joined a builder environment on purpose. | | |
| Terminal Taiwan | 2026 | place | Environment, Resilience | Started a community for international builders in Taiwan. | | |
| Ikigai map | 2026 | free | Discover, Define | How I chose a direction. | | |

---

## 4. 要修正的技術問題

1. **three.js 版本**：原型用 CDN 的 r128。改用 npm `three`，寫成 client component，`useEffect` 初始化、卸載時 dispose（geometry、material、renderer）並移除事件。
2. **佈局在 resize 時會變**：`rnd()` 是共用的種子亂數，每次 resize 重算佈局都會拿到不同的值，節點會跳位。每次建佈局前重設種子，或把抖動值一次算好存起來。
3. **段落位置測量**：只在 `load` 時量。字體載入後高度會變，改成 `document.fonts.ready` 後與 `ResizeObserver` 再量。
4. **無障礙**：
   - `prefers-reduced-motion`：停止自轉與漂浮，階段切換改為直接淡入淡出。
   - 探索模式：chip 與卡片可用鍵盤操作；canvas 加 `aria-hidden`，另外提供一個隱藏的節點清單給螢幕報讀器。
   - WebGL 失敗時顯示靜態圖，不讓頁面空白。
5. **效能**：分頁不在畫面上時停止 `requestAnimationFrame`；canvas 只在首頁載入，其他頁面不要背著 3D。
6. **捲動**：桌機與手機實測，Safari 上 `100svh` 與網址列伸縮不要讓段落跳動。

---

## 5. 網站其他部分（細節見 CONTENT.md）

- 框架：Next.js（App Router），可用 `output: "export"` 輸出靜態網站，方便之後在 Vercel 或 Cloudflare Pages 之間搬。
- 頁面：`/`、`/cohort`、`/minutes`、`/log`、`/log/[slug]`、`/zh/cohort`。
- 其他頁面沿用同一套暗色視覺與字體，但不載 3D；`/minutes` 的「Explore the map」連到 `/?explore=1`，首頁讀到參數就直接進探索模式。
- 日誌：`content/log/*.md`，frontmatter 有 `title`、`date`、`module`、`summary`、`draft`。
- 候補名單表單：欄位見 CONTENT.md。送出端點用環境變數 `NEXT_PUBLIC_WAITLIST_ENDPOINT`；沒設定時改用 `mailto:` 備案。自動帶上 `lang` 與網址上的 `utm_source`。

---

## 6. 驗收清單

- [ ] 6 個階段依序變形，每段中間停得住，文字可讀
- [ ] 階段 1 的三群偏紅、階段 2 主題標籤換字
- [ ] 探索模式：拖曳、縮放、點節點出卡片、chip 篩選、ESC 離開都正常
- [ ] 手機（390px）與桌機（1440px）各截圖檢查，文字不被節點蓋住
- [ ] resize 後節點不跳位
- [ ] reduced motion 與 WebGL 失敗都有替代畫面
- [ ] `[TBD]` 都以紅色標籤顯示，沒有給 Ting 看的內部說明
- [ ] Lighthouse 行動版效能 ≥ 80
