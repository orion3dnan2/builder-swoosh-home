# أيقونات PWA للبيت السوداني

هذا المجلد يحتوي على جميع الأيقونات المطلوبة لتطبيق PWA "البيت السوداني".

## الأيقونات المطلوبة:

### أيقونات أساسية:

- `icon-16x16.png` - للمتصفح والمفضلة
- `icon-32x32.png` - للمتصفح والمفضلة
- `icon-72x72.png` - للأجهزة المحمولة
- `icon-96x96.png` - للأجهزة المحمولة
- `icon-128x128.png` - للأجهزة المحمولة
- `icon-144x144.png` - لـ Windows Metro
- `icon-152x152.png` - للآيباد
- `icon-192x192.png` - لـ Android Chrome
- `icon-384x384.png` - لـ Android Chrome
- `icon-512x512.png` - لـ Android Chrome

### أيقونات Apple:

- `apple-touch-icon.png` (180x180) - للآيفون والآيباد

### أيقونات إضافية:

- `safari-pinned-tab.svg` - لـ Safari المثبت
- `badge-72x72.png` - للإشعارات
- `og-image.png` (1200x630) - للمشاركة الاجتماعية
- `twitter-card.png` (1200x675) - لتويتر

## كيفية التوليد:

1. استخدم ملف `icon.svg` الموجود كقاعدة
2. استخدم أدوات مثل ImageMagick أو Photoshop أو أدوات online لتوليد الأحجام
3. تأكد من أن الأيقونات واضحة في جميع الأحجام
4. احفظ الملفات بصيغة PNG بجودة عالية

## أوامر ImageMagick (إذا متوفر):

```bash
# توليد جميع الأحجام من SVG
convert icon.svg -resize 16x16 icon-16x16.png
convert icon.svg -resize 32x32 icon-32x32.png
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
convert icon.svg -resize 180x180 apple-touch-icon.png
```

## ملاحظات:

- تأكد من أن جميع الأيقونات تحافظ على نسبة العرض للارتفاع
- استخدم ألوان متسقة مع هوية البرند
- اختبر الأيقونات على أجهزة مختلفة للتأكد من الوضوح
