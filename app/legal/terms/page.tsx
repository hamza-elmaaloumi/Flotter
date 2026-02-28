"use client"

import React from 'react'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'

export default function TermsOfService() {
  const { language } = useLanguage()
  const { isDark } = useTheme()

  const isAr = language === 'ar'

  return (
    <div className={`max-w-3xl mx-auto px-4 py-12 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{isAr ? 'شروط الخدمة والبيع' : 'Terms of Service & Sales'}</h1>
      
      <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '1. العقد' : '1. Contract'}
          </h2>
          <p>
            {isAr 
              ? 'هذه اتفاقية بين المستخدم و Mezuma فيما يتعلق باستخدام خدمة Flotter.' 
              : 'This is an agreement between the user and Mezuma regarding the use of Flotter.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '2. التاجر المسجل' : '2. Merchant of Record'}
          </h2>
          <p>
            {isAr 
              ? 'تتم معالجة المدفوعات لفئة "Pro" (1$/شهريًا) بواسطة Polar. تتولى Polar جميع عمليات الفوترة والضرائب والامتثال المالي نيابة عن Mezuma.' 
              : 'Payments for the "Pro" tier (1$/month) are processed by Polar. Polar handles all billing, taxes, and financial compliance on behalf of Mezuma.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '3. سياسة الاسترداد' : '3. Refund Policy'}
          </h2>
          <p>
            {isAr 
              ? 'جميع المبيعات لـ Flotter Pro نهائية. لا توجد مبالغ مستردة.' 
              : 'All sales for Flotter Pro are final. No refunds.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '4. قواعد الاستخدام' : '4. Usage Rules'}
          </h2>
          <p>
            {isAr 
              ? 'يُمنع منعًا باتًا استخراج البيانات (Scraping)، والوصول غير المصرح به إلى واجهة برمجة التطبيقات (API)، وأي محاولات لتجاوز الأمان.' 
              : 'No scraping, no unauthorized API access, and no attempts to bypass security.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '5. الاختصاص القضائي' : '5. Jurisdiction'}
          </h2>
          <p>
            {isAr 
              ? 'تخضع هذه الشروط للقانون المغربي 31-08 (حماية المستهلك). تقع أي نزاعات تحت اختصاص المحكمة التجارية بالدار البيضاء، المغرب.' 
              : 'These terms comply with Moroccan Law 31-08 (Consumer Protection). Any disputes fall under the jurisdiction of the Commercial Court of Casablanca, Morocco.'}
          </p>
        </section>
      </div>
    </div>
  )
}
