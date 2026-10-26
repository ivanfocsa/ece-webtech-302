import { getParisWeather } from '@/lib/weather';

export default async function WeatherWidget() {
  const weather = await getParisWeather();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono">
      <span>{weather.icon}</span>
      <span className="font-semibold text-zinc-200">{weather.city}</span>
      <span className="text-white font-bold">{weather.temp}°C</span>
      <span className="hidden sm:inline text-zinc-500">• {weather.condition}</span>
      <span className="hidden md:inline text-zinc-500">• Vent {weather.windSpeed} km/h</span>
    </div>
  );
}
