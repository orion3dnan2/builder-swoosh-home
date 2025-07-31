const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// استخدام tar بدلاً من zip لأنه مدعوم بشكل افتراضي
try {
  execSync('tar -czf ui-interfaces.tar.gz ui-export/', { stdio: 'inherit' });
  console.log('✅ تم إنشاء ملف ui-interfaces.tar.gz بنجاح');
  
  // عرض إحصائيات الملف
  const stats = fs.statSync('ui-interfaces.tar.gz');
  console.log(`📦 حجم الملف: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
} catch (error) {
  console.log('❌ فشل في إنشاء الملف المضغوط:', error.message);
  
  // محاولة بديلة: إنشاء ملف نصي يحتوي على قائمة الملفات
  const files = execSync('find ui-export -type f', { encoding: 'utf8' });
  fs.writeFileSync('ui-files-list.txt', `قائمة بجميع ملفات الواجهات المُصدّرة:\n\n${files}`);
  console.log('📝 تم إنشاء ملف ui-files-list.txt كبديل');
}
