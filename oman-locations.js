// Oman Governorates and Cities Mapping
// Based on Oman Ministry of Awqaf and Religious Affairs regions

const OMAN_REGIONS = {
    // Muscat Governorate
    'muscat': {
        nameAr: 'مسقط',
        nameEn: 'Muscat',
        governmentCode: 'مسقط',
        coordinates: { lat: 23.5880, lon: 58.3829 }
    },
    'muttrah': {
        nameAr: 'مطرح',
        nameEn: 'Muttrah',
        governmentCode: 'مسقط',
        coordinates: { lat: 23.6145, lon: 58.5636 }
    },
    'bawshar': {
        nameAr: 'بوشر',
        nameEn: 'Bawshar',
        governmentCode: 'مسقط',
        coordinates: { lat: 23.5772, lon: 58.3995 }
    },
    'seeb': {
        nameAr: 'السيب',
        nameEn: 'Seeb',
        governmentCode: 'السيب',
        coordinates: { lat: 23.6709, lon: 58.1891 }
    },
    
    // Dhofar Governorate
    'salalah': {
        nameAr: 'صلالة',
        nameEn: 'Salalah',
        governmentCode: 'صلالة',
        coordinates: { lat: 17.0151, lon: 54.0924 }
    },
    'taqah': {
        nameAr: 'طاقة',
        nameEn: 'Taqah',
        governmentCode: 'طاقة',
        coordinates: { lat: 17.0394, lon: 54.3994 }
    },
    'mirbat': {
        nameAr: 'مرباط',
        nameEn: 'Mirbat',
        governmentCode: 'مرباط',
        coordinates: { lat: 16.9931, lon: 54.6961 }
    },
    
    // Musandam Governorate
    'khasab': {
        nameAr: 'خصب',
        nameEn: 'Khasab',
        governmentCode: 'خصب',
        coordinates: { lat: 26.1799, lon: 56.2464 }
    },
    'dibba': {
        nameAr: 'دبا البيعة',
        nameEn: 'Dibba Al-Baya',
        governmentCode: 'دبا البيعة',
        coordinates: { lat: 25.6194, lon: 56.2625 }
    },
    
    // Al Buraimi Governorate
    'buraimi': {
        nameAr: 'البريمي',
        nameEn: 'Al Buraimi',
        governmentCode: 'البريمي',
        coordinates: { lat: 24.2500, lon: 55.7931 }
    },
    
    // Ad Dakhliyah Governorate
    'nizwa': {
        nameAr: 'نزوى',
        nameEn: 'Nizwa',
        governmentCode: 'نزوى',
        coordinates: { lat: 22.9333, lon: 57.5333 }
    },
    'bahla': {
        nameAr: 'بهلاء',
        nameEn: 'Bahla',
        governmentCode: 'بهلاء',
        coordinates: { lat: 22.9667, lon: 57.3000 }
    },
    'manah': {
        nameAr: 'منح',
        nameEn: 'Manah',
        governmentCode: 'منح',
        coordinates: { lat: 22.8667, lon: 57.3833 }
    },
    'adam': {
        nameAr: 'ادم',
        nameEn: 'Adam',
        governmentCode: 'ادم',
        coordinates: { lat: 22.3833, lon: 57.8167 }
    },
    'izki': {
        nameAr: 'ازكي',
        nameEn: 'Izki',
        governmentCode: 'ازكي',
        coordinates: { lat: 22.9333, lon: 57.7667 }
    },
    'samail': {
        nameAr: 'سمائل',
        nameEn: 'Samail',
        governmentCode: 'سمائل',
        coordinates: { lat: 23.3000, lon: 57.9833 }
    },
    
    // Ash Sharqiyah North Governorate
    'sur': {
        nameAr: 'صور',
        nameEn: 'Sur',
        governmentCode: 'صور',
        coordinates: { lat: 22.5667, lon: 59.5289 }
    },
    'ibra': {
        nameAr: 'ابراء',
        nameEn: 'Ibra',
        governmentCode: 'ابراء',
        coordinates: { lat: 22.6917, lon: 58.5333 }
    },
    'alqabil': {
        nameAr: 'القابل الشرقية',
        nameEn: 'Al Qabil',
        governmentCode: 'القابل الشرقية',
        coordinates: { lat: 22.2167, lon: 58.9667 }
    },
    'wadi_bani_khalid': {
        nameAr: 'وادي بني خالد',
        nameEn: 'Wadi Bani Khalid',
        governmentCode: 'وادي بني خالد',
        coordinates: { lat: 22.6333, lon: 59.1167 }
    },
    
    // Ash Sharqiyah South Governorate
    'jalan_bani_bu_hasan': {
        nameAr: 'جعلان بوحسن',
        nameEn: 'Jalan Bani Bu Hasan',
        governmentCode: 'جعلان بوحسن',
        coordinates: { lat: 22.0167, lon: 59.1333 }
    },
    'jalan_bani_bu_ali': {
        nameAr: 'جعلان بوعلي',
        nameEn: 'Jalan Bani Bu Ali',
        governmentCode: 'جعلان بوعلي',
        coordinates: { lat: 21.8167, lon: 59.3667 }
    },
    'masirah': {
        nameAr: 'مصيرة',
        nameEn: 'Masirah',
        governmentCode: 'مصيرة',
        coordinates: { lat: 20.6667, lon: 58.8833 }
    },
    
    // Ad Dhahirah Governorate
    'ibri': {
        nameAr: 'عبري',
        nameEn: 'Ibri',
        governmentCode: 'عبري',
        coordinates: { lat: 23.2256, lon: 56.5158 }
    },
    'yanqul': {
        nameAr: 'ينقل',
        nameEn: 'Yanqul',
        governmentCode: 'ينقل',
        coordinates: { lat: 23.5833, lon: 56.5500 }
    },
    'dhank': {
        nameAr: 'ضنك',
        nameEn: 'Dhank',
        governmentCode: 'ضنك',
        coordinates: { lat: 23.2667, lon: 56.7833 }
    },
    
    // Al Batinah North Governorate
    'sohar': {
        nameAr: 'صحار',
        nameEn: 'Sohar',
        governmentCode: 'صحار',
        coordinates: { lat: 24.3474, lon: 56.7085 }
    },
    'shinas': {
        nameAr: 'شناص',
        nameEn: 'Shinas',
        governmentCode: 'شناص',
        coordinates: { lat: 24.7500, lon: 56.4833 }
    },
    'liwa': {
        nameAr: 'لوى',
        nameEn: 'Liwa',
        governmentCode: 'لوى',
        coordinates: { lat: 23.8667, lon: 57.0167 }
    },
    'saham': {
        nameAr: 'صحم',
        nameEn: 'Saham',
        governmentCode: 'صحم',
        coordinates: { lat: 24.1667, lon: 56.8833 }
    },
    'khabourah': {
        nameAr: 'الخابورة',
        nameEn: 'Al Khabourah',
        governmentCode: 'الخابورة',
        coordinates: { lat: 23.9667, lon: 57.0833 }
    },
    
    // Al Batinah South Governorate
    'rustaq': {
        nameAr: 'الرستاق',
        nameEn: 'Rustaq',
        governmentCode: 'الرستاق',
        coordinates: { lat: 23.3908, lon: 57.4244 }
    },
    'barka': {
        nameAr: 'بركاء',
        nameEn: 'Barka',
        governmentCode: 'بركاء',
        coordinates: { lat: 23.6667, lon: 57.8833 }
    },
    'nakhal': {
        nameAr: 'نخل',
        nameEn: 'Nakhal',
        governmentCode: 'نخل',
        coordinates: { lat: 23.3833, lon: 57.8333 }
    },
    'wadi_maawil': {
        nameAr: 'وادي المعاول',
        nameEn: 'Wadi Maawil',
        governmentCode: 'الواسط',
        coordinates: { lat: 23.2167, lon: 57.7667 }
    },
    'awabi': {
        nameAr: 'العوابي',
        nameEn: 'Al Awabi',
        governmentCode: 'العوابي',
        coordinates: { lat: 23.2833, lon: 57.5167 }
    },
    'musannah': {
        nameAr: 'المصنعة',
        nameEn: 'Al Musannah',
        governmentCode: 'مصنعة',
        coordinates: { lat: 23.8333, lon: 57.5167 }
    },
    
    // Al Wusta Governorate
    'haima': {
        nameAr: 'هيما',
        nameEn: 'Haima',
        governmentCode: 'هيماء',
        coordinates: { lat: 19.9333, lon: 56.2833 }
    },
    'duqm': {
        nameAr: 'الدقم',
        nameEn: 'Duqm',
        governmentCode: 'الدقم',
        coordinates: { lat: 19.6667, lon: 57.7167 }
    },
    'mahout': {
        nameAr: 'محوت',
        nameEn: 'Mahout',
        governmentCode: 'محوت',
        coordinates: { lat: 19.4667, lon: 56.5000 }
    }
};

// Function to find closest Oman region based on coordinates
function findClosestOmanRegion(lat, lon) {
    let closestRegion = null;
    let minDistance = Infinity;
    
    for (const [key, region] of Object.entries(OMAN_REGIONS)) {
        const distance = Math.sqrt(
            Math.pow(lat - region.coordinates.lat, 2) + 
            Math.pow(lon - region.coordinates.lon, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closestRegion = { key, ...region };
        }
    }
    
    return closestRegion;
}

// Function to check if coordinates are within Oman
function isInOman(lat, lon) {
    // Oman boundaries (approximate)
    const omanBounds = {
        north: 26.5,
        south: 16.5,
        east: 60.0,
        west: 51.5
    };
    
    return lat >= omanBounds.south && lat <= omanBounds.north &&
           lon >= omanBounds.west && lon <= omanBounds.east;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OMAN_REGIONS, findClosestOmanRegion, isInOman };
}
