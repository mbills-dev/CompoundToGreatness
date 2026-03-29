import { useState, useEffect, useRef } from 'react';
import { Target, ArrowRight, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoaded, setIsLoaded] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    setTimeout(() => setIsLoaded(true), 100);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { data: signup, error: signupError } = await supabase
        .from('beta_signups')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            payment_status: 'pending'
          }
        ])
        .select()
        .maybeSingle();

      if (signupError) throw signupError;

      const checkoutUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`;

      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          signupId: signup?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-black/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="w-10 h-10 bg-neon rounded-full flex items-center justify-center transition-transform hover:scale-110 hover:rotate-12 duration-300">
              <Target className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">COMPOUND TO GREATNESS</span>
          </div>
          <a
            href="#start"
            className={`hidden md:block bg-neon hover:bg-neon-light text-black px-8 py-3 font-black text-sm tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon/50 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            START NOW
          </a>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-neon/10 rounded-full blur-3xl animate-glow-pulse"></div>
          <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto pt-32 pb-20">
          <div className="space-y-8 mb-16">
            <div className={`inline-block transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-neon text-sm font-black tracking-widest mb-6">BETA ACCESS</div>
            </div>

            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: '100ms' }}>
              77 DAYS.<br />
              <span className="text-neon inline-block hover:scale-105 transition-transform duration-300">ONE IDENTITY.</span><br />
              ZERO EXCUSES.
            </h1>

            <p className={`text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
               style={{ transitionDelay: '300ms' }}>
              Stop chasing habits. Start building identity. The only 77-day challenge that transforms who you are, not just what you do.
            </p>
          </div>

          <a
            href="#start"
            className={`inline-flex items-center gap-4 bg-neon hover:bg-neon-light text-black px-12 py-5 font-black text-lg tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-neon/50 group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: '500ms' }}
          >
            BEGIN YOUR TRANSFORMATION
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

      </section>

      <section className="relative py-32 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 reveal-left">
              <div className="text-neon text-sm font-black tracking-widest">THE CHALLENGE</div>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter">
                WHO ARE YOU BECOMING?
              </h2>
              <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
                <p>
                  Most people track habits. Winners build identities.
                </p>
                <p>
                  77 days is the scientifically-proven timeframe to rewire your brain and cement lasting change. Not 21 days. Not 30 days. 77 days of relentless commitment.
                </p>
                <p>
                  This isn't about checking boxes. It's about proving to yourself, every single day, that you are who you say you are.
                </p>
              </div>
            </div>

            <div className="space-y-6 reveal-right">
              <div className="bg-zinc-900 border-l-4 border-neon p-8 hover:bg-zinc-800 hover:scale-105 hover:shadow-xl hover:shadow-neon/10 transition-all duration-300"
                   style={{ transitionDelay: '0ms' }}>
                <div className="text-6xl font-black text-neon mb-4">77</div>
                <div className="text-xl font-black mb-2">DAYS TO REWIRE</div>
                <div className="text-gray-400 font-light">The exact timeframe science says you need to form permanent neural pathways.</div>
              </div>

              <div className="bg-zinc-900 border-l-4 border-neon-light p-8 hover:bg-zinc-800 hover:scale-105 hover:shadow-xl hover:shadow-neon-light/10 transition-all duration-300"
                   style={{ transitionDelay: '100ms' }}>
                <div className="text-6xl font-black text-neon-light mb-4">100%</div>
                <div className="text-xl font-black mb-2">IDENTITY-BASED</div>
                <div className="text-gray-400 font-light">Every action reinforces who you're becoming, not just what you're doing.</div>
              </div>

              <div className="bg-zinc-900 border-l-4 border-white p-8 hover:bg-zinc-800 hover:scale-105 hover:shadow-xl hover:shadow-white/10 transition-all duration-300"
                   style={{ transitionDelay: '200ms' }}>
                <div className="text-6xl font-black text-white mb-4">∞</div>
                <div className="text-xl font-black mb-2">COMPOUNDING RESULTS</div>
                <div className="text-gray-400 font-light">Small daily wins that stack into massive transformation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-6xl mx-auto reveal-scale">
          <div className="relative w-full h-[600px] bg-zinc-900/50 rounded-xl overflow-hidden shadow-2xl shadow-neon/10 border border-neon/10">
            <iframe
              src="https://ais-pre-dnmwudhi3lro6vt6uou4jk-319127725657.us-west2.run.app?embed=true"
              className="w-full h-full border-none"
              title="Compound to Greatness Journey"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 reveal">
            <div className="text-neon text-sm font-black tracking-widest mb-6">THE SYSTEM</div>
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8">
              BUILT FOR<br />TRANSFORMATION
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-neon/20">
            <div className="bg-black p-12 space-y-4 hover:bg-zinc-950 transition-all duration-500 group reveal-scale cursor-pointer">
              <div className="w-16 h-16 bg-neon/10 flex items-center justify-center mb-6 group-hover:bg-neon/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Target className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-3xl font-black group-hover:text-neon transition-colors duration-300">IDENTITY COMPASS</h3>
              <p className="text-gray-400 font-light text-lg leading-relaxed">
                Define your core identity pillars. Let them drive every decision. Become unmovable in who you are.
              </p>
            </div>

            <div className="bg-black p-12 space-y-4 hover:bg-zinc-950 transition-all duration-500 group reveal-scale cursor-pointer" style={{ transitionDelay: '100ms' }}>
              <div className="w-16 h-16 bg-neon/10 flex items-center justify-center mb-6 group-hover:bg-neon/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Zap className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-3xl font-black group-hover:text-neon transition-colors duration-300">DAILY PROOF</h3>
              <p className="text-gray-400 font-light text-lg leading-relaxed">
                Check in every day. Build your streak. Stack evidence that you are who you claim to be.
              </p>
            </div>

            <div className="bg-black p-12 space-y-4 hover:bg-zinc-950 transition-all duration-500 group reveal-scale cursor-pointer" style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-neon/10 flex items-center justify-center mb-6 group-hover:bg-neon/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-8 h-8 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black group-hover:text-neon transition-colors duration-300">EVIDENCE LOG</h3>
              <p className="text-gray-400 font-light text-lg leading-relaxed">
                Capture your wins. Document your growth. Build an undeniable case for your transformation.
              </p>
            </div>

            <div className="bg-black p-12 space-y-4 hover:bg-zinc-950 transition-all duration-500 group reveal-scale cursor-pointer" style={{ transitionDelay: '300ms' }}>
              <div className="w-16 h-16 bg-neon/10 flex items-center justify-center mb-6 group-hover:bg-neon/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-8 h-8 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black group-hover:text-neon transition-colors duration-300">ACCOUNTABILITY</h3>
              <p className="text-gray-400 font-light text-lg leading-relaxed">
                Share your journey. Get real support. Let your circle hold you to your standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto text-center space-y-12 reveal">
          <div>
            <div className="text-neon text-sm font-black tracking-widest mb-6">THE TRUTH</div>
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter">
              YOU ALREADY KNOW<br />WHAT TO DO
            </h2>
          </div>

          <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            The question isn't what. It's who. Who do you need to become to get what you want? And are you willing to prove it every single day for 77 days?
          </p>

          <div className="pt-8 reveal-scale">
            <div className="inline-block bg-zinc-900 border border-neon/30 px-8 py-4 hover:border-neon/60 hover:shadow-lg hover:shadow-neon/20 transition-all duration-300 hover:scale-105">
              <div className="text-sm font-black text-gray-500 mb-2">EARLY ACCESS</div>
              <div className="text-4xl font-black text-neon">LIMITED SPOTS</div>
            </div>
          </div>
        </div>
      </section>

      <section id="start" className="relative py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-6">
              START YOUR<br />
              <span className="text-neon">77 DAYS</span>
            </h2>
            <p className="text-xl text-gray-400 font-light">
              Join the beta. Begin your transformation today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 reveal-scale">
            <div className="group">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-8 py-6 bg-zinc-900 border-2 border-zinc-800 focus:border-neon text-white text-lg font-medium placeholder-gray-600 focus:outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:shadow-neon/20"
                placeholder="FULL NAME"
              />
            </div>

            <div className="group">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-8 py-6 bg-zinc-900 border-2 border-zinc-800 focus:border-neon text-white text-lg font-medium placeholder-gray-600 focus:outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:shadow-neon/20"
                placeholder="EMAIL"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neon hover:bg-neon-light disabled:bg-zinc-700 text-black px-8 py-6 font-black text-xl tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon/50 disabled:scale-100 flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                <>
                  BEGIN TRANSFORMATION
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>

            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 p-6 text-red-500 text-center font-medium animate-fade-in-up">
                SOMETHING WENT WRONG. TRY AGAIN.
              </div>
            )}
          </form>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-neon rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Target className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-black tracking-tight">COMPOUND TO GREATNESS</span>
          </div>
          <p className="text-gray-600 text-sm font-light">
            © 2026 — Transform your identity, one day at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
