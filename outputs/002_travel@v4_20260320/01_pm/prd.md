# 002_travel — Travel Quest AR PRD

## 一句话定义
这个产品帮助旅行者在一次出行准备到现场体验中，通过“任务-积分-商城-无障碍表单-AR导览”的一体化流程，减少操作繁琐，让他们能更省心地完成行程并获得沉浸式探索感。

## 推理记录
### 用户与场景分析
#### 谁在用？
- 主要用户：计划出行的年轻通勤者/学生（1-3天短途到一周轻旅行），希望快速定制行程；技术成熟度中等（能用 App/小程序，但不想经历复杂设置）；审美成熟度中等（偏好高科技、冷色、干净界面）。
- 次要用户：需要无障碍支持的旅行者（有视力/听力/行动能力需求），对表单清晰度、错误反馈与可访问性有更高要求。

#### 使用场景
- 旅行前：在地铁/咖啡店/旅途中完成行程规划与偏好设置。
- 旅行中：在景点排队/移动中查看任务进度、兑换积分奖励、用 AR 导览定位“下一站”。
- 频率与设备环境：移动端为主（手机横竖屏切换），网络可能波动；用户会希望“少点几次就完成”。

#### 用户当前痛点是什么？
- 显性痛点：任务/奖励/行程规划分散在多个模块或页面里，流程跳转多，操作步骤繁琐；换设备或回到页面后状态丢失需要重做。
- 隐性痛点：无障碍偏好难以被系统真正“落地”为可用体验（表单容易出错但反馈不清晰）；AR 导览在权限/性能/可用性上存在不确定性，用户容易在关键时刻遇到“看不到/不知道怎么用”的失败体验。

#### 用户真正想要的结果是什么？
- 不是“想要某个功能”，而是“把行程从想法变成可执行的下一步”，并在现场获得清晰路线与奖励回馈，同时保证无障碍用户的可用性与可控体验。

### 核心问题定义
一句话定义：
> 这个产品帮助旅行者在旅行前规划与旅行中探索的场景下，解决“流程繁琐、状态丢失与无障碍落地不清”的问题，让他们能更省心地完成行程并获得沉浸式 AR 导览体验。

### 实体与功能推导
#### 实体清单（Entities）
1. `User`（用户）
   - 属性：id、displayName、accessibilityProfile（无障碍偏好）、pointsBalance（积分余额）
2. `TripPlan`（行程计划）
   - 属性：tripId、destination、startDate/endDate、stops（停靠点列表）、theme（配色/风格）
3. `Task`（任务）
   - 属性：taskId、category（check-in/museum/food/ar）、title、description、progress（0-100）、state（todo/active/completed）
4. `RewardItem`（积分商城商品）
   - 属性：rewardId、name、price（points）、stock（可兑换库存/或无限）、ownedCount
5. `PointsLedgerEntry`（积分账本）
   - 属性：entryId、type（earn/spend/adjust）、amount、reason（任务/兑换）、timestamp
6. `AccessibilityProfile`（无障碍偏好）
   - 属性：reducedMotionPreference（是否减少动效）、fontScale、captionMode、contrastMode、mobilitySupport（轮椅等）
7. `ARWaypoint`（AR 导览点位）
   - 属性：waypointId、tripId、label、hintText、estimatedDistance（由算法/模拟计算）、arCategory

#### 功能点清单（Features）
以下功能同时包含显性与隐性目标。

##### 显性功能（用户主动触发）
1. 任务系统（Gamification Tasks）
   - 用户价值：点击任务卡片并完成任务，实时看到进度与积分增长。
   - 缺失影响：用户无法建立“努力->回馈”的闭环，体验显得枯燥且缺少成就感。
2. 积分商城（Points Shop）
   - 用户价值：使用积分兑换奖励，并查看库存/已拥有数量。
   - 缺失影响：积分缺少用途，失去动机；兑换流程若不清晰会造成挫败。
3. 无障碍表单系统（A11y Forms）
   - 用户价值：多步填写旅行与无障碍偏好，提交后在页面中生效（如减少动效、字幕模式）。
   - 缺失影响：无障碍用户无法获得稳定、可理解的体验；表单出错会导致流程中断。
