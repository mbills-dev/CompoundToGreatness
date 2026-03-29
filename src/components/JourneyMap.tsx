import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Flag,
  Zap,
  Compass,
  Trophy,
  Info,
  ArrowRight,
  RefreshCw,
  Maximize2,
  Map as MapIcon
} from 'lucide-react';

interface JourneyStep {
  id: string;
  day: number;
  title: string;
  description: string;
  viewBox: string;
  color: string;
  isFullMap?: boolean;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'start',
    day: 0,
    title: 'Compound to Greatness',
    description: 'Welcome to the COMPOUND TO GREATNESS. A 77-day road map to make achieving your goals inevitable.',
    viewBox: '-100 -100 1400 800',
    color: '#ccff00',
    isFullMap: true,
  },
  {
    id: 'commitment',
    day: 1,
    title: 'The Commitment',
    description: 'Your journey begins with single choice to commit to making your goals a reality.',
    viewBox: '-212 448 450 300',
    color: '#ccff00',
  },
  {
    id: 'void',
    day: 30,
    title: 'The Void',
    description: 'The "Zero Evidence Zone". You are working hard, but seeing no results.',
    viewBox: '165 432 450 300',
    color: '#ccff00',
  },
  {
    id: 'shift',
    day: 55,
    title: 'The Shift',
    description: 'The curve starts to bend. Momentum begins to build.',
    viewBox: '489 330 450 300',
    color: '#ccff00',
  },
  {
    id: 'emergence',
    day: 77,
    title: 'The Emergence',
    description: 'You have achieved the goal, but more importantly you have become the person who gets the goal by default.',
    viewBox: '775 -100 450 300',
    color: '#ccff00',
  },
  {
    id: 'end',
    day: 77,
    title: 'Journey Complete',
    description: 'You have traversed the compound curve. What is your next horizon?',
    viewBox: '-100 -100 1400 800',
    color: '#ccff00',
    isFullMap: true,
  },
];

const CURVE_COLOR = "#ccff00";

