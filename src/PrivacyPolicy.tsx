import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect the following categories of information directly from you or automatically as part of using the App:',
    ],
    subsections: [
      {
        heading: 'Contact Information',
        items: [
          'Name — collected during onboarding and account creation, used to personalize your experience (for example, your 77-day commitment) and to identify you to friends/accountability partners you choose to connect with.',
          'Email Address — collected when you create an account, used for login, account recovery, and service-related communications.',
        ],
      },
      {
        heading: 'Photos',
        items: [
          'Profile photo — optional, uploaded by you from your photo library or camera.',
          'Daily completion photos — optional evidence photos you may attach to a day\'s activities as part of your accountability record.',
          'Any photos you upload remain your own property. We do not share, license, or use your photos for any purpose beyond operating the App\'s features — they are visible only to you and, if you choose to enable a watcher connection, to the specific person(s) you\'ve invited.',
        ],
      },
      {
        heading: 'User-Generated Content',
        items: [
          'Identity statements, goals, and daily inputs you create as part of building your 77-day challenge.',
          'Encouragement messages — free-text messages and emoji you choose to send to friends within the App.',
        ],
      },
      {
        heading: 'Account and Purchase Identifiers',
        items: [
          'User ID — an internal identifier tied to your account, used to operate the App and to manage your subscription.',
          'Purchase history — subscription status and transaction history, processed through Apple\'s In-App Purchase system and our subscription management provider, RevenueCat.',
          'Push notification token — a device-specific identifier used solely to deliver reminders and notifications you\'ve enabled.',
        ],
      },
    ],
    note: [
      'What We Do Not Collect',
      'We do not collect or access: your precise or approximate location, your device\'s contact list, your web browsing or search history, financial account or payment card details (these are handled directly by Apple), or health and fitness data from HealthKit or similar device sensors. All activity and habit tracking in the App is self-reported by you — we do not read step counts, heart rate, or any other data from your device\'s health sensors.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use the information described above to:',
    ],
    list: [
      'Operate the core features of the App, including your challenge tracking, streaks, badges, and accountability features',
      'Personalize your experience (for example, showing your name on your commitment screen)',
      'Process and manage your subscription',
      'Send you notifications and reminders you\'ve opted into',
      'Provide customer support',
      'Maintain the security and integrity of the App',
    ],
    note: [
      'We do not use your information for third-party advertising, and we do not sell or share your information with data brokers.',
    ],
  },
  {
    title: '3. Third-Party Service Providers',
    body: [
      'We work with the following service providers, who process data on our behalf solely to help us operate the App:',
    ],
    list: [
      'Supabase — our backend database, authentication, and file storage provider. All account data, goals, photos, and messages are stored on Supabase\'s infrastructure.',
      'RevenueCat — manages subscription purchases and entitlements. RevenueCat receives your purchase history and an internal user identifier to determine your subscription status.',
      'Apple — processes all in-app purchases and subscription payments directly; we never see or store your payment card details.',
      'Expo — delivers push notifications to your device using a device-specific push token.',
    ],
    note: [
      'These providers are contractually limited to using your data only to provide services to us, not for their own independent purposes.',
    ],
  },
  {
    title: '4. Data Sharing with Other Users',
    body: [
      'Some features of the App are designed to be visible to other people you specifically choose to share with:',
    ],
    list: [
      'Watchers/friends — if you invite someone to "watch" your progress, they can see the information associated with that feature (your challenge day, streak, and activity completion) for as long as that connection remains active.',
      'Public journey link — if you choose to share your unique journey link with someone, anyone with that specific link can view the associated public content. This link is not searchable or browsable within the App by other users — it is only accessible to people you\'ve directly given the link to.',
    ],
    note: [
      'You control who receives these links and invitations; we do not publish or broadly distribute your content ourselves.',
    ],
  },
  {
    title: '5. Data Retention and Deletion',
    body: [
      'We retain your information for as long as your account remains active, or as needed to provide the App\'s services.',
      'You can permanently delete your account and all associated data at any time directly within the App, under Settings → Delete Account. This action is irreversible and removes your challenge history, photos, friend connections, and streak data from our systems.',
    ],
  },
  {
    title: '6. Children\'s Privacy',
    body: [
      'Compound to Greatness is not directed at children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it.',
    ],
  },
  {
    title: '7. Your Rights',
    body: [
      'Depending on where you live, you may have rights to access, correct, delete, or receive a copy of your personal information, and to object to certain uses of it. You can exercise most of these rights directly within the App (editing your profile, deleting your account). For anything else, you can contact us using the information below.',
      'If you are located in the European Union, you also have rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with your local data protection authority.',
    ],
  },
  {
    title: '8. Security',
    body: [
      'We take reasonable technical and organizational measures to protect your information, including industry-standard encryption in transit and access controls on our backend systems. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. If we make material changes, we will update the effective date above and, where required, notify you through the App.',
    ],
  },
];

function PrivacyPolicy() {
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
              PRIVACY<br />POLICY
            </h1>
            <div className="flex items-center gap-3 text-gray-500 text-sm font-light">
              <span className="w-8 h-px bg-neon/40" />
              Effective Date: September 5, 2026
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
            Compound to Greatness ("C2G," "the App," "we," "us," or "our") is developed and operated by Lumière Holdings LLC. This Privacy Policy explains what information we collect when you use the App, how we use it, and the choices you have.
          </p>
          <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
            By creating an account or using the App, you agree to the practices described in this policy.
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
              {section.subsections?.map((sub) => (
                <div key={sub.heading} className="space-y-3 pl-0 sm:pl-4 border-l-0 sm:border-l sm:border-zinc-800">
                  <h3 className="text-base font-black text-white tracking-wide">{sub.heading}</h3>
                  {sub.items.map((item, i) => (
                    <p key={i} className="text-base text-gray-400 font-light leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
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
                    <p key={i} className={`text-base font-light leading-relaxed ${i === 0 ? 'text-white font-black tracking-wide' : 'text-gray-400'}`}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              10. Contact Us
            </h2>
            <p className="text-base text-gray-400 font-light leading-relaxed">
              If you have questions about this Privacy Policy or how your information is handled, contact us at:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-2">
              <p className="text-base font-black text-white tracking-wide">Lumière Holdings LLC</p>
              <p className="text-base text-gray-400 font-light">Email: [insert business contact email]</p>
              <p className="text-base text-gray-400 font-light">Phone: [insert business contact phone number]</p>
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

export default PrivacyPolicy;
