import { z } from 'zod';

export const WeatherDataSchema = z.object({
  current: z.object({
    temp: z.number(),
    condition: z.string(),
    icon: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
  }),
  location: z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  forecast: z.array(
    z.object({
      date: z.string(),
      condition: z.string(),
      temp: z.number(),
      chanceOfRain: z.number(),
    })
  ),
});
