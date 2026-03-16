import type {
  Meeting, Participant, TranscriptLine, SummaryItem,
  UpcomingMeeting, Minutes, Task, HistoryMeeting,
} from '@/types';

export const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: '陈晓明', avatar: 'CX', color: '#38bdf8', isMuted: false, isSpeaking: true },
  { id: 'p2', name: '李雅婷', avatar: 'LY', color: '#34d399', isMuted: false, isSpeaking: false },
  { id: 'p3', name: '王浩然', avatar: 'WH', color: '#a78bfa', isMuted: true, isSpeaking: false },
  { id: 'p4', name: 'David Chen', avatar: 'DC', color: '#fbbf24', isMuted: false, isSpeaking: false },
  { id: 'p5', name: '张思远', avatar: 'ZS', color: '#fb7185', isMuted: true, isSpeaking: false },
  { id: 'p6', name: '刘雨萌', avatar: 'LR', color: '#2dd4bf', isMuted: false, isSpeaking: false },
];

export const ACTIVE_MEETING: Meeting = {
  id: 'm001',
  title: '2026年Q1产品路线图评审',
  titleEn: 'Q1 2026 Product Roadmap Review',
  date: '2026-03-15',
  startTime: '14:00',
  duration: '45',
  participants: PARTICIPANTS,
  status: 'in-progress',
};

export const TRANSCRIPT_LINES: TranscriptLine[] = [
  {
    id: 't1', participantId: 'p1', participantName: '陈晓明',
    participantColor: '#38bdf8', timestamp: '14:00:12',
    text: '好的，大家都到了，我们正式开始今天的路线图评审会议。首先请李雅婷介绍一下Q1的核心目标。',
    textEn: "Alright, everyone's here. Let's officially start today's roadmap review. First, let's have Li Yating introduce the Q1 core objectives.",
  },
  {
    id: 't2', participantId: 'p2', participantName: '李雅婷',
    participantColor: '#34d399', timestamp: '14:00:35',
    text: '谢谢晓明。Q1我们主要聚焦三个方向：用户增长、产品稳定性和新功能的PMF验证。用户增长目标是DAU提升20%，稳定性目标是P0故障零容忍。',
    textEn: 'Thanks Xiaoming. In Q1 we focus on three areas: user growth, product stability, and PMF validation for new features. Growth target is 20% DAU increase, stability target is zero tolerance for P0 incidents.',
  },
  {
    id: 't3', participantId: 'p4', participantName: 'David Chen',
    participantColor: '#fbbf24', timestamp: '14:01:18',
    text: 'For the new feature roadmap, I think we need to prioritize the AI meeting assistant. The market window is very tight and competitors are moving fast.',
    textEn: 'For the new feature roadmap, I think we need to prioritize the AI meeting assistant. The market window is very tight and competitors are moving fast.',
  },
  {
    id: 't4', participantId: 'p1', participantName: '陈晓明',
    participantColor: '#38bdf8', timestamp: '14:02:05',
    text: '同意David的判断。会议AI这块，我们有鸿蒙分布式的独特优势，这个技术壁垒竞争对手短期内很难复制。',
    textEn: "Agree with David's assessment. For meeting AI, we have the unique advantage of HarmonyOS distributed capabilities - this technical moat is hard for competitors to replicate in the short term.",
  },
  {
    id: 't5', participantId: 'p2', participantName: '李雅婷',
    participantColor: '#34d399', timestamp: '14:03:22',
    text: '那我们确认一下优先级：第一优先是AI实时转写和纪要生成，第二优先是多设备协作批注，第三优先是多语言支持。大家有异议吗？',
    textEn: "So let's confirm the priorities: first is AI real-time transcription and minutes generation, second is multi-device collaborative annotation, third is multi-language support. Any objections?",
  },
  {
    id: 't6', participantId: 'p6', participantName: '刘雨萌',
    participantColor: '#2dd4bf', timestamp: '14:04:10',
    text: '补充一点，多语言支持要考虑东南亚市场，特别是越南语和泰语，这是我们下半年的出海重点。',
    textEn: 'One addition: multi-language support should consider SEA markets, especially Vietnamese and Thai - these are our key expansion targets in H2.',
  },
];

export const UPCOMING_TRANSCRIPT_LINES: TranscriptLine[] = [
  {
    id: 't7', participantId: 'p3', participantName: '王浩然',
    participantColor: '#a78bfa', timestamp: '14:04:55',
    text: '技术层面我确认一下，实时转写的延迟目标是2秒以内，纪要生成在会议结束后30秒内完成，这个指标我们团队可以承诺。',
    textEn: 'From the technical side, I can confirm: the latency target for real-time transcription is under 2 seconds, and minutes generation should complete within 30 seconds after the meeting ends. Our team can commit to these metrics.',
  },
  {
    id: 't8', participantId: 'p1', participantName: '陈晓明',
    participantColor: '#38bdf8', timestamp: '14:05:40',
    text: '好，王浩然这个承诺记录下来，作为Q1的技术交付验收指标。任务分配：李雅婷负责产品需求文档，David负责竞品分析报告，王浩然负责技术方案评审。',
    textEn: "Good, let's record Wang Haoran's commitment as the Q1 technical delivery acceptance criteria. Task assignments: Li Yating owns the product requirements doc, David owns competitor analysis, Wang Haoran owns technical architecture review.",
  },
];

