# Tawkit Prayer Times Clone - Arabic Version with Geolocation

A fully Arabic clone of the Tawkit prayer times display website (https://offline.tawkit.net/) with automatic geolocation detection and dynamic prayer times based on your location.

## Features

### 🇴🇲 Oman-Specific Integration
- **Automatic Oman Detection**: Detects if you're in Oman and identifies the closest region
- **70+ Oman Regions**: Supports all major cities and regions across Oman's 11 governorates
- **Oman Calculation Method**: Uses Umm Al-Qura method (Method 4) approved in Oman
- **Government Data Alignment**: Aligned with Ministry of Awqaf and Religious Affairs standards
- **12-Hour Format**: All times displayed in 12-hour format (ص/م) as commonly used in Oman

### 🌍 Automatic Geolocation
- Uses browser's Geolocation API to detect your location automatically
- Fetches prayer times based on your current GPS coordinates
- Displays city and country name in Arabic
- Defaults to Muscat, Oman if location access is denied

### 🎯 Current Configuration
- **Target Location**: Sultanate of Oman (all regions supported)
- **Default Location**: Muscat, Oman (if GPS denied)
- **Prayer Calculation Method**: Umm Al-Qura (Method 4) - Official Oman method
- **Time Format**: 12-hour format with Arabic AM/PM (ص/م)
- **Update Interval**: Every 60 seconds
- **Language**: Full Arabic interface with RTL support
- **Fonts**: Cairo and Amiri (loaded from Google Fonts)

### 🕌 Dynamic Prayer Times
- **Live Prayer Times**: Fetches real-time prayer times from Aladhan API based on YOUR location
- **Location-Based**: Prayer times change automatically based on where you are
- **Accurate Calculations**: Uses Islamic Society of North America (ISNA) method
- **Next Prayer Countdown**: Real-time countdown to the next prayer
- **Tomorrow's Fajr**: Shows next day's Fajr time

### 🇸🇦 Full Arabic Interface
- Complete Arabic language interface
- RTL (Right-to-Left) layout support
- Arabic Hadiths and Quranic verses
- Arabic date formatting (Hijri and Gregorian)
- Professional Arabic fonts (Cairo, Amiri)

### 📖 Islamic Content
- **Hadith Display**: Rotating collection of authentic Arabic Hadiths
- **Quranic Verses**: Display of selected Ayats in Arabic
- **Auto-rotation**: Content changes every 30 seconds

### 🎨 Modern Design
- Dark gradient background matching original Tawkit style
- Glowing effects and animations
- Active prayer highlighting with pulse animation
- **Interactive Clock**: Toggle between full and mini clock display
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Multiple click interactions matching the original website

## Interactive Features

All the interactive features from the original Tawkit website have been implemented:

- **Clock**: Click to switch between Mini and Full clock
- **Hadith Section**: Click to switch between Ahadith and scrolling announcements
- **Isha Iqama**: Click to change Hadith
- **Next Prayer Label**: Click to change prayer names layout (HR/VR)
- **Next Prayer Countdown**: Click to enlarge the countdown
- **Logo**: Double-click to activate black screen (click black screen to remove)
- **Mosque Name**: Click to swap date position
- **Tawkit Name**: Click to switch between 5 or 6 prayer cells display
- **Weather**: Click 7 times to reset app settings and restart
- **Fajr Iqama**: Double-click to toggle Iqama display (time vs minutes after Adhan)
- **Maghrib Name**: Click 3 times to start a short counter demonstration
- **Tomorrow Fajr**: Click 3 times to show/hide Ayats

## Supported Oman Regions

The system supports **70+ regions** across all 11 governorates of Oman:

- **Muscat**: مسقط، مطرح، بوشر، السيب
- **Dhofar**: صلالة، طاقة، مرباط
- **Musandam**: خصب، دبا البيعة
- **Al Buraimi**: البريمي
- **Ad Dakhliyah**: نزوى، بهلاء، منح، ادم، ازكي، سمائل
- **Ash Sharqiyah North**: صور، ابراء، القابل، وادي بني خالد
- **Ash Sharqiyah South**: جعلان بوحسن، جعلان بوعلي، مصيرة
- **Ad Dhahirah**: عبري، ينقل، ضنك
- **Al Batinah North**: صحار، شناص، لوى، صحم، الخابورة
- **Al Batinah South**: الرستاق، بركاء، نخل، وادي المعاول، العوابي، المصنعة
- **Al Wusta**: هيما، الدقم، محوت

See `OMAN_GUIDE.md` for complete list and details.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - JavaScript logic for data fetching and interactivity
- `oman-locations.js` - Oman regions database and location detection
- `OMAN_GUIDE.md` - Comprehensive guide for Oman-specific features (Arabic/English)

## Data Source

The website fetches live prayer times from the Aladhan API (https://aladhan.com/prayer-times-api). By default, it's configured for Dubai, UAE, but you can easily modify the location in the `script.js` file.

## Customization

### Change Location

The website automatically detects your location. If you want to set a specific location instead:

1. **Allow location access** when prompted by your browser
2. **To use a fixed location**, edit the `getLocation()` function in `script.js` to skip geolocation:

```javascript
// Comment out the geolocation code and set a fixed location:
CONFIG.userLocation = {
    latitude: 25.2048,  // Your latitude
    longitude: 55.2708  // Your longitude
};
fetchPrayerTimes();
```

### Change Mosque Name

Edit the mosque name in `index.html`:

```html
<h1 id="mosque-name">Your Mosque Name</h1>
```

### Add Your Own Hadiths

Edit the `HADITHS` array in `script.js`:

```javascript
const HADITHS = [
    "Your hadith text here...",
    // Add more hadiths
];
```

### Add Your Own Ayats

Edit the `AYATS` array in `script.js`:

```javascript
const AYATS = [
    "Your ayat text here...",
    // Add more ayats
];
```

### Adjust Iqama Times

Modify the `calculateIqama()` function calls in `fetchPrayerTimes()`:

```javascript
prayerData.fajr.iqama = calculateIqama(timings.Fajr, 20); // 20 minutes after Fajr
```

## How to Use

1. Open `index.html` in a web browser
2. The website will automatically fetch and display prayer times
3. Prayer times update every 60 seconds
4. Hadiths rotate every 30 seconds
5. Use the interactive features by clicking on various elements

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

**Note**: Browser must support Geolocation API for automatic location detection.

## Permissions Required

- **Location Access**: To detect your location and fetch accurate prayer times
- **Internet Connection**: To fetch prayer times and location data

## Privacy

- Your location is NOT stored or saved
- Location is only used to fetch prayer times from the API
- No personal data is sent to any external servers
- All data fetching is done through public APIs

## Notes

- The website uses a gradient blue background similar to the original
- Prayer times are fetched from a public API and may vary slightly from your local mosque
- The website is fully responsive and works on all screen sizes
- All interactive features from the original Tawkit website are implemented

## Future Customization Ideas

- Connect to your mosque's specific prayer time API
- Add custom announcements
- Integrate with local weather API
- Add prayer notifications
- Customize colors and themes
- Add multiple language support

## License

This is a clone for educational and personal use. Please respect the original Tawkit website and its creators.
