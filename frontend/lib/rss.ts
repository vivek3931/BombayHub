import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    sourceLogo?: string; // We can map this manually
    category: 'Traffic' | 'Weather' | 'Civic' | 'Politics' | 'Crime' | 'General';
    snippet: string;
}

const FEEDS = [
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', // TOI Mumbai
        source: 'Times of India'
    },
    {
        url: 'https://indianexpress.com/section/cities/mumbai/feed/', // IE Mumbai
        source: 'Indian Express'
    }
];

// Helper to deduce category from title
function categorizeNews(title: string): NewsItem['category'] {
    const t = title.toLowerCase();
    if (t.includes('traffic') || t.includes('road') || t.includes('highway') || t.includes('train') || t.includes('metro') || t.includes('delay') || t.includes('block')) return 'Traffic';
    if (t.includes('rain') || t.includes('weather') || t.includes('monsoon') || t.includes('heat') || t.includes('degrees') || t.includes('cloud')) return 'Weather';
    if (t.includes('bmc') || t.includes('civic') || t.includes('water') || t.includes('power') || t.includes('repair')) return 'Civic';
    if (t.includes('police') || t.includes('arrest') || t.includes('crime') || t.includes('murder') || t.includes('scam')) return 'Crime';
    if (t.includes('politics') || t.includes('minister') || t.includes('govt') || t.includes('election')) return 'Politics';
    return 'General';
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    return Math.floor(seconds / 86400) + "d ago";
}

export async function getMumbaiNews(topic?: string): Promise<NewsItem[]> {
    let allNews: NewsItem[] = [];

    try {
        const promises = FEEDS.map(async (feed) => {
            try {
                // We use Next.js fetch to enable caching of the XML response
                // RSS Parser usually takes a URL, but we can pass string content to parseString
                // This allows us to control the fetch caching policy.
                const response = await fetch(feed.url, { next: { revalidate: 900 } }); // 15 mins
                if (!response.ok) return [];
                const xml = await response.text();

                const p = await parser.parseString(xml);

                return p.items.map(item => ({
                    title: item.title || 'Untitled',
                    link: item.link || '#',
                    pubDate: item.pubDate ? timeAgo(item.pubDate) : 'Recently',
                    source: feed.source,
                    category: categorizeNews(item.title || ''),
                    snippet: item.contentSnippet?.substring(0, 100) + '...' || ''
                }));
            } catch (e) {
                console.error(`Error fetching feed ${feed.url}`, e);
                return [];
            }
        });

        const results = await Promise.all(promises);
        allNews = results.flat().sort((a, b) => {
            // Simple sort workaround since timeAgo removes precise timestamp. 
            // In real app, keep raw ISO date for sorting, convert to string for display.
            // For now, we assume feeds are sorted.
            return 0;
        });

        if (topic) {
            return allNews.filter(n => n.category.toLowerCase() === topic.toLowerCase());
        }

        return allNews.slice(0, 20); // Limit total return
    } catch (error) {
        console.error("News Aggregation Error", error);
        return [];
    }
}
