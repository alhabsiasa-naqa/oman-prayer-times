# دليل دمج المشروع في تطبيق Android
# Android WebView Integration Guide

## 📱 نظرة عامة | Overview

هذا الدليل يشرح كيفية عرض موقع أوقات الصلاة داخل تطبيق Android باستخدام WebView.

---

## 🎯 المتطلبات | Requirements

### 1. Android Studio
- الإصدار: Arctic Fox أو أحدث
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 33 أو أحدث

### 2. رابط الموقع
بعد رفع المشروع على GitHub Pages:
```
https://YOUR_USERNAME.github.io/oman-prayer-times/
```

---

## 🚀 الطريقة 1: WebView بسيط (الأسهل)

### الخطوة 1: إضافة أذونات الإنترنت

في ملف `AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourcompany.prayertimes">

    <!-- إضافة إذن الإنترنت -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PrayerTimes"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

### الخطوة 2: تصميم Layout

في ملف `res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <!-- شريط التحميل -->
    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:visibility="visible" />

    <!-- WebView -->
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</RelativeLayout>
```

### الخطوة 3: كود Java/Kotlin

#### Java (MainActivity.java):

```java
package com.yourcompany.prayertimes;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private static final int LOCATION_PERMISSION_REQUEST = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        // طلب أذونات الموقع
        requestLocationPermission();

        // إعداد WebView
        setupWebView();

        // تحميل الموقع
        webView.loadUrl("https://YOUR_USERNAME.github.io/oman-prayer-times/");
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // تفعيل JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // تفعيل DOM Storage
        webSettings.setDomStorageEnabled(true);
        
        // تفعيل Geolocation
        webSettings.setGeolocationEnabled(true);
        
        // تفعيل Zoom
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Cache
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // دعم RTL
        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.TEXT_AUTOSIZING);

        // WebViewClient للتحكم في التنقل
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }
        });

        // WebChromeClient لدعم Geolocation
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(
                String origin, 
                GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });
    }

    private void requestLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, 
            Manifest.permission.ACCESS_FINE_LOCATION) 
            != PackageManager.PERMISSION_GRANTED) {
            
            ActivityCompat.requestPermissions(this,
                new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                },
                LOCATION_PERMISSION_REQUEST);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

#### Kotlin (MainActivity.kt):

```kotlin
package com.yourcompany.prayertimes

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private val LOCATION_PERMISSION_REQUEST = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)

        requestLocationPermission()
        setupWebView()

        webView.loadUrl("https://YOUR_USERNAME.github.io/oman-prayer-times/")
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            setGeolocationEnabled(true)
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }

            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.visibility = if (newProgress < 100) View.VISIBLE else View.GONE
            }
        }
    }

    private fun requestLocationPermission() {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ),
                LOCATION_PERMISSION_REQUEST
            )
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

---

## 🎨 الطريقة 2: WebView مع ميزات إضافية

### إضافة Splash Screen

في `res/layout/activity_splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/primary_color">

    <ImageView
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:layout_centerInParent="true"
        android:src="@drawable/ic_mosque"
        android:contentDescription="@string/app_name" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="50dp"
        android:text="أوقات الصلاة"
        android:textColor="@android:color/white"
        android:textSize="24sp"
        android:textStyle="bold" />

</RelativeLayout>
```

### إضافة Pull to Refresh

في `build.gradle (Module: app)`:

```gradle
dependencies {
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
```

في `activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.swiperefreshlayout.widget.SwipeRefreshLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/swipeRefresh"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
```

في MainActivity:

```java
SwipeRefreshLayout swipeRefresh = findViewById(R.id.swipeRefresh);
swipeRefresh.setOnRefreshListener(() -> {
    webView.reload();
    swipeRefresh.setRefreshing(false);
});
```

---

## 🔧 إعدادات متقدمة

### 1. تخزين البيانات Offline

```java
webSettings.setAppCacheEnabled(true);
webSettings.setAppCachePath(getCacheDir().getAbsolutePath());
webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
```

### 2. دعم ملء الشاشة

```java
@Override
public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );
    }
}
```

### 3. منع Sleep أثناء العرض

```java
getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
```

---

## 📱 اختبار التطبيق

### 1. على المحاكي (Emulator)
- تأكد من تفعيل GPS في إعدادات المحاكي
- استخدم Location Mocking لتجربة مواقع مختلفة

### 2. على جهاز حقيقي
- فعّل Developer Options
- فعّل USB Debugging
- اسمح بأذونات الموقع

---

## 🐛 حل المشاكل الشائعة

### المشكلة: الموقع لا يُحمّل
**الحل:**
```java
// تأكد من إضافة هذا في AndroidManifest.xml
android:usesCleartextTraffic="true"
```

### المشكلة: JavaScript لا يعمل
**الحل:**
```java
webSettings.setJavaScriptEnabled(true);
```

### المشكلة: localStorage لا يعمل
**الحل:**
```java
webSettings.setDomStorageEnabled(true);
webSettings.setDatabaseEnabled(true);
```

### المشكلة: الموقع لا يطلب أذونات الموقع
**الحل:**
```java
webView.setWebChromeClient(new WebChromeClient() {
    @Override
    public void onGeolocationPermissionsShowPrompt(
        String origin, 
        GeolocationPermissions.Callback callback) {
        callback.invoke(origin, true, false);
    }
});
```

---

## 📦 ملف build.gradle كامل

```gradle
plugins {
    id 'com.android.application'
}

android {
    compileSdk 33

    defaultConfig {
        applicationId "com.yourcompany.prayertimes"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
```

---

## ✅ قائمة التحقق

- [ ] تم إضافة أذونات الإنترنت والموقع
- [ ] تم تفعيل JavaScript
- [ ] تم تفعيل DOM Storage
- [ ] تم تفعيل Geolocation
- [ ] تم إضافة WebChromeClient
- [ ] تم اختبار على المحاكي
- [ ] تم اختبار على جهاز حقيقي
- [ ] تم اختبار أذونات الموقع
- [ ] تم اختبار زر الرجوع

---

## 🎯 نصائح للأداء الأفضل

1. **استخدم Hardware Acceleration**
   ```xml
   <application android:hardwareAccelerated="true">
   ```

2. **قلل استخدام الذاكرة**
   ```java
   @Override
   protected void onDestroy() {
       webView.destroy();
       super.onDestroy();
   }
   ```

3. **أضف Error Handling**
   ```java
   webView.setWebViewClient(new WebViewClient() {
       @Override
       public void onReceivedError(WebView view, WebResourceRequest request, 
           WebResourceError error) {
           // عرض رسالة خطأ للمستخدم
       }
   });
   ```

---

## 🚀 خطوات النشر

1. **بناء APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

2. **توقيع التطبيق**
   - Build → Generate Signed Bundle / APK
   - اختر APK
   - أنشئ Keystore جديد أو استخدم موجود

3. **رفع على Google Play**
   - اذهب إلى Google Play Console
   - أنشئ تطبيق جديد
   - ارفع APK الموقّع
   - املأ معلومات التطبيق

---

## 📞 الدعم

للمزيد من المساعدة:
- راجع التوثيق الرسمي: https://developer.android.com/guide/webapps/webview
- راجع ملفات المشروع الأخرى

---

## 🎉 تهانينا!

تطبيقك جاهز الآن! 📱✨
