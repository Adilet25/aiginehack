import { useMemo } from "react";
import { useLang } from "../../app/providers/LanguageProvider";

type RingArc = {
  label: string;
  startDay: number;
  endDay: number;
  color: string;
};

function getMonthLabels(lang: "ru" | "en") {
  return lang === "en"
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
}

const kyrgyzLabels = [
  "Бирдин айы",
  "Жалган куран",
  "Чын куран",
  "Бугу",
  "Кулжа",
  "Теке",
  "Баш оона",
  "Аяк оона",
  "Тогуздун айы",
  "Жетинин айы",
  "Бештин айы",
  "Үчтүн айы",
];

function getSpecialRings(t: {
  legendKyshChilde: string;
  legendZhayChilde: string;
  legendTokson: string;
}): RingArc[] {
  return [
    {
      label: t.legendKyshChilde,
      startDay: 8, // Jan 8
      endDay: 49, // Feb 18
      color: "#22d3ee",
    },
    {
      label: t.legendZhayChilde,
      startDay: 189, // Jul 8
      endDay: 230, // Aug 18
      color: "#f59e0b",
    },
    {
      label: t.legendTokson,
      startDay: 347, // Dec 13
      endDay: 72, // Mar 13 (cross-year)
      color: "#60a5fa",
    },
  ];
}

const DAYS_IN_YEAR = 365;
const SIZE = 760;
const CENTER = SIZE / 2;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function dayToAngle(day: number) {
  return (day / DAYS_IN_YEAR) * 360;
}

function getMonthStartDays() {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const starts: number[] = [];
  let sum = 0;
  for (let i = 0; i < monthDays.length; i++) {
    starts.push(sum);
    sum += monthDays[i];
  }
  return starts;
}

export default function KyrgyzCalendarWheel() {
  const { t, lang } = useLang();
  const monthStarts = useMemo(() => getMonthStartDays(), []);
  const monthLabels = getMonthLabels(lang);
  const specialRings = getSpecialRings(t);

  return (
    <div className="glow-card panel-ornament rounded-3xl p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-black text-stone-900 dark:text-white">
          {t.wheelTitle}
        </h3>
        <p className="mt-2 text-sm leading-7 text-stone-900 dark:text-stone-600 dark:text-white/65">
          {t.wheelDesc}
        </p>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="mx-auto h-[760px] w-[760px] max-w-full"
        >
          {/* outer background */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={300}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />

          {/* month sectors */}
          {monthStarts.map((startDay, index) => {
            const startAngle = dayToAngle(startDay);
            const endAngle = dayToAngle(
              index === 11 ? DAYS_IN_YEAR : monthStarts[index + 1],
            );

            const outerR = 290;
            const innerR = 220;

            const startOuter = polarToCartesian(
              CENTER,
              CENTER,
              outerR,
              startAngle,
            );
            const endOuter = polarToCartesian(CENTER, CENTER, outerR, endAngle);
            const startInner = polarToCartesian(
              CENTER,
              CENTER,
              innerR,
              startAngle,
            );
            const endInner = polarToCartesian(CENTER, CENTER, innerR, endAngle);

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            const path = [
              `M ${startOuter.x} ${startOuter.y}`,
              `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
              `L ${endInner.x} ${endInner.y}`,
              `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
              "Z",
            ].join(" ");

            const midAngle = (startAngle + endAngle) / 2;
            const labelPos = polarToCartesian(CENTER, CENTER, 255, midAngle);
            const kyrgyzPos = polarToCartesian(CENTER, CENTER, 205, midAngle);

            return (
              <g key={index}>
                <path
                  d={path}
                  fill={
                    index % 2 === 0
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.02)"
                  }
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.2"
                />

                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                >
                  {monthLabels[index]}
                </text>

                <text
                  x={kyrgyzPos.x}
                  y={kyrgyzPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="10"
                >
                  {kyrgyzLabels[index]}
                </text>
              </g>
            );
          })}

          {/* seasonal rings */}
          {specialRings.map((ring, index) => {
            const r = 175 - index * 24;

            if (ring.startDay <= ring.endDay) {
              const startAngle = dayToAngle(ring.startDay);
              const endAngle = dayToAngle(ring.endDay);

              return (
                <g key={ring.label}>
                  <path
                    d={describeArc(CENTER, CENTER, r, startAngle, endAngle)}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                </g>
              );
            }

            // cross-year arc, e.g. Tokson
            const firstStart = dayToAngle(ring.startDay);
            const firstEnd = 360;
            const secondStart = 0;
            const secondEnd = dayToAngle(ring.endDay);

            return (
              <g key={ring.label}>
                <path
                  d={describeArc(CENTER, CENTER, r, firstStart, firstEnd)}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d={describeArc(CENTER, CENTER, r, secondStart, secondEnd)}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* center circles */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={118}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={84}
            fill="rgba(0,0,0,0.2)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* center title */}
          <text
            x={CENTER}
            y={CENTER - 18}
            textAnchor="middle"
            fill="white"
            fontSize="22"
            fontWeight="800"
          >
            {t.kyrgyzCalendar.split(" ")[0]}
          </text>
          <text
            x={CENTER}
            y={CENTER + 10}
            textAnchor="middle"
            fill="white"
            fontSize="22"
            fontWeight="800"
          >
            {t.kyrgyzCalendar.split(" ")[1] ?? ""}
          </text>
          <text
            x={CENTER}
            y={CENTER + 38}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="11"
          >
            Ай • Үркөр • Чилде
          </text>

          {/* legend */}
          <g transform={`translate(${CENTER - 120}, ${CENTER + 150})`}>
            <rect x="0" y="0" width="14" height="14" rx="4" fill="#22d3ee" />
            <text x="24" y="11" fill="white" fontSize="12">
              {t.legendKyshChilde}
            </text>

            <rect x="0" y="26" width="14" height="14" rx="4" fill="#f59e0b" />
            <text x="24" y="37" fill="white" fontSize="12">
              {t.legendZhayChilde}
            </text>

            <rect x="0" y="52" width="14" height="14" rx="4" fill="#60a5fa" />
            <text x="24" y="63" fill="white" fontSize="12">
              {t.legendTokson}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
