# دليل نظام أوقات الصلاة العماني
# Oman Prayer Times System Guide

## نظرة عامة | Overview

تم تطوير هذا النظام خصيصاً لسلطنة عُمان مع التكامل مع بيانات وزارة الأوقاف والشؤون الدينية العمانية.

This system has been specifically developed for the Sultanate of Oman with integration to the Ministry of Awqaf and Religious Affairs data.

---

## المميزات الرئيسية | Key Features

### 🇴🇲 تحديد المواقع العمانية التلقائي
**Automatic Oman Location Detection**

- يكتشف النظام تلقائياً إذا كنت في عُمان
- يحدد أقرب منطقة/مدينة عمانية لموقعك
- يعرض اسم المنطقة باللغة العربية

- System automatically detects if you are in Oman
- Identifies the closest Oman region/city to your location
- Displays region name in Arabic

### ⏰ صيغة 12 ساعة
**12-Hour Format**

- جميع الأوقات تُعرض بصيغة 12 ساعة (ص/م)
- ص = صباحاً (AM)
- م = مساءً (PM)

- All times displayed in 12-hour format (AM/PM)
- ص = Morning (AM)
- م = Evening (PM)

### 🕌 طريقة الحساب العمانية
**Oman Calculation Method**

يستخدم النظام طريقة أم القرى (Method 4) المعتمدة في سلطنة عُمان لحساب أوقات الصلاة.

The system uses the Umm Al-Qura method (Method 4) approved in the Sultanate of Oman for prayer time calculations.

---

## المناطق المدعومة | Supported Regions

### محافظة مسقط | Muscat Governorate
- مسقط (Muscat)
- مطرح (Muttrah)
- بوشر (Bawshar)
- السيب (Seeb)

### محافظة ظفار | Dhofar Governorate
- صلالة (Salalah)
- طاقة (Taqah)
- مرباط (Mirbat)

### محافظة مسندم | Musandam Governorate
- خصب (Khasab)
- دبا البيعة (Dibba Al-Baya)

### محافظة البريمي | Al Buraimi Governorate
- البريمي (Al Buraimi)

### محافظة الداخلية | Ad Dakhliyah Governorate
- نزوى (Nizwa)
- بهلاء (Bahla)
- منح (Manah)
- ادم (Adam)
- ازكي (Izki)
- سمائل (Samail)

### محافظة الشرقية شمال | Ash Sharqiyah North
- صور (Sur)
- ابراء (Ibra)
- القابل الشرقية (Al Qabil)
- وادي بني خالد (Wadi Bani Khalid)

### محافظة الشرقية جنوب | Ash Sharqiyah South
- جعلان بوحسن (Jalan Bani Bu Hasan)
- جعلان بوعلي (Jalan Bani Bu Ali)
- مصيرة (Masirah)

### محافظة الظاهرة | Ad Dhahirah Governorate
- عبري (Ibri)
- ينقل (Yanqul)
- ضنك (Dhank)

### محافظة الباطنة شمال | Al Batinah North
- صحار (Sohar)
- شناص (Shinas)
- لوى (Liwa)
- صحم (Saham)
- الخابورة (Al Khabourah)

### محافظة الباطنة جنوب | Al Batinah South
- الرستاق (Rustaq)
- بركاء (Barka)
- نخل (Nakhal)
- وادي المعاول (Wadi Maawil)
- العوابي (Al Awabi)
- المصنعة (Al Musannah)

### محافظة الوسطى | Al Wusta Governorate
- هيما (Haima)
- الدقم (Duqm)
- محوت (Mahout)

---

## كيفية العمل | How It Works

### 1. تحديد الموقع | Location Detection

```javascript
// عند فتح الموقع، يطلب النظام إذن الوصول للموقع
// When opening the site, system requests location permission

navigator.geolocation.getCurrentPosition()
```

### 2. التحقق من الموقع العماني | Verify Oman Location

```javascript
// يتحقق النظام إذا كانت الإحداثيات ضمن حدود عُمان
// System checks if coordinates are within Oman boundaries

isInOman(latitude, longitude)
// Returns: true/false
```

### 3. تحديد أقرب منطقة | Find Closest Region

```javascript
// يحدد النظام أقرب منطقة عمانية
// System identifies closest Oman region

findClosestOmanRegion(latitude, longitude)
// Returns: { nameAr: 'مسقط', nameEn: 'Muscat', ... }
```

### 4. جلب أوقات الصلاة | Fetch Prayer Times

```javascript
// يستخدم طريقة أم القرى (Method 4)
// Uses Umm Al-Qura method (Method 4)

api.aladhan.com/v1/timings?latitude=LAT&longitude=LON&method=4
```

### 5. عرض الأوقات بصيغة 12 ساعة | Display in 12-Hour Format

```javascript
// تحويل من 24 ساعة إلى 12 ساعة
// Convert from 24-hour to 12-hour

convertTo12Hour("14:30") // Returns: "2:30 م"
convertTo12Hour("06:15") // Returns: "6:15 ص"
```

---

## التخصيص | Customization

### تغيير المنطقة الافتراضية | Change Default Region

إذا فشل تحديد الموقع، يستخدم النظام مسقط كموقع افتراضي.
If location detection fails, system defaults to Muscat.

لتغيير المنطقة الافتراضية، عدّل في `script.js`:
To change default region, edit in `script.js`:

