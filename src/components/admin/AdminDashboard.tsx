'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  ImageIcon,
  Newspaper,
  Calendar,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react'
import OverviewTab from './OverviewTab'
import SliderManager from './SliderManager'
import NewsManager from './NewsManager'
import ScheduleManager from './ScheduleManager'
import VideoManager from './VideoManager'

interface AdminDashboardProps {
  admin: { id: string; name: string; username: string }
  onLogout: () => void
}

type TabKey = 'overview' | 'slider' | 'news' | 'schedules' | 'videos' | 'settings'

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'slider', label: 'إدارة السلايدر', icon: <ImageIcon className="w-5 h-5" /> },
  { key: 'news', label: 'إدارة الأخبار', icon: <Newspaper className="w-5 h-5" /> },
  { key: 'schedules', label: 'إدارة الجداول', icon: <Calendar className="w-5 h-5" /> },
  { key: 'videos', label: 'إدارة الفيديوهات', icon: <Video className="w-5 h-5" /> },
  { key: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
]

export default function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onNavigate={setActiveTab} />
      case 'slider':
        return <SliderManager />
      case 'news':
        return <NewsManager />
      case 'schedules':
        return <ScheduleManager />
      case 'videos':
        return <VideoManager />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Top Bar */}
      <header className="bg-[#2A374E] text-white sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              <span className="font-bold text-lg hidden sm:inline">لوحة الإدارة</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80 hidden sm:inline">
              مرحباً، <span className="font-medium text-white">{admin.name}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-white/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-[#2A374E] text-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute right-0 top-0 h-full w-72 bg-[#2A374E] text-white shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-bold">القائمة</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Mobile Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t shadow-lg">
          <div className="flex justify-around items-center h-16 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#2A374E] dark:text-blue-400'
                    : 'text-gray-400'
                }`}
              >
                {tab.icon}
                <span className="truncate max-w-[60px]">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// Simple settings tab
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border text-center">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">صفحة الإعدادات قيد التطوير</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">سيتم إضافة المزيد من الخيارات قريباً</p>
      </div>
    </div>
  )
}
