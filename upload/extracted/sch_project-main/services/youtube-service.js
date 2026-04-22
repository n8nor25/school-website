// YouTube API Service for Educational Video Recommendations
// This service handles YouTube API integration for finding educational videos

const { getAIConfig } = require('../config/ai-config');

class YouTubeService {
  constructor() {
    this.config = getAIConfig().YOUTUBE;
    this.apiKey = this.config.apiKey;
    this.baseUrl = this.config.baseUrl;
    this.maxResults = this.config.maxResults;
  }

  // Search for educational videos based on subject and query
  async searchEducationalVideos(subject, query, maxResults = 3) {
    try {
      const searchQuery = this.buildSearchQuery(subject, query);
      const videos = await this.searchVideos(searchQuery, maxResults);
      
      return this.formatVideoResults(videos);

    } catch (error) {
      console.error('YouTube Search Error:', error);
      return this.getFallbackVideos(subject);
    }
  }

  // Build search query based on subject and user query
  buildSearchQuery(subject, userQuery) {
    const subjectKeywords = {
      'الرياضيات': ['رياضيات', 'math', 'حساب', 'جبر', 'هندسة'],
      'العلوم': ['علوم', 'science', 'فيزياء', 'كيمياء', 'أحياء'],
      'اللغة العربية': ['عربي', 'نحو', 'صرف', 'أدب', 'شعر'],
      'اللغة الإنجليزية': ['english', 'grammar', 'vocabulary', 'conversation'],
      'التاريخ': ['تاريخ', 'history', 'تاريخ عربي', 'تاريخ عالمي'],
      'الجغرافيا': ['جغرافيا', 'geography', 'خرائط', 'دول'],
      'الفيزياء': ['فيزياء', 'physics', 'ميكانيكا', 'كهرباء'],
      'الكيمياء': ['كيمياء', 'chemistry', 'تفاعلات', 'عناصر'],
      'الأحياء': ['أحياء', 'biology', 'خلية', 'وراثة']
    };

    const keywords = subjectKeywords[subject] || subjectKeywords['عام'] || ['تعليم', 'education'];
    const primaryKeyword = keywords[0];
    
    return `${primaryKeyword} ${userQuery} شرح تعليمي tutorial`;
  }

  // Search videos using YouTube API
  async searchVideos(query, maxResults = 3) {
    const url = `${this.baseUrl}/search`;
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      order: 'relevance',
      videoDuration: 'medium', // 4-20 minutes
      videoDefinition: 'high',
      key: this.apiKey
    });

    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  // Format video results for the application
  formatVideoResults(videos) {
    return videos.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: 'N/A' // Would need additional API call to get duration
    }));
  }

  // Get fallback videos when API fails
  getFallbackVideos(subject) {
    const fallbackVideos = {
      'الرياضيات': [
        {
          id: 'math1',
          title: 'شرح الرياضيات للمبتدئين',
          url: 'https://www.youtube.com/watch?v=math1',
          thumbnail: '/images/math-thumbnail.jpg'
        },
        {
          id: 'math2',
          title: 'حل المسائل الرياضية',
          url: 'https://www.youtube.com/watch?v=math2',
          thumbnail: '/images/math-thumbnail2.jpg'
        }
      ],
      'العلوم': [
        {
          id: 'science1',
          title: 'تجارب علمية ممتعة',
          url: 'https://www.youtube.com/watch?v=science1',
          thumbnail: '/images/science-thumbnail.jpg'
        },
        {
          id: 'science2',
          title: 'شرح الظواهر الطبيعية',
          url: 'https://www.youtube.com/watch?v=science2',
          thumbnail: '/images/science-thumbnail2.jpg'
        }
      ],
      'اللغة العربية': [
        {
          id: 'arabic1',
          title: 'قواعد اللغة العربية',
          url: 'https://www.youtube.com/watch?v=arabic1',
          thumbnail: '/images/arabic-thumbnail.jpg'
        }
      ],
      'اللغة الإنجليزية': [
        {
          id: 'english1',
          title: 'تعلم الإنجليزية بسهولة',
          url: 'https://www.youtube.com/watch?v=english1',
          thumbnail: '/images/english-thumbnail.jpg'
        }
      ]
    };

    return fallbackVideos[subject] || fallbackVideos['الرياضيات'];
  }

  // Get trending educational videos for a subject
  async getTrendingEducationalVideos(subject) {
    try {
      const query = this.buildSearchQuery(subject, 'trending');
      const videos = await this.searchVideos(query, 5);
      
      return this.formatVideoResults(videos);

    } catch (error) {
      console.error('Trending Videos Error:', error);
      return this.getFallbackVideos(subject);
    }
  }

  // Get video details by ID
  async getVideoDetails(videoId) {
    try {
      const url = `${this.baseUrl}/videos`;
      const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: this.apiKey
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium?.url,
          duration: video.contentDetails.duration,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt
        };
      }

      return null;

    } catch (error) {
      console.error('Video Details Error:', error);
      return null;
    }
  }

  // Search for videos by specific topics
  async searchVideosByTopic(topic, subject) {
    const searchQueries = [
      `${topic} ${subject} شرح`,
      `${topic} tutorial ${subject}`,
      `learn ${topic} ${subject}`
    ];

    const allVideos = [];

    for (const query of searchQueries) {
      try {
        const videos = await this.searchVideos(query, 2);
        allVideos.push(...this.formatVideoResults(videos));
      } catch (error) {
        console.error(`Search Error for query "${query}":`, error);
      }
    }

    // Remove duplicates and return top results
    const uniqueVideos = this.removeDuplicateVideos(allVideos);
    return uniqueVideos.slice(0, this.maxResults);
  }

  // Remove duplicate videos based on video ID
  removeDuplicateVideos(videos) {
    const seen = new Set();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }

  // Get educational channels for a subject
  async getEducationalChannels(subject) {
    const channels = {
      'الرياضيات': [
        'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Khan Academy
        'UCbQh6Oj8Q8Q8Q8Q8Q8Q8Q8Q'  // Math Channel
      ],
      'العلوم': [
        'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Khan Academy
        'UCbQh6Oj8Q8Q8Q8Q8Q8Q8Q8Q'  // Science Channel
      ]
    };

    return channels[subject] || channels['الرياضيات'];
  }
}

module.exports = YouTubeService;
