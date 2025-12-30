// Weather functionality for Prayer Times Display
// This file handles fetching and displaying weather information

async function fetchWeather() {
    // Check if we have user location
    if (!CONFIG.userLocation) {
        // Use default Muscat coordinates
        CONFIG.userLocation = {
            latitude: 23.5880,
            longitude: 58.3829
        };
    }

    try {
        const { latitude, longitude } = CONFIG.userLocation;
        
        // Using Open-Meteo API (free, no API key required)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const weatherCode = data.current_weather.weathercode;
            
            // Update temperature
            document.getElementById('temperature').textContent = `${temp}°`;
            
            // Update weather icon based on weather code
            const icon = getWeatherIcon(weatherCode);
            document.getElementById('weather-icon').textContent = icon;
        }
    } catch (error) {
        console.error('خطأ في جلب بيانات الطقس:', error);
        // Show default values on error
        document.getElementById('temperature').textContent = '--°';
        document.getElementById('weather-icon').textContent = '☀️';
    }
}

// Get weather icon based on WMO weather code
function getWeatherIcon(code) {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️'; // Clear sky
    if (code === 1 || code === 2) return '🌤️'; // Mainly clear, partly cloudy
    if (code === 3) return '☁️'; // Overcast
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 57) return '🌧️'; // Drizzle
    if (code >= 61 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '🌨️'; // Snow
    if (code >= 80 && code <= 82) return '🌧️'; // Rain showers
    if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
    if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
    
    return '☀️'; // Default
}

// Initialize weather on page load
function initializeWeather() {
    fetchWeather();
    // Update weather every 30 minutes
    setInterval(fetchWeather, 30 * 60 * 1000);
}
