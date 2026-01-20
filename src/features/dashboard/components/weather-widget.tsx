'use client';

import {
  CloudIcon,
  CloudRainIcon,
  LoaderIcon,
  MapPinIcon,
  RefreshCwIcon,
  SunIcon,
} from 'lucide-react';
import useSWR from 'swr';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import { WeatherDataSchema } from '../schema';

export interface LocationData {
  lat: number;
  lon: number;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'clear':
      return <SunIcon className='size-8 text-yellow-500' />;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return <CloudRainIcon className='size-8 text-blue-500' />;
    case 'clouds':
      return <CloudIcon className='size-8 text-gray-500' />;
    default:
      return <CloudIcon className='size-8' />;
  }
};

function getGeolocation(): Promise<LocationData | undefined> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData: LocationData = {
          lat: latitude,
          lon: longitude,
        };
        resolve(locationData);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location permission denied'));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reject(new Error('Location information unavailable'));
        } else {
          reject(new Error('Failed to get location'));
        }
      },
      {
        timeout: 10000,
        maximumAge: 300000,
        enableHighAccuracy: true,
      }
    );
  });
}

async function fetchWeather(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather');
  }

  return WeatherDataSchema.parse(await response.json());
}

export function WeatherWidget() {
  const {
    data: locationData,
    isLoading: locationLoading,
    error: locationError,
  } = useSWR('current-location', getGeolocation);

  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    isValidating,
    mutate,
  } = useSWR(
    locationData
      ? `/api/weather?lat=${locationData.lat}&lon=${locationData.lon}`
      : null,
    fetchWeather
  );

  const handleRefresh = () => {
    mutate();
  };

  const error = weatherError?.message || locationError?.message || null;
  const loading = weatherLoading || locationLoading;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <MapPinIcon className='size-5' />
            Weather
          </CardTitle>
          {locationData && (
            <Button
              size='sm'
              variant='ghost'
              onClick={handleRefresh}
              disabled={loading || isValidating}
            >
              <RefreshCwIcon
                className={cn(`size-4`, isValidating && 'animate-spin')}
              />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {loading && !weatherData && (
          <div className='flex items-center justify-center py-8'>
            <LoaderIcon className='text-muted-foreground size-8 animate-spin' />
          </div>
        )}

        {error && (
          <div className='text-destructive py-4 text-center text-sm'>
            {error}
          </div>
        )}

        {weatherData && !loading && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-3xl font-bold'>
                  {weatherData.current.temp}°C
                </div>
                <div className='text-muted-foreground text-sm'>
                  {weatherData.location.name}
                </div>
              </div>
              <div>{getWeatherIcon(weatherData.current.condition)}</div>
            </div>

            <div className='grid grid-cols-2 gap-2 text-xs'>
              <div>
                <div className='text-muted-foreground'>Humidity</div>
                <div className='font-medium'>
                  {weatherData.current.humidity}%
                </div>
              </div>
              <div>
                <div className='text-muted-foreground'>Wind</div>
                <div className='font-medium'>
                  {weatherData.current.windSpeed} m/s
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
