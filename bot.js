const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');
const path = require('path'); // إضافة مكتبة المسارات

// طباعة رسالة بدء التشغيل للتأكد من عمل الحاوية
console.log("------------------------------------------------");
console.log("🚀 جاري بدء تشغيل البوت المطور V3 (نسخة النجوم)...");

// 1. إعداد Firebase Admin SDK
try {
    // استخدام path.join و __dirname لضمان الوصول للملف بشكل صحيح
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ تم تحميل ملف Firebase بنجاح من المسار: " + serviceAccountPath);
    }
} catch (error) {
    console.error("❌ خطأ فادح في تحميل ملف Firebase:");
    console.error("- تأكد من وجود ملف باسم 'serviceAccountKey.json' في نفس مجلد bot.js");
    console.error("- رسالة الخطأ:", error.message);
    process.exit(1); 
}

const db = admin.firestore();

// 2. إعداد بوت تليجرام
const bot = new Telegraf('8419083555:AAHaMuIdIS5VvQ5U_uKtdeAsiH8NQT931yI');
const ADMIN_ID = '7228104866';

// 3. مراقب طلبات شراء النجوم (Watcher)
db.collection('celebrities').where('notify', '==', true).onSnapshot(snap => {
    snap.docChanges().forEach(async (change) => {
        if (change.type !== 'added') return;

        const celeb = change.doc.data();
        console.log(`🔔 محتوى جديد: جاري إشعار المشتركين - ${celeb.name}`);
    });
}, error => {
    console.error("⚠️ تنبيه Firestore (خطأ في الاتصال):", error.message);
});

// 4. اختبار اتصال بسيط عند التشغيل
db.collection('celebrities').limit(1).get()
    .then(() => console.log("🟢 تم التحقق من الاتصال بقاعدة البيانات: الحالة ممتازة."))
    .catch(err => console.error("🔴 فشل التحقق من الاتصال:", err.message));

// 5. تشغيل البوت
bot.launch().then(() => {
    console.log("🤖 البوت الآن متصل ومستعد لاستقبال الأوامر على تليجرام.");
}).catch(err => {
    console.error("❌ فشل تشغيل بوت تليجرام:", err.message);
});

// التعامل مع إغلاق البرنامج بسلاسة
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
