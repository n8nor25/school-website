'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ImageIcon, Newspaper, Calendar, Video, ArrowLeft, Loader2,
  Users, ClipboardCheck, FileText, MessageSquare, BarChart3,
  GraduationCap,
} from 'lucide-react'

type TabKey = 'overview' | 'statistics' | 'students' | 'attendance' | 'grades' | 'parents' | 'slider' | 'news' | 'schedules' | 'videos' | 'settings'

interface OverviewTabProps {
  onNavigate: (tab: TabKey) => void
}

interface ContentStats {
  sliders: number
  news: number
  schedules: number
  videos: number
}

interface SchoolStats {
  totalStudents: number
  totalClasses: number
  totalParents: number
  attendanceRate: number
  averageGrades: number
  unreadMessages: number
}

export default function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [contentStats, setContentStats] = useState<ContentStats>({ sliders: 0, news: 0, schedules: 0, videos: 0 })
  const [schoolStats, setSchoolStats] = useState<SchoolStats>({
    totalStudents: 0, totalClasses: 0, totalParents: 0,
    attendanceRate: 0, averageGrades: 0, unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [slidersRes, newsRes, schedulesRes, videosRes, statsRes] = await Promise.all([
          fetch('/api/slider'),
          fetch('/api/news'),
          fetch('/api/schedules'),
          fetch('/api/videos'),
          fetch('/api/statistics'),
        ])

        const [sliders, news, schedules, videos] = await Promise.all([
          slidersRes.json(),
          newsRes.json(),
          schedulesRes.json(),
          videosRes.json(),
        ])

        setContentStats({
          sliders: Array.isArray(sliders) ? sliders.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          schedules: Array.isArray(schedules) ? schedules.length : 0,
          videos: Array.isArray(videos) ? videos.length : 0,
        })

        if (statsRes.ok) {
          const stats = await statsRes.json()
          setSchoolStats({
            totalStudents: stats.totalStudents || 0,
            totalClasses: stats.totalClasses || 0,
            totalParents: stats.totalParents || 0,
            attendanceRate: stats.attendanceRate || 0,
            averageGrades: stats.averageGrades || 0,
            unreadMessages: 0,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const schoolCards = [
    {
      label: 'إجمالي الطلاب',
      count: schoolStats.totalStudents,
      icon: <Users className="w-7 h-7" />,
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      tab: 'students' as TabKey,
    },
    {
      label: 'نسبة الحضور',
      count: `${schoolStats.attendanceRate}%`,
      icon: <ClipboardCheck className="w-7 h-7" />,
      bgLight: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      tab: 'attendance' as TabKey,
    },
    {
      label: 'متوسط الدرجات',
      count: schoolStats.averageGrades ? schoolStats.averageGrades.toFixed(1) : '0',
      icon: <FileText className="w-7 h-7" />,
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      tab: 'grades' as TabKey,
    },
    {
      label: 'أولياء الأمور',
      count: schoolStats.totalParents,
      icon: <MessageSquare className="w-7 h-7" />,
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      tab: 'parents' as TabKey,
    },
  ]

  const contentCards = [
    {
      label: 'صور السلايدر',
      count: contentStats.sliders,
      icon: <ImageIcon className="w-7 h-7" />,
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      tab: 'slider' as TabKey,
    },
    {
      label: 'الأخبار',
      count: contentStats.news,
      icon: <Newspaper className="w-7 h-7" />,
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      tab: 'news' as TabKey,
    },
    {
      label: 'الجداول',
      count: contentStats.schedules,
      icon: <Calendar className="w-7 h-7" />,
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      tab: 'schedules' as TabKey,
    },
    {
      label: 'الفيديوهات',
      count: contentStats.videos,
      icon: <Video className="w-7 h-7" />,
      bgLight: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      tab: 'videos' as TabKey,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">نظرة عامة</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">ملخص إدارة المدرسة والمحتوى</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
        </div>
      ) : (
        <>
          {/* School Management Stats */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2A374E]" />
              إدارة المدرسة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {schoolCards.map((card) => (
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
          </div>

          {/* Content Management Stats */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#2A374E]" />
              إدارة المحتوى
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentCards.map((card) => (
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
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'تسجيل الحضور', tab: 'attendance' as TabKey, icon: <ClipboardCheck className="w-4 h-4" /> },
                { label: 'إضافة طالب', tab: 'students' as TabKey, icon: <Users className="w-4 h-4" /> },
                { label: 'إدخال درجات', tab: 'grades' as TabKey, icon: <FileText className="w-4 h-4" /> },
                { label: 'إرسال رسالة لولي أمر', tab: 'parents' as TabKey, icon: <MessageSquare className="w-4 h-4" /> },
                { label: 'عرض الإحصائيات', tab: 'statistics' as TabKey, icon: <BarChart3 className="w-4 h-4" /> },
                { label: 'إضافة خبر', tab: 'news' as TabKey, icon: <Newspaper className="w-4 h-4" /> },
              ].map((action) => (
                <Button
                  key={action.tab + action.label}
                  variant="outline"
                  className="justify-between h-12 text-right font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => onNavigate(action.tab)}
                >
                  <span className="flex items-center gap-2">{action.icon} {action.label}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-[#2A374E] rounded-xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">إجمالي بيانات المدرسة</p>
                <p className="text-4xl font-bold mt-1">
                  {schoolStats.totalStudents + schoolStats.totalClasses + schoolStats.totalParents + contentStats.sliders + contentStats.news + contentStats.schedules + contentStats.videos}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white/80" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
