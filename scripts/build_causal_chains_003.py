#!/usr/bin/env python3
"""Build causal chain SFT training data for case 003_smart-home."""

import json
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "outputs", "v3-pipeline", "003_smart-home@v4_20260316")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs", "slow-think-causal-chain-data")
SRC = os.path.join(BASE, "03_frontend", "src")


def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().rstrip("\n")


USER_PROMPT = (
    "帮我做一个全屋智能中控面板。家里有十几台鸿蒙智联的设备，灯、空调、摄像头、窗帘、电视都有，"
    "想要一个统一的界面来管理。需要能按房间筛选设备，一键切换场景模式（比如回家、离家、睡眠、观影），"
    "还要有语音控制和能耗统计的功能。视觉风格要有高级感，最好是暗色系的，设备开启的时候能有发光效果，"
    "让人感觉像真的在控制灯光一样。希望手机和平板都能用。"
)

# Think monologues stored as module-level variables for clarity
THINK_01 = """\
让我想想技术栈怎么选。这个智能家居中控面板的核心挑战是设备状态管理——十几台设备，6种类型，\
每种有不同的控制参数，灯有亮度、空调有温度和模式、窗帘有开合度，还要4种场景联动批量操作多台设备。

React还是Vue？Vue的双向绑定对设备参数调节确实方便，v-model绑一个slider几乎零成本。\
但问题在于，我脑中已经有了场景触发的动画设计：设备逐个激活、每台间隔120ms的stagger效果，\
加上页面切换的退场动画——这些用Framer Motion做最顺手，而Framer Motion是React生态独有的。\
Vue那边的动画方案，transition-group够基础，但编排复杂时序动画差得远。

那Svelte呢？性能确实好，内置动画也不错。但我要用的图表库Recharts不支持Svelte，得找替代品……\
D3太底层了，ECharts太重。为了一个不确定的图表方案冒险不值得。

Next.js？这是个纯客户端原型，SSR完全用不上，引入额外的服务端概念只会增加负担，对开发效率反而是拖累。

嗯，就React + TypeScript + Vite。TypeScript特别重要——6种设备类型的控制参数各不相同，\
没有类型系统的话组件的参数传递会变成灾难。Vite提供快速HMR，原型阶段开发体验好，\
构建速度也碾压webpack。"""

THINK_02 = """\
状态管理是这个应用最需要想清楚的部分。让我梳理一下有哪些状态要管理。

首先是设备状态——16台设备，每台有开关、在线状态、类型各异的控制参数。这是最复杂的一块。\
然后是场景——4个预设场景，每个关联多台设备的目标状态，还有正在执行的场景标记和执行中的设备列表。\
最后是UI状态——当前激活的导航标签、Toast通知队列。

先想用什么方案。Redux？对于这个规模太重了。我不需要时间旅行调试、不需要中间件。\
引入Redux等于多写一堆样板代码，完全不产生价值。

那全部用Zustand？Zustand确实轻量好用。但等等，场景触发的逻辑比较复杂——\
用户点击「回家模式」，需要：先标记开始执行，然后遍历场景关联的设备，每台间隔120ms标记为执行中，\
再过300ms更新实际参数，全部完成后标记场景激活。这是一个多步骤的状态机。

用Zustand的set来写这个也不是不行，但代码会变成一堆嵌套的setTimeout里调set，可读性差。\
useReducer的dispatch模式更适合——每个步骤是一个明确的action：开始执行、设备开始变更、\
设备完成变更、场景完成。状态流转清晰可追溯。

好，那就分两层。设备核心状态用React Context + useReducer，内部用reducer管理设备和场景的所有变更。\
UI状态用Zustand，管理导航标签和Toast队列，简单直接，不需要Provider包裹。

为什么不反过来？因为设备状态的消费者很多，每个DeviceCard、SceneCard、HomePage都要读，\
useReducer的action派发让每次状态变更都有据可查。而UI状态只有两个简单值，\
Zustand的set足矣，也省去了Context嵌套一层Provider的麻烦。"""

