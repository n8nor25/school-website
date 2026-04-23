import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/statistics - Get comprehensive statistics
export async function GET() {
  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Total counts
    const [totalStudents, totalClasses, totalParents] = await Promise.all([
      db.student.count(),
      db.classRoom.count(),
      db.parent.count(),
    ])

    // Today's attendance stats
    const todayAttendance = await db.attendance.findMany({
      where: { date: today },
    })

    const presentToday = todayAttendance.filter((a) => a.status === 'حاضر').length
    const absentToday = todayAttendance.filter((a) => a.status === 'غائب').length
    const lateToday = todayAttendance.filter((a) => a.status === 'متأخر').length
    const excuseToday = todayAttendance.filter((a) => a.status === 'إذن').length

    // Attendance rate (based on today, or all-time if no records today)
    const totalAttendanceRecords = await db.attendance.count()
    const totalPresent = await db.attendance.count({
      where: { status: 'حاضر' },
    })
    const attendanceRate = totalAttendanceRecords > 0
      ? Math.round((totalPresent / totalAttendanceRecords) * 100)
      : 0

    // Grade statistics
    const allGrades = await db.grade.findMany({
      select: { score: true, maxScore: true, studentId: true },
    })

    let averageGrades = 0
    const gradeDistribution = {
      excellent: 0, // 90-100%
      veryGood: 0,  // 80-89%
      good: 0,      // 70-79%
      pass: 0,      // 60-69%
      fail: 0,      // below 60%
    }

    if (allGrades.length > 0) {
      const totalPercentage = allGrades.reduce((sum, g) => {
        return sum + (g.score / g.maxScore) * 100
      }, 0)
      averageGrades = Math.round(totalPercentage / allGrades.length)

      allGrades.forEach((g) => {
        const percentage = (g.score / g.maxScore) * 100
        if (percentage >= 90) gradeDistribution.excellent++
        else if (percentage >= 80) gradeDistribution.veryGood++
        else if (percentage >= 70) gradeDistribution.good++
        else if (percentage >= 60) gradeDistribution.pass++
        else gradeDistribution.fail++
      })
    }

    // Class statistics
    const classrooms = await db.classRoom.findMany({
      include: {
        students: {
          include: {
            attendance: true,
            grades: true,
          },
        },
      },
    })

    const classStats = classrooms.map((cls) => {
      const studentCount = cls.students.length

      // Attendance rate for this class
      const totalAttendanceForClass = cls.students.reduce(
        (sum, s) => sum + s.attendance.length,
        0
      )
      const presentForClass = cls.students.reduce(
        (sum, s) => sum + s.attendance.filter((a) => a.status === 'حاضر').length,
        0
      )
      const classAttendanceRate =
        totalAttendanceForClass > 0
          ? Math.round((presentForClass / totalAttendanceForClass) * 100)
          : 0

      // Average grade for this class
      const allClassGrades = cls.students.flatMap((s) => s.grades)
      const classAvgGrade =
        allClassGrades.length > 0
          ? Math.round(
              allClassGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
                allClassGrades.length
            )
          : 0

      return {
        className: cls.name,
        studentCount,
        attendanceRate: classAttendanceRate,
        avgGrade: classAvgGrade,
      }
    })

    // Recent attendance (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

    const recentAttendanceRecords = await db.attendance.findMany({
      where: {
        date: { gte: sevenDaysAgoStr },
      },
    })

    // Group by date
    const attendanceByDate: Record<string, { present: number; absent: number; late: number }> = {}
    recentAttendanceRecords.forEach((record) => {
      if (!attendanceByDate[record.date]) {
        attendanceByDate[record.date] = { present: 0, absent: 0, late: 0 }
      }
      if (record.status === 'حاضر') attendanceByDate[record.date].present++
      else if (record.status === 'غائب') attendanceByDate[record.date].absent++
      else if (record.status === 'متأخر') attendanceByDate[record.date].late++
    })

    const recentAttendance = Object.entries(attendanceByDate)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => b.date.localeCompare(a.date))

    // Top students (by average grade)
    const studentGrades = await db.grade.findMany({
      include: {
        student: {
          include: {
            classRoom: {
              select: { name: true },
            },
          },
        },
      },
    })

    const studentAvgMap: Record<string, { name: string; className: string; totalScore: number; totalCount: number }> = {}

    studentGrades.forEach((g) => {
      const sid = g.studentId
      if (!studentAvgMap[sid]) {
        studentAvgMap[sid] = {
          name: g.student.name,
          className: g.student.classRoom?.name || '',
          totalScore: 0,
          totalCount: 0,
        }
      }
      studentAvgMap[sid].totalScore += (g.score / g.maxScore) * 100
      studentAvgMap[sid].totalCount++
    })

    const topStudents = Object.entries(studentAvgMap)
      .map(([id, data]) => ({
        id,
        name: data.name,
        avgScore: Math.round(data.totalScore / data.totalCount),
        className: data.className,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10)

    const statistics = {
      totalStudents,
      totalClasses,
      totalParents,
      attendanceRate,
      absentToday,
      lateToday,
      presentToday,
      excuseToday,
      averageGrades,
      gradeDistribution,
      classStats,
      recentAttendance,
      topStudents,
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
