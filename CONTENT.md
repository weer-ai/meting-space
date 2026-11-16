# meting space 網站：架構與文案 v1

Nov 16, 2026 · @Ting

> **v2（2026-11-16）**：首頁改成七拍故事線（What is happening → The real problem → The idea → The method → Meet your mentor）。首頁英文文案以本檔為準；`/cohort`、`/minutes` 暫時維持 v1，之後再對齊（見「待確認事項」）。

## 給開發者的摘要

meting space 從「航空體驗顧問」網站改為人生設計網站：用設計師的方法論，教人把自己當公司經營。網站的唯一主要行動是**加入第一期 cohort 的候補名單**。

- **讀者**：想轉型、想遊牧或創業、想讓人生有更多選擇的專業人士（兩個族群並行測試，見候補名單表單）。
- **主要行動**：加入候補名單（email ＋ 一題「你現在卡在哪」）。
- **次要行動**：讀 build in public 日誌、寄信洽談企業版或演講。
- **語言**：英文為主，與現有站一致；若第一批客群是台灣人，再加繁中版本。
- **沿用**：me/ting space 字標、會議語彙（agenda、minutes、seat）、3D 節點圖、品牌色與字體。
- **捨棄**：航空顧問的 Pain／Approach／Ask 敘事、「Plan a meeting」主按鈕、所有航空工作坊。航空經歷降為證據。

**一句話概念**：Go long on yourself. 在變動的時代，疊加能力、多方佈局、分散風險，讓人生長期看漲；方法是把人生當公司經營，這門課就是它的董事會。

## 網站架構

四個頁面。首頁負責說服，Cohort 頁負責轉換，其他兩頁是證據與流量入口。

| 路徑 | 頁面 | 目的 | 主要行動 |
| --- | --- | --- | --- |
| `/` | Home | 說清楚概念：時代在變、真正的問題、方法、為什麼是我 | 加入候補名單 |
| `/cohort` | The Board（第一期 cohort） | 六週內容、形式、適合誰、FAQ | 加入候補名單 |
| `/minutes` | About／證據 | 五個跨界維度、獲獎與專利、3D 節點圖全螢幕探索 | 加入候補名單 |
| `/log` | Build in public 日誌 | 用這套系統撐過 Weer 兩年的紀錄 | 訂閱（同一份名單） |

另加 `/zh/cohort`：Cohort 頁的繁中版，用來測中文市場（台灣與華語圈）。內容與英文版相同，表單共用同一份名單，以 `lang=zh` 標記。中文文案等英文版定稿後再寫。

**首頁段落順序**（七拍；起點與終點都是那張「保護網」）

1. Cover：破題＋候補名單按鈕。3D 背景是一張已經織好的網（各種已完成的分散佈局）包住 `me/ting`
2. (01) What is happening?：中心節點是訪客當天的日期，周圍節點輪流閃出這個時代的焦慮
3. (02) The real problem：只押在一個支點上——One skill、One income、One place、One circle、One pot
4. (03) The idea：用經營公司的方法經營人生（公司 vs 人生對照）
5. (04) The method：六個工具，每週一個，連到 `/cohort`
6. (05) Meet your mentor：我是第一個用戶，依五個支柱列事證，連到 `/minutes`
7. Closing：候補名單表單（深色區塊）。有已發佈的日誌時，在標題下方列 (06) From the log 最新 2–3 篇

footer：email、LinkedIn、「For teams and talks」一行連結、財稅免責聲明。

**五個支柱**（網的結構，也是 (02) 的五個籃子、(05) 的五個段落）：Skills、Income、Places、People、Money。Flag theory（分散居住、收入、資產所在地）屬於 Places 與 Money；Five friends 屬於 People。

## 首頁文案

英文是上線文案，中文只是給你對照的意思。語氣沿用 v9：第一人稱、短句、只用數字和名字，不用形容詞。

### Cover

- Eyebrow（小字，在 headline 上方）：*Hi, nice me(e)ting you.*
- Headline：**The world now moves faster than any career. Go long on yourself.**
- Sub-line：*Skills, income, places and people that hold each other up, like a net. A six-week life-design cohort by someone who runs her own life this way.*
- CTA：**Join the waitlist** · 次要連結 *What is happening ↓*

（這個世界現在比任何一種職涯都快。做多你自己。「Go long」是投資用語的「做多、長期看漲」，剛好接上後面的 Fund 與 Resilience。背景那張網就是承諾：技能、收入、地方、人脈彼此撐住。）

### (01) What is happening?

**Lead:** Prices rise. AI learns your job. Teams get cut. Every week there is something new you are meant to keep up with.

**Result line:** You are not falling behind. The ground is moving.

