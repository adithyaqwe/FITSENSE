import Sidebar from './Sidebar'
import FatigueChatbot from './FatigueChatbot'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </div>
      </main>
      <FatigueChatbot />
    </div>
  )
}
