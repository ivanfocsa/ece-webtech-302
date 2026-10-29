import { getParisWeather } from '@/lib/weather';

export default async function WeatherWidget() {
  const w = await getParisWeather();

  return (
    <p className="text-xs text-zinc-500">
      Paris, {w.temp}°C, {w.condition.toLowerCase()}, vent {w.windSpeed} km/h
    </p>
  );
}
