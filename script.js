const CONFIG = {
    sourceUrl: 'https://offline.tawkit.net/',
    updateInterval: 60000,
    clockMini: false,
    showAnnouncements: false,
    showAyats: false,
    fivePrayersMode: false,
    showIqamaWithTime: true,
    datePosition: 'default',
    nextPrayerEnlarged: false,
    currentHadithIndex: 0,
    userLocation: null,
    locationName: 'جاري تحديد الموقع...',
    omanRegion: null,
    isInOman: false,
    use12HourFormat: true,
    timeOffset: 0,
    useManualTimes: false
};

// Load settings from localStorage
function loadSettings() {
    const savedOffset = localStorage.getItem('timeOffset');
    if (savedOffset) {
        CONFIG.timeOffset = parseInt(savedOffset);
    }
    
    const saved12Hour = localStorage.getItem('use12HourFormat');
    if (saved12Hour !== null) {
        CONFIG.use12HourFormat = saved12Hour === 'true';
    }
    
    const savedMosqueName = localStorage.getItem('mosqueName');
    if (savedMosqueName) {
        CONFIG.locationName = savedMosqueName;
    }
    
    const useManual = localStorage.getItem('useManualTimes');
    if (useManual === 'true') {
        CONFIG.useManualTimes = true;
    }
}

const HADITHS = [
    "قال رسول الله ﷺ: 'خيركم من تعلم القرآن وعلمه' (البخاري)",
    "قال رسول الله ﷺ: 'المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف' (مسلم)",
    "قال رسول الله ﷺ: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت' (البخاري)",
    "قال رسول الله ﷺ: 'أحب الأعمال إلى الله أدومها وإن قل' (البخاري)",
    "قال رسول الله ﷺ: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه' (البخاري)",
    "قال رسول الله ﷺ: 'الكلمة الطيبة صدقة' (البخاري)",
    "قال رسول الله ﷺ: 'تبسمك في وجه أخيك صدقة' (الترمذي)",
    "قال رسول الله ﷺ: 'من صلى الفجر في جماعة فهو في ذمة الله' (مسلم)",
    "قال رسول الله ﷺ: 'الصلوات الخمس والجمعة إلى الجمعة كفارات لما بينهن' (مسلم)",
    "قال رسول الله ﷺ: 'من حافظ على الصلوات الخمس كانت له نوراً وبرهاناً يوم القيامة' (أحمد)"
];

const AYATS = [
    "وَقُل رَّبِّ زِدْنِي عِلْمًا (طه: 114)",
    "إِنَّ مَعَ الْعُسْرِ يُسْرًا (الشرح: 6)",
    "فَاذْكُرُونِي أَذْكُرْكُمْ (البقرة: 152)",
    "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ (هود: 115)",
    "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا (النساء: 103)",
    "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ (البقرة: 238)"
];

let prayerData = {
    fajr: { adhan: '--:--' },
    sunrise: { adhan: '--:--' },
    dhuhr: { adhan: '--:--' },
    asr: { adhan: '--:--' },
    maghrib: { adhan: '--:--' },
    isha: { adhan: '--:--' },
    tomorrowFajr: '--:--'
};

let clickCounts = {
    weather: 0,
    maghrib: 0,
    tomorrowFajr: 0
};

const PRAYER_NAMES_AR = {
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء'
};

