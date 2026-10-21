export async function getParisWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,weather_code');
    const data = await res.json();
    return {
      temp: Math.round(data?.current?.temperature_2m || 15),
      condition: 'Ciel dégagé',
      icon: '☀️',
      windSpeed: 10,
      city: 'Paris',
    };
  } catch {
    return { temp: 15, condition: 'Ciel dégagé', icon: '☀️', windSpeed: 10, city: 'Paris' };
  }
}
