'use client';

import {
  CloudIcon,
  CloudRainIcon,
  RadarIcon,
  RefreshCwIcon,
  SunIcon,
} from 'lucide-react';
import useSWR from 'swr';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { ControlPanel } from '~/features/control-center/components/control-panel';

import { WeatherDataSchema } from '../schema';

export interface LocationData {
  lat: number;
  lon: number;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'clear':
      return <SunIcon className='size-10 text-yellow-500' />;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return <CloudRainIcon className='size-10 text-blue-500' />;
    case 'clouds':
      return <CloudIcon className='size-10 text-gray-400' />;
    default:
      return <CloudIcon className='text-muted-foreground size-10' />;
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

  const status = error ? 'error' : loading ? 'loading' : 'online';

  return (
    <ControlPanel
      title='Weather'
      status={status}
      headerAction={
        locationData && (
          <Button
            size='sm'
            variant='ghost'
            onClick={handleRefresh}
            disabled={loading || isValidating}
            className='h-6 w-6 p-0'
          >
            <RefreshCwIcon
              className={cn('size-3', isValidating && 'animate-spin')}
            />
          </Button>
        )
      }
    >
      {loading && !weatherData && (
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-3' />
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-24' />
          </div>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-24 sm:h-12 sm:w-28' />
            <Skeleton className='size-10 rounded-full' />
          </div>
          <div className='grid grid-cols-2 gap-4 border-t border-white/10 pt-4'>
            <div className='space-y-1'>
              <Skeleton className='h-3 w-14' />
              <Skeleton className='h-6 w-12' />
            </div>
            <div className='space-y-1'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-6 w-16' />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='py-4 text-center'>
          <div className='text-xs tracking-wider text-[#ef4444] uppercase'>
            Signal Lost
          </div>
          <div className='text-muted-foreground mt-1 text-xs'>{error}</div>
        </div>
      )}

      {weatherData && !loading && (
        <div className='space-y-4'>
          {/* Location */}
          <div className='flex items-center gap-2 text-xs'>
            <RadarIcon className='text-muted-foreground size-3' />
            <span className='text-muted-foreground tracking-wider uppercase'>
              Location:
            </span>
            <span className='text-foreground font-medium'>
              {weatherData.location.name}
            </span>
          </div>

          {/* Main Display */}
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-mono text-2xl font-bold tabular-nums sm:text-3xl lg:text-4xl'>
                {weatherData.current.temp}
                <span className='text-muted-foreground text-xl sm:text-2xl'>
                  °C
                </span>
              </div>
            </div>
            <div>{getWeatherIcon(weatherData.current.condition)}</div>
          </div>

          {/* Metrics Grid */}
          <div className='grid grid-cols-2 gap-4 border-t border-white/10 pt-4'>
            <div>
              <div className='text-muted-foreground text-[10px] tracking-wider uppercase'>
                Humidity
              </div>
              <div className='font-mono text-lg font-semibold tabular-nums'>
                {weatherData.current.humidity}
                <span className='text-muted-foreground text-sm'>%</span>
              </div>
            </div>
            <div>
              <div className='text-muted-foreground text-[10px] tracking-wider uppercase'>
                Wind Speed
              </div>
              <div className='font-mono text-lg font-semibold tabular-nums'>
                {weatherData.current.windSpeed}
                <span className='text-muted-foreground text-sm'> m/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ControlPanel>
  );
}