```javascript
// في دالة getLocation() - خطأ في تحديد الموقع
// In getLocation() function - location error

CONFIG.omanRegion = OMAN_REGIONS.salalah; // بدلاً من muscat
CONFIG.locationName = 'صلالة، عُمان';
CONFIG.userLocation = {
    latitude: 17.0151,
    longitude: 54.0924
};
```

### تغيير أوقات الإقامة | Change Iqama Times

```javascript
// في دالة fetchPrayerTimes()
// In fetchPrayerTimes() function

prayerData.fajr.iqama = calculateIqama(timings.Fajr, 20);    // 20 دقيقة
prayerData.dhuhr.iqama = calculateIqama(timings.Dhuhr, 10);  // 10 دقائق
prayerData.asr.iqama = calculateIqama(timings.Asr, 10);      // 10 دقائق
prayerData.maghrib.iqama = calculateIqama(timings.Maghrib, 5); // 5 دقائق
prayerData.isha.iqama = calculateIqama(timings.Isha, 15);    // 15 دقيقة
```

### التبديل إلى صيغة 24 ساعة | Switch to 24-Hour Format

```javascript
// في بداية script.js
// At the beginning of script.js

CONFIG.use12HourFormat = false; // تغيير من true إلى false
```

---

## مصادر البيانات | Data Sources

### 1. وزارة الأوقاف والشؤون الدينية العمانية
**Ministry of Awqaf and Religious Affairs**

- الموقع الرسمي: https://www.mara.gov.om
- يوفر أوقات الصلاة الرسمية لجميع مناطق عُمان
- Official website providing prayer times for all Oman regions

### 2. Aladhan API

- يستخدم طريقة أم القرى (Method 4)
- Uses Umm Al-Qura method (Method 4)
- API: https://api.aladhan.com

### 3. OpenStreetMap Nominatim

- لتحويل الإحداثيات إلى أسماء المناطق
- For converting coordinates to region names
- API: https://nominatim.openstreetmap.org

---

## استكشاف الأخطاء | Troubleshooting

### المشكلة: لا يتم اكتشاف الموقع العماني
**Issue: Oman location not detected**

**الحل | Solution:**
1. تأكد من السماح بالوصول للموقع في المتصفح
2. تحقق من أن GPS مفعّل
3. النظام سيستخدم مسقط كموقع افتراضي

1. Ensure location access is allowed in browser
2. Check that GPS is enabled
3. System will default to Muscat

### المشكلة: الأوقات غير دقيقة
**Issue: Times are inaccurate**

**الحل | Solution:**
1. تحقق من أن موقعك محدد بدقة
2. قارن مع موقع وزارة الأوقاف الرسمي
3. قد تختلف الأوقات قليلاً حسب المنطقة

1. Verify your location is accurately detected
2. Compare with official Ministry website
3. Times may vary slightly by region

### المشكلة: الأوقات تظهر بصيغة 24 ساعة
**Issue: Times showing in 24-hour format**

**الحل | Solution:**
```javascript
// تحقق من الإعداد في script.js
// Check setting in script.js
CONFIG.use12HourFormat = true; // يجب أن تكون true
```

---

## الملفات الرئيسية | Main Files

### `oman-locations.js`
- قاعدة بيانات المناطق العمانية
- Oman regions database
- دوال تحديد الموقع
- Location detection functions

### `script.js`
- المنطق الرئيسي للتطبيق
- Main application logic
- جلب وعرض أوقات الصلاة
- Fetching and displaying prayer times
- تحويل صيغة الوقت
- Time format conversion

### `index.html`
- واجهة المستخدم العربية
- Arabic user interface
- عناصر العرض
- Display elements

### `styles.css`
- التصميم والأنماط
- Design and styling
- دعم RTL
- RTL support

---

## ملاحظات مهمة | Important Notes

### ⚠️ الدقة | Accuracy

- الأوقات المعروضة تعتمد على الإحداثيات الجغرافية
- Times displayed are based on GPS coordinates
- قد تختلف قليلاً عن أوقات المساجد المحلية
- May differ slightly from local mosque times
- يُنصح بالتحقق من أوقات مسجدك المحلي
- Recommended to verify with your local mosque

### 🔒 الخصوصية | Privacy

- لا يتم حفظ موقعك
- Your location is not saved
- يُستخدم فقط لجلب أوقات الصلاة
- Used only to fetch prayer times
- لا يتم إرسال بيانات لخوادم خارجية
- No data sent to external servers

### 📱 التوافق | Compatibility

- يعمل على جميع المتصفحات الحديثة
- Works on all modern browsers
- يتطلب دعم Geolocation API
- Requires Geolocation API support
- يحتاج اتصال بالإنترنت
- Requires internet connection

---

## الدعم | Support

للمزيد من المعلومات أو الإبلاغ عن مشاكل:
For more information or to report issues:

- راجع ملف README.md
- Check README.md file
- راجع ملف README_AR.md للتوثيق العربي
- Check README_AR.md for Arabic documentation

---

## الترخيص | License

هذا المشروع للاستخدام الشخصي والتعليمي
This project is for personal and educational use

مع الاحترام لبيانات وزارة الأوقاف والشؤون الدينية العمانية
With respect to Ministry of Awqaf and Religious Affairs data