THINK_03 = """\
这个产品的视觉方向是最需要认真对待的决策之一。用户画像很明确——中产到中高端家庭，\
已经花了不少钱买智能家居设备，他们对界面品质有期待。

先排除几个方向。白底极简？太平庸了，跟一个普通的工具App没区别，不符合「高级感」的期待。\
直接照搬华为EMUI的浅色扁平风格？视觉太保守，没有差异化价值。\
紫蓝渐变的玻璃态？嗯……这更像SaaS工具或者AI产品的风格，跟居家场景不搭。

让我想想什么风格跟「智能家居控制」的产品语义最吻合。用户在操控灯光、调节温度——\
这些动作的本质是在改变物理空间的状态。如果界面本身也能映射这种「空间变化」，那体验就对了。

暗色主题。对，暗色背景下，设备打开时发出对应的光晕——灯发暖黄光、空调发冷蓝光、安防发绿光。\
这不就是现实中「灯亮了」的数字映射吗？而且智能家居高频使用场景是晚上，暗色主题对夜间使用更友好。

深色背景不能用纯黑，那太廉价了。用带蓝灰调的近黑色，配上磨砂玻璃质感的卡片层，\
加上设备发光的光晕层，形成四层视觉深度：背景、环境动效、卡片、发光层。\
这种 Ambient Dark 的风格在国内智能家居应用中几乎没人做，是一个有差异化的设计空间。

配色上设备发光色要跟真实设备认知一致——灯是暖黄橙、空调是冷蓝、安防是绿、\
娱乐设备是紫。文字用近白蓝调，辅助信息用灰蓝。全局CSS变量管理，保证一致性。"""

THINK_04 = """\
导航结构怎么设计。先看内容层级——5个主要页面：主页概览、设备管理、场景联动、能耗统计、系统设置。

移动端是优先适配的尺寸，手机上5个页面怎么导航？底部Tab是最自然的选择。但标准底部Tab放5个icon\
会显得拥挤，而且还有一个语音按钮需要突出展示。

让我想想……语音是这个产品的特色交互，按钮应该比普通导航项更突出。\
把它做成一个悬浮的FAB放在底部导航栏中间位置，比周围的Tab图标大一圈，用渐变色背景让它跳出来。\
这样底部实际只放4个导航Tab（主页、设备、场景、能耗），设置页通过侧边栏访问就行。

等等，那平板和桌面端呢？底部Tab在大屏上就不合适了，太浪费空间。\
768px以上切换到左侧侧边栏，图标加文字，还能折叠成仅图标模式。\
侧边栏用spring动画过渡宽度变化，体验流畅。

要不要用React Router做真正的URL路由？想了想，不用。这是一个单页应用原型，\
不需要URL深链接、不需要SSR渲染。用Zustand存一个activeTab状态，\
根据它渲染不同页面组件就好。AnimatePresence包裹做页面切换的淡入淡出动画，简单又够用。\
真要上线的话以后可以再加路由，原型阶段没必要引入额外的库依赖。"""

THINK_05 = """\
用户需求里提到了「语音控制设备」，但让我想清楚这个「语音控制」到底要做到什么程度。

这是一个前端原型，不是真正的IoT产品。如果去接真实的语音识别——先不说成本，\
光是麦克风权限、音频流处理、语音转文字的延迟……这些工作量至少占项目的40%，\
而且全部是后端和基础设施层面的事情。用户要的是「展示交互体验」，不是「能真的听懂说话」。

所以语音部分全部用mock。具体来说：点击语音按钮后，弹出浮层，800ms后自动从预设的指令库里\
抽一条（比如「打开客厅灯」「睡觉模式」），然后模拟逐字打字效果，再进入「理解中」状态，\
最后给出结果。整个过程覆盖了listening、processing、success、error四个状态的视觉变化。

犹豫了一下要不要用浏览器的Web Speech API来做真实的语音识别。毕竟现代浏览器是支持的……\
但兼容性不稳定，Safari限制多，而且还需要处理权限弹窗的交互体验。\
最关键的是，就算语音识别对了，背后也没有真正的设备控制API来执行指令。\
这就变成了一个「能听懂但做不了事」的半成品，体验反而更差。

所以决定全面mock，把精力放在声纹波形的Canvas动画、四态视觉变化、逐字显示的流式感这些\
交互细节上。这才是原型要验证的东西。"""

