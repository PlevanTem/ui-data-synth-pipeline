import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MicrophoneSlash, PhoneSlash, MonitorPlay, Translate, Brain,
  ArrowsOut,
} from '@phosphor-icons/react';
import { useMeetingStore, useUIStore } from '@/store';
import { PARTICIPANTS, TRANSCRIPT_LINES, UPCOMING_TRANSCRIPT_LINES, SUMMARY_ITEMS } from '@/utils/mockData';
import { WaveformCanvas } from '@/generative/WaveformCanvas';
import { ParticleConverge } from '@/generative/ParticleConverge';
import type { TranscriptLine } from '@/types';

function PulseRing({ color }: { color: string }) {
  return (
    <span style={{
      position: 'absolute', inset: -3, borderRadius: '50%',
      border: `2px solid ${color}`,
      animation: 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
    }} />
  );
}

export function MeetingView() {
  const { endMeeting, language, setLanguage, setCurrentView } = useMeetingStore();
  const { addToast, setProjectionOpen } = useUIStore();

  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>(TRANSCRIPT_LINES.slice(0, 3));
  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [showParticle, setShowParticle] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const lineIdxRef = useRef(3);
  const allLines = [...TRANSCRIPT_LINES, ...UPCOMING_TRANSCRIPT_LINES];

  // Streaming transcript simulation
  useEffect(() => {
    const iv = setInterval(() => {
      if (lineIdxRef.current < allLines.length) {
        const next = allLines[lineIdxRef.current];
        setTranscriptLines((prev) => [...prev, next]);
        lineIdxRef.current++;
        const pIdx = PARTICIPANTS.findIndex((p) => p.id === next.participantId);
        if (pIdx >= 0) setSpeakingIdx(pIdx);
      }
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptLines]);

  const handleEndMeeting = () => {
    if (!confirmEnd) {
      setConfirmEnd(true);
      return;
    }
    setShowParticle(true);
    setConfirmEnd(false);
  };

  const handleParticleComplete = useCallback(() => {
    setShowParticle(false);
    endMeeting();
    addToast({ type: 'success', message: 'AI 已完成纪要整理，请查看会议纪要' });
  }, [endMeeting, addToast]);

  const speakingParticipant = PARTICIPANTS[speakingIdx];
  const isActive = speakingIdx >= 0;

  return (
    <>
      {showParticle && <ParticleConverge onComplete={handleParticleComplete} />}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Meeting header */}
        <div style={{
          padding: '12px 20px', background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {language === 'zh' ? 'Q1产品路线图评审' : 'Q1 Product Roadmap Review'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>2026年3月15日 · 已进行 28分钟</div>
          </div>
          <div style={{ flex: 1 }} />

          {/* Language toggle */}
          <div style={{
            display: 'flex', gap: 2,
            background: 'var(--color-bg-elevated)', borderRadius: 8, padding: 3,
          }}>
            {(['zh', 'en'] as const).map((lang) => (
              <button key={lang} onClick={() => setLanguage(lang)} style={{
                padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: language === lang ? 600 : 400,
                background: language === lang ? 'var(--color-bg-overlay)' : 'transparent',
                color: language === lang ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}>
                {lang === 'zh' ? '中文' : 'EN'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSummaryVisible(!summaryVisible)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: summaryVisible ? 'var(--color-accent-muted)' : 'var(--color-bg-elevated)',
              color: summaryVisible ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer',
            }}
          >
            <Brain size={15} />
            AI 摘要
          </button>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Transcript panel */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            borderRight: summaryVisible ? '1px solid var(--color-border-subtle)' : 'none',
          }}>
            {/* Waveform */}
            <div style={{ padding: '10px 20px 6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <WaveformCanvas isActive={isActive} height={36} />
              {speakingParticipant && (
                <div style={{ fontSize: 11, color: speakingParticipant.color, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: speakingParticipant.color, display: 'inline-block' }} />
                  {speakingParticipant.name} 正在发言
                </div>
              )}
            </div>

            {/* Transcript lines */}
            <div
              ref={transcriptRef}
              style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <AnimatePresence>
                {transcriptLines.map((line, i) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', gap: 12 }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: line.participantColor + '33',
                      border: `2px solid ${line.participantColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: line.participantColor,
                    }}>
                      {line.participantName.slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: line.participantColor }}>
                          {line.participantName}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{line.timestamp}</span>
                      </div>
                      <p style={{
                        fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.65,
                        background: i === transcriptLines.length - 1 ? 'var(--color-accent-muted)' : 'transparent',
                        borderRadius: 8, padding: i === transcriptLines.length - 1 ? '8px 12px' : 0,
                        border: i === transcriptLines.length - 1 ? '1px solid rgba(56,189,248,0.2)' : 'none',
                      }}>
                        {language === 'zh' ? line.text : line.textEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Summary panel */}
          <AnimatePresence>
            {summaryVisible && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ overflow: 'hidden', background: 'var(--color-bg-surface)', flexShrink: 0 }}
              >
                <div style={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Brain size={14} /> AI 实时摘要
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {SUMMARY_ITEMS.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                          padding: '8px 10px', borderRadius: 8,
                          background: item.category === 'decision' ? 'rgba(251,191,36,0.08)' :
                            item.category === 'action' ? 'rgba(56,189,248,0.08)' : 'var(--color-bg-elevated)',
                          border: `1px solid ${
                            item.category === 'decision' ? 'rgba(251,191,36,0.2)' :
                            item.category === 'action' ? 'rgba(56,189,248,0.2)' : 'var(--color-border-subtle)'
                          }`,
                        }}
                      >
                        <div style={{
                          fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4,
                          color: item.category === 'decision' ? '#fbbf24' :
                            item.category === 'action' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                        }}>
                          {item.category === 'decision' ? '决策' : item.category === 'action' ? '行动项' : '要点'}
                        </div>
                        <p style={{ fontSize: 12.5, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                          {language === 'zh' ? item.text : item.textEn}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Participants row */}
        <div style={{
          padding: '10px 20px', borderTop: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-surface)', display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginRight: 4 }}>参会者</span>
          {PARTICIPANTS.map((p, i) => (
            <div key={p.id} style={{ position: 'relative' }} title={p.name}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: p.color + '33', border: `2px solid ${p.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: p.color,
                opacity: p.isMuted ? 0.5 : 1,
              }}>
                {p.avatar}
              </div>
              {i === speakingIdx && <PulseRing color={p.color} />}
              {p.isMuted && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: 'var(--color-error)', border: '1.5px solid var(--color-bg-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MicrophoneSlash size={8} color="white" />
                </div>
              )}
            </div>
          ))}
          <div style={{ flex: 1 }} />

          {/* Controls */}
          <button
            onClick={() => setProjectionOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-default)', borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}
          >
            <MonitorPlay size={15} /> 投屏
          </button>

          {confirmEnd ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setConfirmEnd(false)} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-default)', borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>
                取消
              </button>
              <button onClick={handleEndMeeting} style={{ background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                确认结束
              </button>
            </div>
          ) : (
            <button
              onClick={handleEndMeeting}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(248,113,113,0.12)', color: 'var(--color-error)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              <PhoneSlash size={15} /> 结束会议
            </button>
          )}
        </div>
      </div>
    </>
  );
}