export default function JourneyMap() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [cardVisible, setCardVisible] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentStep = JOURNEY_STEPS[currentStepIndex];

  const curvePoints = useMemo(() => {
    const points: [number, number][] = [];
    const totalDays = 77;
    const width = 1000;
    const height = 600;
    const xStep = width / totalDays;
    const a = 2;
    const b = Math.log((height - 50) / a) / width;

    for (let d = 0; d <= totalDays; d++) {
      const x = d * xStep;
      const y = height - (a * Math.exp(b * x));
      points.push([x, y]);
    }
    return points;
  }, []);

  const pathData = useMemo(() => `M ${curvePoints.map(p => p.join(',')).join(' L ')}`, [curvePoints]);

  const pathMetrics = useMemo(() => {
    let total = 0;
    const lengths = [0];
    for (let i = 1; i < curvePoints.length; i++) {
      const d = Math.sqrt(
        Math.pow(curvePoints[i][0] - curvePoints[i-1][0], 2) +
        Math.pow(curvePoints[i][1] - curvePoints[i-1][1], 2)
      );
      total += d;
      lengths.push(total);
    }
    return { total, lengths };
  }, [curvePoints]);

  const getPointAtDay = (day: number): [number, number] => curvePoints[day] || [0, 0];

  const goToStep = (index: number) => {
    if (isMoving) return;
    setIsMoving(true);
    setCardVisible(false);
    setTimeout(() => {
      setCurrentStepIndex(index);
      setCardVisible(true);
      setIsMoving(false);
    }, 400);
  };

  const nextStep = () => goToStep((currentStepIndex + 1) % JOURNEY_STEPS.length);
  const prevStep = () => goToStep((currentStepIndex - 1 + JOURNEY_STEPS.length) % JOURNEY_STEPS.length);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(nextStep, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStepIndex]);

  const pathLength = currentStep.day === 0
    ? 0
    : pathMetrics.lengths[Math.min(currentStep.day - 1, pathMetrics.lengths.length - 1)] / pathMetrics.total;

  return (
    <div className="w-full h-[600px] bg-[#050505] text-white font-sans overflow-hidden flex flex-col selection:bg-[#ccff00] selection:text-black rounded-3xl border border-white/5 shadow-2xl relative">
      <header className="p-4 md:p-6 flex justify-between items-center border-b border-white/5 z-20 bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
            <Compass className="w-5 h-5 md:w-6 md:h-6 text-[#ccff00]" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight uppercase italic leading-none">Compound to Greatness</h1>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] mt-1 font-bold text-white/40">
              {currentStep.isFullMap ? 'Global Overview' : `Phase ${currentStepIndex}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all border ${isAutoPlaying ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
          >
            {isAutoPlaying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            <span className="hidden xs:inline">{isAutoPlaying ? 'AUTO-SEQUENCE' : 'AUTO-PLAY'}</span>
          </button>
          <button onClick={() => goToStep(0)} className="p-1.5 md:p-2 rounded-full bg-white/5 text-white/40 hover:text-white border border-white/10"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-black">
        <svg
          ref={svgRef}
          viewBox={currentStep.viewBox}
          className="w-full h-full transition-all duration-[2500ms] ease-in-out"
          style={{ transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ccff00" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
            </radialGradient>
            <clipPath id="pathClip">
              <rect x="-200" y="-200" width={`${(pathLength) * 1400}`} height="1000" />
            </clipPath>
          </defs>

          <path
            d={pathData}
            fill="none"
            stroke="#ccff00"
            strokeWidth="4"
            strokeLinecap="round"
            clipPath="url(#pathClip)"
          />

          {JOURNEY_STEPS.filter(s => !s.isFullMap).map((step) => {
            const [x, y] = getPointAtDay(step.day);
            const isActive = step.id === currentStep.id;
            if (step.day > currentStep.day) return null;
            return (
              <g key={step.id}>
                {isActive && <circle cx={x} cy={y} r="40" fill="url(#glow)" />}
                <circle cx={x} cy={y} r="12" fill="rgba(5,5,5,0.8)" stroke={isActive ? CURVE_COLOR : 'rgba(204,255,0,0.3)'} strokeWidth="1" />
                <circle cx={x} cy={y} r="3" fill={isActive ? CURVE_COLOR : 'rgba(204,255,0,0.5)'} />
                <text x={x + 20} y={y + 30} fill={isActive ? '#ccff00' : 'rgba(204,255,0,0.4)'} fontSize="11" fontWeight="900" fontStyle="italic">{step.title}</text>
              </g>
            );
          })}
        </svg>

        <div className="absolute top-6 left-6 right-6 md:top-12 md:left-12 md:right-auto md:max-w-md z-10">
          <div
            style={{
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
            className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ccff00] flex items-center justify-center text-black">
                {currentStep.id === 'start' && <MapIcon className="w-5 h-5" />}
                {currentStep.id === 'commitment' && <Flag className="w-5 h-5" />}
                {currentStep.id === 'void' && <Info className="w-5 h-5" />}
                {currentStep.id === 'shift' && <Zap className="w-5 h-5" />}
                {currentStep.id === 'emergence' && <Trophy className="w-5 h-5" />}
                {currentStep.id === 'end' && <Trophy className="w-5 h-5" />}
              </div>
              <h2 className="text-xl md:text-3xl font-black uppercase italic leading-none tracking-tight">{currentStep.title}</h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-6 text-xs md:text-sm font-medium">{currentStep.description}</p>
            <div className="flex items-center gap-2">
              <button onClick={prevStep} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"><ChevronLeft className="w-4 h-4 text-white/60" /></button>
              <button onClick={nextStep} className="flex-1 flex items-center justify-between p-3 px-6 rounded-xl bg-[#ccff00] text-black font-black uppercase italic transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="text-xs md:text-sm">{currentStepIndex === 0 ? 'Start Journey' : currentStepIndex === JOURNEY_STEPS.length - 1 ? 'Restart Protocol' : 'Next Phase'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 md:p-5 px-6 md:px-10 bg-[#050505] border-t border-white/5 flex flex-col md:flex-row gap-4 md:justify-between items-center text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-black text-white/20">
        <div className="flex gap-6 md:gap-12">
          <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" /> Imagination Phase</div>
          <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#ccff00]" /> Vision Realization</div>
        </div>
        <div className="flex items-center gap-2"><span>System Status:</span><span className="text-[#ccff00]">Nominal</span></div>
      </footer>
    </div>
  );
}
