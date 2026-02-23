"use client"

import React from 'react'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'

export default function PrivacyPolicy() {
  const { language } = useLanguage()
  const { isDark } = useTheme()

  const isAr = language === 'ar'

  return (
    <div className={`max-w-3xl mx-auto px-4 py-12 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
      
      <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '1. الكيان المسؤول' : '1. Responsible Entity'}
          </h2>
          <p>
            {isAr 
              ? 'تغطي هذه السياسة البيانات التي يتم جمعها بواسطة خدمة Flotter، والتي تديرها Mezuma.' 
              : 'This policy covers the data collected by the service Flotter, managed by Mezuma.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '2. الامتثال لقانون CNDP' : '2. CNDP Compliance'}
          </h2>
          <p>
            <strong>{isAr ? 'رقم CNDP:' : 'CNDP Number:'}</strong> {isAr ? 'قيد التصريح من قبل Mezuma.' : 'En cours de déclaration par Mezuma.'}
          </p>
          <p>
            {isAr 
              ? 'تتوافق هذه السياسة مع القانون المغربي 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.' 
              : 'This policy complies with Moroccan Law 09-08 relating to the protection of individuals with regard to the processing of personal data.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '3. جمع البيانات' : '3. Data Collection'}
          </h2>
          <p>
            {isAr 
              ? 'نحن نستخدم البريد الإلكتروني/كلمة المرور وتسجيل الدخول عبر Google OAuth. نقوم بجمع أسماء المستخدمين وعناوين البريد الإلكتروني لتقديم خدمة Flotter.' 
              : 'We use Email/Password and Google OAuth. We collect user names and email addresses to provide the Flotter service.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '4. معالجة البيانات وتخزينها' : '4. Data Processing and Storage'}
          </h2>
          <p>
            {isAr 
              ? 'يتم تخزين جميع البيانات بشكل آمن في قاعدة بيانات Neon الخاصة بنا عبر البنية التحتية لـ Google Cloud/Vercel.' 
              : 'All data is stored securely in our Neon database via Google Cloud/Vercel infrastructure.'}
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {isAr ? '5. حقوق المستخدم' : '5. User Rights'}
          </h2>
          <p>
            {isAr 
              ? 'وفقًا للقانون 09-08، يحق لك الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. لممارسة هذه الحقوق، يرجى الاتصال بنا عبر البريد الإلكتروني.' 
              : 'In accordance with Law 09-08, you have the right to access, rectify, and delete your personal data. To exercise these rights, please contact us via email.'}
          </p>
        </section>
      </div>
    </div>
  )
}
