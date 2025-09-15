import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// إضافة خط Readex Pro
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const InteractiveMirror = () => {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showBookingLink, setShowBookingLink] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('✨');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // تعيين حجم الكانفاس للشكل الجديد
    canvas.width = 350;
    canvas.height = 500;
    
    // رسم طبقة الغبار الواقعية المحسنة
    drawEnhancedDust(ctx);
    
    // إعداد خصائص المسح
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const drawEnhancedDust = (ctx) => {
    const canvas = canvasRef.current;
    
    // طبقة الغبار الأساسية مع تدرج أكثر واقعية
    const gradient = ctx.createRadialGradient(175, 250, 0, 175, 250, 250);
    gradient.addColorStop(0, 'rgba(200, 190, 180, 0.85)');
    gradient.addColorStop(0.3, 'rgba(180, 170, 160, 0.9)');
    gradient.addColorStop(0.6, 'rgba(160, 150, 140, 0.95)');
    gradient.addColorStop(1, 'rgba(140, 130, 120, 0.98)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // إضافة طبقة غبار إضافية للواقعية
    const dustGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    dustGradient.addColorStop(0, 'rgba(160, 150, 140, 0.3)');
    dustGradient.addColorStop(0.5, 'rgba(140, 130, 120, 0.5)');
    dustGradient.addColorStop(1, 'rgba(120, 110, 100, 0.4)');
    
    ctx.fillStyle = dustGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // نقاط غبار عشوائية أكثر كثافة
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2.5 + 0.5;
      const opacity = Math.random() * 0.4 + 0.1;
      
      ctx.fillStyle = `rgba(110, 100, 90, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // خطوط وبقع غبار للمزيد من الواقعية
    for (let i = 0; i < 100; i++) {
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;
      const x2 = x1 + (Math.random() - 0.5) * 30;
      const y2 = y1 + (Math.random() - 0.5) * 30;
      
      ctx.strokeStyle = `rgba(120, 110, 100, ${Math.random() * 0.3 + 0.1})`;
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // بقع غبار كبيرة
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 8 + 3;
      const opacity = Math.random() * 0.2 + 0.1;
      
      ctx.fillStyle = `rgba(100, 90, 80, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    
    // إظهار إيموجي عشوائي عند بدء المسح
    const emojis = ['✨', '🌟', '💫', '⭐', '🔮', '💎', '🌙'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setCurrentEmoji(randomEmoji);
    setShowEmoji(true);
    
    // إخفاء الإيموجي بعد ثانية واحدة
    setTimeout(() => {
      setShowEmoji(false);
    }, 1000);
    
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const pos = e.touches ? getTouchPos(e) : getMousePos(e);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // فحص نسبة المسح
    checkRevealPercentage();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const checkRevealPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 80) { // تحسين حساسية الكشف
        transparentPixels++;
      }
    }
    
    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setRevealPercentage(Math.round(percentage));
    
    if (percentage > 12 && !isRevealed) { // تقليل النسبة المطلوبة
      revealMessage();
    }
  };

  const revealMessage = () => {
    setIsRevealed(true);
    setShowMessage(true);
      // إظهار رابط الحجز بعد 3 ثوانٍ من الكشف
      setTimeout(() => {
        setShowBookingLink(true);
      }, 3000);
  };

  // دعم اللمس المحسن للأجهزة المحمولة
  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 md:p-4 overflow-hidden" style={{ fontFamily: 'Readex Pro, sans-serif' }}>

      {/* عداد التقدم */}
      {!isRevealed && revealPercentage > 0 && (
        <div className="mb-4 text-white text-sm opacity-70">
          التقدم: {Math.round(revealPercentage)}%
        </div>
      )}

      {/* رسالة المسح فوق المرآة */}
      {!isRevealed && (
        <div className="mb-6 text-center">
          <p className="text-white text-lg md:text-xl font-medium opacity-80" style={{
            textShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
          }}>
            امسح الغبار لتكشف الرسالة
          </p>
        </div>
      )}

      {/* الإيموجي التعبيري عند المسح */}
      {showEmoji && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-6xl animate-bounce">
            {currentEmoji}
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* إطار المرآة الجديد - يشبه الصورة المرفقة */}
        <div className={`relative transition-all duration-1000 ${
          showBookingLink ? 'transform translate-y-full opacity-0' : ''
        }`} style={{
          width: 'min(350px, 85vw)',
          height: 'min(500px, 75vh)',
          background: `
            linear-gradient(145deg, #d4af37 0%, #f4d03f 20%, #d4af37 40%, #b8941f 60%, #d4af37 80%, #f4d03f 100%)
          `,
          borderRadius: '20px 20px 10px 10px',
          padding: '12px',
          boxShadow: `
            0 0 40px rgba(212, 175, 55, 0.4),
            inset 0 2px 10px rgba(255, 255, 255, 0.3),
            inset 0 -2px 10px rgba(0, 0, 0, 0.3),
            0 20px 40px rgba(0, 0, 0, 0.3)
          `
        }}>
          {/* الزخرفة العلوية */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-8" style={{
            background: 'linear-gradient(145deg, #d4af37, #f4d03f)',
            borderRadius: '50% 50% 20px 20px',
            boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)'
          }}></div>
          
          {/* سطح المرآة */}
          <div className="relative w-full h-full overflow-hidden" style={{
            borderRadius: '15px 15px 8px 8px',
            background: `
              linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)
            `,
            boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
          }}>
            {/* انعكاسات المرآة */}
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
                radial-gradient(ellipse at 70% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 30%),
                linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)
              `,
              borderRadius: '15px 15px 8px 8px'
            }}></div>
            
            {/* الرسالة المخفية */}
            {showMessage && (
              <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                <div className="text-center animate-fade-in">
                  <p className="text-white text-lg md:text-xl font-bold leading-relaxed mb-4" style={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)'
                  }}>
                    مرآة حياتك تشبه هذه المرآة
                  </p>
                  <p className="text-yellow-300 text-base md:text-lg font-semibold leading-relaxed" style={{
                    textShadow: '0 0 15px rgba(255, 235, 59, 0.8)'
                  }}>
                    تحتاج صدفة بغريب<br />
                    تفتح لك آفاق الحياة
                  </p>
                </div>
              </div>
            )}
            
            {/* كانفاس الغبار */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 cursor-pointer touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ 
                width: '100%', 
                height: '100%',
                borderRadius: '15px 15px 8px 8px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* رابط حجز التذكرة */}
      {showBookingLink && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md mx-4 text-center">
            {/* شعار الشركة الكبير */}
            <div className="mb-6 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="شعار شركة جادوا الثقافية" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
                }}
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2" style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.6)'
              }}>
                هل أنت مستعد لتغيير حياتك؟
              </h2>
              <p className="text-gray-300 text-base md:text-lg">
                احجز تذكرتك الآن واكتشف آفاق جديدة
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
              style={{
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)'
              }}
              onClick={() => {
                alert('سيتم توجيهك إلى صفحة الحجز قريباً!');
              }}
            >
              🎫 احجز تذكرتك الآن
            </Button>
            <div className="mt-4">
              <p className="text-gray-400 text-xs md:text-sm">
                ✨ عرض محدود لفترة قصيرة ✨
              </p>
            </div>
            
            <div className="mt-6 text-white/70 text-sm font-medium">
              مقدم من شركة جادوا الثقافية
            </div>
            
            {/* حسابات التواصل الاجتماعي */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-white/60 text-xs">تابعونا على</p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/jado.saudi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-xs hover:scale-105 transition-transform duration-200"
                >
                  📷 Instagram
                </a>
                <a 
                  href="https://x.com/Jado_sa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black text-white px-3 py-2 rounded-lg text-xs hover:scale-105 transition-transform duration-200"
                >
                  🐦 X
                </a>
                <a 
                  href="https://www.tiktok.com/@jado.saudi1?_t=ZS-8zeHUqSJmyY&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black text-white px-3 py-2 rounded-lg text-xs hover:scale-105 transition-transform duration-200"
                >
                  🎵 TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMirror;

