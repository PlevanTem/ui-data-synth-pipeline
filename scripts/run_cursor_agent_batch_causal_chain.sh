#!/usr/bin/env bash
# 使用 Cursor CLI 的 headless Agent，按 case 目录批量执行 slow-think-causal-chain。
#
# 前置条件：
#   1) 已安装 Cursor CLI：https://cursor.com/docs/cli/installation
#   2) 终端可用的 Cursor Agent 启动方式（默认使用 `cursor agent`）
#   3) 已设置 CURSOR_API_KEY（CI/无界面场景）或已完成本机登录
#   4) case 目录已包含 web-design-pipeline 产物（至少 meta.json / 01_pm / 02_designer / 03_frontend）
#
# 用法：
#   chmod +x scripts/run_cursor_agent_batch_causal_chain.sh
#   ./scripts/run_cursor_agent_batch_causal_chain.sh outputs
#
# 可选第二个参数：最多跑几条（用于试跑）
#   ./scripts/run_cursor_agent_batch_causal_chain.sh outputs 1
#
# 可选第三个参数：输出目录（默认 outputs/slow-think-causal-chain-data）
#   ./scripts/run_cursor_agent_batch_causal_chain.sh outputs 0 outputs/slow-think-causal-chain-data
#
# 说明：
#   - 默认遇到已存在的 <case_id>_causal_chains.json 会跳过。
#   - 如需强制覆盖，设置：FORCE_REGEN=1 ./scripts/run_cursor_agent_batch_causal_chain.sh ...
#   - 若本机启动命令不同，可 export CURSOR_AGENT_CMD="你的命令"（如 `agent` 或 `cursor agent`）

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CASES_ROOT_INPUT="${1:?请传入 case 根目录，如 outputs 或 outputs/v3-pipeline}"
LIMIT="${2:-0}"
OUT_DIR_INPUT="${3:-outputs/slow-think-causal-chain-data}"
AGENT_INVOKE="${CURSOR_AGENT_CMD:-cursor agent}"
FORCE_REGEN="${FORCE_REGEN:-0}"
SKILL_REL=".cursor/skills/slow-think-causal-chain/SKILL.md"

# 允许 CURSOR_AGENT_CMD 传入多词命令，如 "cursor agent"。
read -r -a AGENT_PARTS <<< "$AGENT_INVOKE"

if [[ ${#AGENT_PARTS[@]} -eq 0 ]] || ! command -v "${AGENT_PARTS[0]}" >/dev/null 2>&1; then
  echo "未找到 Cursor Agent 启动命令: $AGENT_INVOKE" >&2
  echo "请先安装 Cursor CLI 并确保 agent 在 PATH 中：https://cursor.com/docs/cli/installation" >&2
  exit 1
fi

if [[ -d "$CASES_ROOT_INPUT" ]]; then
  CASES_ROOT="$CASES_ROOT_INPUT"
elif [[ -d "$REPO_ROOT/$CASES_ROOT_INPUT" ]]; then
  CASES_ROOT="$REPO_ROOT/$CASES_ROOT_INPUT"
else
  echo "找不到 case 根目录: $CASES_ROOT_INPUT" >&2
  exit 1
fi

if [[ "$OUT_DIR_INPUT" = /* ]]; then
  OUT_DIR="$OUT_DIR_INPUT"
else
  OUT_DIR="$REPO_ROOT/$OUT_DIR_INPUT"
fi
mkdir -p "$OUT_DIR"

if [[ ! -f "$REPO_ROOT/$SKILL_REL" ]]; then
  echo "找不到 skill 文件: $REPO_ROOT/$SKILL_REL" >&2
  exit 1
fi

CASES=()
while IFS= read -r line; do
  [[ -n "$line" ]] && CASES+=("$line")
done < <(python3 -c "
import os, sys
from pathlib import Path

root = Path(sys.argv[1]).resolve()
limit = int(sys.argv[2]) if len(sys.argv) > 2 else 0
n = 0

for p in sorted(root.iterdir()):
    if not p.is_dir():
        continue
    # 过滤明显非 case 目录
    if p.name.startswith('.'):
        continue
    if p.name in ('slow-think-causal-chain-data', 'slow-think-causal-chain- v1'):
        continue
    has_meta = (p / 'meta.json').exists()
    has_pm = (p / '01_pm').is_dir()
    has_designer = (p / '02_designer').is_dir()
    has_frontend = (p / '03_frontend').is_dir()
    if not (has_meta or (has_pm and has_designer and has_frontend)):
        continue
    print(str(p))
    n += 1
    if limit and n >= limit:
        break
" "$CASES_ROOT" "$LIMIT")

if [[ ${#CASES[@]} -eq 0 ]]; then
  echo "未找到可执行的 case 目录（需包含 meta.json 或 01_pm/02_designer/03_frontend）。" >&2
  exit 1
fi

LOG="$REPO_ROOT/outputs/cursor_agent_batch_causal_chain_$(date +%Y%m%d_%H%M%S).log"
echo "仓库: $REPO_ROOT"
echo "Case 根目录: $CASES_ROOT"
echo "输出目录: $OUT_DIR"
echo "日志: $LOG"
echo "共 ${#CASES[@]} 条"
echo ""

for case_abs in "${CASES[@]}"; do
  case_name="$(basename "$case_abs")"
  case_id="${case_name%%@*}"
  target_json="$OUT_DIR/${case_id}_causal_chains.json"
  target_rel="${target_json#$REPO_ROOT/}"
  case_rel="${case_abs#$REPO_ROOT/}"

  if [[ "$FORCE_REGEN" != "1" && -f "$target_json" ]]; then
    echo "[SKIP] 已存在: $target_rel" | tee -a "$LOG"
    continue
  fi

  echo "========== $case_name ==========" | tee -a "$LOG"
  PROMPT="工作区为仓库根目录: $REPO_ROOT

请为以下 case 目录执行 slow-think-causal-chain 数据合成，并将结果写入指定文件。

必须首先打开并严格遵循的文件：
$REPO_ROOT/$SKILL_REL

case 目录（读取其全阶段产物）：
$case_abs

输出文件（覆盖写入）：
$target_json

要求：
1) 严格按 skill 产出单个 JSON 对象，包含 samples 与 metadata。
2) sample 数量 8-15，覆盖多种决策锚点，并满足 negative/比较/否定推理等约束。
3) 所有样本共享同一个 user prompt。
4) 只修改这一个输出文件，不改动其他项目文件。"

  if (cd "$REPO_ROOT" && "${AGENT_PARTS[@]}" -p --force "$PROMPT") 2>&1 | tee -a "$LOG"; then
    if [[ -f "$target_json" ]]; then
      echo "[OK] $case_name -> $target_rel" | tee -a "$LOG"
    else
      echo "[FAIL] $case_name (agent 成功返回但未产出目标文件)" | tee -a "$LOG"
    fi
  else
    echo "[FAIL] $case_name (见日志)" | tee -a "$LOG"
  fi
  echo "" | tee -a "$LOG"
done

echo "全部结束。日志: $LOG"
