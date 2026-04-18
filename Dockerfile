# 1. تحديد نسخة Node.js
FROM node:18

# 2. تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# 3. نسخ ملفات التعريف وتثبيت المكتبات
COPY package*.json ./
RUN npm install

# 4. نسخ بقية ملفات المشروع (بما في ذلك bot.js و serviceAccountKey.json)
COPY . .

# 5. الأمر الأساسي لتشغيل البوت
CMD ["node", "bot.js"]
