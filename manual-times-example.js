// مثال: إدخال أوقات الصلاة يدوياً من موقع وزارة الأوقاف
// Example: Manual prayer times entry from Ministry website

// في script.js، استبدل دالة fetchPrayerTimes بهذا:

function setManualPrayerTimes() {
    // أوقات مسقط - ديسمبر 2025
    // Muscat times - December 2025
    // احصل على الأوقات من: https://www.mara.gov.om/arabic/calendar_page2.asp
    
    const today = new Date().getDate();
    
    // جدول الأوقات لشهر ديسمبر (مثال)
    const decemberTimes = {
        1: { fajr: '05:15', sunrise: '06:35', dhuhr: '12:05', asr: '15:15', maghrib: '17:35', isha: '18:55' },
        2: { fajr: '05:15', sunrise: '06:35', dhuhr: '12:05', asr: '15:15', maghrib: '17:35', isha: '18:55' },
        3: { fajr: '05:16', sunrise: '06:36', dhuhr: '12:06', asr: '15:16', maghrib: '17:36', isha: '18:56' },
        // ... أضف باقي أيام الشهر من موقع الوزارة
        // ... add rest of month days from Ministry website
        30: { fajr: '05:30', sunrise: '06:50', dhuhr: '12:15', asr: '15:20', maghrib: '17:40', isha: '19:00' }
    };
    
    const todayTimes = decemberTimes[today] || decemberTimes[1];
    
    // تعيين الأوقات
    prayerData.fajr.adhan = todayTimes.fajr;
    prayerData.fajr.iqama = calculateIqama(todayTimes.fajr, 20);
    prayerData.sunrise.adhan = todayTimes.sunrise;
    prayerData.dhuhr.adhan = todayTimes.dhuhr;
    prayerData.dhuhr.iqama = calculateIqama(todayTimes.dhuhr, 10);
    prayerData.asr.adhan = todayTimes.asr;
    prayerData.asr.iqama = calculateIqama(todayTimes.asr, 10);
    prayerData.maghrib.adhan = todayTimes.maghrib;
    prayerData.maghrib.iqama = calculateIqama(todayTimes.maghrib, 5);
    prayerData.isha.adhan = todayTimes.isha;
    prayerData.isha.iqama = calculateIqama(todayTimes.isha, 15);
    
    // غداً
    const tomorrow = decemberTimes[today + 1] || decemberTimes[1];
    prayerData.tomorrowFajr = tomorrow.fajr;
    
    updatePrayerTimesDisplay();
    updateNextPrayer();
}

// استخدم هذه الدالة بدلاً من fetchPrayerTimes
// في دالة getLocation، استبدل:
// fetchPrayerTimes();
// بـ:
// setManualPrayerTimes();

/* 
 * خطوات الاستخدام:
 * 1. افتح موقع وزارة الأوقاف
 * 2. اختر منطقتك والشهر الحالي
 * 3. انسخ الأوقات لكل يوم في الجدول أعلاه
 * 4. استبدل fetchPrayerTimes() بـ setManualPrayerTimes()
 * 5. حدّث الأوقات كل شهر
 */
