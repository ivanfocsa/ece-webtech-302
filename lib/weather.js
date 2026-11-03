/**
 * Météo actuelle de Paris via l'API publique Open-Meteo (sans clé).
 */
const fallback = { temp: 15, max: 17, min: 10, kind: 'clear', condition: 'Ciel dégagé', isDay: true, windSpeed: 12, humidity: 65 };

// Codes WMO renvoyés par Open-Meteo, regroupés en quelques types simples
function kindFromCode(code) {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code <= 48) return 'fog';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rain';
  if (code <= 77 || code === 85 || code === 86) return 'snow';
  return 'storm';
}

const labels = {
  clear: 'Ciel dégagé',
  partly: 'Partiellement nuageux',
  cloudy: 'Couvert',
  fog: 'Brouillard',
  rain: 'Pluie',
  snow: 'Neige',
  storm: 'Orage',
};

export async function getParisWeather() {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522' +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
      '&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Europe%2FParis';
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;

    const { current = {}, daily = {} } = await res.json();
    const kind = kindFromCode(current.weather_code ?? 0);

    return {
      temp: Math.round(current.temperature_2m ?? fallback.temp),
      max: Math.round(daily.temperature_2m_max?.[0] ?? fallback.max),
      min: Math.round(daily.temperature_2m_min?.[0] ?? fallback.min),
      kind,
      condition: labels[kind],
      isDay: current.is_day !== 0,
      windSpeed: Math.round(current.wind_speed_10m ?? fallback.windSpeed),
      humidity: Math.round(current.relative_humidity_2m ?? fallback.humidity),
    };
  } catch {
    return fallback;
  }
}
