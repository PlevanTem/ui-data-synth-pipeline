# 批量生成输入数据格式说明

使用 `scripts/batch_web_design_pipeline.py` 批量生成 case 目录时，输入数据应为 **JSON 数组**。

## 基本格式

```json
[
  {
    "id": 1,
    "domain": "开发者工具 (DevTools)",
    "user_req": "系统性能瓶颈",
    "original_example_text": "完整的用户需求描述..."
  },
  {
    "id": 2,
    "domain": "旅游出行 (Travel)",
    "user_req": "操作流程繁琐",
    "original_example_text": "另一个完整需求..."
  }
]
```

## 字段说明

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| **`id`** | 数字或字符串 | ✅ 推荐 | 用于生成 case 目录名前缀（格式化为三位补零）。若缺失，脚本会尝试从其他字段推断，但建议显式提供以保证命名一致。 | `1` → `001_`<br>`"10"` → `010_` |
| **`domain`** | 字符串 | ✅ 推荐 | 领域/类别，用于生成 case 目录名后缀。<br>**命名规则**：若含英文括号，优先提取括号内英文作 slug；否则从字符串中提取连续拉丁字母。<br>示例：`"开发者工具 (DevTools)"` → slug `devtools`<br>`"旅游出行 (Travel)"` → slug `travel` | `"开发者工具 (DevTools)"`<br>`"企业服务 (SaaS)"` |
| **`user_req`** | 字符串 | ⚠️ 至少需其一 | 短需求关键词/痛点描述。若 `original_example_text` 存在，此字段仅作补充；若不存在，会与 `domain` 组合成基础需求文本。 | `"系统性能瓶颈"`<br>`"操作流程繁琐"` |
| **`original_example_text`** | 字符串 | ⚠️ 至少需其一 | **完整的需求描述**（优先使用）。此字段会直接作为 Agent 的主输入，传给 PM Agent。建议包含：功能点、视觉风格、技术约束等。 | 见下方完整示例 |

**注意**：`user_req` 和 `original_example_text` 至少需提供一个；若两者都有，优先用 `original_example_text`。

## Case 目录命名规则

脚本会根据 `id` 和 `domain` 生成目录名：

```
{NNN}_{domain_slug}@v{N}_{YYYYMMDD}
```

- `{NNN}`：`id` 格式化为三位补零（如 `1` → `001`）
- `{domain_slug}`：从 `domain` 提取的英文 slug（小写、连字符分隔）
- `@v{N}`：管线版本（默认 `v4`，可通过 `--pipeline-version` 指定）
- `_{YYYYMMDD}`：生成日期（默认今天，可通过 `--date` 指定）

**示例**：
- `id: 1, domain: "开发者工具 (DevTools)"` → `001_devtools@v4_20260319`
- `id: 10, domain: "会议协作 (Meeting Collaboration)"` → `010_meeting-collaboration@v4_20260319`

## 完整示例

### 示例 1：标准格式（推荐）

```json
[
  {
    "id": 1,
    "domain": "开发者工具 (DevTools)",
    "user_req": "系统性能瓶颈",
    "original_example_text": "创建一个解决'系统性能瓶颈'痛点的开发者工具应用，包括：1) 基于 WebGL 的大数据量渲染引擎；2) 动态 SVG 图表与微交互动画；3) 语音控制与自然语言查询接口；4) 暗黑模式适配的高性能数据表格；5) 采用新拟态 (Neumorphism) 软UI风格，确保视觉一致性与用户体验。"
  },
  {
    "id": 2,
    "domain": "电商平台 (E-commerce)",
    "user_req": "移动端体验差",
    "original_example_text": "设计一个移动端优先的电商平台，支持商品浏览、购物车、结算流程。要求：1) 响应式布局，适配手机和平板；2) 流畅的页面切换动画；3) 采用液态玻璃 (Liquid Glass) 设计风格；4) 集成 3D 商品查看器；5) 支持语音搜索和语义推荐。"
  }
]
```

### 示例 2：最小格式（仅必需字段）

```json
[
  {
    "id": 1,
    "domain": "健康管理 (Health)",
    "original_example_text": "做一个健康数据追踪应用，支持心率、睡眠、运动数据可视化，采用温暖治愈的配色，支持长辈模式。"
  }
]
```

### 示例 3：无 `original_example_text`（脚本会组合）

```json
[
  {
    "id": 3,
    "domain": "教育平台 (Education)",
    "user_req": "学习路径不清晰"
  }
]
```

脚本会生成类似 `"领域：教育平台 (Education)\n核心痛点/主题：学习路径不清晰"` 的基础需求文本。

## 使用方式

### 方式 1：从 JSON 文件批量生成

```bash
# 1. 准备输入 JSON（如 test_data/my_cases.json）
# 2. 运行脚本
python scripts/batch_web_design_pipeline.py \
  --inputs test_data/my_cases.json \
  --out-root outputs \
  --batch-no-pause

# 3. 查看生成的目录和 manifest
ls outputs/
cat outputs/batch_manifest_YYYYMMDD.json
```

### 方式 2：单条 query（无需 JSON 文件）

```bash
python scripts/batch_web_design_pipeline.py \
  --slug habit-tracker \
  --user-text "做一个习惯追踪应用，移动端优先，支持每日打卡、数据统计、成就系统，采用极简风格。" \
  --out-root outputs \
  --batch-no-pause
```

## 字段提取逻辑（技术细节）

### `domain` → slug 规则

1. **优先提取括号内英文**：
   - `"开发者工具 (DevTools)"` → `devtools`
   - `"跨境电商 (E-commerce)"` → `e-commerce`
   - `"企业服务 (SaaS)"` → `saas`

2. **无括号时提取连续拉丁字母**：
   - `"Health Management"` → `health-management`
   - `"AI Tool"` → `ai-tool`

3. **纯中文等无拉丁字母时**：使用哈希值生成占位 slug（`domain-{hash}`）

### `id` → 前缀规则

- 数字：`1` → `001`，`10` → `010`，`123` → `123`
- 字符串：`"abc"` → `abc`（去除非字母数字字符，转小写）

## 常见问题

**Q: `id` 必须是连续数字吗？**  
A: 不必。可以是任意数字或字符串，但建议用连续数字便于管理。

**Q: `domain` 必须含英文括号吗？**  
A: 不必。但含括号时命名更规范（如 `001_devtools` 比 `001_开发者工具` 更清晰）。

**Q: 如果同一天同一 `id` 和 `domain` 跑两次会怎样？**  
A: 默认行为（`--on-exists suffix`）会在目录名后加 `-run2`、`-run3` 等后缀。也可用 `--on-exists skip` 跳过已存在目录，或 `--on-exists fail` 直接报错。

**Q: 生成的目录在哪里？**  
A: 默认在 `outputs/` 下（可通过 `--out-root` 指定）。每个 case 目录包含：
- `01_pm/`、`02_designer/`、`03_frontend/`（空壳）
- `meta.json`（元数据模板）
- `00_RUN_WEB_DESIGN_PIPELINE.md`（Agent 执行说明）

## 参考

- 现有示例：`test_data/example_inputs_5.json`
- 脚本源码：`scripts/batch_web_design_pipeline.py`
- 输出结构规范：`.agents/skills/web-design-pipeline/references/output-structure.md`
