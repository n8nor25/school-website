'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  GraduationCap,
  Phone,
  CheckCircle,
  TrendingUp,
  Award,
  CalendarDays,
  UserCheck,
  UserX,
  Clock,
  BarChart3,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface GradeDistribution {
  excellent: number
  veryGood: number
  good: number
  pass: number
  fail: number
}

interface ClassStat {
  className: string
  studentCount: number
  attendanceRate: number
  avgGrade: number
}

interface RecentAttendanceDay {
  date: string
  present: number
  absent: number
  late: number
}

interface TopStudent {
  id: string
  name: string
  avgScore: number
  className: string
}

interface StatisticsData {
  totalStudents: number
  totalClasses: number
  totalParents: number
  attendanceRate: number
  absentToday: number
  lateToday: number
  presentToday: number
  excuseToday: number
  averageGrades: number
  gradeDistribution: GradeDistribution
  classStats: ClassStat[]
  recentAttendance: RecentAttendanceDay[]
  topStudents: TopStudent[]
}

// ─── Animated Counter Hook ───────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0)
  const prevTarget = useRef(target)

  useEffect(() => {
    if (target === prevTarget.current && count !== 0) return
    prevTarget.current = target

    let start = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(eased * target)
      setCount(current)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return count
}

// ─── Animated Number Component ───────────────────────────────────────────────

function AnimatedNumber({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const animated = useAnimatedCounter(decimals > 0 ? Math.round(value * Math.pow(10, decimals)) : value)
  const display = decimals > 0 ? (animated / Math.pow(10, decimals)).toFixed(decimals) : animated
  return <span>{display}{suffix}</span>
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-14 w-14 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Students Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Trend Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="flex items-end gap-3 h-48">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-full rounded-t-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StatisticsTab() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/statistics')
      if (!res.ok) throw new Error('فشل في تحميل الإحصائيات')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  if (loading) return <LoadingSkeleton />

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{error || 'لا توجد بيانات'}</p>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-[#2A374E] text-white rounded-lg hover:bg-[#3a4a64] transition-colors text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  const d = data

  // ── Grade distribution helpers ──
  const gradeDistTotal =
    d.gradeDistribution.excellent +
    d.gradeDistribution.veryGood +
    d.gradeDistribution.good +
    d.gradeDistribution.pass +
    d.gradeDistribution.fail

  const gradeBars = [
    { label: 'ممتاز', range: '90-100%', count: d.gradeDistribution.excellent, color: 'bg-emerald-500', bgLight: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'جيد جداً', range: '80-89%', count: d.gradeDistribution.veryGood, color: 'bg-sky-500', bgLight: 'bg-sky-100 dark:bg-sky-900/30', textColor: 'text-sky-600 dark:text-sky-400' },
    { label: 'جيد', range: '70-79%', count: d.gradeDistribution.good, color: 'bg-amber-500', bgLight: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'مقبول', range: '60-69%', count: d.gradeDistribution.pass, color: 'bg-orange-500', bgLight: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-600 dark:text-orange-400' },
    { label: 'راسب', range: 'أقل من 60%', count: d.gradeDistribution.fail, color: 'bg-red-500', bgLight: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-600 dark:text-red-400' },
  ]

  // ── Attendance trend helpers ──
  const recentAttendanceSorted = [...d.recentAttendance].sort((a, b) => a.date.localeCompare(b.date))
  const maxAttendance = Math.max(
    ...recentAttendanceSorted.map((d) => d.present + d.absent + d.late),
    1
  )

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    return days[d.getDay()]
  }

  // ── Top student medal color ──
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900'
    if (rank === 2) return 'bg-gray-300 text-gray-700'
    if (rank === 3) return 'bg-amber-600 text-white'
    return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    if (score >= 80) return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
    if (score >= 70) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    if (score >= 60) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#2A374E] dark:text-blue-400" />
            لوحة الإحصائيات
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إحصائيات شاملة عن أداء المدرسة</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* ── 1. Top Stats Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  <AnimatedNumber value={d.totalStudents} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">طالب مسجل</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Classes */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">الفصول الدراسية</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  <AnimatedNumber value={d.totalClasses} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <GraduationCap className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">فصل نشط</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Parents */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">أولياء الأمور</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  <AnimatedNumber value={d.totalParents} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Phone className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-500 font-medium">ولي أمر</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Phone className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">نسبة الحضور</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  <AnimatedNumber value={d.attendanceRate} suffix="%" />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-500 font-medium">معدل الحضور العام</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-[#2A374E] dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">توزيع الدرجات</h3>
            </div>
            <div className="space-y-5">
              {gradeBars.map((bar) => {
                const pct = gradeDistTotal > 0 ? Math.round((bar.count / gradeDistTotal) * 100) : 0
                return (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-3 h-3 rounded-sm ${bar.color}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{bar.label}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({bar.range})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${bar.textColor}`}>{bar.count}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({pct}%)</span>
                      </div>
                    </div>
                    <div className={`w-full h-3 rounded-full ${bar.bgLight} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(pct, 0)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {gradeDistTotal === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                لا توجد بيانات درجات حتى الآن
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Statistics Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-[#2A374E] dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">إحصائيات الفصول</h3>
            </div>
            {d.classStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-300">اسم الفصل</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-300">عدد الطلاب</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-300">نسبة الحضور</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-300">متوسط الدرجات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.classStats.map((cls, idx) => (
                      <tr
                        key={cls.className}
                        className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50/50 dark:bg-gray-800/20'
                        }`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#2A374E] dark:bg-blue-400" />
                            <span className="font-medium text-gray-800 dark:text-white">{cls.className}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                            {cls.studentCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  cls.attendanceRate >= 80
                                    ? 'bg-emerald-500'
                                    : cls.attendanceRate >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${cls.attendanceRate}%` }}
                              />
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                cls.attendanceRate >= 80
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : cls.attendanceRate >= 60
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {cls.attendanceRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadgeVariant(cls.avgGrade)}`}>
                            {cls.avgGrade}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                لا توجد بيانات فصول حتى الآن
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Today's Attendance Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Present Today */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">حاضر اليوم</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={d.presentToday} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absent Today */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-red-500" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">غائب اليوم</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  <AnimatedNumber value={d.absentToday} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Late Today */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-amber-500" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">متأخر اليوم</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  <AnimatedNumber value={d.lateToday} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Top Students Table ── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-[#2A374E] dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">أفضل 10 طلاب</h3>
          </div>
          {d.topStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-gray-300 w-16">الترتيب</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-gray-300">اسم الطالب</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600 dark:text-gray-300">الفصل</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600 dark:text-gray-300 w-24">المتوسط</th>
                  </tr>
                </thead>
                <tbody>
                  {d.topStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        idx < 3 ? 'bg-gradient-to-l from-transparent' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getMedalColor(idx + 1)}`}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {idx < 3 && (
                            <Award className={`w-4 h-4 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                          )}
                          <span className="font-medium text-gray-800 dark:text-white">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {student.className}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getScoreBadgeVariant(student.avgScore)}`}>
                          {student.avgScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
              لا توجد بيانات طلاب حتى الآن
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 5. Recent Attendance Trend ── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2A374E] dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">اتجاه الحضور - آخر 7 أيام</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-gray-500 dark:text-gray-400">حاضر</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" />
                <span className="text-gray-500 dark:text-gray-400">غائب</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-gray-500 dark:text-gray-400">متأخر</span>
              </div>
            </div>
          </div>
          {recentAttendanceSorted.length > 0 ? (
            <div className="flex items-end gap-2 sm:gap-4" style={{ height: '200px' }}>
              {recentAttendanceSorted.map((day) => {
                const total = day.present + day.absent + day.late
                const presentH = total > 0 ? (day.present / maxAttendance) * 100 : 0
                const absentH = total > 0 ? (day.absent / maxAttendance) * 100 : 0
                const lateH = total > 0 ? (day.late / maxAttendance) * 100 : 0
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full">
                    {/* Tooltip-style label */}
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center whitespace-nowrap">
                      {total > 0 ? total : ''}
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-end gap-0.5">
                      {/* Present - bottom */}
                      <div
                        className="w-full bg-emerald-500 rounded-t-sm transition-all duration-700 ease-out min-h-[2px]"
                        style={{ height: `${presentH}%` }}
                        title={`حاضر: ${day.present}`}
                      />
                      {/* Late - middle */}
                      <div
                        className="w-full bg-amber-500 transition-all duration-700 ease-out min-h-[2px]"
                        style={{ height: `${lateH}%` }}
                        title={`متأخر: ${day.late}`}
                      />
                      {/* Absent - top */}
                      <div
                        className="w-full bg-red-500 rounded-b-sm transition-all duration-700 ease-out min-h-[2px]"
                        style={{ height: `${absentH}%` }}
                        title={`غائب: ${day.absent}`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{formatDate(day.date)}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(day.date + 'T00:00:00').getDate()}/{new Date(day.date + 'T00:00:00').getMonth() + 1}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
              لا توجد بيانات حضور للأيام الأخيرة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
