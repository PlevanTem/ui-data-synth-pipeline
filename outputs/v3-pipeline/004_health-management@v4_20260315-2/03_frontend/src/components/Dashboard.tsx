import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplets, Moon, BrainCircuit, HeartPulse, User } from 'lucide-react';
import { useElderMode } from '../context/ElderModeContext';
import { VitalCard } from './VitalCard';
import { BottomNav } from './BottomNav';
import { AIAlertBanner } from './AIAlertBanner';

export const Dashboard: React.FC = () => {
  const { isElderMode, toggleElderMode } = useElderMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeVital, setActiveVital] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  const vitals = [
    { id: 'heart', title: '实时心率', value: 72, unit: 'BPM', status: 'normal' as const, advice: '心率平稳，过去24小时未出现异常波动。建议下午进行30分钟适度有氧运动。', icon: HeartPulse },
    { id: 'sleep', title: '睡眠得分', value: 68, unit: '分', status: 'alert' as const, advice: '昨夜深度睡眠仅占15%，较前日下降。AI分析可能与睡前心率较高有关。建议睡前1小时避免使用手机，尝试温水泡脚与正念冥想。', icon: Moon },
    { id: 'oxygen', title: '血氧饱和度', value: 98, unit: '%', status: 'normal' as const, advice: '血氧水平极佳，呼吸系统运转良好。', icon: Droplets }
  ];

  const activeAdviceData = vitals.find(v => v.id === activeVital);

  return (
    <div className={`min-h-screen px-4 pb-28 pt-8 mx-auto max-w-md transition-all duration-500 ${isElderMode ? 'elder-mode-active' : ''}`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-8 sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-40 py-2 -mx-4 px-4">
        <div>
          <motion.h1 layout className={`font-bold text-[#2D3142] ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
            {activeTab === 'dashboard' ? '今日健康' : activeTab === 'ai' ? 'AI 专属指导' : activeTab === 'report' ? '健康报告' : '我的'}
          </motion.h1>
          <motion.p layout className={`text-[#747C84] mt-1 ${isElderMode ? 'text-lg' : 'text-sm'}`}>
            2026年3月15日 星期日
          </motion.p>
        </div>
        <button 
          onClick={toggleElderMode}
          className={`px-4 py-2.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 ${isElderMode ? 'bg-[#6BA292] text-white' : 'bg-white text-[#2D3142] hover:bg-[#FDFBF7]'}`}
        >
          {isElderMode ? '退出长辈模式' : '长辈模式'}
        </button>
      </header>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <AnimatePresence>
                {showAlert && (
                  <AIAlertBanner 
                    message="昨夜睡眠质量偏低（68分），AI已为您生成专属改善方案。" 
                    onClose={() => setShowAlert(false)} 
                  />
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {vitals.map(vital => (
                  <VitalCard 
                    key={vital.id}
                    title={vital.title}
                    value={vital.value}
                    unit={vital.unit}
                    status={vital.status}
                    isActive={activeVital === vital.id}
                    onClick={() => setActiveVital(vital.id === activeVital ? null : vital.id)}
                  />
                ))}
              </div>

              <AnimatePresence>
                {activeVital && activeAdviceData && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-[24px] bg-white p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${activeAdviceData.status === 'alert' ? 'bg-[#E65F5C]/10 text-[#E65F5C]' : 'bg-[#6BA292]/10 text-[#6BA292]'}`}>
                          <BrainCircuit size={24} />
                        </div>
                        <h3 className={`font-semibold text-[#2D3142] ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
                          AI 深度解读
                        </h3>
                      </div>
                      <p className={`text-[#747C84] leading-relaxed ${isElderMode ? 'text-xl' : 'text-base'}`}>
                        {activeAdviceData.advice}
                      </p>
                      <button className={`mt-5 w-full py-3 rounded-xl font-medium transition-colors ${activeAdviceData.status === 'alert' ? 'bg-[#E65F5C] text-white hover:bg-[#E65F5C]/90' : 'bg-[#FDFBF7] text-[#2D3142] border border-gray-200'}`}>
                        查看完整方案
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#6BA292]">
                {activeTab === 'ai' ? <BrainCircuit size={40} /> : activeTab === 'report' ? <Activity size={40} /> : <User size={40} />}
              </div>
              <h2 className={`font-semibold text-[#2D3142] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                {activeTab === 'ai' ? '正在生成您的健康方案...' : '模块开发中'}
              </h2>
              <p className={`mt-2 text-[#747C84] ${isElderMode ? 'text-xl' : 'text-base'}`}>
                这里将展示完整的页面流转内容。
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};