3D：中心節點顯示訪客當天的日期，周圍節點輪流閃出下列標籤（一次亮 3 個、各亮約 2–3 秒）：Inflation · AI · Robots taking jobs · Layoffs · Job hunting · Can't keep up · Rising rent · Stale skills · Borders and visas

（開啟「減少動態」時不閃，固定亮其中幾個；沒有 WebGL 時，這幾個詞以文字標籤列出。）

### (02) The real problem

**Lead:** For decades the safe plan was one skill, one employer, one country. In a decade of AI, restructuring and borders that open and close, that plan is a concentrated bet.

1. **One skill.** A single skill can be automated or outsourced. A combination of skills is much harder to replace.
2. **One income.** When one paycheque carries rent, savings and every plan, one decision by someone else can stop all of it.
3. **One place.** Your career, money and residency all sit under one country's rules and one market's cycle.
4. **One circle.** When everyone around you works in the same field and thinks the same way, nobody warns you.
5. **One pot.** All your money in one currency, one bank, one asset.

**Result line:** You would never put your whole portfolio in one stock. Most of us put our whole life in one.

**Bridge line（接到 03）：** The answer is not to predict the future. It is to be positioned for several of them.

### (03) The idea: run your life like a company

**Lead:** Diversify like an investor, operate like a company. A company has a mission, a product line, a CFO, a talent plan and an R&D budget. Your life can too.

| A company has | Your life needs |
| --- | --- |
| A mission | A position you can say in one sentence |
| A product line | More than one income curve |
| A CFO | A runway you know to the month |
| A talent plan | An environment that makes you grow |
| R&D | Small, cheap experiments before big moves |
| A board | Five people who tell you the truth |
| A risk register | Risk spread across places and assets |

**Line under table:** I am not a coach with a motivational script. I am a designer who applied the same methods to her own life, and kept the receipts.

### (04) The method

**Lead:** Six tools, one per week. Each one ends with a decision, not a mood.

六張卡片，編號 (01)–(06)，每張一個工具加一句話，並標出它屬於哪個模組：

| Tool | Module | One line |
| --- | --- | --- |
| **Ikigai** | Discover | See where you really stand: skills, assets, money, energy. |
| **Design thinking** | Define | Design the life you want, and measure the gap. |
| **Prototyping** | Prototype | Test the new life in small, cheap experiments. |
| **Runway** | Fund | Make the experiments affordable: spending, runway, income curves. |
| **Five friends** | Environment | Put yourself where growth happens on its own. The five people around you set your normal. Choose them on purpose. |
| **Flag theory** | Resilience | Spread your risk across places, income and assets. |

CTA：*See the full agenda →* `/cohort`

### (05) Meet your mentor

**Lead:** I am the first client of this method. Fifteen years, five countries, three kinds of work, and one rule: design it, test it, then commit.

依五個支柱列事證。每個支柱一句話，下面接該支柱的所有經歷（名稱、年份、一句成果，文字出自 `DESIGN-BRIEF.md` 的節點表；尚未確認的以紅色 `[TBD]` 標示）：

| Pillar | Line |
| --- | --- |
| Skills | Design, business, money and AI building, layered over fifteen years. |
| Income | Full-time, freelance and startups. |
| Places | Taiwan, Germany, the Netherlands, the US and Singapore. |
| People | Put yourself where growth happens on its own. |
| Money | Two years, no salary, by design. |

**Right now:** I am building a startup with no salary for two years, and running this playbook in public so you can watch it work, or not.

CTA：*Read the minutes →* `/minutes`

### (06) From the log

**Lead:** The live case study. Real numbers, real decisions, including the ones that did not work.

自動列出 `/log` 最新 3 篇（標題、日期、一句摘要）。沒有已發佈的日誌就整塊不顯示。

### Closing（深色區塊）

- Headline：**Take a seat at your own board.**
- Body：*The first cohort is small on purpose. Join the waitlist and tell me where you are stuck. I read every answer.*
- 表單欄位見「視覺與技術規格」。

### 3D 節點圖上的標籤

五個支柱節點在不同階段換字：封面是網的五個結構，(02) 是各自只有一個的籃子，(03) 是分散之後。

| Cover | (02) The real problem | (03) The idea |
| --- | --- | --- |
| Skills | One skill | Stacked skills |
| Income | One income | More than one income |
| Places | One place | More than one place |
| People | One circle | More than one circle |
| Money | One pot | More than one pot |

### Footer

- *For teams and talks: the same method, in your company's language.* → email
- 免責：*Money, tax and residency topics are shared as personal experience, not financial, tax or legal advice.*

## Cohort 頁文案（`/cohort`）

頁名 **The Board**：每一期學員就是彼此的董事會。價格、日期、人數在第一期定案前一律留白，用 `[TBD]` 標籤顯示。

### Hero