THINK_06 = """\
另一个重要的边界决策：所有设备数据都用前端mock，不接任何真实后端。

这个决定其实一开始有点纠结。我想过用一个简单的Express服务或者json-server来模拟API，\
这样前端代码里至少有真实的fetch调用和异步处理，看起来更「完整」。

但仔细想想，引入一个后端服务带来的问题比好处多。首先，别人拿到这个项目要先启动一个服务\
才能看效果，这对原型展示来说太麻烦了。其次，网络请求引入了不确定性——延迟、超时、\
错误处理，这些会让本来流畅的交互变得卡顿，而且还需要额外处理loading状态和错误兜底。

所以所有的数据都放在一个mockData文件里——16台设备的初始状态、4个场景的配置、能耗统计数据。\
所有「控制」操作直接修改前端state，响应速度是毫秒级的，没有任何网络延迟。

这个决定的好处是让我可以把全部精力放在交互品质上。设备开关的即时反馈、场景触发的stagger动画、\
能耗图表的过渡效果——这些才是原型要验证的核心价值。如果花30%的时间去搭后端mock，\
这些体验打磨的时间就被压缩了。

只是要注意一点：mockData的数据要足够真实和丰富，才能让演示有说服力。\
所以我放了16台设备，覆盖6种类型、5个房间，每台都有合理的初始参数和功耗数据。\
能耗数据也要有日、周、月三个维度，设备排行要有真实的百分比和趋势。"""

THINK_07 = """\
这个项目的动画需求挺多的——页面切换过渡、设备卡片的hover和tap反馈、\
场景触发的stagger时序动画、抽屉的滑入滑出、Toast的弹出消失、语音浮层的出入场……\
需要一个靠谱的动画方案。

先想想纯CSS够不够。简单的hover和transition确实够用，但有两个场景CSS搞不定：一是退出动画——\
组件从DOM移除时需要一个退出过渡，CSS做不到，因为元素已经不在了；二是stagger时序控制——\
场景触发时设备依次亮起，每台间隔120ms，CSS的animation-delay只能写死，动态计算很麻烦。

那GSAP呢？GSAP是动画界的王者，timeline API做编排特别强。但GSAP是命令式的，\
需要用ref获取DOM元素，然后在useEffect里写tween……在React的声明式范式下，\
这显得格格不入，代码维护性差。而且GSAP的license对商用项目有限制。

Framer Motion就自然多了。它的API完全是声明式的——给组件加motion前缀，定义animate属性就行。\
AnimatePresence解决了退出动画的问题，layout属性处理布局变化的动画，\
whileHover和whileTap做交互反馈几乎零配置。spring物理引擎让动画有弹性质感，\
不需要手动调贝塞尔曲线。

唯一的顾虑是包体积，Framer Motion比纯CSS方案重不少。但这是一个展示型原型，\
不需要极致的包体积优化，体验流畅度比包大小重要得多。就用Framer Motion。"""

THINK_08 = """\
设计方案里要求背景有「缓慢流动的环境光」效果，模拟家居空间中光线的细微变化。这个怎么实现？

最简单的方案是CSS渐变动画——用keyframes改变background-position或者hue-rotate。\
试了试脑海中的效果……太机械了，线性的颜色循环完全没有「有机流动」的感觉。

那用Canvas 2D配合噪声函数？Simplex noise可以生成连续的、自然的随机场，\
用它驱动颜色插值就能产生那种类似「光影缓慢漂移」的效果。这是一个成熟的生成式技术方案。

等等，WebGL会不会更好？用fragment shader直接在GPU上算噪声，性能绝对够。\
但引入WebGL的复杂度太高了——shader代码调试麻烦、状态管理跟React集成不顺畅。\
为了一个背景效果引入整套WebGL pipeline，投入产出比不合理。

嗯，那Canvas 2D就行。但有一个性能问题——全屏分辨率下逐像素计算噪声会很卡。\
我的方案是降采样：用1/3分辨率计算噪声，生成一个小的ImageData，\
然后画到一个小的离屏canvas上，最后用drawImage放大到全屏。\
模糊是可以接受的，因为这本来就是柔和的背景效果，不需要锐利的边缘。

还要考虑无障碍。如果用户开启了「减少动态效果」（prefers-reduced-motion），\
就直接用静态纯色填充，不跑动画循环。组件卸载时一定要取消requestAnimationFrame，\
防止内存泄漏。颜色选了4个近黑的色值，带蓝灰和暗紫的微妙差异，\
跟整体暗色主题协调。opacity设为0.85，让效果若隐若现。"""

