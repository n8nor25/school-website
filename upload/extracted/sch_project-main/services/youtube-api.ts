// YouTube API Service
// خدمة YouTube API للبحث عن الفيديوهات التعليمية

const YOUTUBE_API_KEY = 'AIzaSyCOpOcxyilmrQVOdHj7azdqlzwH2fRGb0w';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  publishedAt: string;
}

class YouTubeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = YOUTUBE_API_KEY;
    this.baseUrl = YOUTUBE_BASE_URL;
  }

  // البحث عن فيديوهات تعليمية
  async searchEducationalVideos(query: string, subject: string = 'عام', maxResults: number = 3): Promise<YouTubeVideo[]> {
    try {
      // بناء استعلام البحث
      const searchQuery = this.buildSearchQuery(query, subject);
      
      console.log('البحث عن فيديوهات:', searchQuery);
      
      // استدعاء YouTube API
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${this.apiKey}&relevanceLanguage=ar&regionCode=SA`
      );

      if (!response.ok) {
        console.error('YouTube API Error:', response.status, response.statusText);
        throw new Error(`YouTube API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('نتائج YouTube:', data);
      
      // تحويل النتائج إلى تنسيق مناسب
      const videos = this.formatVideoResults(data.items || []);
      console.log('فيديوهات معالجة:', videos);
      
      return videos;

    } catch (error) {
      console.error('YouTube Search Error:', error);
      // إرجاع فيديوهات افتراضية في حالة الخطأ
      return this.getFallbackVideos(subject);
    }
  }

  // بناء استعلام البحث
  private buildSearchQuery(query: string, subject: string): string {
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

    const keywords = subjectKeywords[subject as keyof typeof subjectKeywords] || ['تعليم', 'education'];
    const primaryKeyword = keywords[0];
    
    return `${primaryKeyword} ${query} شرح تعليمي tutorial`;
  }

  // تحويل نتائج API إلى تنسيق مناسب
  private formatVideoResults(items: any[]): YouTubeVideo[] {
    return items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  }

  // فيديوهات افتراضية في حالة الخطأ
  private getFallbackVideos(subject: string): YouTubeVideo[] {
    const fallbackVideos = {
      'الرياضيات': [
        {
          id: 'math1',
          title: 'شرح الرياضيات للمبتدئين',
          description: 'فيديو تعليمي للرياضيات',
          thumbnail: '/images/math-thumbnail.jpg',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          channelTitle: 'قناة تعليمية',
          publishedAt: new Date().toISOString()
        }
      ],
      'العلوم': [
        {
          id: 'science1',
          title: 'تجارب علمية ممتعة',
          description: 'فيديو تعليمي للعلوم',
          thumbnail: '/images/science-thumbnail.jpg',
          url: 'https://www.youtube.com/watch?v=H8WJ2KENlK0',
          channelTitle: 'قناة تعليمية',
          publishedAt: new Date().toISOString()
        }
      ],
      'عام': [
        {
          id: 'general1',
          title: 'فيديو تعليمي عام',
          description: 'فيديو تعليمي مفيد',
          thumbnail: '/images/general-thumbnail.jpg',
          url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          channelTitle: 'قناة تعليمية',
          publishedAt: new Date().toISOString()
        }
      ]
    };

    return fallbackVideos[subject as keyof typeof fallbackVideos] || fallbackVideos['عام'];
  }

  // البحث عن فيديوهات حسب الموضوع
  async searchVideosByTopic(topic: string, subject: string): Promise<YouTubeVideo[]> {
    const searchQueries = [
      `${topic} ${subject} شرح`,
      `${topic} tutorial ${subject}`,
      `learn ${topic} ${subject}`
    ];

    const allVideos: YouTubeVideo[] = [];

    for (const query of searchQueries) {
      try {
        const videos = await this.searchEducationalVideos(query, subject, 2);
        allVideos.push(...videos);
      } catch (error) {
        console.error(`Search Error for query "${query}":`, error);
      }
    }

    // إزالة التكرارات وإرجاع أفضل النتائج
    const uniqueVideos = this.removeDuplicateVideos(allVideos);
    return uniqueVideos.slice(0, 3);
  }

  // إزالة الفيديوهات المكررة
  private removeDuplicateVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
    const seen = new Set();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }
}

// إنشاء instance واحد للاستخدام
const youtubeService = new YouTubeService();

export { youtubeService, YouTubeVideo };
export default youtubeService;