- Headline：**The Board · Cohort 01**
- Sub-line：*Six weeks to design, test and fund the next version of your life.*
- Facts row：`6 weeks` · `Live, online` · `Small group [TBD]` · `Starts [TBD]`
- CTA：**Join the waitlist**

### Who it is for

- **The professional at a crossroads.** You are good at your job, maybe senior, and quietly aware that one employer, one skill and one country is a lot to bet on. You want options before you need them.
- **The explorer.** You already work remotely, travel, or have a side project. You want to turn scattered experiments into a strategy that pays.
- Either way, you like frameworks, spreadsheets and honest numbers more than affirmations.

**Not for you if** you want someone to tell you what to do, or a guaranteed income plan.

### The agenda（六週，可展開）

每週一張卡片：編號、標題、你會做什麼、你帶走什麼。展開後的「From my minutes」是 Ting 的真實例子。

| Week | Title | You will | You leave with | From my minutes |
| --- | --- | --- | --- | --- |
| (01) | Discover: see where you stand | Map your skills, assets, money and energy, as-is | A one-page company profile of you | My Ikigai map and four career curves |
| (02) | Define: design the to-be | Use design thinking to describe the life you want, then size the gap | A to-be statement and a gap list | How I chose a startup over a safe consulting niche |
| (03) | Prototype: test before you leap | Turn the gap into three small, cheap experiments | A 90-day experiment plan | Living and working across five countries before committing to one |
| (04) | Fund: make it affordable | Spending design, runway to the month, more than one income curve | Your runway number and income map | The ledger I use to fund two years without a salary |
| (05) | Environment: grow by default | Choose or create the rooms that make you better | One environment to join, one to build | Network School, and starting a builder community in Taiwan |
| (06) | Resilience: spread the risk | Spread where you live, earn and keep assets | A personal risk map | Running a company in one country while living in another |

### How it works

1. **Live sessions:** one per week, online. Recordings for those in other time zones `[TBD]`.
2. **Weekly assignment:** one worksheet, about two hours.
3. **Peer board:** small groups that review each other's decisions.
4. **Templates you keep:** life ledger, Ikigai canvas, runway calculator.

### FAQ

- **Is this financial or tax advice?** No. I share what I did and why. For your own case, I will point you to a licensed professional.
- **Do I need to quit my job?** No. Most experiments in week 3 fit around a full-time job.
- **What does it cost?** `[TBD]` Waitlist members hear first.
- **What if it is not for me?** `[TBD 退款政策]`

### Closing

- Headline：**Your board meets in \[month TBD\].**
- CTA：**Join the waitlist**

## About／證據頁文案（`/minutes`）

頁名沿用 v9 的 minutes（會議記錄）。沿用「不寫職位」規則：每個經歷只寫那次的角色與成果。只放已查證的事實，尚未確認的數字先不上線。

### Hero

- Headline：**The minutes.**
- Lead：*Everything I teach, I tried on myself first. Here is the record.*
- 下方是 3D 節點圖的全螢幕入口：**Explore the map**

### Five lines that cross

| # | Line | Copy | Evidence |
| --- | --- | --- | --- |
| 1 | Four curves | Design, business, money and AI building, layered over fifteen years. | Product design → consulting → founder; building Weer with AI |
| 2 | Five countries | Asia-Pacific and Europe, then the US, and back to Taiwan. | Taiwan, Germany, the Netherlands, the US, Singapore |
| 3 | Three ways of working | Inside large companies, on my own, and in startups. | Lufthansa Group, Accenture, BMW; freelance; Weer |
| 4 | Three industries | Aviation hardware, tech consulting, e-commerce and retail. | Boeing 777X cabin, Accenture, Rituals, PVH |
| 5 | Recognised in each role | As a designer, an engineer and a product team. | US patent, Red Dot Design Concept, Webby Winner, GSMA GLOMO |

### What this means for you

**Lead:** Changing direction is a skill. I have done it on purpose, more than once, and measured what it cost.

- I know what it feels like to start over in a new country and a new language.
- I know the spreadsheet behind a calm decision.
- I know which experiments were cheap and which were not.

### Now

- **Weer** — a rental marketplace so travellers can pack less. Two years, no salary, by design.
- **The Board** — this cohort, and the log where I run the method in public.
- **Taiwan** — helping international builders settle here, on the side.

### Closing

- CTA：**Join the waitlist** · 次要：*Teams and talks → email*

以下事實 v9 標為尚未確認，先不放上網站：專利數量（7 個）、Lufthansa +12%／+18%、SkyTeam 18 家航空、語言程度。

## 視覺與技術規格

在現有 3D 網站上改版，不重做。節點圖保留，只換節點資料與敘事文字。

### 品牌系統

