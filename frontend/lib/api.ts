const API_BASE_URL = 'http://localhost:4000';

export async function getPlaces(location?: string, category?: string) {
    const params = new URLSearchParams();
    if (location && location !== 'All Mumbai') params.append('location', location);
    if (category) params.append('category', category);

    const res = await fetch(`${API_BASE_URL}/places?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch places');
    return res.json();
}

export async function getJobs(location?: string) {
    const params = new URLSearchParams();
    if (location && location !== 'All Mumbai') params.append('location', location);

    const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

export async function getPhotos(location?: string) {
    const params = new URLSearchParams();
    if (location && location !== 'All Mumbai') params.append('location', location);

    const res = await fetch(`${API_BASE_URL}/photos?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
}

export async function createPlace(data: any) {
    const res = await fetch(`${API_BASE_URL}/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create place');
    return res.json();
}

export async function createJob(data: any) {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
}

export async function createPhoto(data: any) {
    const res = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create photo');
    return res.json();
}

export async function getEvents(category?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);

    const res = await fetch(`${API_BASE_URL}/events?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
}

export async function createEvent(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || 'Failed to create event');
    }
    return res.json();
}


export async function getWeather(lat = 19.0760, lng = 72.8777) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code`
        );
        const data = await res.json();
        const current = data.current;

        return {
            temp: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            condition: getWeatherCondition(current.weather_code),
        };
    } catch (e) {
        console.error("Failed to fetch weather", e);
        return null; // Return null to handle gracefully
    }
}

export async function getAQI(lat = 19.0760, lng = 72.8777) {
    try {
        const res = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5`
        );
        const data = await res.json();
        const current = data.current;

        return {
            aqi: data.current ? current.us_aqi : '--',
            pm25: data.current ? current.pm2_5 : '--',
        };
    } catch (e) {
        console.error("Failed to fetch AQI", e);
        return null;
    }
}

function getWeatherCondition(code: number): string {
    const codes: Record<number, string> = {
        0: 'Clear Sky',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing Rime Fog',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Slight Showers',
        81: 'Moderate Showers',
        82: 'Violent Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with Hail',
        99: 'Thunderstorm with Hail'
    };
    return codes[code] || 'Unknown';
}
export async function getNews(limit?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const res = await fetch(`${API_BASE_URL}/news/latest?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
}

export async function getAllNews() {
    const res = await fetch(`${API_BASE_URL}/news`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch all news');
    return res.json();
}
