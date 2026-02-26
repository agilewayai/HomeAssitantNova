# RAVIS-冰箱助手 / RAVIS Fridge Assistant

## 中文版

### 1. 产品定位
`RAVIS-冰箱助手` 是一个单页离线优先的冰箱库存管理 Web App，目标是降低食材过期率，帮助用户优先处理临期食材。

### 2. 核心功能
- 多冰箱管理：创建、编辑、删除（仅在清空后允许删除）。
- 可视化冰箱分区：每台冰箱支持多个分区（蔬菜、蛋白、饮品等）。
- 食材管理：新增、编辑、跨分区转移、用完/丢弃、延期等操作。
- 食材字段：名称、数量、单位、添加日期、到期日期、状态、剩余有效天数、备注。
- 食材库：内置经典食材模板，支持自定义条目、别名、智能提示与快速引用。
- 临期优先机制：自动识别 `Rescue/Critical/Expired`，生成优先处理队列与建议。
- 语音输入：支持浏览器语音识别输入名称、单位、备注等文本字段。
- 冰箱主题色：可为每台冰箱设置不同颜色主题。
- 多语言切换：支持 `中文 / English / 日本語 / Deutsch / Français / Español / Italiano`。
- 语言包优化：中文内置，其他语言采用紧凑 JSON 语言包并按需懒加载。
- 应用内手册：内置多语言使用手册页（跟随当前语言）。
- 打印清单导出：一键导出分层、排版清晰的库存 `.txt` 文件（冰箱 -> 分区 -> 食材）。

### 3. 数据存储与安全机制（localStorage）
应用数据默认存储在浏览器 `localStorage`，不依赖云端账号。

主要存储键：
- `homeassistant-nova:state`：主状态数据（冰箱、分区、食材、日志、食材库）。
- `homeassistant-nova:meta`：元信息（版本、迁移信息、时间戳等）。
- `homeassistant-nova:backup-index`：备份索引。
- `homeassistant-nova:backup:*`：历史备份快照（升级迁移前写入）。
- `homeassistant-nova:locale`：用户语言偏好。
- `locales/*.json`：非默认语言紧凑包（按需请求并缓存）。

安全策略：
- 版本升级时先创建备份快照，再执行数据迁移。
- 若迁移异常，优先尝试从最近备份恢复。
- 通过 schema/version 信封结构降低升级数据损坏风险。

注意事项：
- 清理浏览器缓存或站点数据会清空本地数据。
- 隐私/无痕模式不适合长期保存。

### 4. 手机和平板安装

#### iPhone / iPad（Safari）
1. 使用 Safari 打开应用地址。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 主屏图标启动后可接近原生 App 体验运行。

#### Android（Chrome）
1. 使用 Chrome 打开应用地址。
2. 点击菜单（⋮）。
3. 选择“添加到主屏幕”或“安装应用”。
4. 安装后从桌面图标启动。

#### iPad 可执行包（仓库内）
- 目录：`iPad-executable/`
- 打包文件：`HomeAssistant-Nova.iPad-executable.zip`
- 可本地解压并通过静态服务器启动，支持 PWA 与离线缓存。

### 5. 应用内手册
- 入口：右侧 `快捷操作` 区域中的 `使用手册` 按钮。
- 手册内容包含：快速开始、核心操作、数据安全。
- 手册语言与页面语言一致，通过顶部语言切换器同步切换。

---

## English Version

### 1. Product Overview
`RAVIS Fridge Assistant` is an offline-first single-page web app for fridge inventory management, designed to reduce food waste by prioritizing near-expiry items.

### 2. Core Features
- Multi-fridge management: create, edit, delete (delete allowed only when empty).
- Visual fridge zoning: each fridge can contain multiple zones (vegetables, protein, drinks, etc.).
- Item management: add, edit, move between zones, consume/discard, extend expiry.
- Item fields: name, amount, unit, added date, expiry date, status, days left, notes.
- Ingredient library: built-in classic templates + custom entries, aliases, smart suggestions, quick apply.
- Expiry-first workflow: automatic `Rescue/Critical/Expired` detection with priority queue.
- Voice input for text fields (browser speech recognition support required).
- Per-fridge color themes for quick visual differentiation.
- Locale switching: `Chinese / English / Japanese / German / French / Spanish / Italian`.
- Locale optimization: Chinese is built-in; other locales use compact JSON packs with lazy loading.
- In-app manual pages (localized with current locale).
- Printable list export: one-click layered `.txt` export (Fridge -> Zone -> Items) for printing and sharing.

### 3. Data Storage & Safety (localStorage)
The app stores data locally in browser `localStorage` with no cloud dependency by default.

Primary keys:
- `homeassistant-nova:state`: main app state (fridges, zones, items, logs, ingredient library).
- `homeassistant-nova:meta`: metadata (version, migration info, timestamps).
- `homeassistant-nova:backup-index`: backup pointer list.
- `homeassistant-nova:backup:*`: backup snapshots created before migrations.
- `homeassistant-nova:locale`: user locale preference.
- `locales/*.json`: compact non-default locale packs (requested lazily and cached).

Safety mechanism:
- On version upgrade, backup snapshot is written first, then migration runs.
- If migration fails, recent backup restore is attempted.
- Schema/version envelope reduces upgrade corruption risk.

Notes:
- Clearing site data/cache removes local data.
- Private/incognito mode is not suitable for long-term persistence.

### 4. Installation on Phones and Tablets

#### iPhone / iPad (Safari)
1. Open the app URL in Safari.
2. Tap the Share button.
3. Choose “Add to Home Screen”.
4. Launch from the home-screen icon for app-like usage.

#### Android (Chrome)
1. Open the app URL in Chrome.
2. Tap menu (⋮).
3. Choose “Add to Home screen” or “Install app”.
4. Launch from the installed icon.

#### iPad executable package (in repo)
- Folder: `iPad-executable/`
- Archive: `HomeAssistant-Nova.iPad-executable.zip`
- Can run locally via static server, with PWA + offline cache support.

### 5. In-App Manual
- Entry point: `Manual` button in the right-side `Quick Actions` panel.
- Covers: quick start, core actions, and data safety.
- Manual language follows the top locale switcher.
