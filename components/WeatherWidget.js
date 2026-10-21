import { getParisWeather } from '@/lib/weather';

export default async function WeatherWidget() {
  const weather = await getParisWeather();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 shadow-sm backdrop-blur">
      <span className="text-sm">{weather.icon}</span>
      <span className="font-semibold text-white">{weather.city}</span>
      <span className="text-blue-400 font-bold">{weather.temp}°C</span>
      <span className="hidden sm:inline text-slate-400">• {weather.condition}</span>
      <span className="hidden md:inline text-slate-400">• Vent {weather.windSpeed} km/h</span>
    </div>
  );
}
