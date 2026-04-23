'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Phone, Mail, Plus, Search, Send, Trash2, Edit, Eye,
  MessageSquare, Bell, AlertTriangle, BookOpen, User, Users,
  Loader2, Check, X as XIcon,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Parent {
  id: string
  name: string
  phone: string
  email?: string
  relation: string
  students: { id: string; name: string; classRoom?: { name: string } }[]
  messages?: ParentMessage[]
}

interface ParentMessage {
  id: string
  parentId: string
  studentId?: string
  subject: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  parent?: { name: string; phone: string }
  student?: { name: string }
}

const messageTypes = [
  { value: 'إشعار', label: 'إشعار', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Bell className="w-4 h-4" /> },
  { value: 'تحذير', label: 'تحذير', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <AlertTriangle className="w-4 h-4" /> },
  { value: 'غياب', label: 'غياب', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <User className="w-4 h-4" /> },
  { value: 'نتائج', label: 'نتائج', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <BookOpen className="w-4 h-4" /> },
]

const relationOptions = ['أب', 'أم', 'ولي أمر', 'أخ/أخت', 'جد/جدة']

const templates = [
  { label: 'غياب الطالب', subject: 'إشعار غياب', message: 'نود إبلاغكم بأن طالبكم كان غائباً عن المدرسة اليوم. نرجو التواصل مع إدارة المدرسة لمعرفة الأسباب.' },
  { label: 'تنبيه درجات', subject: 'تنبيه بشأن الدرجات', message: 'نود إبلاغكم بنتائج طالبكم في الامتحان الأخير. نرجو المتابعة والاهتمام.' },
  { label: 'دعوة اجتماع', subject: 'دعوة لحضور اجتماع', message: 'نتشرف بدعوتكم لحضور اجتماع أولياء الأمور المقرر في المدرسة. نرجو تأكيد الحضور.' },
  { label: 'إشعار عام', subject: 'إشعار من المدرسة', message: 'نتشرف بإبلاغكم بآخر المستجدات والأخبار المدرسية.' },
]

