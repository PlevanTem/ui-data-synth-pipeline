# Scripts 说明

## `batch_web_design_pipeline.py`

按 **web-design-pipeline** 的归档约定，从测试 JSON（或单条 `--user-text`）**批量创建 case 目录骨架**，并生成每个 case 根目录下的 **`00_RUN_WEB_DESIGN_PIPELINE.md`**（给 Cursor Agent 用的执行说明，内含技能路径、交付清单、本 case 需求）。

**输入格式**：JSON 数组，每项包含 `id`、`domain`、`user_req`、`original_example_text`（后两者至少一个）。详见 [`docs/input-format-for-batch.md`](../docs/input-format-for-batch.md)。

- **不调用大模型**：完整 PM / Designer / Frontend 仍需在 Cursor（或具备同等工具的 Agent）中执行。
- 建议配合 `--batch-no-pause`，在说明里写明连续跑完三阶段，适合批量跑批。

```bash
# 预览将创建的目录
python scripts/batch_web_design_pipeline.py \
  --inputs test_data/example_inputs_5.json \
  --out-root outputs \
  --dry-run

# 实际创建（默认今天日期；目录已存在时自动加 -run2 / -run3）
python scripts/batch_web_design_pipeline.py \
  --inputs test_data/example_inputs_5.json \
  --out-root outputs \
  --batch-no-pause

# 单条 query（无测试文件）
python scripts/batch_web_design_pipeline.py \
  --slug saas-landing-ai \
  --user-text "做一个 AI SaaS 落地页，需深色科技风与产品演示区块" \
  --out-root outputs \
  --batch-no-pause
```

生成物：

- `outputs/<case_id>@v4_YYYYMMDD/`：`01_pm/`、`02_designer/`、`03_frontend/`（空壳）、`meta.json`、`00_RUN_WEB_DESIGN_PIPELINE.md`
- `outputs/batch_manifest_YYYYMMDD.json`：本次 batch 列表

完成后可将这些 case 目录作为 **`batch_synth_causal_chains.py --cases-root`** 的输入，合成因果链数据。

### 通过 Cursor 批量调用（CLI）

Cursor 提供 **headless Agent**（非交互），可在终端里循环调用，适合批量跑每个 case 的 `00_RUN_WEB_DESIGN_PIPELINE.md`：

1. 安装并配置 [Cursor CLI](https://cursor.com/docs/cli/installation)、[Authentication](https://cursor.com/docs/cli/reference/authentication)（如设置 `CURSOR_API_KEY`）。
2. 确认终端能执行 **`agent`**（若命令名不同，可 `export CURSOR_AGENT_CMD=...`）。
3. 使用 **`agent -p --force`**：`--print` 为非交互；`--force` 允许直接改文件（批量前建议分支/备份仓库）。详见 [Headless CLI](https://cursor.com/docs/cli/headless)。

本仓库提供示例脚本（按 `batch_manifest_*.json` 顺序执行）：

```bash
chmod +x scripts/run_cursor_agent_batch.sh
# 先建壳 + manifest
python scripts/batch_web_design_pipeline.py --inputs test_data/example_inputs_5.json --out-root outputs --batch-no-pause

# 试跑 1 条
./scripts/run_cursor_agent_batch.sh outputs/batch_manifest_YYYYMMDD.json 1

# 全部顺序执行（耗时长、注意额度）
./scripts/run_cursor_agent_batch.sh outputs/batch_manifest_YYYYMMDD.json
```

**注意**：Designer 阶段若依赖 **WebSearch** 等工具，需 CLI Agent 与订阅能力支持；单条 pipeline 体量大，大批量时请做**限流、失败重试、分机器**。**IDE 里手动 Agent** 仍是最稳的兜底方式。

## `batch_synth_causal_chains.py`

在 **已有完整 case 目录** 上，调用 OpenAI 兼容 API，按 **slow-think-causal-chain** 规范合成因果链样本（JSONL）。依赖见 `requirements-batch-synth.txt`。

## `build_causal_chains_003.py`

无 API、固定独白 + 读磁盘源码，拼装 `003_smart-home` 因果链 JSON（用于对齐格式/回归）。
