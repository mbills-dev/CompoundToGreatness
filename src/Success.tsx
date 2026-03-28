import { Target, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

function Success() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (id) setSessionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center space-y-12 py-20">
        <div className="inline-flex items-center justify-center w-32 h-32 border-4 border-neon rounded-full mb-8">
          <div className="text-6xl font-black text-neon">✓</div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter">
            YOU'RE IN.
          </h1>

          <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
            Your transformation starts now. Check your email for access to the app and your 77-day challenge begins today.
          </p>
        </div>

        <div className="bg-zinc-900 border border-neon/30 p-12 space-y-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black">WHAT HAPPENS NEXT</h2>

          <div className="space-y-6 text-left">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-neon/10 flex items-center justify-center flex-shrink-0">
                <div className="text-2xl font-black text-neon">1</div>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">CHECK YOUR EMAIL</h3>
                <p className="text-gray-400 font-light">
                  Your welcome email is on the way with download links and setup instructions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-neon/10 flex items-center justify-center flex-shrink-0">
                <div className="text-2xl font-black text-neon">2</div>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">BUILD YOUR COMPASS</h3>
                <p className="text-gray-400 font-light">
                  Define your identity. Set your pillars. Create the foundation for your transformation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-neon/10 flex items-center justify-center flex-shrink-0">
                <div className="text-2xl font-black text-neon">3</div>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">START DAY 1</h3>
                <p className="text-gray-400 font-light">
                  Your 77-day journey begins. Show up. Check in. Build proof of who you are.
                </p>
              </div>
            </div>
          </div>
        </div>

        {sessionId && (
          <div className="text-sm text-gray-600 font-mono">
            ORDER: {sessionId.slice(0, 24)}...
          </div>
        )}

        <div className="pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 bg-neon hover:bg-neon-light text-black px-8 py-4 font-black text-lg tracking-wide transition-all duration-200 hover:scale-105 group"
          >
            <Target className="w-6 h-6" />
            BACK TO HOME
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Success;
