import { z } from 'zod';

import { WeatherDataSchema } from './schema';

export type WeatherData = z.infer<typeof WeatherDataSchema>;