function initializeApp() {
    loadSettings();
    getLocation();
    updateClock();
    updateDates();
    setupEventListeners();
    displayHadith();
    
    // Initialize weather if available
    if (typeof initializeWeather === 'function') {
        initializeWeather();
    }
    
    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(fetchPrayerTimes, CONFIG.updateInterval);
    setInterval(() => {
        if (!CONFIG.showAnnouncements) {
            CONFIG.currentHadithIndex = (CONFIG.currentHadithIndex + 1) % HADITHS.length;
            displayHadith();
        }
    }, 30000);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                CONFIG.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Check if location is in Oman
                CONFIG.isInOman = isInOman(position.coords.latitude, position.coords.longitude);
                
                if (CONFIG.isInOman) {
                    // Find closest Oman region
                    CONFIG.omanRegion = findClosestOmanRegion(position.coords.latitude, position.coords.longitude);
                    CONFIG.locationName = CONFIG.omanRegion.nameAr + '، عُمان';
                    document.getElementById('mosque-name').textContent = CONFIG.locationName;
                    console.log('موقع عماني تم اكتشافه:', CONFIG.omanRegion.nameAr);
                    
                    // Hide loading screen
                    setTimeout(() => {
                        document.getElementById('loading-screen').classList.add('hidden');
                        document.getElementById('main-container').classList.remove('hidden');
                    }, 500);
                } else {
                    fetchLocationName(position.coords.latitude, position.coords.longitude);
                }
                
                fetchPrayerTimes();
            },
            (error) => {
                console.error('خطأ في تحديد الموقع:', error);
                // Default to Muscat, Oman
                CONFIG.isInOman = true;
                CONFIG.omanRegion = OMAN_REGIONS.muscat;
                CONFIG.locationName = 'مسقط، عُمان';
                CONFIG.userLocation = {
                    latitude: 23.5880,
                    longitude: 58.3829
                };
                document.getElementById('mosque-name').textContent = CONFIG.locationName;
                
                // Hide loading screen
                setTimeout(() => {
                    document.getElementById('loading-screen').classList.add('hidden');
                    document.getElementById('main-container').classList.remove('hidden');
                }, 500);
                
                fetchPrayerTimes();
            }
        );
    } else {
        console.error('المتصفح لا يدعم تحديد الموقع');
        // Default to Muscat, Oman
        CONFIG.isInOman = true;
        CONFIG.omanRegion = OMAN_REGIONS.muscat;
        CONFIG.locationName = 'مسقط، عُمان';
        CONFIG.userLocation = {
            latitude: 23.5880,
            longitude: 58.3829
        };
        document.getElementById('mosque-name').textContent = CONFIG.locationName;
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('main-container').classList.remove('hidden');
        }, 500);
        
        fetchPrayerTimes();
    }
}

async function fetchLocationName(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`);
        const data = await response.json();
        
        if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state;
            const country = data.address.country;
            CONFIG.locationName = `${city}, ${country}`;
            document.getElementById('mosque-name').textContent = CONFIG.locationName;
        }
    } catch (error) {
        console.error('خطأ في جلب اسم الموقع:', error);
        CONFIG.locationName = 'موقعك الحالي';
        document.getElementById('mosque-name').textContent = CONFIG.locationName;
    }
    
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
    }, 500);
}

// Convert 24-hour time to 12-hour format
function convertTo12Hour(time24) {
    if (!CONFIG.use12HourFormat) return time24;
    
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'م' : 'ص'; // م for PM (مساء), ص for AM (صباح)
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Convert 12-hour time back to 24-hour for calculations
function convertTo24Hour(time12) {
    const match = time12.match(/(\d+):(\d+)\s*([صم])/);
    if (!match) return time12;
    
    let [_, hours, minutes, period] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (period === 'م' && hours !== 12) hours += 12;
    if (period === 'ص' && hours === 12) hours = 0;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function fetchPrayerTimes() {
    // Check if manual times are set
    if (CONFIG.useManualTimes) {
        loadManualPrayerTimes();
        return;
    }
    
    try {
        let url;
        
        // For Oman locations, use coordinates-based API with Oman-specific calculation method
        if (CONFIG.isInOman && CONFIG.userLocation) {
            // Method 4 is Umm Al-Qura University, Makkah (used in Oman)
            url = `https://api.aladhan.com/v1/timings?latitude=${CONFIG.userLocation.latitude}&longitude=${CONFIG.userLocation.longitude}&method=4`;
        } else if (CONFIG.userLocation) {
            url = `https://api.aladhan.com/v1/timings?latitude=${CONFIG.userLocation.latitude}&longitude=${CONFIG.userLocation.longitude}&method=8`;
        } else {
            // Default to Muscat
            url = 'https://api.aladhan.com/v1/timings?latitude=23.5880&longitude=58.3829&method=4';
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            const timings = data.data.timings;
            
            // Store times in 24-hour format for calculations
            prayerData.fajr.adhan = applyTimeOffset(formatTime(timings.Fajr));
            prayerData.sunrise.adhan = applyTimeOffset(formatTime(timings.Sunrise));
            prayerData.dhuhr.adhan = applyTimeOffset(formatTime(timings.Dhuhr));
            prayerData.asr.adhan = applyTimeOffset(formatTime(timings.Asr));
            prayerData.maghrib.adhan = applyTimeOffset(formatTime(timings.Maghrib));
            prayerData.isha.adhan = applyTimeOffset(formatTime(timings.Isha));
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);
            
            let tomorrowUrl;
            if (CONFIG.isInOman && CONFIG.userLocation) {
                tomorrowUrl = `https://api.aladhan.com/v1/timings/${tomorrowTimestamp}?latitude=${CONFIG.userLocation.latitude}&longitude=${CONFIG.userLocation.longitude}&method=4`;
            } else if (CONFIG.userLocation) {
                tomorrowUrl = `https://api.aladhan.com/v1/timings/${tomorrowTimestamp}?latitude=${CONFIG.userLocation.latitude}&longitude=${CONFIG.userLocation.longitude}&method=8`;
            } else {
                tomorrowUrl = `https://api.aladhan.com/v1/timings/${tomorrowTimestamp}?latitude=23.5880&longitude=58.3829&method=4`;
            }
            
            const tomorrowResponse = await fetch(tomorrowUrl);
            const tomorrowData = await tomorrowResponse.json();
            if (tomorrowData.code === 200) {
                prayerData.tomorrowFajr = formatTime(tomorrowData.data.timings.Fajr);
            }
            
            updatePrayerTimesDisplay();
            updateNextPrayer();
        }
    } catch (error) {
        console.error('خطأ في جلب أوقات الصلاة:', error);
        generateSamplePrayerTimes();
    }
}

