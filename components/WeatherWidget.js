import { getParisWeather } from '@/lib/weather';

// Petites icônes SVG dessinées au trait, une par type de temps
function WeatherIcon({ kind, isDay }) {
  const sun = (
    <g>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </g>
  );
  const moon = <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />;
  const cloud = <path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z" />;

  const shapes = {
    clear: isDay ? sun : moon,
    partly: (
      <g>
        <path d="M8 3.5v1.2M3.5 8h1.2M4.8 4.8l.9.9M11.2 4.8l-.9.9" />
        <path d="M5.6 10.4A3 3 0 0 1 10.6 7" />
        {cloud}
      </g>
    ),
    cloudy: cloud,
    fog: <path d="M4 9h16M2 13h20M5 17h14" />,
    rain: (
      <g>
        <path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15z" />
        <path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" />
      </g>
    ),
    snow: (
      <g>
        <path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15z" />
        <path d="M8 19h.01M12 21h.01M16 19h.01" strokeWidth="2.5" />
      </g>
    ),
    storm: (
      <g>
        <path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15z" />
        <path d="M13 15l-2 4h3l-2 4" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes[kind]}
    </svg>
  );
}

// Rendu serveur : la météo est rafraîchie avec la page (ISR) et mise en cache 5 min
export default async function WeatherWidget() {
  const w = await getParisWeather();

  return (
    <div className="w-full sm:w-64 rounded-2xl p-5 bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white">Paris</p>
          <p className="text-5xl font-light text-white mt-1">{w.temp}°</p>
        </div>
        <WeatherIcon kind={w.kind} isDay={w.isDay} />
      </div>
      <p className="text-sm text-white mt-3">{w.condition}</p>
      <p className="text-sm text-zinc-400">Max. {w.max}° Min. {w.min}°</p>
      <div className="flex justify-between text-xs text-zinc-400 border-t border-zinc-700/60 mt-4 pt-3">
        <span>Vent {w.windSpeed} km/h</span>
        <span>Humidité {w.humidity} %</span>
      </div>
    </div>
  );
}