4. AR 增强导览功能（AR Guide）
   - 用户价值：选择目的地/下一站并启动 AR 模式，在相机画面上叠加路线与点位信息。
   - 缺失影响：AR 变成“不可用噱头”，遇到权限或性能问题就会直接失败。
5. 导航切换与锚点/视图联动
   - 用户价值：在任务、商城、表单、AR之间切换不迷路。
   - 缺失影响：用户需要反复返回/重做设置。

##### 隐性功能（体验底座）
1. 加载态与空态
   - 用户价值：网络波动或数据尚未就绪时，提供骨架屏/空状态引导，避免白屏。
2. 错误恢复
   - 用户价值：模拟加载失败时提供重试；失败有解释与下一步。
3. 动效与可访问性安全
   - 用户价值：遵守 `prefers-reduced-motion`，减少动画强度；保证键盘焦点与 aria 反馈。
4. 状态持久化
   - 用户价值：刷新或返回后保留积分、任务进度、表单提交结果与 AR 选择项。
5. 响应式适配
   - 用户价值：手机端触控友好（44x44）、不水平滚动，弹层与列表可用。

#### 数据交互清单（Data Interactions）
- 用户触发：
  - 点击任务完成按钮 -> 写入：任务状态、pointsBalance、ledgerEntry
  - 兑换商品 -> 写入：ownedCount、pointsBalance、ledgerEntry
  - 多步表单提交 -> 写入：AccessibilityProfile、TripPlan（在可选范围内更新）
  - AR 开始/停止 -> 读取：权限状态、waypoints；写入：arSession状态
  - 导航切换 -> 读取：viewState并保持
- 系统触发：
  - 初始化 -> 读取 localStorage，恢复状态
  - 模拟网络请求 -> async 触发 loading/error
  - 页面状态变化 -> 实时更新 UI（points、progress、图层叠加参数）

#### 功能架构（Functional Architecture）
1. `AppShell & Navigation`
   - 负责：路由/标签页切换、统一头部与主题层
2. `Gamification Engine`
   - 负责：任务进度模型、积分计算与账本记录
3. `Points Shop`
   - 负责：商品列表、兑换校验、库存/拥有数量
4. `A11y Trip Form`
   - 负责：无障碍偏好与行程信息的多步校验、提交反馈
5. `AR Guide Module`
   - 负责：相机权限、AR overlay、waypoint选择与显示
6. `Persistence Layer`
   - 负责：localStorage读写、错误恢复、版本兼容（简化为本案）

### 非功能需求推导
- 性能感知：生成式背景与 AR 相机叠加可能较耗资源，因此需要动画上限、节流与 reduced-motion 降级。
- 视觉信任感：高科技蓝黑冷色调 + 清晰层级 + 可访问性底线，避免“广告感噱头”。
- 交互密度：旅行场景希望“快速完成一次闭环”，因此互动以按钮/卡片为主，关键反馈即时可见。
- 情绪目标：打开时冷静、专业、带探索冲动；完成任务时有轻量的成就反馈；进入 AR 时沉浸但不惊吓。

## 取舍说明
本案以“可用 + 互动完整 + 高质量视觉”为优先，不追求原生 WebXR 级别的真实空间定位。

降级/排除项（在 requirement_spec 的 X 类中体现）：
- 不做真正基于 WebXR/marker 的世界空间定位；AR 使用“相机画面 + 叠加点位层”的可用交互形态。

## 执行契约摘要
详细版见 `requirement_spec.json`：
- Must Deliver：M01~M07
- Should Deliver：S01~S03
- Excluded：X01~X02

## 设计约束
- 视觉主题：高科技蓝黑冷色调，包含细微发光与噪声纹理的科技感，但必须保护可读性。

## 技术约束
- 前端交付必须使用 TypeScript + 组件框架（React + TS 或 Next + TS 等）。
- Tailwind CSS V4 原生架构（禁止 tailwind.config.js）。

## 边界情况
- 摄像头权限拒绝：必须提供可理解的替代体验（mock overlay + 指引）。
- reduced-motion 环境：生成式背景需静态降级或降低强度。

