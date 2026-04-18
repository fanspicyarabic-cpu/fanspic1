const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');

// طباعة رسالة بدء التشغيل للتأكد من عمل الحاوية
console.log("------------------------------------------------");
console.log("🚀 جاري بدء تشغيل البوت المطور V3 (نسخة النجوم)...");

// 1. إعداد Firebase Admin SDK
try {
    const serviceAccount = require("./serviceAccountKey.json");

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ تم تحميل ملف Firebase بنجاح.");
    }
} catch (error) {
    console.error("❌ خطأ فادح في تحميل ملف Firebase:", error.message);
    process.exit(1); // إيقاف البوت إذا لم يجد المفتاح
}

const db = admin.firestore();

// 2. إعداد بوت تليجرام
// ملاحظة: يفضل دائماً وضع التوكن في متغيرات البيئة للأمان
const bot = new Telegraf('8419083555:AAHaMuIdIS5VvQ5U_uKtdeAsiH8NQT931yI');
const ADMIN_ID = '7228104866';

// 3. مراقب طلبات شراء النجوم (Watcher)
// هذا الجزء يراقب التغييرات في مجموعة 'celebrities'
db.collection('celebrities').where('notify', '==', true).onSnapshot(snap => {
    snap.docChanges().forEach(async (change) => {
        if (change.type !== 'added') return;

        const celeb = change.doc.data();
        const celebId = change.doc.id;
        
        console.log(`🔔 محتوى جديد: جاري إشعار المشتركين - ${celeb.name}`);
        
        // هنا يمكنك إضافة منطق إرسال الرسائل للمستخدمين
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
