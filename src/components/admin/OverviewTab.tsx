'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageIcon, Newspaper, Calendar, Video, ArrowLeft, Loader2 } from 'lucide-react'

type TabKey = 'overview' | 'slider' | 'news' | 'schedules' | 'videos' | 'settings'

interface OverviewTabProps {
  onNavigate: (tab: TabKey) => void
}

interface Stats {
  sliders: number
  news: number
  schedules: number
  videos: number
}

export default function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [stats, setStats] = useState<Stats>({ sliders: 0, news: 0, schedules: 0, videos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [slidersRes, newsRes, schedulesRes, videosRes] = await Promise.all([
          fetch('/api/slider'),
          fetch('/api/news'),
          fetch('/api/schedules'),
          fetch('/api/videos'),
        ])

        const [sliders, news, schedules, videos] = await Promise.all([
          slidersRes.json(),
          newsRes.json(),
          schedulesRes.json(),
          videosRes.json(),
        ])

        setStats({
          sliders: Array.isArray(sliders) ? sliders.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          schedules: Array.isArray(schedules) ? schedules.length : 0,
          videos: Array.isArray(videos) ? videos.length : 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'صور السلايدر',
      count: stats.sliders,
      icon: <ImageIcon className="w-7 h-7" />,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      tab: 'slider' as TabKey,
    },
    {
      label: 'الأخبار',
      count: stats.news,
      icon: <Newspaper className="w-7 h-7" />,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      tab: 'news' as TabKey,
    },
    {
      label: 'الجداول',
      count: stats.schedules,
      icon: <Calendar className="w-7 h-7" />,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      tab: 'schedules' as TabKey,
    },
    {
      label: 'الفيديوهات',
      count: stats.videos,
      icon: <Video className="w-7 h-7" />,
      color: 'from-rose-500 to-rose-600',
      bgLight: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      tab: 'videos' as TabKey,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">نظرة عامة</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">ملخص محتوى الموقع والإحصائيات</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <Card
                key={card.tab}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => onNavigate(card.tab)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{card.count}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl ${card.bgLight} flex items-center justify-center ${card.textColor}`}>
                      {card.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statCards.map((card) => (
                <Button
                  key={card.tab}
                  variant="outline"
                  className="justify-between h-12 text-right font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => onNavigate(card.tab)}
                >
                  <span>{card.label}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-[#2A374E] rounded-xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">إجمالي المحتوى</p>
                <p className="text-4xl font-bold mt-1">
                  {stats.sliders + stats.news + stats.schedules + stats.videos}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-white/80" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
