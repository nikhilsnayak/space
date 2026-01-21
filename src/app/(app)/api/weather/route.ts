import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

import { getSession } from '~/lib/auth';
import type { WeatherData } from '~/features/dashboard/types';

// Map weather condition codes to readable conditions
const getCondition = (code: number): string => {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'atmosphere';
  if (code === 800) return 'clear';
  if (code >= 801 && code < 805) return 'clouds';
  return 'unknown';
};

const ForecastResponseSchema = z.object({
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({ temp: z.number(), humidity: z.number() }),
      weather: z.array(z.object({ id: z.number(), icon: z.string() })),
      pop: z.number().optional(),
    })
  ),
});

const WeatherResponseSchema = z.object({
  main: z.object({ temp: z.number(), humidity: z.number() }),
  weather: z.array(z.object({ id: z.number(), icon: z.string() })),
  name: z.string(),
  wind: z.object({ speed: z.number() }).optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  const search = new URLSearchParams({
    lat: lat || '',
    lon: lon || '',
    appid: apiKey || '',
    units: 'metric',
  });

  try {
    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?${search}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${search}`;

    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: currentWeatherResponse.status }
      );
    }

    const currentData = WeatherResponseSchema.parse(
      await currentWeatherResponse.json()
    );

    let forecastData: z.infer<typeof ForecastResponseSchema> | null = null;
    if (forecastResponse.ok) {
      forecastData = ForecastResponseSchema.parse(
        await forecastResponse.json()
      );
    }

    const condition = getCondition(currentData.weather[0].id);

    // Process forecast for next 24 hours
    const forecast: WeatherData['forecast'] = [];
    if (forecastData?.list) {
      const now = new Date();
      const next24Hours = forecastData.list
        .filter((item) => {
          const itemDate = new Date(item.dt * 1000);
          return itemDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000;
        })
        .slice(0, 8); // Next 8 periods (3-hour intervals = 24 hours)

      forecast.push(
        ...next24Hours.map((item) => ({
          date: new Date(item.dt * 1000).toISOString(),
          condition: getCondition(item.weather[0].id),
          temp: Math.round(item.main.temp),
          chanceOfRain: item.pop ? Math.round(item.pop * 100) : 0,
        }))
      );
    }

    const response: WeatherData = {
      current: {
        temp: Math.round(currentData.main.temp),
        condition,
        icon: currentData.weather[0].icon,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind?.speed || 0,
      },
      location: {
        name: currentData.name || 'Unknown',
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      },
      forecast,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