THINK_09 = """\
DeviceCard是这个应用最核心的UI组件。6种设备类型，每种有不同的控制方式，怎么设计这个组件？

两个方向：做6个独立组件（LightCard、ClimateCard、SecurityCard……），\
或者做一个通用DeviceCard内部按类型分支渲染。

6个独立组件的好处是每个组件逻辑清晰，没有type判断的分支。但坏处很明显——大量重复代码。\
卡片的外框样式、开关状态变化、离线标识、glow效果、点击进入详情……\
这些逻辑6个组件完全一样，维护成本翻好几倍。

所以选一个通用DeviceCard。核心思路是：共性逻辑在外层统一处理，差异化的控制元素按类型条件渲染。\
icon用一个类型到图标的映射表，颜色也是。glow效果通过CSS class映射——\
灯用暖黄光晕、空调用冷蓝、安防用绿色。这样设备开启时的发光效果自动跟设备类型绑定。

卡片内的快捷控制是差异化最大的部分。灯开启时显示亮度slider，空调开启时显示温度加减按钮。\
这些用简单的条件渲染就能处理。

犹豫了一下要不要做更复杂的控制——比如空调的模式切换按钮组。但卡片空间有限，太多控件会让卡片变得拥挤。\
把复杂控制放到详情抽屉里，卡片只保留最高频的操作。这是一个「信息密度」的权衡——\
卡片上够用就好，详情里再展开。

离线状态也要特殊处理——透明度降下来，边框改虚线，加一个小小的离线标识，操作按钮禁用。\
这样用户一眼就能分辨哪些设备不在线。执行场景时的设备用pulse闪烁表示正在变更中。"""

THINK_10 = """\
能耗统计需要图表——柱状图做设备用电排行，面积图做用电趋势，还要支持日、周、月维度切换。\
选什么图表库？

D3？功能最强大，什么图表都能做。但D3是命令式的，需要手动操作DOM，\
跟React的声明式范式冲突严重。用D3做一个简单的柱状图要写五六十行代码来处理比例尺、坐标轴、\
数据绑定……太底层了。这个项目不需要那么灵活的定制能力。

Chart.js？也是一个选择，但它基于Canvas渲染，React封装库的API不太自然，\
tooltip定制麻烦，而且跟Framer Motion的配合不好——没法用AnimatePresence做图表切换动画。

Recharts就很适合。它是专门为React设计的，API完全是声明式的——BarChart、AreaChart、\
XAxis、Tooltip都是React组件，读起来就像在写JSX布局。ResponsiveContainer自动处理响应式，\
内置的animationDuration控制入场动画时长。

自定义tooltip用了磨砂玻璃风格的小卡片，跟整体设计系统一致。柱状图的颜色按品牌色系编码，\
面积图用渐变填充。配合Framer Motion包裹图表容器，切换时段时做crossfade过渡。

唯一的不足是Recharts的高级自定义能力不如D3。但对于柱状图和面积图这种标准图表，\
Recharts的声明式写法省去了80%的代码量，这个取舍完全值得。"""

THINK_11 = """\
这个项目有两个Canvas动画同时运行——全屏的环境背景和语音浮层的波形，\
加上Framer Motion的各种过渡动画和数字滚动效果。需要想想性能策略。

最大的性能开销在环境背景的Canvas。全屏分辨率下逐像素计算simplex noise是不可能60fps的。\
解决方案是降采样——以1/3分辨率计算噪声，生成小尺寸的ImageData，\
画到离屏canvas后再放大绘制到主canvas。这样计算量降到原来的九分之一。\
视觉上因为是柔和的背景效果，放大带来的模糊反而是期望的。

语音波形的canvas小很多——固定280x100像素，24根波形条的计算量不大，不需要特殊优化。\
但要注意它只在浮层打开时运行，关闭时不应该继续跑循环。

所有requestAnimationFrame的使用都必须在组件卸载时正确清理。useEffect的cleanup函数里\
调cancelAnimationFrame，防止组件移除后动画循环还在跑。这在单页应用的页面切换场景下特别重要。

prefers-reduced-motion是一个容易忽略但重要的点。如果用户系统设置了减少动态效果，\
环境背景就不跑动画循环，直接用静态纯色。这既是无障碍需求，也节省了电量。

还有数字滚动动画useCountUp。它也用了requestAnimationFrame，600ms的ease-out曲线。\
好在每个实例只跑600ms就停了，不是持续运行的，开销可控。

考虑过用React.memo给DeviceCard做记忆化，但useReducer的dispatch本身就比较精准——\
只有相关设备的状态变了才会触发重渲染。目前16台设备的规模，React的默认协调足够高效，\
过早优化反而增加代码复杂度。"""

