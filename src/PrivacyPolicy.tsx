import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

/*
 * Privacy Policy text: d279eae Part 1 (PRIVACY_TERMS_FINAL_DRAFT_2026-11-16.md) with the Stripe insertion from
 * 45bd190 (PUBLICATION_DECISIONS_2026-11-16.md) after Kit in Section 4. "**text**" marks bold text.
 * EFFECTIVE_DATE is a placeholder: the owner sets it to the publication date before this page is deployed.
 */
const EFFECTIVE_DATE = '[publication date]';

type ListItem = { text: string; children?: Block[] };
type Block = { h3: string } | { p: string } | { ul: ListItem[] } | { note: Block[] };
type Section = { title: string; blocks: Block[] };

const INTRO: string[] = [
  "Compound to Greatness (\"CTG,\" \"the App,\" \"we,\" \"us,\" or \"our\") is developed and operated by Lumière Holdings LLC. This Privacy Policy explains what information we collect when you use the App, including the public challenge pages on our website, how we use it, and the choices you have.",
  "By creating an account or using the App, you agree to the practices described in this policy."
];

const SECTIONS: Section[] = [
  {
    "title": "1. Information We Collect",
    "blocks": [
      {
        "p": "We collect the following categories of information directly from you or automatically as part of using the App:"
      },
      {
        "h3": "Contact Information"
      },
      {
        "ul": [
          {
            "text": "**Name.** We collect the first and last name you enter during onboarding or in Settings. We use it to personalize your experience (for example, your 77-day commitment) and to identify you to friends and accountability partners you choose to connect with. If you turn on your Public Challenge Page, only your first name and last initial appear there."
          },
          {
            "text": "**Email address.** We collect it when you create an account. We use it for login, account recovery, and service-related communications. If you sign in with Apple or Google, we receive the name and email address that service shares with us. With Apple, this may be a private relay address."
          },
          {
            "text": "**Username.** Other members can find you by your username to send a friend request. Your username also forms the address of your Public Challenge Page."
          }
        ]
      },
      {
        "h3": "Photos"
      },
      {
        "ul": [
          {
            "text": "**Profile photo.** Optional; uploaded by you from your photo library or camera. It is shown to other members with your profile, and on your Public Challenge Page if you turn it on."
          },
          {
            "text": "**Proof photos.** Optional photos you capture or choose as evidence of your progress. They are private to you: they are not shown to friends or watchers, or on your Public Challenge Page."
          },
          {
            "text": "**Goal photo.** Optional. During onboarding you can add a photo of your written goals so the App can read them.",
            "children": [
              {
                "ul": [
                  {
                    "text": "This uses AI (see Section 3) and is available only after you agree to AI personalization."
                  },
                  {
                    "text": "The photo is stored privately in your account's storage and is used only to read your goals."
                  },
                  {
                    "text": "It remains stored until you delete your account."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "p": "Any photos you upload remain your own property. We do not share, license, or use your photos for any purpose beyond operating the App's features described in this policy."
      },
      {
        "h3": "Goals, Plans and Progress"
      },
      {
        "ul": [
          {
            "text": "**Your goals and plan:**",
            "children": [
              {
                "ul": [
                  {
                    "text": "your goals and the answers you give to clarify them;"
                  },
                  {
                    "text": "your Success Stack (your daily inputs, and when and where you plan to do them);"
                  },
                  {
                    "text": "your identity statement and your Compass."
                  }
                ]
              }
            ]
          },
          {
            "text": "**Your challenge records:** completed inputs, Challenge Day, streaks, badges, notes you add to proof, and the history of past challenge runs."
          },
          {
            "text": "**Weight-loss goals:**",
            "children": [
              {
                "ul": [
                  {
                    "text": "To estimate your daily targets, the App asks for your current weight, height, age, sex, activity level, and preferred pace."
                  },
                  {
                    "text": "These calculations run on your device. The measurements are not stored on our servers and are never sent to our AI provider."
                  },
                  {
                    "text": "We save the goal you entered (for example, \"Lose 20 lbs\") and the resulting daily inputs (for example, a daily calorie or protein target) as part of your plan."
                  },
                  {
                    "text": "If you set a target weight, your identity statement may include it (for example, \"I weigh 165 lbs.\"). Your friends can access your goal, targets, and identity statement as described in Section 5. On your Public Challenge Page, your identity statement, the names of your daily inputs (which may include a calorie or protein target), and the goal each input belongs to appear only if you turn on Detailed Sharing."
                  },
                  {
                    "text": "This saved goal and these calorie and protein targets are health and fitness information, linked to your account. We do not access HealthKit or your device's health sensors (see \"What We Do Not Collect\" below)."
                  },
                  {
                    "text": "These targets are estimates for self-tracking, not medical advice."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "h3": "User-Generated Content"
      },
      {
        "ul": [
          {
            "text": "Identity statements, goals, and daily inputs you create as part of building your 77-day challenge."
          },
          {
            "text": "Encouragement messages: free-text messages and emoji you choose to send to friends within the App."
          },
          {
            "text": "Reports: the reason and any details you provide when you report a message or a member (see Section 6)."
          }
        ]
      },
      {
        "h3": "AI Personalization Choice"
      },
      {
        "ul": [
          {
            "text": "The App saves whether you agreed to or declined AI personalization, when you made the choice, and which version of the disclosure you saw."
          },
          {
            "text": "This choice is saved on your device. If you reinstall the App or use another device, you choose again; until you agree, the App doesn't use AI."
          }
        ]
      },
      {
        "h3": "Information from Public Page Visitors"
      },
      {
        "ul": [
          {
            "text": "People who visit a member's Public Challenge Page, members or not, can send that member an encouragement message."
          },
          {
            "text": "We collect the name the visitor enters and their message. We collect an email address only if the visitor ticks the box to receive updates from Compound to Greatness."
          },
          {
            "text": "To help prevent spam and abuse, when a visitor sends a message from a Public Challenge Page, we may store a one-way, keyed hash of the visitor's IP address with the message, not the address itself. We use it to help apply sending limits and, after a report, to help prevent further messages from the same source. These measures reduce abuse but cannot guarantee that every unwanted message is stopped."
          }
        ]
      },
      {
        "h3": "Account and Purchase Identifiers"
      },
      {
        "ul": [
          {
            "text": "**User ID.** An internal identifier tied to your account, used to operate the App and to manage your subscription. Before you create an account, the App uses a temporary guest account with its own identifier, so your progress is saved while you set up your challenge."
          },
          {
            "text": "**Purchase history.** Your subscription status and transaction history, processed through Apple's In-App Purchase system and our subscription management provider, RevenueCat."
          },
          {
            "text": "**Push notification token.** A push token tied to Apple's push notification service. Our push provider, Expo, uses it to deliver notifications to this app on your device. We use it solely to deliver reminders and notifications you've enabled."
          }
        ]
      },
      {
        "h3": "Technical Information"
      },
      {
        "ul": [
          {
            "text": "Like most online services, our servers and hosting providers automatically process standard technical information when the App or our website connects to them, such as IP addresses, device and browser type, and request times."
          },
          {
            "text": "They keep it in operational and security logs to run, secure, and troubleshoot the service."
          }
        ]
      },
      {
        "note": [
          {
            "h3": "What We Do Not Collect"
          },
          {
            "p": "We do not collect or access:"
          },
          {
            "ul": [
              {
                "text": "your precise or approximate location (the App does not request location permission, and we do not use IP addresses to determine your location);"
              },
              {
                "text": "your device's contact list;"
              },
              {
                "text": "your web browsing or search history;"
              },
              {
                "text": "financial account or payment card details (these are handled directly by Apple);"
              },
              {
                "text": "health and fitness data from HealthKit or similar device sensors."
              }
            ]
          },
          {
            "p": "All activity and habit tracking in the App is self-reported by you. We do not read step counts, heart rate, or any other data from your device's health sensors. The App contains no advertising or analytics SDKs, and we do not track you across other companies' apps or websites."
          }
        ]
      }
    ]
  },
  {
    "title": "2. How We Use Your Information",
    "blocks": [
      {
        "p": "We use the information described above to:"
      },
      {
        "ul": [
          {
            "text": "operate the core features of the App, including your challenge tracking, streaks, badges, and accountability features;"
          },
          {
            "text": "personalize your experience (for example, showing your name on your commitment screen);"
          },
          {
            "text": "with your permission, use AI to help clarify your goals and suggest your daily inputs (see Section 3);"
          },
          {
            "text": "show your Public Challenge Page to visitors and deliver their messages to you, when you turn the page on;"
          },
          {
            "text": "process and manage your subscription;"
          },
          {
            "text": "understand how subscriptions perform, including renewals and cancellations, using the subscription information our subscription provider, RevenueCat, gives us;"
          },
          {
            "text": "send you notifications and reminders you've opted into;"
          },
          {
            "text": "send account emails, such as sign-in and password-reset messages;"
          },
          {
            "text": "provide customer support;"
          },
          {
            "text": "review reports and keep the App safe, including filtering abusive messages and limiting spam;"
          },
          {
            "text": "maintain the security and integrity of the App."
          }
        ]
      },
      {
        "note": [
          {
            "p": "We do not use your information for third-party advertising, and we do not sell or share your information with data brokers. We send marketing emails only to people who have opted in to receive them, and every marketing email includes a way to unsubscribe."
          }
        ]
      }
    ]
  },
  {
    "title": "3. AI Personalization",
    "blocks": [
      {
        "p": "**What AI does in the App.** Compound to Greatness can use artificial intelligence to personalize your plan:"
      },
      {
        "ul": [
          {
            "text": "to help clarify your goals and decode them into daily inputs;"
          },
          {
            "text": "to check that an input is specific enough to check off;"
          },
          {
            "text": "to notice goals that overlap;"
          },
          {
            "text": "to suggest Compass options and identity statements;"
          },
          {
            "text": "to read a photo of your written goals."
          }
        ]
      },
      {
        "p": "Our AI provider is Anthropic, which provides the Claude models."
      },
      {
        "p": "**We ask first.** On the goal screen, you choose \"Agree & Continue\" to use AI personalization, or \"Continue without AI.\" If you add a goal photo before choosing, we ask first. The App sends nothing to Anthropic until you agree."
      },
      {
        "h3": "What is sent"
      },
      {
        "ul": [
          {
            "text": "The goals you type, and any edits to them."
          },
          {
            "text": "Your answers to follow-up questions about a goal (for example, how much time you have each day)."
          },
          {
            "text": "The daily inputs and actions you write or choose, and the other goals in your plan when they help put a suggestion in context."
          },
          {
            "text": "For skills you practice, the skill, your level, and your daily minutes."
          },
          {
            "text": "If you add a goal photo, the photo itself. Anthropic retrieves it through a link that expires after five minutes. The link's address contains the internal identifier of your account's storage folder."
          }
        ]
      },
      {
        "h3": "What is not sent"
      },
      {
        "ul": [
          {
            "text": "Your name, email address, or username."
          },
          {
            "text": "Your proof photos or profile photo."
          },
          {
            "text": "The body measurements described in Section 1."
          },
          {
            "text": "Your messages."
          },
          {
            "text": "Your account identifier, except inside a goal photo's temporary link as described above."
          }
        ]
      },
      {
        "h3": "Your choice"
      },
      {
        "ul": [
          {
            "text": "If you decline, the App builds your plan without AI: you write your own daily inputs, and the App uses its standard suggestions. We will not ask you again during onboarding."
          },
          {
            "text": "You can turn AI personalization on or off at any time in Settings → Privacy → AI personalization."
          },
          {
            "text": "Turning it off stops all future AI requests from the App from that moment. It does not recall information already sent."
          }
        ]
      },
      {
        "note": [
          {
            "p": "Anthropic processes this information as our service provider to return results to the App."
          },
          {
            "p": "AI suggestions can be inaccurate or incomplete. Review them before you adopt them."
          },
          {
            "p": "Our servers keep operational logs of AI requests to diagnose problems. For most requests, these logs include the beginning of the goal or input that was sent (up to 80 characters). For a goal photo, they include the beginning of its temporary link. If the AI's response can't be processed, they include part of that response."
          }
        ]
      }
    ]
  },
  {
    "title": "4. Third-Party Service Providers",
    "blocks": [
      {
        "p": "We work with the following service providers, who process data on our behalf to help us operate the App:"
      },
      {
        "ul": [
          {
            "text": "**Supabase.** Our backend database, authentication, file storage, and server functions provider. All account data, goals, photos, and messages are stored on Supabase's infrastructure."
          },
          {
            "text": "**Anthropic.** Provides the AI models behind AI personalization. It receives only the information described in Section 3, and only if you agree."
          },
          {
            "text": "**RevenueCat.** Manages subscription purchases and entitlements. RevenueCat receives your purchase history and an internal user identifier to determine your subscription status."
          },
          {
            "text": "**Apple.** Processes all in-app purchases and subscription payments directly; we never see or store your payment card details. Apple also provides Sign in with Apple, if you use it, and delivers push notifications to Apple devices."
          },
          {
            "text": "**Google.** Provides Sign in with Google, if you use it."
          },
          {
            "text": "**Expo.** Sends push notifications to your device. It receives your device's push token and the content of each notification needed to deliver it."
          },
          {
            "text": "**Resend.** Sends our emails, such as sign-in and password-reset messages."
          },
          {
            "text": "**Vercel.** Hosts our website and the Public Challenge Pages."
          },
          {
            "text": "**Kit.** Our email marketing provider. It receives a name and email address only when someone opts in to marketing emails."
          },
          {
            "text": "**Stripe.** Processed payments for founding memberships and Beta Lifetime access purchased on our website before the App launched. We keep a record of each such purchase, including its Stripe identifier, so it can be honored in the App. We may share that identifier with RevenueCat to link the membership to your account. These purchases are no longer sold."
          }
        ]
      },
      {
        "note": [
          {
            "p": "These providers process information to provide their services to us. Their handling of information is also governed by their own terms and privacy policies."
          }
        ]
      }
    ]
  },
  {
    "title": "5. Data Sharing with Other Users",
    "blocks": [
      {
        "p": "Some features of the App are designed to be visible to other people you specifically choose to share with:"
      },
      {
        "ul": [
          {
            "text": "**Friends.** Members you connect with as friends can see your profile and your challenge progress (Challenge Day, completed days, and streak) for as long as the connection remains active. Friends' accounts can also access the details of your active goals and your Success Stack, including your identity statement, your Compass, your goal targets, and each daily input with the time and place you plan to do it. **Share Full Journey** controls whether the App displays your identity statement, today's Success Stack, and which inputs you've completed to friends; it is on by default, and you can change it in Settings. It does not limit what a friend's account can access, so connect only with people you trust with this information.",
            "children": [
              {
                "ul": [
                  {
                    "text": "You can remove a friend or block a member at any time."
                  }
                ]
              }
            ]
          },
          {
            "text": "**Encouragement messages.** Messages you send are delivered to the friend you send them to."
          },
          {
            "text": "**Public Challenge Page.** Off by default. If you turn it on in Settings, anyone with your page link (app.compoundtogreatness.com/watch/your-username) can see:",
            "children": [
              {
                "ul": [
                  {
                    "text": "your username, your first name and last initial, and your profile photo;"
                  },
                  {
                    "text": "your challenge progress: Challenge Day, completed days, streak, last active day, and your completion calendar."
                  }
                ]
              },
              {
                "p": "**Detailed Sharing**, a separate setting that is also off by default, adds your identity statement, the names of your daily inputs, and the goal each input belongs to."
              },
              {
                "p": "Your page never shows your proof photos, email address, last name, or Compass. With Detailed Sharing on, the shared identity statement, input names, and goals can include targets you entered, such as a target weight, a weight-loss goal (for example, \"Lose 20 lbs\"), or a daily calorie target. Turning the page off makes it unavailable right away."
              }
            ]
          },
          {
            "text": "**Visitor messages.** Visitors to your page can send you encouragement. You see the visitor's name and message, but not their email address."
          },
          {
            "text": "**Invitations.** When you share your link, the person you send it to sees your page if it's on. Otherwise, they see an invitation to join the App."
          }
        ]
      },
      {
        "note": [
          {
            "p": "You control who receives your links and whether your page is on. Your page is not listed or searchable in the App, but anyone who knows your username can open it while it's on. We do not publish or broadly distribute your content ourselves."
          }
        ]
      }
    ]
  },
  {
    "title": "6. Reports, Moderation and Safety",
    "blocks": [
      {
        "p": "**Message filtering.** To keep the App safe, messages sent to friends and from Public Challenge Pages are automatically checked against a list of clearly abusive terms. Visitor messages may not contain links. A message that fails this check is not saved."
      },
      {
        "p": "**Reports.** You can report a message sent to you, a visitor message, or a member. A report records:"
      },
      {
        "ul": [
          {
            "text": "your account;"
          },
          {
            "text": "the account being reported, if any;"
          },
          {
            "text": "the reason you choose and any details you add;"
          },
          {
            "text": "a copy of the reported content at the time of the report."
          }
        ]
      },
      {
        "p": "The person you report cannot see the report or who sent it. Our team reviews reports. We may remove content, restrict further messages from a visitor, or suspend or terminate accounts that violate our Terms."
      }
    ]
  },
  {
    "title": "7. Data Retention and Deletion",
    "blocks": [
      {
        "p": "We retain your information for as long as your account remains active, or as needed to provide the App's services."
      },
      {
        "p": "**Deleting your account.** You can permanently delete your account at any time directly within the App, under Settings → Delete Account. This action is irreversible. It removes from our systems:"
      },
      {
        "ul": [
          {
            "text": "your account and profile;"
          },
          {
            "text": "your goals, Success Stack, challenge history, and streak data;"
          },
          {
            "text": "your proof, profile, and goal photos;"
          },
          {
            "text": "your friend connections and the encouragement messages you sent and received;"
          },
          {
            "text": "your settings and Public Challenge Page;"
          },
          {
            "text": "the visitor messages sent to you."
          }
        ]
      },
      {
        "h3": "Some records are kept after deletion:"
      },
      {
        "ul": [
          {
            "text": "**Reports.** Reports filed by or about a deleted account are kept as a record of moderation decisions, including their copy of the reported content. The link to the deleted account is removed."
          },
          {
            "text": "**Subscription and security records.** We keep records of subscription and access changes, and security logs, for billing, security, and fraud-prevention purposes."
          },
          {
            "text": "**Backups and provider logs.** Deleted information may remain in backups and logs kept by our service providers until they are overwritten or expire."
          },
          {
            "text": "**Provider records.** Information already provided to our service providers, such as purchase records held by Apple and RevenueCat, is handled under those providers' own retention practices."
          }
        ]
      },
      {
        "p": "**Visitors.** Visitors to Public Challenge Pages can ask us to delete a message or email address they submitted by contacting us (Section 12)."
      }
    ]
  },
  {
    "title": "8. Children's Privacy",
    "blocks": [
      {
        "p": "Compound to Greatness is not directed at children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it."
      }
    ]
  },
  {
    "title": "9. Your Rights",
    "blocks": [
      {
        "p": "Depending on where you live, you may have rights to access, correct, delete, or receive a copy of your personal information, and to object to certain uses of it. You can exercise most of these rights directly within the App, by editing your profile or deleting your account. For anything else, contact us using the information below."
      },
      {
        "p": "You can also change your AI personalization choice at any time in Settings → Privacy → AI personalization, and unsubscribe from marketing emails with the link in any marketing email."
      },
      {
        "p": "If you are located in the European Union, you also have rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with your local data protection authority."
      }
    ]
  },
  {
    "title": "10. Security",
    "blocks": [
      {
        "p": "We take reasonable technical and organizational measures to protect your information, including industry-standard encryption in transit and access controls on our backend systems. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security."
      }
    ]
  },
  {
    "title": "11. Changes to This Policy",
    "blocks": [
      {
        "p": "We may update this Privacy Policy from time to time. If we make material changes, we will update the effective date above and, where required, notify you through the App."
      }
    ]
  }
];

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-black text-white">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>,
      )}
    </>
  );
}

function Blocks({ blocks, nested = false }: { blocks: Block[]; nested?: boolean }): ReactNode {
  return blocks.map((block, i) => {
    if ('h3' in block) {
      return <h3 key={i} className="text-base font-black text-white tracking-wide">{block.h3}</h3>;
    }
    if ('p' in block) {
      return (
        <p key={i} className="text-base text-gray-400 font-light leading-relaxed break-words">
          <Inline text={block.p} />
        </p>
      );
    }
    if ('ul' in block) {
      return (
        <ul key={i} className="space-y-3">
          {block.ul.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-base text-gray-400 font-light leading-relaxed">
              <span className={`w-1.5 h-1.5 mt-2.5 flex-shrink-0 ${nested ? 'bg-zinc-600' : 'bg-neon'}`} />
              <div className="space-y-3 min-w-0">
                <div className="break-words"><Inline text={item.text} /></div>
                {item.children && <Blocks blocks={item.children} nested />}
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-3">
        <Blocks blocks={block.note} />
      </div>
    );
  });
}

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
              Effective Date: {EFFECTIVE_DATE}
            </div>
          </div>

          {INTRO.map((para, i) => (
            <p key={i} className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
              {para}
            </p>
          ))}

          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {section.title}
              </h2>
              <Blocks blocks={section.blocks} />
            </section>
          ))}

          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              12. Contact Us
            </h2>
            <p className="text-base text-gray-400 font-light leading-relaxed">
              If you have questions about this Privacy Policy or how your information is handled, contact us at:
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

export default PrivacyPolicy;
