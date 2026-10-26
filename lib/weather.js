/**
 * Intégration de l'API externe publique Open-Meteo pour Paris.
 * Sans clé d'API, rapide et hautement disponible.
 */
export async function getParisWeather() {
  const fallback = {
    temp: 15.4,
    condition: 'Ciel dégagé',
    icon: '☀️',
    windSpeed: 12.0,
    humidity: 65,
    city: 'Paris',
  };

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe%2FParis';
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) return fallback;

    const data = await res.json();
    const current = data.current || {};
    const code = current.weather_code ?? 0;

    let condition = 'Ciel dégagé';
    let icon = '☀️';

    if (code === 0) {
      condition = 'Ciel dégagé';
      icon = '☀️';
    } else if (code <= 3) {
      condition = 'Partiellement nuageux';
      icon = '🌤️';
    } else if (code <= 48) {
      condition = 'Brume';
      icon = '🌫️';
    } else if (code <= 67) {
      condition = 'Pluie';
      icon = '🌧️';
    } else if (code <= 77) {
      condition = 'Neige';
      icon = '❄️';
    } else if (code <= 99) {
      condition = 'Orage';
      icon = '⛈️';
    }

    return {
      temp: Math.round(current.temperature_2m ?? fallback.temp),
      condition,
      icon,
      windSpeed: Math.round(current.wind_speed_10m ?? fallback.windSpeed),
      humidity: Math.round(current.relative_humidity_2m ?? fallback.humidity),
      city: 'Paris',
    };
  } catch (error) {
    return fallback;
  }
}
