// API endpoint for Smart Chat Assistant
// This would typically be a server-side endpoint

const express = require('express');
const router = express.Router();
const ChatIntegration = require('./chat-integration');

// Initialize chat integration
const chatIntegration = new ChatIntegration();

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, studentId, subject } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Process message using chat integration
    const response = await chatIntegration.processMessage(message, studentId, subject);

    res.json({
      success: true,
      reply: response.reply,
      videoLinks: response.videoLinks,
      videoDetails: response.videoDetails,
      subject: response.subject,
      timestamp: response.timestamp
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'حدث خطأ في معالجة طلبك',
      details: error.message 
    });
  }
});

// GET /api/chat/history/:studentId
router.get('/chat/history/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 50 } = req.query;
    
    const history = await chatIntegration.getChatHistory(studentId, limit);

    res.json({ success: true, history });

  } catch (error) {
    console.error('Chat History API Error:', error);
    res.status(500).json({ error: 'حدث خطأ في جلب تاريخ المحادثة' });
  }
});

// GET /api/chat/analytics/:studentId
router.get('/chat/analytics/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const analytics = await chatIntegration.getStudyAnalytics(studentId);

    res.json({ success: true, analytics });

  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({ error: 'حدث خطأ في جلب التحليلات' });
  }
});

// GET /api/chat/recommendations/:studentId
router.get('/chat/recommendations/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject = 'عام' } = req.query;
    
    const recommendations = await chatIntegration.getStudyRecommendations(studentId, subject);

    res.json({ success: true, recommendations });

  } catch (error) {
    console.error('Recommendations API Error:', error);
    res.status(500).json({ error: 'حدث خطأ في جلب التوصيات' });
  }
});

module.exports = router;
