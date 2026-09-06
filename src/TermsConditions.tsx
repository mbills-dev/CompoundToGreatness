import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Eligibility',
    body: [
      'You must be at least 13 years old to use the App. If you are between 13 and 17, you may only use the App with the involvement and consent of a parent or legal guardian. By using the App, you represent that you meet these requirements.',
    ],
  },
  {
    title: '2. Description of Service',
    body: [
      'C2G is a habit- and identity-building tool that helps you reverse-engineer your goals into daily inputs and track your progress over a structured 77-day challenge. Features may include goal tracking, streaks, badges, optional accountability partners ("watchers"), and optional community/subscription content.',
      'C2G is a self-tracking and accountability tool. It does not provide medical, nutritional, psychological, or financial advice. Any health, fitness, or wellness-related content within the App reflects general encouragement and self-reported tracking, not professional guidance. Consult a qualified professional before making decisions about your health, diet, exercise, or finances.',
    ],
  },
  {
    title: '3. Accounts',
    body: [
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate information when creating your account and to keep it up to date.',
      'You may delete your account at any time directly within the App (Settings → Delete Account). Deletion is permanent and will remove your challenge history, photos, and associated data as described in our Privacy Policy.',
    ],
  },
  {
    title: '4. Subscriptions and Billing',
    body: [
      'Certain features of the App require a paid subscription. Subscription purchases are processed entirely through the Apple App Store, and your payment is governed by Apple\'s own terms and payment system — we do not directly collect or store your payment card details.',
    ],
    list: [
      'Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date.',
      'Cancellations, refund requests, and billing management are handled through your Apple ID account settings, not within the App directly.',
      'Pricing is displayed within the App prior to purchase and is subject to change with notice.',
    ],
  },
  {
    title: '5. Your Content',
    body: [
      '"Your Content" means anything you create, upload, or submit through the App, including your identity statements, goals, daily activity records, photos, and messages sent to friends or watchers.',
      'You retain ownership of Your Content. By submitting Your Content, you grant us a limited, non-exclusive license to host, store, and display it solely for the purpose of operating and providing the App\'s features to you — including displaying your progress to accountability partners you specifically invite, or to anyone you choose to share a public journey link with. We do not sell Your Content, license it to third parties for their own purposes, or use it to train external AI models.',
      'You are solely responsible for Your Content and confirm that you have the right to share it and that it does not violate these Terms or any law.',
    ],
  },
  {
    title: '6. Acceptable Use',
    body: [
      'When using the App, including any messaging or friend/watcher features, you agree not to:',
    ],
    list: [
      'Harass, abuse, threaten, or demean other users',
      'Upload unlawful, obscene, or infringing content',
      'Impersonate any person or misrepresent your identity',
      'Attempt to gain unauthorized access to other users\' accounts or data',
      'Reverse engineer, decompile, or attempt to extract the App\'s source code',
      'Use the App for any purpose other than its intended personal accountability and habit-tracking use',
    ],
    note: [
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    title: '7. Third-Party Services',
    body: [
      'The App relies on third-party service providers to operate, including Supabase (data storage and authentication), RevenueCat (subscription management), and Apple\'s App Store (payment processing and push notification delivery). Your use of the App is also subject to Apple\'s Media Services Terms and Usage Rules where applicable. We are not responsible for the availability or performance of these third-party services.',
    ],
  },
  {
    title: '8. Intellectual Property',
    body: [
      'Excluding Your Content, all rights, title, and interest in the App — including its design, features, trademarks, and underlying code — belong to Lumière Holdings LLC or its licensors. You may not copy, modify, distribute, or create derivative works from the App itself.',
    ],
  },
  {
    title: '9. Disclaimer of Warranties',
    body: [
      'The App is provided "as is" and "as available," without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the App will be uninterrupted, error-free, or that any particular results (including fitness, financial, or personal outcomes) will be achieved through its use.',
    ],
  },
  {
    title: '10. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, Lumière Holdings LLC\'s total liability arising out of or relating to your use of the App will not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) $100 USD. We are not liable for indirect, incidental, special, or consequential damages, including loss of data or personal injury arising from activities you undertake as part of using the App.',
    ],
  },
  {
    title: '11. Termination',
    body: [
      'We may suspend or terminate your access to the App at any time if you violate these Terms. You may stop using the App and delete your account at any time as described in Section 3.',
    ],
  },
  {
    title: '12. Governing Law',
    body: [
      'These Terms are governed by the laws of the State of Missouri, without regard to its conflict-of-laws principles, unless otherwise required by the mandatory consumer protection laws of your country or state of residence.',
    ],
  },
  {
    title: '13. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. If we make material changes, we will update the effective date above and, where appropriate, notify you through the App. Continued use of the App after changes take effect constitutes your acceptance of the updated Terms.',
    ],
  },
];

function TermsConditions() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-3 text-gray-400 hover:text-neon transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-black tracking-wider">BACK TO HOME</span>
          </a>
          <img src="/c2g-wordmark.png" alt="Compound to Greatness" className="h-6 w-auto" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="text-neon text-xs sm:text-sm font-black tracking-wide">LEGAL</div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter">
              TERMS &<br />CONDITIONS
            </h1>
            <div className="flex items-center gap-3 text-gray-500 text-sm font-light">
              <span className="w-8 h-px bg-neon/40" />
              Effective Date: September 5, 2026
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
            These Terms and Conditions ("Terms") govern your access to and use of Compound to Greatness ("C2G," "the App," "we," "us," or "our"), developed and operated by Lumière Holdings LLC. By downloading, accessing, or using the App, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please do not use the App.
          </p>

          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {section.title}
              </h2>
              {section.body?.map((para, i) => (
                <p key={i} className="text-base text-gray-400 font-light leading-relaxed">
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-3">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-gray-400 font-light leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-neon mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.note && (
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-3">
                  {section.note.map((para, i) => (
                    <p key={i} className="text-base font-light leading-relaxed text-gray-400">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              14. Contact Us
            </h2>
            <p className="text-base text-gray-400 font-light leading-relaxed">
              If you have questions about these Terms, contact us at:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-2">
              <p className="text-base font-black text-white tracking-wide">Lumière Holdings LLC</p>
              <p className="text-base text-gray-400 font-light">Email: info@compoundtogreatness.com</p>
              <p className="text-base text-gray-400 font-light">Phone: 314-626-4807</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <img src="/c2g-wordmark.png" alt="Compound to Greatness" className="h-6 w-auto" />
          <p className="text-gray-700 text-xs font-light tracking-wide text-center">
            © 2026 Lumière Holdings LLC — Transform your identity, one day at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TermsConditions;
