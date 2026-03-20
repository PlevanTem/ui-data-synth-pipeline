#!/usr/bin/env bash
# 使用 Cursor CLI 的 headless Agent 按 manifest 逐个跑 web-design-pipeline。
#
# 前置条件：
#   1) 已安装 Cursor CLI：https://cursor.com/docs/cli/installation
#   2) 命令行里可执行 agent（安装后按文档加入 PATH）
#   3) 已设置 CURSOR_API_KEY（CI/无界面场景）或已完成本机登录（见官方 Authentication）
#   4) 已运行 batch_web_design_pipeline.py 生成各 case 的 00_RUN_WEB_DESIGN_PIPELINE.md
#
# 用法：
#   chmod +x scripts/run_cursor_agent_batch.sh
#   ./scripts/run_cursor_agent_batch.sh outputs/batch_manifest_20260319.json
#
# 可选第二个参数：最多跑几条（用于试跑）
#   ./scripts/run_cursor_agent_batch.sh outputs/batch_manifest_20260319.json 1
#
# 说明：
#   - 每条 case 会顺序执行，耗时与费用较高；大批量建议加 sleep、限流或拆分到多台机器。
#   - --force 会不经确认写文件，请先在副本仓库或分支上试跑。
#   - 若你本机 agent 命令名不同，可 export CURSOR_AGENT_CMD=你的命令

set -u
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="${1:?请传入 manifest 路径，如 outputs/batch_manifest_20260319.json}"
LIMIT="${2:-0}"
AGENT_CMD="${CURSOR_AGENT_CMD:-agent}"

if ! command -v "$AGENT_CMD" >/dev/null 2>&1; then
  echo "未找到命令: $AGENT_CMD" >&2
  echo "请先安装 Cursor CLI 并确保 agent 在 PATH 中：https://cursor.com/docs/cli/installation" >&2
  exit 1
fi

if [[ ! -f "$REPO_ROOT/$MANIFEST" ]] && [[ ! -f "$MANIFEST" ]]; then
  echo "找不到 manifest: $MANIFEST" >&2
  exit 1
fi
MFILE="$MANIFEST"
[[ -f "$REPO_ROOT/$MANIFEST" ]] && MFILE="$REPO_ROOT/$MANIFEST"

mapfile -t PATHS < <(python3 -c "
import json, sys
limit = int(sys.argv[2]) if len(sys.argv) > 2 else 0
with open(sys.argv[1], encoding='utf-8') as f:
    rows = json.load(f)
n = 0
for r in rows:
    p = (r.get('path') or '').strip()
    if not p:
        continue
    st = r.get('status', '')
    if st in ('skipped_existing', 'dry_run'):
        continue
    print(p)
    n += 1
    if limit and n >= limit:
        break
" "$MFILE" "$LIMIT")

if [[ ${#PATHS[@]} -eq 0 ]]; then
  echo "manifest 中没有可执行的 path（需含 path，且 status 不为 skipped_existing/dry_run）。" >&2
  echo "若刚建壳，请确认 batch_web_design_pipeline.py 已写入 batch_manifest。" >&2
  exit 1
fi

LOG="$REPO_ROOT/outputs/cursor_agent_batch_$(date +%Y%m%d_%H%M%S).log"
echo "仓库: $REPO_ROOT"
echo "日志: $LOG"
echo "共 ${#PATHS[@]} 条"
echo ""

for relpath in "${PATHS[@]}"; do
  RUN="$REPO_ROOT/$relpath/00_RUN_WEB_DESIGN_PIPELINE.md"
  if [[ ! -f "$RUN" ]]; then
    echo "[SKIP] 无运行说明: $RUN" | tee -a "$LOG"
    continue
  fi
  echo "========== $relpath ==========" | tee -a "$LOG"
  PROMPT="工作区为仓库根目录: $REPO_ROOT

请完整阅读并按以下文件中的指令执行 Web Design Pipeline（PM → Designer → Frontend），所有产物写入该 case 目录下的 01_pm、02_designer、03_frontend，严格遵守文档中的技能与 output-structure 要求。

必须首先打开并遵循的文件：
$RUN"

  if (cd "$REPO_ROOT" && "$AGENT_CMD" -p --force "$PROMPT") 2>&1 | tee -a "$LOG"; then
    echo "[OK] $relpath" | tee -a "$LOG"
  else
    echo "[FAIL] $relpath (见日志)" | tee -a "$LOG"
  fi
  echo "" | tee -a "$LOG"
done

echo "全部结束。日志: $LOG"
