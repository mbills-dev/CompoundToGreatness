const W = 1000;
const H = 600;
const A = 2;
const B = Math.log((H - 50) / A) / W;

const DAY_X = (day: number) => (day / 77) * W;
const CURVE_Y = (x: number) => H - A * Math.exp(B * x);

function pathFrom(off: number): string {
  const pts: string[] = [];
  for (let d = 0; d <= 77; d++) {
    const x = DAY_X(d);
    const y = CURVE_Y(x);
    const slope = -A * B * Math.exp(B * x);
    const len = Math.sqrt(1 + slope * slope);
    const ox = x + (off * slope) / len;
    const oy = y - off / len;
    pts.push(`${ox.toFixed(1)},${oy.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

const MILESTONES = [
  { day: 1, title: 'THE COMMITMENT' },
  { day: 30, title: 'THE VOID', sub: 'MOST PEOPLE QUIT HERE' },
  { day: 55, title: 'THE SHIFT' },
  { day: 77, title: 'THE EMERGENCE' },
];

export default function CompoundCurve() {
  return (
    <div className="w-full">
      <svg viewBox="-60 -70 1280 780" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <path id="zonePath" d={pathFrom(42)} fill="none" />
        </defs>

        <path
          d={pathFrom(0)}
          fill="none"
          stroke="#ccff00"
          strokeWidth="4"
          strokeLinecap="round"
          className="curve-draw"
        />

        <text fill="#ccff00" fontSize="13" fontWeight="900" fontStyle="italic" letterSpacing="4" opacity="0.85" className="curve-fade">
          <textPath href="#zonePath" startOffset="5%">———&#160;&#160;ZERO EVIDENCE ZONE&#160;&#160;———</textPath>
        </text>
        <text fill="#ccff00" fontSize="13" fontWeight="900" fontStyle="italic" letterSpacing="4" opacity="0.85" className="curve-fade">
          <textPath href="#zonePath" startOffset="63%">———&#160;&#160;MOMENTUM ZONE&#160;&#160;———</textPath>
        </text>

        {MILESTONES.map((m) => {
          const x = DAY_X(m.day);
          const y = CURVE_Y(x);
          const isEnd = m.day === 77;
          return (
            <g key={m.day} className="curve-fade">
              <circle cx={x} cy={y} r="12" fill="rgba(5,5,5,0.8)" stroke="#ccff00" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="3" fill="#ccff00" />
              <text
                x={isEnd ? x + 24 : x + 20}
                y={isEnd ? y + 8 : y + 34}
                fill="#ccff00"
                fontSize="13"
                fontWeight="900"
                fontStyle="italic"
              >
                {m.title}
              </text>
              {m.sub && (
                <text x={x + 20} y={y + 54} fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="700" letterSpacing="1.5">
                  {m.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
