import { useState, useEffect } from "react";

function useWeather() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        let cancelled = false;

        // get user location first
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;

                // two fetches needed — one for weather, one for city name
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weathercode,apparent_temperature&timezone=auto`;

                const cityUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

                // fetch both at same time
                Promise.all([
                    fetch(weatherUrl).then(r => r.json()),
                    fetch(cityUrl).then(r => r.json())
                ])
                .then(([weatherData, cityData]) => {
                    if (!cancelled) {
                        setWeather({
                            city:        cityData.address.city
                                      || cityData.address.town
                                      || cityData.address.village
                                      || 'Your Location',
                            temp:        Math.round(weatherData.current.temperature_2m),
                            feels_like:  Math.round(weatherData.current.apparent_temperature),
                            humidity:    weatherData.current.relative_humidity_2m,
                            description: getDescription(weatherData.current.weathercode),
                            icon:        getIcon(weatherData.current.weathercode),
                        });
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (!cancelled) {
                        setError(err.message);
                        setLoading(false);
                    }
                });
            },
            // location denied — fallback to Madurai coords
            () => {
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=9.9252&longitude=78.1198&current=temperature_2m,relative_humidity_2m,weathercode,apparent_temperature&timezone=auto`;

                fetch(weatherUrl)
                    .then(r => r.json())
                    .then(data => {
                        if (!cancelled) {
                            setWeather({
                                city:        'Madurai',
                                temp:        Math.round(data.current.temperature_2m),
                                feels_like:  Math.round(data.current.apparent_temperature),
                                humidity:    data.current.relative_humidity_2m,
                                description: getDescription(data.current.weathercode),
                                icon:        getIcon(data.current.weathercode),
                            });
                            setLoading(false);
                        }
                    })
                    .catch(err => {
                        if (!cancelled) {
                            setError(err.message);
                            setLoading(false);
                        }
                    });
            }
        );

        return () => { cancelled = true; };
    }, []);

    return { weather, loading, error };
}

// open-meteo uses weather codes instead of descriptions
// https://open-meteo.com/en/docs#weathervariables
function getDescription(code) {
    if (code === 0)           return 'Clear sky'
    if (code <= 2)            return 'Partly cloudy'
    if (code === 3)           return 'Overcast'
    if (code <= 49)           return 'Foggy'
    if (code <= 59)           return 'Drizzle'
    if (code <= 69)           return 'Rainy'
    if (code <= 79)           return 'Snowy'
    if (code <= 82)           return 'Rain showers'
    if (code <= 99)           return 'Thunderstorm'
    return 'Unknown'
}

// map weather code to openweathermap icon codes for the img
function getIcon(code) {
    if (code === 0)           return '01d'   // clear
    if (code <= 2)            return '02d'   // partly cloudy
    if (code === 3)           return '04d'   // overcast
    if (code <= 49)           return '50d'   // fog
    if (code <= 59)           return '09d'   // drizzle
    if (code <= 69)           return '10d'   // rain
    if (code <= 79)           return '13d'   // snow
    if (code <= 82)           return '09d'   // showers
    if (code <= 99)           return '11d'   // thunderstorm
    return '01d'
}

export default useWeather;