function generateSamplePrayerTimes() {
    prayerData = {
        fajr: { adhan: '05:30', iqama: '05:50' },
        sunrise: { adhan: '06:50' },
        dhuhr: { adhan: '12:25', iqama: '12:35' },
        asr: { adhan: '15:45', iqama: '15:55' },
        maghrib: { adhan: '18:15', iqama: '18:20' },
        isha: { adhan: '19:45', iqama: '20:00' },
        tomorrowFajr: '05:28'
    };
    updatePrayerTimesDisplay();
    updateNextPrayer();
}

function formatTime(time) {
    return time.substring(0, 5);
}

// Apply time offset from admin panel
function applyTimeOffset(time) {
    if (CONFIG.timeOffset === 0) return time;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + CONFIG.timeOffset;
    const newHours = Math.floor((totalMinutes + 1440) / 60) % 24;
    const newMinutes = (totalMinutes + 1440) % 60;
    
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// Load manual prayer times from localStorage
function loadManualPrayerTimes() {
    const manualTimesStr = localStorage.getItem('manualPrayerTimes');
    if (!manualTimesStr) {
        CONFIG.useManualTimes = false;
        fetchPrayerTimes();
        return;
    }
    
    try {
        const times = JSON.parse(manualTimesStr);
        
        prayerData.fajr.adhan = times.fajr || '--:--';
        prayerData.sunrise.adhan = times.sunrise || '--:--';
        prayerData.dhuhr.adhan = times.dhuhr || '--:--';
        prayerData.asr.adhan = times.asr || '--:--';
        prayerData.maghrib.adhan = times.maghrib || '--:--';
        prayerData.isha.adhan = times.isha || '--:--';
        
        // Use tomorrow's Fajr from current Fajr time (add 1 day)
        prayerData.tomorrowFajr = times.fajr || '--:--';
        
        updatePrayerTimesDisplay();
        updateNextPrayer();
    } catch (error) {
        console.error('خطأ في تحميل الأوقات اليدوية:', error);
        CONFIG.useManualTimes = false;
        fetchPrayerTimes();
    }
}


function updatePrayerTimesDisplay() {
    Object.keys(prayerData).forEach(prayer => {
        if (prayer === 'tomorrowFajr') {
            const displayTime = CONFIG.use12HourFormat ? convertTo12Hour(prayerData[prayer]) : prayerData[prayer];
            document.getElementById('tomorrow-fajr-time').textContent = displayTime;
            return;
        }
        
        const card = document.querySelector(`.prayer-card[data-prayer="${prayer}"]`);
        if (card) {
            const timeElement = card.querySelector('.prayer-time');
            
            if (timeElement) {
                const displayTime = CONFIG.use12HourFormat ? convertTo12Hour(prayerData[prayer].adhan) : prayerData[prayer].adhan;
                timeElement.textContent = displayTime;
            }
        }
    });
}

function updateClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    if (CONFIG.use12HourFormat) {
        const period = hours24 >= 12 ? 'م' : 'ص';
        const hours12 = hours24 % 12 || 12;
        document.getElementById('clock').textContent = `${hours12}:${minutes}:${seconds} ${period}`;
    } else {
        const hours = String(hours24).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function updateDates() {
    const now = new Date();
    
    const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('gregorian-date').textContent = now.toLocaleDateString('ar-SA', gregorianOptions);
    
    // Apply Hijri date offset if set
    const hijriOffset = parseInt(localStorage.getItem('hijriDateOffset')) || 0;
    const adjustedDate = new Date(now);
    adjustedDate.setDate(adjustedDate.getDate() + hijriOffset);
    
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(adjustedDate);
    document.getElementById('hijri-date').textContent = hijriDate;
}

function updateNextPrayer() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'fajr', nameAr: PRAYER_NAMES_AR.fajr, time: prayerData.fajr.adhan },
        { name: 'dhuhr', nameAr: PRAYER_NAMES_AR.dhuhr, time: prayerData.dhuhr.adhan },
        { name: 'asr', nameAr: PRAYER_NAMES_AR.asr, time: prayerData.asr.adhan },
        { name: 'maghrib', nameAr: PRAYER_NAMES_AR.maghrib, time: prayerData.maghrib.adhan },
        { name: 'isha', nameAr: PRAYER_NAMES_AR.isha, time: prayerData.isha.adhan }
    ];
    
    document.querySelectorAll('.prayer-card').forEach(card => card.classList.remove('active'));
    
    for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        // If current time is before this prayer time, this is the next prayer
        if (currentMinutes < prayerMinutes) {
            document.getElementById('next-prayer-name').textContent = prayer.nameAr;
            const card = document.querySelector(`.prayer-card[data-prayer="${prayer.name}"]`);
            if (card) card.classList.add('active');
            return;
        }
        
        // If current time equals prayer time, show the NEXT prayer in the list
        if (currentMinutes === prayerMinutes) {
            const nextPrayer = prayers[i + 1];
            if (nextPrayer) {
                document.getElementById('next-prayer-name').textContent = nextPrayer.nameAr;
                const card = document.querySelector(`.prayer-card[data-prayer="${nextPrayer.name}"]`);
                if (card) card.classList.add('active');
            } else {
                // If this is Isha, next prayer is tomorrow's Fajr
                document.getElementById('next-prayer-name').textContent = PRAYER_NAMES_AR.fajr;
                const fajrCard = document.querySelector('.prayer-card[data-prayer="fajr"]');
                if (fajrCard) fajrCard.classList.add('active');
            }
            return;
        }
    }
    
    // If we're past all prayers, next is tomorrow's Fajr
    document.getElementById('next-prayer-name').textContent = PRAYER_NAMES_AR.fajr;
    const fajrCard = document.querySelector('.prayer-card[data-prayer="fajr"]');
    if (fajrCard) fajrCard.classList.add('active');
}

