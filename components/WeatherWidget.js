import { getParisWeather } from '@/lib/weather';

export default async function WeatherWidget() {
  const weather = await getParisWeather();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono">
      <span className="text-zinc-200">{weather.city}</span>
      <span className="text-white font-medium">{weather.temp}°C</span>
      <span className="text-zinc-500">• {weather.condition}</span>
    </div>
  );
}
