const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// طباعة رسالة بدء التشغيل في السجلات
console.log("🚀 جاري بدء تشغيل البوت... (الخطة المجانية)");

// 1. تهيئة Firebase مع معالجة الأخطاء
try {
    const serviceAccount = require("./serviceAccountKey.json");
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ تم تحميل ملف الهوية بنجاح.");
    }
} catch (error) {
    console.error("❌ فشل تحميل ملف serviceAccountKey.json. تأكد من رفعه بشكل صحيح:", error.message);
    // لا نوقف البرنامج هنا لكي لا تظهر حالة 'موقوف' فوراً
}

const db = admin.firestore();
const bot = new Telegraf('8419083555:AAHaMuIdIS5VvQ5U_uKtdeAsiH8NQT931yI');

// 2. أمر بسيط للتأكد من عمل البوت
bot.start((ctx) => ctx.reply('البوت يعمل الآن ومربوط بـ Firebase! 🌟'));

// 3. اختبار الاتصال بـ Firestore (دون إيقاف البوت عند الفشل)
db.collection('celebrities').limit(1).get()
    .then(() => console.log("🟢 الاتصال بـ Firestore مستقر."))
    .catch(err => console.error("🔴 تنبيه: لا يمكن الوصول لـ Firestore حالياً:", err.message));

// 4. تشغيل البوت
bot.launch()
    .then(() => console.log("🤖 البوت مستعد لاستقبال الرسائل."))
    .catch(err => console.error("❌ فشل تشغيل Telegraf:", err.message));

// الحفاظ على تشغيل الحاوية
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