THINK_12 = """\
场景联动的时序动效是这个项目的体验亮点之一。用户点击「回家模式」，\
不是所有设备瞬间切换状态，而是像涟漪一样依次激活——这种「空间正在变化」的视觉叙事很重要。

怎么实现这个stagger效果？核心思路是：场景的每个关联设备间隔120ms依次处理。\
比如「回家」场景关联6台设备，那从第一台到最后一台总共经过720ms。每台设备的变化过程是：\
先标记为「执行中」（卡片闪烁），300ms后更新实际参数，然后移除执行标记。

犹豫了一下120ms这个间隔够不够。太短了设备变化会看起来像同时发生，失去stagger的意义；\
太长了整体执行时间拉得很长，用户等得不耐烦。测试了几个值——80ms太快眼睛跟不上，\
200ms又拖沓。120ms是一个微妙的平衡点，人眼能感知到是依次发生的，但整体节奏不拖沓。

状态机的设计是关键。用reducer管理整个流程：派发一个「开始执行场景」先清空所有场景的激活状态，\
然后用setTimeout按时序依次派发「设备开始变更」「设备完成变更」，\
最后一个「场景完成」标记新场景为激活态。

有一个边界情况需要处理：如果用户在场景执行过程中又点了另一个场景怎么办？\
做了一个简单的互斥——正在执行场景时忽略新的点击。更优雅的方案是取消当前执行再启动新的，\
但那需要管理一组setTimeout的清除逻辑，复杂度上去了。对于原型来说简单互斥足够了。

视觉层面，执行中的设备卡片用pulse闪烁表示「正在变更」，\
场景卡片本身用opacity脉冲动画和旋转loading图标表示「正在执行」。\
执行完成后Toast通知用户成功，场景卡片显示对勾标记。整个流程从用户点击到全部完成，\
大概1-2秒，既有叙事感又不让人等太久。"""