// Track which prayers have been notified
let notifiedPrayers = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
};

function updateCountdown() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    const prayers = [
        { name: 'fajr', nameAr: PRAYER_NAMES_AR.fajr, time: prayerData.fajr.adhan },
        { name: 'dhuhr', nameAr: PRAYER_NAMES_AR.dhuhr, time: prayerData.dhuhr.adhan },
        { name: 'asr', nameAr: PRAYER_NAMES_AR.asr, time: prayerData.asr.adhan },
        { name: 'maghrib', nameAr: PRAYER_NAMES_AR.maghrib, time: prayerData.maghrib.adhan },
        { name: 'isha', nameAr: PRAYER_NAMES_AR.isha, time: prayerData.isha.adhan }
    ];
    
    // Check if it's time for adhan notification
    prayers.forEach(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        // If current time matches prayer time (within the same minute) and not yet notified
        if (currentMinutes === prayerMinutes && currentSeconds < 5 && !notifiedPrayers[prayer.name]) {
            showAdhanNotification(prayer.nameAr);
            notifiedPrayers[prayer.name] = true;
        }
        
        // Reset notification flag when we're past the prayer time
        if (currentMinutes > prayerMinutes) {
            notifiedPrayers[prayer.name] = false;
        }
    });
    
    // Reset all flags at midnight
    if (currentMinutes === 0 && currentSeconds < 5) {
        Object.keys(notifiedPrayers).forEach(key => notifiedPrayers[key] = false);
    }
    
    let targetPrayer = null;
    
    for (let prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        if (currentMinutes < prayerMinutes) {
            targetPrayer = { ...prayer, minutes: prayerMinutes };
            break;
        }
    }
    
    if (!targetPrayer) {
        const [hours, minutes] = prayerData.fajr.adhan.split(':').map(Number);
        targetPrayer = { name: 'fajr', nameAr: PRAYER_NAMES_AR.fajr, time: prayerData.fajr.adhan, minutes: hours * 60 + minutes + 1440 };
    }
    
    let remainingMinutes = targetPrayer.minutes - currentMinutes;
    if (remainingMinutes < 0) remainingMinutes += 1440;
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    const seconds = 60 - now.getSeconds();
    
    document.getElementById('next-prayer-countdown').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function showAdhanNotification(prayerName) {
    // Create notification overlay
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #0a1929 0%, #1a2332 100%);
        border: 3px solid #ffd700;
        border-radius: 20px;
        padding: 40px 60px;
        z-index: 10000;
        box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
        text-align: center;
        animation: slideIn 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <style>
            @keyframes slideIn {
                from { transform: translate(-50%, -60%); opacity: 0; }
                to { transform: translate(-50%, -50%); opacity: 1; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        </style>
        <div style="font-size: 3rem; color: #ffd700; margin-bottom: 20px; animation: pulse 2s infinite;">🕌</div>
        <h2 style="color: white; font-size: 2rem; margin-bottom: 15px; font-family: 'Cairo', sans-serif;">
            حان الآن موعد أذان صلاة ${prayerName}
        </h2>
        <p style="color: #ffd700; font-size: 1.5rem; font-family: 'Cairo', sans-serif;">
            الله أكبر الله أكبر
        </p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 30px;
            padding: 15px 40px;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border: none;
            border-radius: 10px;
            color: #0a1929;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
        ">حسناً</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
    
    // Play notification sound if available
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXyzn0vBSh+zPDckTsKE1yx6OyrWBQLSKDf8sFuJAUuhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQtIoN/ywW4kBS+Ez/PYiTYHF2S77OihUBELTKXh8bllHAU3jdXyzn0vBSh+zPDckTsKE1yx6OyrWBULSKDf8sFuJAUvhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQtIoN/ywW4kBS+Ez/PYiTYHF2S77OihUBELTKXh8bllHAU3jdXyzn0vBSh+zPDckTsKE1yx6OyrWBULSKDf8sFuJAUvhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQtIoN/ywW4kBS+Ez/PYiTYHF2S77OihUBELTKXh8bllHAU3jdXyzn0vBSh+zPDckTsKE1yx6OyrWBULSKDf8sFuJAUvhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQtIoN/ywW4kBS+Ez/PYiTYHF2S77OihUBELTKXh8bllHAU3jdXyzn0vBSh+zPDckTsKE1yx6OyrWBULSKDf8sFuJAUvhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQtIoN/ywW4kBS+Ez/PYiTYHF2S77OihUBELTKXh8bllHAU3jdXyzn0vBSh+zPDckTsKE1yx6OyrWBULSKDf8sFuJAUvhM/z2Ik2Bxdku+zooVARC0yl4fG5ZRwFN43V8s59LwUofszw3JE7ChNcsejsq1gVC0ig3/LBbiQFL4TP89iJNgcXZLvs6KFQEQtMpeHxuWUcBTeN1fLOfS8FKH7M8NyROwsTXLHo7KtYFQ==');
        audio.play().catch(() => {});
    } catch (e) {}
}

function displayHadith() {
    const hadithText = HADITHS[CONFIG.currentHadithIndex];
    document.getElementById('hadith-text').innerHTML = `<p>${hadithText}</p>`;
}

function setupEventListeners() {
    document.getElementById('clock').addEventListener('click', () => {
        CONFIG.clockMini = !CONFIG.clockMini;
        document.getElementById('clock').classList.toggle('clock-mini', CONFIG.clockMini);
    });
    
    document.getElementById('hadith-container').addEventListener('click', () => {
        CONFIG.showAnnouncements = !CONFIG.showAnnouncements;
        document.getElementById('hadith-container').classList.toggle('hidden', CONFIG.showAnnouncements);
        document.getElementById('announcements-container').classList.toggle('hidden', !CONFIG.showAnnouncements);
    });
    
    const ishaIqama = document.querySelector('.prayer-card[data-prayer="isha"] .iqama-time');
    if (ishaIqama) {
        ishaIqama.addEventListener('click', () => {
            CONFIG.currentHadithIndex = (CONFIG.currentHadithIndex + 1) % HADITHS.length;
            displayHadith();
        });
    }
    
    document.getElementById('next-prayer-label').addEventListener('click', () => {
        document.body.style.flexDirection = document.body.style.flexDirection === 'column' ? 'row' : 'column';
    });
    
    document.getElementById('next-prayer-countdown').addEventListener('click', () => {
        CONFIG.nextPrayerEnlarged = !CONFIG.nextPrayerEnlarged;
        document.getElementById('next-prayer-countdown').style.fontSize = CONFIG.nextPrayerEnlarged ? '4rem' : '3rem';
    });
    
    document.getElementById('logo').addEventListener('dblclick', () => {
        document.getElementById('black-screen').classList.toggle('hidden');
    });
    
    document.getElementById('black-screen').addEventListener('click', () => {
        document.getElementById('black-screen').classList.add('hidden');
    });
    
    document.getElementById('mosque-name').addEventListener('click', () => {
        CONFIG.datePosition = CONFIG.datePosition === 'default' ? 'swapped' : 'default';
    });
    
    document.getElementById('tawkit-name').addEventListener('click', () => {
        CONFIG.fivePrayersMode = !CONFIG.fivePrayersMode;
        document.getElementById('prayer-times').classList.toggle('five-prayers', CONFIG.fivePrayersMode);
    });
    
    document.getElementById('weather').addEventListener('click', () => {
        clickCounts.weather++;
        if (clickCounts.weather >= 7) {
            resetAppSettings();
        }
    });
    
    const fajrIqama = document.querySelector('.prayer-card[data-prayer="fajr"] .iqama-time');
    if (fajrIqama) {
        fajrIqama.addEventListener('dblclick', () => {
            CONFIG.showIqamaWithTime = !CONFIG.showIqamaWithTime;
            updatePrayerTimesDisplay();
        });
    }
    
    const maghribName = document.querySelector('.prayer-card[data-prayer="maghrib"] .prayer-name');
    if (maghribName) {
        maghribName.addEventListener('click', () => {
            clickCounts.maghrib++;
            if (clickCounts.maghrib >= 3) {
                startCounterDemo();
                clickCounts.maghrib = 0;
            }
        });
    }
    
    document.querySelector('.tomorrow-fajr').addEventListener('click', () => {
        clickCounts.tomorrowFajr++;
        if (clickCounts.tomorrowFajr >= 3) {
            CONFIG.showAyats = !CONFIG.showAyats;
            document.getElementById('ayat-section').classList.toggle('hidden', !CONFIG.showAyats);
            if (CONFIG.showAyats) {
                displayRandomAyat();
            }
            clickCounts.tomorrowFajr = 0;
        }
    });
}

function displayRandomAyat() {
    const randomAyat = AYATS[Math.floor(Math.random() * AYATS.length)];
    document.getElementById('ayat-text').textContent = randomAyat;
}

function resetAppSettings() {
    CONFIG.clockMini = false;
    CONFIG.showAnnouncements = false;
    CONFIG.showAyats = false;
    CONFIG.fivePrayersMode = false;
    CONFIG.showIqamaWithTime = true;
    CONFIG.nextPrayerEnlarged = false;
    clickCounts = { weather: 0, maghrib: 0, tomorrowFajr: 0 };
    
    location.reload();
}

function startCounterDemo() {
    let countdown = 10;
    const countdownInterval = setInterval(() => {
        document.getElementById('next-prayer-countdown').textContent = `00:00:${String(countdown).padStart(2, '0')}`;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            updateCountdown();
        }
    }, 1000);
}

window.addEventListener('DOMContentLoaded', initializeApp);
