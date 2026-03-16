import { ROOMS } from '@/store/mockData'

interface RoomTabsProps {
  activeRoomId: string
  onRoomChange: (roomId: string) => void
}

export default function RoomTabs({ activeRoomId, onRoomChange }: RoomTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {ROOMS.map((room) => {
        const isActive = room.id === activeRoomId
        return (
          <button
            key={room.id}
            onClick={() => onRoomChange(room.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 no-select ${
              isActive
                ? 'text-brand-blue'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            style={{
              background: isActive ? 'rgba(78, 158, 255, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(78, 158, 255, 0.35)' : '1px solid transparent',
            }}
          >
            {room.name}
          </button>
        )
      })}
    </div>
  )
}