SAMPLES_DEF = [
    {
        "id": "sample_01",
        "focus": "tech_stack_selection",
        "think": THINK_01,
        "bridge": "基于以上分析，我选择 React + TypeScript + Vite 作为技术栈。以下是项目入口和根组件的实现：",
        "code_files": [
            ("src/App.tsx", os.path.join(SRC, "App.tsx")),
            ("src/main.tsx", os.path.join(SRC, "main.tsx")),
        ],
    },
    {
        "id": "sample_02",
        "focus": "state_management",
        "think": THINK_02,
        "bridge": "最终方案：设备层用 Context + useReducer，UI 层用 Zustand。以下是状态管理的完整实现：",
        "code_files": [
            ("src/store/DeviceStore.tsx", os.path.join(SRC, "store", "DeviceStore.tsx")),
            ("src/store/UIStore.ts", os.path.join(SRC, "store", "UIStore.ts")),
            ("src/types/index.ts", os.path.join(SRC, "types", "index.ts")),
        ],
    },
    {
        "id": "sample_03",
        "focus": "visual_direction",
        "think": THINK_03,
        "bridge": "最终选择「Ambient Dark Control」暗色氛围控制风格。以下是全局样式和环境背景的实现：",
        "code_files": [
            ("src/styles/globals.css", os.path.join(SRC, "styles", "globals.css")),
            ("src/generative/AmbientBackground.tsx", os.path.join(SRC, "generative", "AmbientBackground.tsx")),
        ],
    },
    {
        "id": "sample_04",
        "focus": "layout_navigation",
        "think": THINK_04,
        "bridge": "最终方案：移动端底部Tab + 语音FAB居中，桌面端左侧可折叠侧边栏。以下是布局和导航组件：",
        "code_files": [
            ("src/components/layout/AppLayout.tsx", os.path.join(SRC, "components", "layout", "AppLayout.tsx")),
            ("src/components/layout/Navigation.tsx", os.path.join(SRC, "components", "layout", "Navigation.tsx")),
        ],
    },
    {
        "id": "sample_05",
        "focus": "feature_boundary_voice_mock",
        "think": THINK_05,
        "bridge": "语音功能全部使用前端模拟。以下是语音按钮、浮层交互和 Canvas 波形动画的实现：",
        "code_files": [
            ("src/components/voice/VoiceButton.tsx", os.path.join(SRC, "components", "voice", "VoiceButton.tsx")),
            ("src/generative/VoiceWaveform.tsx", os.path.join(SRC, "generative", "VoiceWaveform.tsx")),
        ],
    },
    {
        "id": "sample_06",
        "focus": "feature_boundary_data_mock",
        "think": THINK_06,
        "bridge": "所有数据通过前端 mock 实现。以下是完整的模拟数据和使用这些数据的设备管理页面：",
        "code_files": [
            ("src/store/mockData.ts", os.path.join(SRC, "store", "mockData.ts")),
            ("src/pages/DevicesPage.tsx", os.path.join(SRC, "pages", "DevicesPage.tsx")),
        ],
    },
    {
        "id": "sample_07",
        "focus": "animation_library_choice",
        "think": THINK_07,
        "bridge": "选择 Framer Motion 作为动画引擎。以下是场景触发动效和设备详情抽屉的动画实现：",
        "code_files": [
            ("src/components/scene/SceneCard.tsx", os.path.join(SRC, "components", "scene", "SceneCard.tsx")),
            ("src/components/device/DeviceDetailDrawer.tsx", os.path.join(SRC, "components", "device", "DeviceDetailDrawer.tsx")),
        ],
    },
    {
        "id": "sample_08",
        "focus": "generative_ambient_background",
        "think": THINK_08,
        "bridge": "使用 Canvas 2D + Simplex Noise 实现环境流动背景。以下是完整组件：",
        "code_files": [
            ("src/generative/AmbientBackground.tsx", os.path.join(SRC, "generative", "AmbientBackground.tsx")),
        ],
    },
    {
        "id": "sample_09",
        "focus": "device_card_multi_variant",
        "think": THINK_09,
        "bridge": "采用单一 DeviceCard 组件 + 类型驱动渲染的方案。以下是设备卡片和类型定义的实现：",
        "code_files": [
            ("src/components/device/DeviceCard.tsx", os.path.join(SRC, "components", "device", "DeviceCard.tsx")),
            ("src/types/index.ts", os.path.join(SRC, "types", "index.ts")),
        ],
    },
    {
        "id": "sample_10",
        "focus": "chart_library_choice",
        "think": THINK_10,
        "bridge": "选择 Recharts 作为图表库。以下是能耗统计面板的完整实现：",
        "code_files": [
            ("src/components/energy/EnergyPanel.tsx", os.path.join(SRC, "components", "energy", "EnergyPanel.tsx")),
        ],
    },
    {
        "id": "sample_11",
        "focus": "performance_strategy",
        "think": THINK_11,
        "bridge": "性能策略核心：Canvas 降采样 + RAF 生命周期管理 + 减少动态效果降级。以下是相关实现：",
        "code_files": [
            ("src/generative/AmbientBackground.tsx", os.path.join(SRC, "generative", "AmbientBackground.tsx")),
            ("src/generative/VoiceWaveform.tsx", os.path.join(SRC, "generative", "VoiceWaveform.tsx")),
            ("src/hooks/useCountUp.ts", os.path.join(SRC, "hooks", "useCountUp.ts")),
        ],
    },
    {
        "id": "sample_12",
        "focus": "scene_stagger_orchestration",
        "think": THINK_12,
        "bridge": "场景联动通过 reducer 状态机 + setTimeout 时序控制实现。以下是核心状态管理和场景卡片组件：",
        "code_files": [
            ("src/store/DeviceStore.tsx", os.path.join(SRC, "store", "DeviceStore.tsx")),
            ("src/components/scene/SceneCard.tsx", os.path.join(SRC, "components", "scene", "SceneCard.tsx")),
        ],
    },
]

