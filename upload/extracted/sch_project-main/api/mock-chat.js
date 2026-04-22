// Mock Chat API for Smart Assistant
// This is a simplified version that works without a backend server

// Mock AI responses for demonstration
const getMockAIResponse = (message, subject = 'عام') => {
  // Add some randomness to make responses feel more natural
  const randomDelay = Math.random() * 1000;
  const responses = {
    'شرح': {
      reply: `أهلاً! سأقوم بشرح الموضوع لك بطريقة مبسطة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nيمكنك طرح سؤال محدد وسأقوم بشرحه لك خطوة بخطوة.`,
      videoLinks: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=example1'
      ]
    },
    'تلخيص': {
      reply: `سأقوم بتلخيص الموضوع لك في نقاط واضحة ومفهومة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nيرجى تحديد الموضوع الذي تريد تلخيصه.`,
      videoLinks: []
    },
    'مساعدة': {
      reply: `أنا هنا لمساعدتك في دراستك! يمكنني:\n• شرح الدروس\n• تلخيص المواد\n• اقتراح فيديوهات تعليمية\n• الإجابة على الأسئلة\n\nما الذي تحتاج مساعدة فيه؟`,
      videoLinks: []
    },
    'مرحبا': {
      reply: `مرحباً! أنا المساعد الذكي لأكاديمية الشرق. كيف يمكنني مساعدتك في دراستك اليوم؟`,
      videoLinks: []
    },
    'رياضيات': {
      reply: `أهلاً! سأساعدك في الرياضيات. يمكنني شرح:\n• الجبر والمعادلات\n• الهندسة\n• الإحصاء والاحتمالات\n• التفاضل والتكامل\n\nما هو الموضوع الذي تريد شرحه؟`,
      videoLinks: [
        'https://www.youtube.com/watch?v=math1',
        'https://www.youtube.com/watch?v=math2'
      ]
    },
    'علوم': {
      reply: `أهلاً! سأساعدك في العلوم. يمكنني شرح:\n• الفيزياء\n• الكيمياء\n• الأحياء\n• علوم الأرض\n\nما هو الموضوع الذي تريد شرحه؟`,
      videoLinks: [
        'https://www.youtube.com/watch?v=science1',
        'https://www.youtube.com/watch?v=science2'
      ]
    },
    'عربي': {
      reply: `أهلاً! سأساعدك في اللغة العربية. يمكنني شرح:\n• النحو والصرف\n• الأدب والشعر\n• البلاغة\n• الكتابة والتعبير\n\nما هو الموضوع الذي تريد شرحه؟`,
      videoLinks: [
        'https://www.youtube.com/watch?v=arabic1'
      ]
    },
    'انجليزي': {
      reply: `Hello! I can help you with English. I can explain:\n• Grammar rules\n• Vocabulary\n• Conversation\n• Writing skills\n\nWhat topic would you like help with?`,
      videoLinks: [
        'https://www.youtube.com/watch?v=english1'
      ]
    },
    'شكرا': {
      reply: `العفو! أنا سعيد لمساعدتك. إذا كان لديك أي أسئلة أخرى، فلا تتردد في سؤالي. أنا هنا لمساعدتك في دراستك! 😊`,
      videoLinks: []
    },
    'كيف': {
      reply: `سأساعدك في فهم كيفية حل هذه المشكلة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nيرجى توضيح السؤال أكثر حتى أتمكن من مساعدتك بشكل أفضل.`,
      videoLinks: []
    },
    'متى': {
      reply: `سأساعدك في معرفة التوقيت المناسب. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nهل تقصد موعد الامتحان أم موعد المراجعة أم شيء آخر؟`,
      videoLinks: []
    },
    'أين': {
      reply: `سأساعدك في العثور على المعلومة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nهل تقصد مكان المعلومة في الكتاب أم في الإنترنت أم في مكان آخر؟`,
      videoLinks: []
    },
    'لماذا': {
      reply: `سأساعدك في فهم السبب. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nهذا سؤال ممتاز! يرجى توضيح السؤال أكثر حتى أتمكن من شرح السبب بشكل واضح.`,
      videoLinks: []
    },
    'default': {
      reply: `شكراً لسؤالك! ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nأنا المساعد الذكي لأكاديمية الشرق. يمكنني مساعدتك في:\n• شرح الدروس بطريقة مبسطة\n• تلخيص المواد في نقاط واضحة\n• اقتراح فيديوهات تعليمية مفيدة\n• الإجابة على الأسئلة الأكاديمية\n• تقديم نصائح دراسية\n\nما الذي تريد المساعدة فيه؟`,
      videoLinks: [
        'https://www.youtube.com/watch?v=example2',
        'https://www.youtube.com/watch?v=example3'
      ]
    }
  };

  // Simple keyword matching for demo
  const lowerMessage = message.toLowerCase();
  
  // Check for greeting
  if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello') || lowerMessage.includes('أهلا') || lowerMessage.includes('السلام')) {
    return responses['مرحبا'];
  }
  // Check for thanks
  else if (lowerMessage.includes('شكرا') || lowerMessage.includes('شكراً') || lowerMessage.includes('thanks')) {
    return responses['شكرا'];
  }
  // Check for explanation requests
  else if (lowerMessage.includes('شرح') || lowerMessage.includes('explain') || lowerMessage.includes('وضح')) {
    return responses['شرح'];
  }
  // Check for summary requests
  else if (lowerMessage.includes('تلخيص') || lowerMessage.includes('summary') || lowerMessage.includes('ملخص')) {
    return responses['تلخيص'];
  }
  // Check for help requests
  else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help') || lowerMessage.includes('ساعد')) {
    return responses['مساعدة'];
  }
  // Check for how questions
  else if (lowerMessage.includes('كيف') || lowerMessage.includes('how')) {
    return responses['كيف'];
  }
  // Check for when questions
  else if (lowerMessage.includes('متى') || lowerMessage.includes('when')) {
    return responses['متى'];
  }
  // Check for where questions
  else if (lowerMessage.includes('أين') || lowerMessage.includes('where')) {
    return responses['أين'];
  }
  // Check for why questions
  else if (lowerMessage.includes('لماذا') || lowerMessage.includes('why')) {
    return responses['لماذا'];
  }
  // Check for subject-specific keywords
  else if (lowerMessage.includes('رياضيات') || lowerMessage.includes('math') || lowerMessage.includes('حساب')) {
    return responses['رياضيات'];
  }
  else if (lowerMessage.includes('علوم') || lowerMessage.includes('science') || lowerMessage.includes('فيزياء') || lowerMessage.includes('كيمياء')) {
    return responses['علوم'];
  }
  else if (lowerMessage.includes('عربي') || lowerMessage.includes('arabic') || lowerMessage.includes('نحو') || lowerMessage.includes('أدب')) {
    return responses['عربي'];
  }
  else if (lowerMessage.includes('انجليزي') || lowerMessage.includes('english') || lowerMessage.includes('إنجليزي')) {
    return responses['انجليزي'];
  }
  // Default response
  else {
    return responses['default'];
  }
};

// Export the mock function
export { getMockAIResponse };
