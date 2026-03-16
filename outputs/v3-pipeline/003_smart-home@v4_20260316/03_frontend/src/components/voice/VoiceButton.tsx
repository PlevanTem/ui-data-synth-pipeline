import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import VoiceWaveform from '@/generative/VoiceWaveform'
import type { VoiceState, VoiceResult } from '@/types'
import { useDeviceStore } from '@/store/DeviceStore'
import { useUIStore } from '@/store/UIStore'

const VOICE_COMMANDS: Record<string, () => void> = {}

const MOCK_COMMANDS = [
  { pattern: /客厅灯|打开.*灯|开灯/, intent: '打开客厅灯', action: '客厅主灯已开启' },
  { pattern: /关灯|关闭.*灯/, intent: '关闭所有灯', action: '已关闭所有灯光' },
  { pattern: /回家|回来了/, intent: '切换回家模式', action: '正在执行「回家」场景' },
  { pattern: /睡觉|睡眠|晚安/, intent: '切换睡眠模式', action: '正在执行「睡眠」场景' },
  { pattern: /离家|出门|锁门/, intent: '切换离家模式', action: '正在执行「离家」场景' },
  { pattern: /看电影|观影/, intent: '切换观影模式', action: '正在执行「观影」场景' },
  { pattern: /空调|温度/, intent: '调节空调温度', action: '客厅空调已设置为26°C' },
]

interface VoiceOverlayProps {
  onClose: () => void
}

function VoiceOverlay({ onClose }: VoiceOverlayProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('listening')
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<VoiceResult | null>(null)
  const { triggerScene } = useDeviceStore()
  const addToast = useUIStore(s => s.addToast)

  const runMockRecognition = () => {
    const sampleInputs = [
      '打开客厅灯',
      '睡觉模式',
      '我回来了',
      '离家模式',
      '调低温度',
    ]
    const input = sampleInputs[Math.floor(Math.random() * sampleInputs.length)]

    // Simulate typing
    let i = 0
    const typing = setInterval(() => {
      setTranscript(input.slice(0, i + 1))
      i++
      if (i >= input.length) clearInterval(typing)
    }, 80)

    setTimeout(() => {
      setVoiceState('processing')
    }, input.length * 80 + 400)

    setTimeout(() => {
      const matched = MOCK_COMMANDS.find(c => c.pattern.test(input))
      if (matched) {
        setResult({ transcript: input, intent: matched.intent, action: matched.action, success: true })
        setVoiceState('success')

        // Execute scene if matches
        if (/回家|回来了/.test(input)) triggerScene('home')
        else if (/睡觉|睡眠|晚安/.test(input)) triggerScene('sleep')
        else if (/离家|出门|锁门/.test(input)) triggerScene('away')
        else if (/看电影|观影/.test(input)) triggerScene('cinema')

        addToast({ type: 'success', title: matched.action })
      } else {
        setResult({ transcript: input, success: false, errorMessage: '未能理解该指令，请重试' })
        setVoiceState('error')
      }

      setTimeout(() => onClose(), 2000)
    }, input.length * 80 + 1200)
  }

  // Auto-start recognition
  useState(() => {
    const timer = setTimeout(runMockRecognition, 800)
    return () => clearTimeout(timer)
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4"
        style={{
          background: 'rgba(18, 20, 28, 0.97)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* State label */}
        <p className="text-xs font-medium text-text-secondary uppercase tracking-widest">
          {voiceState === 'listening' && '小艺在听...'}
          {voiceState === 'processing' && '正在理解指令...'}
          {voiceState === 'success' && '指令已执行'}
          {voiceState === 'error' && '识别失败'}
        </p>

        {/* Waveform canvas */}
        <VoiceWaveform state={voiceState} />

        {/* Transcript */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-base font-medium text-text-primary">"{transcript}"</p>
            {result?.intent && (
              <p className="text-sm text-text-secondary mt-1">{result.intent}</p>
            )}
          </motion.div>
        )}

        {/* Result feedback */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-2xl p-3 text-center"
            style={{
              background: result.success ? 'rgba(52, 211, 153, 0.10)' : 'rgba(255, 92, 92, 0.10)',
              border: `1px solid ${result.success ? 'rgba(52,211,153,0.25)' : 'rgba(255,92,92,0.25)'}`,
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: result.success ? '#34D399' : '#FF5C5C' }}
            >
              {result.success ? result.action : result.errorMessage}
            </p>
          </motion.div>
        )}

        <button
          onClick={onClose}
          className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
        >
          点击任意处关闭
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function VoiceButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #4E9EFF 0%, #7C3AED 100%)',
          boxShadow: '0 4px 20px rgba(78, 158, 255, 0.40)',
        }}
      >
        <Mic size={22} className="text-white" />
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: 'rgba(78, 158, 255, 0.3)', zIndex: -1 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && <VoiceOverlay onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