STAGE_FILES_USED = [
    "meta.json",
    "01_pm/prd.md",
    "01_pm/requirement_spec.json",
    "01_pm/ia_structure.json",
    "02_designer/design_brief.md",
    "02_designer/design_system.json",
    "02_designer/visual_effects.json",
    "02_designer/component_specs.json",
    "02_designer/style_research.md",
    "03_frontend/tech_decision.json",
    "03_frontend/package.json",
    "03_frontend/src/App.tsx",
    "03_frontend/src/main.tsx",
    "03_frontend/src/types/index.ts",
    "03_frontend/src/styles/globals.css",
    "03_frontend/src/components/layout/AppLayout.tsx",
    "03_frontend/src/components/layout/Navigation.tsx",
    "03_frontend/src/components/device/DeviceCard.tsx",
    "03_frontend/src/components/device/DeviceDetailDrawer.tsx",
    "03_frontend/src/components/scene/SceneCard.tsx",
    "03_frontend/src/components/voice/VoiceButton.tsx",
    "03_frontend/src/components/energy/EnergyPanel.tsx",
    "03_frontend/src/components/ui/RoomTabs.tsx",
    "03_frontend/src/components/ui/StatCard.tsx",
    "03_frontend/src/components/ui/Toast.tsx",
    "03_frontend/src/generative/AmbientBackground.tsx",
    "03_frontend/src/generative/VoiceWaveform.tsx",
    "03_frontend/src/pages/HomePage.tsx",
    "03_frontend/src/pages/DevicesPage.tsx",
    "03_frontend/src/pages/ScenesPage.tsx",
    "03_frontend/src/pages/EnergyPage.tsx",
    "03_frontend/src/pages/SettingsPage.tsx",
    "03_frontend/src/store/DeviceStore.tsx",
    "03_frontend/src/store/UIStore.ts",
    "03_frontend/src/store/mockData.ts",
    "03_frontend/src/hooks/useMediaQuery.ts",
    "03_frontend/src/hooks/useCountUp.ts",
]


def build_assistant_content(sample_def: dict) -> str:
    parts = ["<think>\n" + sample_def["think"] + "\n</think>"]
    parts.append("")
    parts.append(sample_def["bridge"])
    parts.append("")

    for label, filepath in sample_def["code_files"]:
        code = read_file(filepath)
        ext = "css" if label.endswith(".css") else "tsx" if label.endswith(".tsx") else "ts"
        parts.append("```" + ext + "\n// " + label + "\n" + code + "\n```")
        parts.append("")

    return "\n".join(parts).rstrip("\n")


def main():
    samples = []
    for sd in SAMPLES_DEF:
        assistant_content = build_assistant_content(sd)
        samples.append({
            "id": sd["id"],
            "focus": sd["focus"],
            "conversations": [
                {"role": "user", "content": USER_PROMPT},
                {"role": "assistant", "content": assistant_content},
            ],
        })

    output = {
        "case_id": "003_smart-home",
        "domain": "智能家居 (Smart Home)",
        "pipeline_version": "v4",
        "samples": samples,
        "metadata": {
            "source_case": "outputs/v3-pipeline/003_smart-home@v4_20260316",
            "synth_method": "causal-chain-v2",
            "total_samples": len(samples),
            "stage_files_used": STAGE_FILES_USED,
        },
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, "003_smart-home_causal_chains.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Written {len(samples)} samples to {out_path}")

    # Quality checks
    print("\n== Quality Checks ==")
    print(f"[{'OK' if 10 <= len(samples) <= 12 else 'FAIL'}] Sample count: {len(samples)} (need 10-12)")

    focuses = [s["focus"] for s in samples]
    cat_checks = {
        "tech_stack": any("tech_stack" in f for f in focuses),
        "state_management": any("state_management" in f for f in focuses),
        "visual": any("visual" in f for f in focuses),
        "layout/nav": any("layout" in f or "navigation" in f for f in focuses),
        "feature_boundary": sum(1 for f in focuses if "boundary" in f or "mock" in f),
    }
    covered = sum(1 for k, v in cat_checks.items() if k != "feature_boundary" and v) + (1 if cat_checks["feature_boundary"] else 0)
    print(f"[{'OK' if covered >= 5 else 'FAIL'}] Category coverage: {covered} categories")
    neg = cat_checks["feature_boundary"]
    print(f"[{'OK' if neg >= 2 else 'FAIL'}] Negative samples: {neg} (need >= 2)")

    for s in samples:
        content = s["conversations"][1]["content"]
        t0 = content.index("<think>") + 7
        t1 = content.index("</think>")
        think = content[t0:t1]
        cc = len(think)
        has_h = any(ln.strip().startswith("#") for ln in think.split("\n"))
        print(f"  {s['id']} ({s['focus']}): {cc} chars {'HEADINGS!' if has_h else 'ok'}")

    user_set = set(s["conversations"][0]["content"] for s in samples)
    print(f"[{'OK' if len(user_set) == 1 else 'FAIL'}] User prompt consistency: {len(user_set)} unique")


if __name__ == "__main__":
    main()