| 項目 | 規格 |
| --- | --- |
| 字標 | `me[TING] space`，括號用紅色 |
| 標題與標籤字體 | IBM Plex Mono |
| 內文字體 | Georgia（中文備援 Noto Serif TC） |
| 主色 | 科技藍 `#2A2FD8`：結構、連結、編號 |
| 強調色 | 紅 `#D93B23`：只用在 CTA、數字、`[TBD]` 標籤 |
| 背景 | 首頁 Cover 與 Closing 用黑底（3D 節點圖）；內文段落用米白格線紙 |
| 簽名元素 | 尺規刻度分隔線、括號編號 (01)–(06) |

### 3D 節點圖

- 節點分五群，對應五個跨界維度；六個模組也是節點，連到對應的經歷（例如 Fund → 新加坡公司、ledger）。
- 資料放在一個 `nodes.json`：`id`、`label`、`group`、`year`、`role`、`result`、`links[]`。
- 首頁是捲動敘事的背景；點「Explore the map」進全螢幕探索。
- 手機版必須在不互動的情況下讀完整頁；3D 降為靜態圖或輕量動畫。
- 尊重 `prefers-reduced-motion`。

### 候補名單表單

| 欄位 | 類型 | 必填 |
| --- | --- | --- |
| Email | email | 是 |
| First name | text | 是 |
| Which sounds more like you? | 單選：A professional at a crossroads · An explorer (remote, nomad, side project, founder) · Neither, tell me below | 是 |
| Where are you stuck right now? | 單選：Career direction · Money and runway · Starting something · Moving countries · Other | 是 |
| If Cohort 01 costs \[price TBD\], would you consider joining? | 單選：Yes · Maybe, depends on dates · Not at that price | 是 |
| Anything else? | 長文字 | 否 |
| Send me the log too | checkbox，預設勾選 | 否 |

**客群測試**：第三題分族群、第五題分付費意願。每筆報名記下來源管道（UTM：`linkedin`、`ns`、`nomad`、`log`）。價格定下來之前，第五題可以先寫一個測試價。

- 接到同一個 email 工具（例如 Buttondown、ConvertKit 或 Tally），候補與訂閱用標籤區分。
- 送出後的文案：*You are on the list. I read every answer, and I will write before the doors open.*

### 日誌 `/log`

- 每篇一個 Markdown 檔：`title`、`date`、`module`（對應 01–06）、`summary`。
- 列表可依 module 篩選，讓讀者看到每個模組的真實案例。

### 交給 Claude Code 的指令

1. 把這份文件存成 repo 裡的 `CONTENT.md`，在 `CLAUDE.md` 加上：「文案以 CONTENT.md 為準，不自行改寫；`[TBD]` 保留紅色標籤」。
2. 先改首頁敘事與 `nodes.json`，再新增 `/cohort`、`/minutes`、`/log`。
3. 最後接表單，在手機與桌機各截一張圖檢查。

## 待確認事項

前兩項會改到文案本身，建議開發前先決定。

- [ ] **第一批客群**：先不定案，用候補名單測試。網站同時寫兩個人物（想轉型的專業人士、遊牧／創業者），2027 年 1 月定價時，依各族群的報名數與「願意付費」比例，決定第一期只開哪一群，再收窄 Cover 與「Who it is for」。假設：遊牧族群報名多、專業人士付費意願高。
- [ ] **語言**：英文站為主，另加一頁繁中 \`/zh/cohort\` 一起測。中文頁的候補名單記錄語言，1 月定價時和族群一起看：第一期用哪種語言開課，由數據決定。
- [ ] **公開度**：「two years, no salary」與 ledger、新加坡公司這些細節要公開到什麼程度。先照現在的文案開發，看到網頁設計後再決定。
- [ ] 「Recognised in each role」裡的「awards as a founder」：是哪個獎？沒有的話改成「and founder programmes」。
- [ ] 專利數量、Lufthansa 數字、語言能力（沿用 v9 紅字）。
- [ ] 第一期價格、人數、開課日、退款政策（Flight Plan 排在 2027 年 1 月決定）。
- [ ] Email 工具選哪個。
- [ ] 現有 3D 站的技術架構（框架、repo 位置），讓 Claude Code 知道從哪裡改。
- [ ] **`/cohort` 對齊首頁新故事線（暫定，之後討論）**：六週標題要不要換成方法名（Ikigai、Design thinking、Prototyping、Runway、Five friends、Flag theory）、「Who it is for」與首頁的呼應。目前 `/cohort`、`/minutes` 維持 v1 文案。
- [ ] 首頁 v2 新增、待你過目：五個支柱的歸屬（例如 Ikigai map 與 Industrial design 歸 Skills，TU Delft 歸 People）、三個我加的焦慮標籤（Rising rent、Stale skills、Borders and visas）。