export const SUMMARY_ITEMS: SummaryItem[] = [
  { id: 's1', category: 'key-point', text: 'Q1核心目标：DAU提升20%，P0故障零容忍', textEn: 'Q1 Core Goals: 20% DAU increase, zero P0 incidents' },
  { id: 's2', category: 'decision', text: 'AI会议助手优先级提升至P0，Q1必须交付', textEn: 'AI Meeting Assistant priority elevated to P0, must ship in Q1' },
  { id: 's3', category: 'key-point', text: '鸿蒙分布式能力是核心技术壁垒，需重点投入', textEn: 'HarmonyOS distributed capability is key technical moat, prioritize investment' },
  { id: 's4', category: 'decision', text: '多语言路线图增加东南亚语种（越南语、泰语）', textEn: 'Multi-language roadmap extended to include Vietnamese and Thai' },
  { id: 's5', category: 'action', text: '技术交付指标：转写延迟<2s，纪要生成<30s', textEn: 'Technical delivery metrics: transcription latency <2s, minutes generation <30s' },
];

export const MOCK_MINUTES: Minutes = {
  meetingId: 'm001',
  title: '2026年Q1产品路线图评审',
  titleEn: 'Q1 2026 Product Roadmap Review',
  date: '2026年3月15日 14:00–14:48',
  duration: '48分钟',
  participants: ['陈晓明', '李雅婷', '王浩然', 'David Chen', '张思远', '刘雨萌'],
  agendaItems: [
    {
      id: 'a1',
      title: 'Q1核心目标确认',
      titleEn: 'Q1 Core Objectives Review',
      content: '确认了Q1三个核心方向：用户增长（DAU+20%）、产品稳定性（P0零容忍）、新功能PMF验证。',
      contentEn: 'Confirmed three core Q1 directions: user growth (DAU+20%), product stability (zero P0), new feature PMF validation.',
      decisions: [
        { id: 'd1', text: 'DAU目标+20%，由增长团队负责', textEn: 'DAU target +20%, owned by growth team', importance: 'high' },
        { id: 'd2', text: 'P0故障处理响应时间不超过30分钟', textEn: 'P0 incident response time must be under 30 minutes', importance: 'high' },
      ],
    },
    {
      id: 'a2',
      title: 'AI会议功能优先级讨论',
      titleEn: 'AI Meeting Feature Priority Discussion',
      content: 'AI实时转写+纪要生成升为P0，多设备协作批注P1，多语言支持（含东南亚）P2。鸿蒙分布式能力作为核心技术壁垒重点投入。',
      contentEn: 'AI real-time transcription + minutes generation elevated to P0, multi-device collaborative annotation P1, multi-language support (including SEA) P2. HarmonyOS distributed capabilities identified as key technical moat.',
      decisions: [
        { id: 'd3', text: 'AI会议助手Q1必须上线', textEn: 'AI Meeting Assistant must launch in Q1', importance: 'high' },
        { id: 'd4', text: '多语言路线图纳入越南语和泰语', textEn: 'Vietnamese and Thai added to multi-language roadmap', importance: 'medium' },
      ],
    },
  ],
  actionItems: [
    { id: 'ai1', text: '李雅婷：整理AI会议功能完整产品需求文档，下周五前完成', textEn: 'Li Yating: Complete full PRD for AI meeting features by next Friday', assignee: '李雅婷', dueDate: '2026-03-22', synced: false },
    { id: 'ai2', text: 'David Chen：完成主要竞品（Otter.ai、飞书会议）深度分析报告', textEn: 'David Chen: Complete in-depth competitor analysis (Otter.ai, Feishu)', assignee: 'David Chen', dueDate: '2026-03-20', synced: false },
    { id: 'ai3', text: '王浩然：输出鸿蒙分布式会议方案技术评审文档', textEn: 'Wang Haoran: Deliver technical architecture review for HarmonyOS distributed meeting solution', assignee: '王浩然', dueDate: '2026-03-25', synced: false },
    { id: 'ai4', text: '刘雨萌：调研东南亚市场语言优先级，提交市场报告', textEn: 'Liu Yumeng: Research SEA market language priorities and submit market report', assignee: '刘雨萌', dueDate: '2026-03-28', synced: false },
  ],
};

