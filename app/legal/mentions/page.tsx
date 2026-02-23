"use client"

import React from 'react'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'

export default function LegalNotice() {
  const { language } = useLanguage()
  const { isDark } = useTheme()

  const isAr = language === 'ar'

  return (
    <div className={`max-w-3xl mx-auto px-4 py-12 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{isAr ? 'إشعار قانوني' : 'Legal Notice'}</h1>
      
      <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '1. معلومات الناشر' : '1. Publisher Information'}
          </h2>
          <p><strong>{isAr ? 'اسم الخدمة:' : 'Service Name:'}</strong> Flotter</p>
          <p><strong>{isAr ? 'الناشر:' : 'Publisher:'}</strong> Mezuma (Independent Developer: Hamza El Maaloumi)</p>
          <p><strong>{isAr ? 'العنوان المسجل:' : 'Registered Address:'}</strong> Casablanca, Maroc</p>
          <p><strong>{isAr ? 'الشكل القانوني:' : 'Legal Status:'}</strong> {isAr ? 'مطور مستقل / شركة ناشئة في مرحلة التخفي' : 'Individual Developer / Startup in stealth'}</p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '2. التسجيل الضريبي والتجاري' : '2. Tax and Commercial Registration'}
          </h2>
          <p><strong>ICE / RC / IF:</strong> {isAr ? 'قيد التسجيل الضريبي (Mezuma).' : 'Identification fiscale en cours (Mezuma).'}</p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '3. استضافة الويب' : '3. Web Hosting'}
          </h2>
          <p><strong>{isAr ? 'المضيف:' : 'Host:'}</strong> Vercel Inc.</p>
          <p><strong>{isAr ? 'العنوان:' : 'Address:'}</strong> 340 S Lemon Ave #1150, Walnut, CA 91789, USA</p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '4. الامتثال القانوني' : '4. Legal Compliance'}
          </h2>
          <p>
            {isAr 
              ? 'يتوافق هذا الإشعار القانوني مع القوانين المغربية 53-05 المتعلقة بالتبادل الإلكتروني للبيانات القانونية و 31-08 المتعلقة بحماية المستهلك.' 
              : 'This legal notice complies with Moroccan Laws 53-05 relating to the electronic exchange of legal data and 31-08 relating to consumer protection.'}
          </p>
        </section>
      </div>
    </div>
  )
}
