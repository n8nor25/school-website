import { NextResponse } from 'next/server';

const conversations = new Map<string, Array<{ role: string; content: string }>>();

const SYSTEM_PROMPT = `أنت مساعد ذكي تعليمي لمدرسة الاحايوه شرق الاعدادية. دورك هو:
- مساعدة الطلاب في شرح الدروس والمواد الدراسية بطريقة مبسطة
- الإجابة على الأسئلة الأكاديمية في جميع المواد (رياضيات، علوم، لغة عربية، لغة إنجليزية، تاريخ، جغرافيا، كمبيوتر، إلخ)
- تقديم نصائح دراسية وطرق مذاكرة فعالة
- تلخيص الدروس والمواضيع المهمة
- تشجيع الطلاب وتحفيزهم على التفوق
- الرد باللغة العربية دائماً إلا إذا طلب الطالب غير ذلك
- كن ودوداً ومشجعاً واستخدم أمثلة بسيطة وقريبة من فهم الطالب
- إذا سُئلت عن شيء خارج نطاق التعليم، وجّه الطالب بلطف إلى ما يفيده دراسياً`;

export async function POST(request: Request) {
  try {
    const { sessionId, message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });
    }

    const sessionKey = sessionId || 'default';

    // Get or create conversation history
    let history = conversations.get(sessionKey);
    if (!history) {
      history = [];
      conversations.set(sessionKey, history);
    }

    // Add user message
    history.push({ role: 'user', content: message });

    // Use z-ai-web-dev-sdk
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    // Build messages array with system prompt first
    const messagesForAPI = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role as 'assistant' | 'user',
        content: m.content,
      })),
    ];

    const completion = await zai.chat.completions.create({
      messages: messagesForAPI,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من الرد. حاول مرة أخرى.';

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });

    // Keep conversation manageable (last 20 messages)
    if (history.length > 20) {
      const trimmed = history.slice(-20);
      conversations.set(sessionKey, trimmed);
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الرسالة' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      conversations.delete(sessionId);
    }
    return NextResponse.json({ success: true, message: 'تم مسح المحادثة' });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