export const MOCK_TASKS: Task[] = [
  {
    id: 'task1', title: '整理AI会议功能PRD', titleEn: 'Complete AI Meeting Feature PRD',
    sourceMeetingId: 'm001', sourceMeetingTitle: 'Q1产品路线图评审',
    assignee: '李雅婷', dueDate: '2026-03-22', status: 'doing',
    description: '整理AI会议助手功能的完整产品需求文档，包括实时转写、纪要生成、多设备协作等核心功能点的详细需求描述。',
    descriptionEn: 'Complete full PRD for AI meeting assistant features including real-time transcription, minutes generation, and multi-device collaboration.',
    relatedMinutesExcerpt: 'AI实时转写+纪要生成升为P0，多设备协作批注P1',
    relatedMinutesExcerptEn: 'AI real-time transcription + minutes generation elevated to P0, multi-device collaborative annotation P1',
  },
  {
    id: 'task2', title: '竞品深度分析报告', titleEn: 'Competitor Analysis Report',
    sourceMeetingId: 'm001', sourceMeetingTitle: 'Q1产品路线图评审',
    assignee: 'David Chen', dueDate: '2026-03-20', status: 'todo',
    description: '完成Otter.ai、飞书会议、Teams Copilot的深度竞品分析，重点关注AI会议功能的差异化特点。',
    descriptionEn: 'Complete in-depth analysis of Otter.ai, Feishu Meeting, and Teams Copilot, focusing on AI meeting feature differentiation.',
    relatedMinutesExcerpt: 'David负责竞品分析报告，重点分析Otter.ai和飞书会议',
    relatedMinutesExcerptEn: 'David owns competitor analysis report, focus on Otter.ai and Feishu Meeting',
  },
  {
    id: 'task3', title: '鸿蒙分布式方案技术评审', titleEn: 'HarmonyOS Distributed Solution Tech Review',
    sourceMeetingId: 'm001', sourceMeetingTitle: 'Q1产品路线图评审',
    assignee: '王浩然', dueDate: '2026-03-25', status: 'todo',
    description: '输出鸿蒙分布式会议协作方案的完整技术评审文档，包括多设备协同架构设计和关键技术验证计划。',
    descriptionEn: 'Deliver complete technical architecture review document for HarmonyOS distributed meeting collaboration, including multi-device sync architecture and key technology validation plan.',
    relatedMinutesExcerpt: '技术交付指标：转写延迟<2s，纪要生成<30s',
    relatedMinutesExcerptEn: 'Technical delivery metrics: transcription latency <2s, minutes generation <30s',
  },
  {
    id: 'task4', title: '东南亚市场语言优先级报告', titleEn: 'SEA Market Language Priority Report',
    sourceMeetingId: 'm001', sourceMeetingTitle: 'Q1产品路线图评审',
    assignee: '刘雨萌', dueDate: '2026-03-28', status: 'todo',
    description: '调研越南语、泰语等东南亚语种的市场规模和用户需求，输出语言优先级建议报告。',
    descriptionEn: 'Research market size and user needs for Vietnamese, Thai, and other SEA languages. Deliver language priority recommendation report.',
    relatedMinutesExcerpt: '多语言路线图增加东南亚语种（越南语、泰语）',
    relatedMinutesExcerptEn: 'Vietnamese and Thai added to multi-language roadmap',
  },
  {
    id: 'task5', title: '增长实验：DAU提升方案设计', titleEn: 'Growth Experiment: DAU Improvement Plan',
    sourceMeetingId: 'm000', sourceMeetingTitle: '月度增长复盘',
    assignee: '陈晓明', dueDate: '2026-03-18', status: 'done',
    description: '设计Q1增长实验方案，目标DAU提升20%，包括拉新、留存和活跃度提升的具体策略。',
    descriptionEn: 'Design Q1 growth experiment plan targeting 20% DAU increase, including acquisition, retention, and engagement improvement strategies.',
    relatedMinutesExcerpt: 'Q1用户增长目标DAU提升20%，需拟定增长实验方案',
    relatedMinutesExcerptEn: 'Q1 user growth target is 20% DAU increase, need to formulate growth experiment plan',
  },
];

export const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  { id: 'um1', title: '2026年Q1产品路线图评审', time: '今天 14:00', duration: '60分钟', participantCount: 6, avatars: ['CX', 'LY', 'WH'] },
  { id: 'um2', title: '设计评审：会议AI视觉方案', time: '今天 16:30', duration: '45分钟', participantCount: 4, avatars: ['DC', 'LR'] },
  { id: 'um3', title: '周三工程师站会', time: '明天 09:30', duration: '15分钟', participantCount: 8, avatars: ['WH', 'ZS', 'LR'] },
];

export const HISTORY_MEETINGS: HistoryMeeting[] = [
  { id: 'h1', title: '月度增长复盘 - 2月', date: '2026-03-10', duration: '72分钟', participantCount: 5, keywordsZh: ['增长', 'DAU', '留存率'], keywordsEn: ['growth', 'DAU', 'retention'] },
  { id: 'h2', title: '技术债务清理计划讨论', date: '2026-03-08', duration: '55分钟', participantCount: 4, keywordsZh: ['技术债', '重构', '性能优化'], keywordsEn: ['tech debt', 'refactoring', 'performance'] },
  { id: 'h3', title: '2025年Q4复盘总结', date: '2026-03-01', duration: '120分钟', participantCount: 12, keywordsZh: ['Q4', '复盘', 'OKR'], keywordsEn: ['Q4', 'retrospective', 'OKR'] },
  { id: 'h4', title: '用户研究：会议痛点访谈', date: '2026-02-25', duration: '90分钟', participantCount: 3, keywordsZh: ['用户研究', '痛点', '访谈'], keywordsEn: ['user research', 'pain points', 'interview'] },
];
