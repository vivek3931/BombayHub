// Helper to map WMO codes to text
function getWeatherCondition(code: number): string {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
}

export async function getWeather() {
    try {
        const res = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FKolkata",
            { next: { revalidate: 600 } }
        );

        if (!res.ok) throw new Error('Failed to fetch weather');

        const data = await res.json();
        const current = data.current;

        return {
            temp: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            condition: getWeatherCondition(current.weather_code)
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAQI() {
    try {
        const res = await fetch(
            "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=19.0760&longitude=72.8777&current=us_aqi,pm2_5&timezone=Asia%2FKolkata",
            { next: { revalidate: 600 } }
        );

        if (!res.ok) throw new Error("Failed to fetch AQI");

        const data = await res.json();
        const current = data.current;

        return {
            aqi: current.us_aqi,
            pm25: current.pm2_5
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getNews() {
    const API_KEY = process.env.NEWS_API_KEY;
    if (!API_KEY) return [];

    try {
        const res = await fetch(`https://gnews.io/api/v4/search?q=Mumbai&lang=en&max=5&apikey=${API_KEY}`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}
