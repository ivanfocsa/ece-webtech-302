/**
 * Météo actuelle de Paris via l'API publique Open-Meteo (sans clé).
 */
const fallback = { temp: 15, condition: 'Ciel dégagé', windSpeed: 12, humidity: 65 };

function conditionFromCode(code) {
  if (code === 0) return 'Ciel dégagé';
  if (code <= 3) return 'Partiellement nuageux';
  if (code <= 48) return 'Brume';
  if (code <= 67) return 'Pluie';
  if (code <= 77) return 'Neige';
  return 'Orage';
}

export async function getParisWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe%2FParis';
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;

    const { current = {} } = await res.json();
    return {
      temp: Math.round(current.temperature_2m ?? fallback.temp),
      condition: conditionFromCode(current.weather_code ?? 0),
      windSpeed: Math.round(current.wind_speed_10m ?? fallback.windSpeed),
      humidity: Math.round(current.relative_humidity_2m ?? fallback.humidity),
    };
  } catch {
    return fallback;
  }
}
