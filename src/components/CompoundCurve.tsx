const DAY_X = (day: number) => (day / 77) * 1000;
const CURVE_Y = (x: number) => 600 - 8 * Math.exp(0.004248 * x);

function curvePath(): string {
  const pts: string[] = [];
  for (let d = 0; d <= 77; d++) {
    const x = DAY_X(d);
    pts.push(`${x.toFixed(1)},${CURVE_Y(x).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

export default function CompoundCurve() {
  const quitX = DAY_X(40);
  const quitY = CURVE_Y(quitX);

  return (
    <div className="w-full">
      <svg viewBox="0 0 1000 640" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* zone dividers */}
        {[21, 50, 63].map((day) => (
          <line
            key={day}
            x1={DAY_X(day)} y1="40" x2={DAY_X(day)} y2="600"
            stroke="#27272a" strokeWidth="1.5" strokeDasharray="6 8"
          />
        ))}

        {/* zone labels */}
        <text x={DAY_X(10.5)} y="628" textAnchor="middle" fill="#52525b" fontSize="17" fontWeight="900" letterSpacing="2">COMMITMENT</text>
        <text x={DAY_X(35.5)} y="628" textAnchor="middle" fill="#a1a1aa" fontSize="17" fontWeight="900" letterSpacing="2">ZERO EVIDENCE ZONE</text>
        <text x={DAY_X(56.5)} y="628" textAnchor="middle" fill="#52525b" fontSize="17" fontWeight="900" letterSpacing="2">THE SHIFT</text>
        <text x={DAY_X(70)} y="628" textAnchor="middle" fill="#ccff00" fontSize="17" fontWeight="900" letterSpacing="2">ESCAPE VELOCITY</text>

        {/* baseline */}
        <line x1="0" y1="600" x2="1000" y2="600" stroke="#27272a" strokeWidth="2" />

        {/* the curve */}
        <path
          d={curvePath()}
          fill="none"
          stroke="#ccff00"
          strokeWidth="5"
          strokeLinecap="round"
          className="curve-draw"
        />

        {/* most quit here marker */}
        <circle cx={quitX} cy={quitY} r="9" fill="#000" stroke="#ccff00" strokeWidth="3" />
        <line x1={quitX} y1={quitY - 12} x2={quitX} y2={quitY - 60} stroke="#52525b" strokeWidth="1.5" />
        <text x={quitX} y={quitY - 74} textAnchor="middle" fill="#f4f4f5" fontSize="19" fontWeight="900" letterSpacing="1.5">MOST PEOPLE QUIT HERE</text>
        <text x={quitX} y={quitY - 52} textAnchor="middle" fill="#52525b" fontSize="15" fontWeight="600">DAY 40 — WORKING HARD, NOTHING VISIBLE YET</text>

        {/* day 77 marker */}
        <circle cx={DAY_X(77) - 4} cy={CURVE_Y(DAY_X(77) - 4)} r="9" fill="#ccff00" />
        <text x={DAY_X(72)} y={CURVE_Y(DAY_X(74)) - 24} textAnchor="end" fill="#ccff00" fontSize="19" fontWeight="900" letterSpacing="1.5">DAY 77</text>
      </svg>
    </div>
  );
}