export default function ParentCommManager() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'parents' | 'messages'>('parents')
  const [parents, setParents] = useState<Parent[]>([])
  const [messages, setMessages] = useState<ParentMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Parent form
  const [parentDialogOpen, setParentDialogOpen] = useState(false)
  const [editingParent, setEditingParent] = useState<Parent | null>(null)
  const [parentForm, setParentForm] = useState({ name: '', phone: '', email: '', relation: 'أب' })

  // Message form
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageForm, setMessageForm] = useState({
    parentId: '', studentId: '', subject: '', message: '', type: 'إشعار',
  })

  // View message
  const [viewingMessage, setViewingMessage] = useState<ParentMessage | null>(null)

  // Parent detail
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)

  const fetchParents = useCallback(async () => {
    try {
      const res = await fetch('/api/parents')
      const data = await res.json()
      setParents(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل بيانات أولياء الأمور', variant: 'destructive' })
    }
  }, [toast])

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/parent-messages')
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الرسائل', variant: 'destructive' })
    }
  }, [toast])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchParents(), fetchMessages()])
      setLoading(false)
    }
    load()
  }, [fetchParents, fetchMessages])

  // Parent CRUD
  const handleSaveParent = async () => {
    if (!parentForm.name || !parentForm.phone) {
      toast({ title: 'خطأ', description: 'الاسم والهاتف مطلوبان', variant: 'destructive' })
      return
    }
    try {
      const url = editingParent ? `/api/parents/${editingParent.id}` : '/api/parents'
      const method = editingParent ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parentForm),
      })
      if (res.ok) {
        toast({ title: editingParent ? 'تم التحديث' : 'تمت الإضافة', description: `تم ${editingParent ? 'تحديث' : 'إضافة'} ولي الأمر بنجاح` })
        setParentDialogOpen(false)
        setEditingParent(null)
        setParentForm({ name: '', phone: '', email: '', relation: 'أب' })
        fetchParents()
      }
    } catch {
      toast({ title: 'خطأ', description: 'فشل حفظ البيانات', variant: 'destructive' })
    }
  }

  const handleDeleteParent = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف ولي الأمر؟')) return
    try {
      await fetch(`/api/parents/${id}`, { method: 'DELETE' })
      toast({ title: 'تم الحذف', description: 'تم حذف ولي الأمر' })
      fetchParents()
    } catch {
      toast({ title: 'خطأ', description: 'فشل حذف ولي الأمر', variant: 'destructive' })
    }
  }

  // Message CRUD
  const handleSendMessage = async () => {
    if (!messageForm.parentId || !messageForm.subject || !messageForm.message) {
      toast({ title: 'خطأ', description: 'ولي الأمر والموضوع والرسالة مطلوبون', variant: 'destructive' })
      return
    }
    try {
      const res = await fetch('/api/parent-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageForm),
      })
      if (res.ok) {
        toast({ title: 'تم الإرسال', description: 'تم إرسال الرسالة بنجاح' })
        setMessageDialogOpen(false)
        setMessageForm({ parentId: '', studentId: '', subject: '', message: '', type: 'إشعار' })
        fetchMessages()
      }
    } catch {
      toast({ title: 'خطأ', description: 'فشل إرسال الرسالة', variant: 'destructive' })
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/parent-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      fetchMessages()
    } catch {
      // ignore
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف الرسالة؟')) return
    try {
      await fetch(`/api/parent-messages/${id}`, { method: 'DELETE' })
      toast({ title: 'تم الحذف', description: 'تم حذف الرسالة' })
      fetchMessages()
      setViewingMessage(null)
    } catch {
      toast({ title: 'خطأ', description: 'فشل حذف الرسالة', variant: 'destructive' })
    }
  }

  const applyTemplate = (template: typeof templates[0]) => {
    setMessageForm(prev => ({ ...prev, subject: template.subject, message: template.message }))
  }

  const getTypeInfo = (type: string) => messageTypes.find(t => t.value === type) || messageTypes[0]

  const filteredParents = parents.filter(p =>
    p.name.includes(searchQuery) || p.phone.includes(searchQuery)
  )

  const unreadCount = messages.filter(m => !m.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">تواصل أولياء الأمور</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة أولياء الأمور والرسائل</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'parents' && (
            <Dialog open={parentDialogOpen} onOpenChange={setParentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#2A374E] hover:bg-[#2A374E]/90 gap-2" onClick={() => { setEditingParent(null); setParentForm({ name: '', phone: '', email: '', relation: 'أب' }) }}>
                  <Plus className="w-4 h-4" /> إضافة ولي أمر
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingParent ? 'تعديل ولي الأمر' : 'إضافة ولي أمر جديد'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">الاسم *</label>
                    <Input value={parentForm.name} onChange={e => setParentForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم ولي الأمر" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">الهاتف *</label>
                    <Input value={parentForm.phone} onChange={e => setParentForm(p => ({ ...p, phone: e.target.value }))} placeholder="رقم الهاتف" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
                    <Input value={parentForm.email} onChange={e => setParentForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">صلة القرابة</label>
                    <Select value={parentForm.relation} onValueChange={v => setParentForm(p => ({ ...p, relation: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {relationOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSaveParent} className="w-full bg-[#2A374E] hover:bg-[#2A374E]/90">
                    {editingParent ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {activeTab === 'messages' && (
            <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#2A374E] hover:bg-[#2A374E]/90 gap-2" onClick={() => setMessageForm({ parentId: '', studentId: '', subject: '', message: '', type: 'إشعار' })}>
                  <Send className="w-4 h-4" /> إرسال رسالة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إرسال رسالة لولي الأمر</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">ولي الأمر *</label>
                    <Select value={messageForm.parentId} onValueChange={v => setMessageForm(p => ({ ...p, parentId: v }))}>
                      <SelectTrigger><SelectValue placeholder="اختر ولي الأمر" /></SelectTrigger>
                      <SelectContent>
                        {parents.map(p => <SelectItem key={p.id} value={p.id}>{p.name} - {p.phone}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">نوع الرسالة</label>
                    <Select value={messageForm.type} onValueChange={v => setMessageForm(p => ({ ...p, type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {messageTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">الموضوع *</label>
                    <Input value={messageForm.subject} onChange={e => setMessageForm(p => ({ ...p, subject: e.target.value }))} placeholder="موضوع الرسالة" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">نص الرسالة *</label>
                    <Textarea value={messageForm.message} onChange={e => setMessageForm(p => ({ ...p, message: e.target.value }))} placeholder="اكتب الرسالة هنا..." rows={5} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">قوالب سريعة</label>
                    <div className="flex flex-wrap gap-2">
                      {templates.map((t, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => applyTemplate(t)}>
                          {t.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} className="w-full bg-[#2A374E] hover:bg-[#2A374E]/90 gap-2">
                    <Send className="w-4 h-4" /> إرسال
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{parents.length}</p>
            <p className="text-xs text-gray-500">أولياء الأمور</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{messages.length}</p>
            <p className="text-xs text-gray-500">إجمالي الرسائل</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Bell className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{unreadCount}</p>
            <p className="text-xs text-gray-500">غير مقروءة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Send className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {messages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length}
            </p>
            <p className="text-xs text-gray-500">رسائل اليوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b pb-2">
        <Button variant={activeTab === 'parents' ? 'default' : 'ghost'} onClick={() => setActiveTab('parents')} className="gap-2">
          <Users className="w-4 h-4" /> أولياء الأمور
        </Button>
        <Button variant={activeTab === 'messages' ? 'default' : 'ghost'} onClick={() => setActiveTab('messages')} className="gap-2 relative">
          <MessageSquare className="w-4 h-4" /> الرسائل
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث..." className="pr-10" />
      </div>

      {/* Parents Tab */}
      {activeTab === 'parents' && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {selectedParent ? (
              <div className="p-6">
                <Button variant="ghost" onClick={() => setSelectedParent(null)} className="mb-4 gap-2">
                  ← العودة للقائمة
                </Button>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">معلومات ولي الأمر</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{selectedParent.name}</p>
                          <p className="text-sm text-gray-500">{selectedParent.relation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" /> {selectedParent.phone}
                      </div>
                      {selectedParent.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" /> {selectedParent.email}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingParent(selectedParent)
                        setParentForm({ name: selectedParent.name, phone: selectedParent.phone, email: selectedParent.email || '', relation: selectedParent.relation })
                        setParentDialogOpen(true)
                      }}><Edit className="w-3 h-3 ml-1" /> تعديل</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => { handleDeleteParent(selectedParent.id); setSelectedParent(null) }}><Trash2 className="w-3 h-3 ml-1" /> حذف</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">الأبناء</h3>
                    {selectedParent.students.length === 0 ? (
                      <p className="text-gray-500 text-sm">لا يوجد أبناء مسجلين</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedParent.students.map(s => (
                          <div key={s.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm dark:text-white">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.classRoom?.name || 'غير محدد'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button size="sm" className="mt-4 gap-2 bg-[#2A374E] hover:bg-[#2A374E]/90" onClick={() => {
                      setMessageForm({ parentId: selectedParent.id, studentId: '', subject: '', message: '', type: 'إشعار' })
                      setMessageDialogOpen(true)
                    }}>
                      <Send className="w-3 h-3" /> إرسال رسالة
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">#</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right hidden md:table-cell">القرابة</TableHead>
                    <TableHead className="text-right hidden md:table-cell">الأبناء</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        لا يوجد أولياء أمور
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParents.map((p, i) => (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => setSelectedParent(p)}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium dark:text-white">{p.name}</TableCell>
                        <TableCell dir="ltr" className="text-right">{p.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{p.relation}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{p.students.length} طالب</TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                              setEditingParent(p)
                              setParentForm({ name: p.name, phone: p.phone, email: p.email || '', relation: p.relation })
                              setParentDialogOpen(true)
                            }}><Edit className="w-3 h-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDeleteParent(p.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {viewingMessage ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Button variant="ghost" onClick={() => setViewingMessage(null)} className="mb-4 gap-2">← العودة</Button>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeInfo(viewingMessage.type).color}>
                      {getTypeInfo(viewingMessage.type).icon}
                      <span className="mr-1">{viewingMessage.type}</span>
                    </Badge>
                    {!viewingMessage.isRead && <Badge className="bg-amber-100 text-amber-700">جديد</Badge>}
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">{viewingMessage.subject}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>من: {viewingMessage.parent?.name || 'غير محدد'}</p>
                    <p>التاريخ: {new Date(viewingMessage.createdAt).toLocaleDateString('ar-EG')}</p>
                    {viewingMessage.student && <p>بخصوص: {viewingMessage.student.name}</p>}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{viewingMessage.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!viewingMessage.isRead && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => { handleMarkRead(viewingMessage.id); setViewingMessage(prev => prev ? { ...prev, isRead: true } : null) }}>
                        <Check className="w-3 h-3" /> تعليم كمقروء
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-red-600 gap-2" onClick={() => handleDeleteMessage(viewingMessage.id)}>
                      <Trash2 className="w-3 h-3" /> حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-8"></TableHead>
                      <TableHead className="text-right">الموضوع</TableHead>
                      <TableHead className="text-right hidden md:table-cell">ولي الأمر</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right hidden md:table-cell">التاريخ</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">لا توجد رسائل</TableCell>
                      </TableRow>
                    ) : (
                      messages.map(msg => {
                        const typeInfo = getTypeInfo(msg.type)
                        return (
                          <TableRow key={msg.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => { setViewingMessage(msg); if (!msg.isRead) handleMarkRead(msg.id) }}>
                            <TableCell>
                              {!msg.isRead && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </TableCell>
                            <TableCell className="font-medium dark:text-white">{msg.subject}</TableCell>
                            <TableCell className="hidden md:table-cell">{msg.parent?.name || '-'}</TableCell>
                            <TableCell>
                              <Badge className={typeInfo.color}>
                                {typeInfo.icon}
                                <span className="mr-1">{msg.type}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-500">
                              {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setViewingMessage(msg); if (!msg.isRead) handleMarkRead(msg.id) }}>
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDeleteMessage(msg.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
