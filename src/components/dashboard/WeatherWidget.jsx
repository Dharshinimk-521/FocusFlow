// uses useWeather hook — shows temp + description

import useWeather from '../../hooks/useWeather'

function WeatherWidget() {
    const { weather, loading, error } = useWeather()

    if (loading) return (
        <div className="dash-card weather-card">
            <span className="dash-card-lbl">Loading weather...</span>
        </div>
    )

    if (error) return (
        <div className="dash-card weather-card">
            <span className="dash-card-lbl">Weather unavailable</span>
        </div>
    )

    return (
        <div className="dash-card weather-card">
            <div className="weather-top">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="weather-icon"
                />
                <div className="weather-temp">{weather.temp}°C</div>
            </div>
            <div className="weather-city">{weather.city}</div>
            <div className="weather-desc">{weather.description}</div>
            <div className="weather-feels">
                Feels like {weather.feels_like}°C · {weather.humidity}% humidity
            </div>
        </div>
    )
}

export default WeatherWidget