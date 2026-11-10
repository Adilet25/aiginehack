import './WorkshopStudio.css';
import { useInterfaceCopy } from '../data/interface';
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Hammer,
  Brush,
  RotateCcw,
  Download,
  Sparkles,
  Search,
  Upload,
} from "lucide-react";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";
import type { ArtworkCategory, Lang } from "../types";

type ToolMode = "hammer" | "chisel" | "brush";
type TemplateType = "none" | "goat" | "deer" | "sun" | "hunter";
type DetectedType = "goat" | "deer" | "hunter" | "sun" | "abstract";

type Point = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

type StrokePoint = Point & {
  type: ToolMode;
};

type Interpretation = {
  detectedType: DetectedType;
  title: string;
  whatItShows: string;
  meaning: string;
  projection: string;
  confidence: "low" | "medium" | "high";
};

const templatePaths: Record<Exclude<TemplateType, "none">, string> = {
  goat: "M160 240 C190 180, 240 150, 290 140 C320 135, 350 110, 360 85 M300 145 C310 170, 325 195, 350 215 M220 155 C210 190, 205 220, 205 260 M270 150 C265 190, 270 225, 280 265 M355 83 C370 70, 382 70, 392 83 M355 85 C365 60, 390 45, 410 55",
  deer: "M150 235 C180 180, 230 150, 280 145 C305 143, 330 130, 350 110 M220 150 C215 190, 212 225, 215 260 M270 147 C270 190, 275 225, 285 260 M350 110 C365 88, 382 70, 400 58 M352 108 C376 103, 395 96, 415 82",
  sun: "M280 170 C330 170, 360 200, 360 250 C360 300, 330 330, 280 330 C230 330, 200 300, 200 250 C200 200, 230 170, 280 170 M280 125 L280 85 M320 135 L340 100 M350 165 L385 145 M360 250 L400 250 M350 335 L385 355 M320 365 L340 400 M280 375 L280 415 M240 365 L220 400 M210 335 L175 355 M200 250 L160 250 M210 165 L175 145 M240 135 L220 100",
  hunter:
    "M210 120 L220 155 L215 190 M220 155 L260 150 M260 150 L300 115 M260 150 L300 185 M215 190 L195 240 M215 190 L235 240 M300 115 C330 120, 355 135, 380 155",
};

function getInterpretationLibrary(lang: Lang): Record<DetectedType, Interpretation> {
  if (lang === "en") {
    return {
      goat: {
        detectedType: "goat",
        title: "Looks like a mountain goat",
        whatItShows:
          "The system saw an elongated animal figure with an emphasis on horns, back and a stable pose.",
        meaning:
          "Such an image may be connected with strength, endurance, height, wild nature and the hunting world.",
        projection:
          "The stone seems to show an animal confidently walking along a slope. This may be an image of the power of nature or a figure watched by a human.",
        confidence: "high",
      },
      deer: {
        detectedType: "deer",
        title: "Looks like a deer",
        whatItShows:
          "The drawing resembles a slender animal with a long body and a smooth line of movement.",
        meaning:
          "The image of a deer may convey beauty, sensitivity, movement, memory and connection with the natural cycle.",
        projection:
          "The figure looks as if the animal is moving quietly and carefully. This may be not only a scene of nature, but also a symbol of refinement and path.",
        confidence: "medium",
      },
      hunter: {
        detectedType: "hunter",
        title: "Looks like a hunter or a human in action",
        whatItShows:
          "The system saw a more vertical composition with a hint of a human figure and directed action.",
        meaning:
          "Such a motif may be connected with hunting, observation, strategy, protection or movement toward a goal.",
        projection:
          "It seems that the human figure is in a moment of action: observing, pursuing or directing force in a certain direction.",
        confidence: "medium",
      },
      sun: {
        detectedType: "sun",
        title: "Looks like a solar sign",
        whatItShows:
          "The system detected a circular or radial composition resembling a sign rather than a usual scene.",
        meaning:
          "Such a drawing may relate to the sun, the cycle of time, a sacred symbol or cosmic order.",
        projection:
          "This is rather not a plot but a sign. It looks like an attempt to convey the idea of light, rhythm, sky or ritual meaning.",
        confidence: "high",
      },
      abstract: {
        detectedType: "abstract",
        title: "Ambiguous composition",
        whatItShows:
          "The system sees a set of lines, notches and shapes, but not yet enough features for confident recognition.",
        meaning:
          "This may be an abstract sign, part of a larger drawing or an unfinished motif.",
        projection:
          "For now the scene is not read unambiguously. Perhaps the drawing is only beginning to emerge or needs additional strokes for the plot to become clear.",
        confidence: "low",
      },
    };
  }

  return {
    goat: {
      detectedType: "goat",
      title: "Похоже на горного козла",
      whatItShows:
        "Система увидела вытянутую фигуру животного с акцентом на рога, спину и устойчивую позу.",
      meaning:
        "Такой образ может быть связан с силой, выносливостью, высотой, дикой природой и охотничьим миром.",
      projection:
        "На камне словно показано животное, уверенно идущее по склону. Это может быть образ силы природы или фигура, за которой наблюдает человек.",
      confidence: "high",
    },
    deer: {
      detectedType: "deer",
      title: "Похоже на оленя",
      whatItShows:
        "Рисунок похож на стройное животное с длинным корпусом и плавной линией движения.",
      meaning:
        "Образ оленя может передавать красоту, чуткость, движение, память и связь с природным циклом.",
      projection:
        "Фигура выглядит так, будто животное движется тихо и осторожно. Это может быть не только сцена природы, но и символ утончённости и пути.",
      confidence: "medium",
    },
    hunter: {
      detectedType: "hunter",
      title: "Похоже на охотника или человека в действии",
      whatItShows:
        "Система увидела более вертикальную композицию с намёком на фигуру человека и направленное действие.",
      meaning:
        "Такой мотив может быть связан с охотой, наблюдением, стратегией, защитой или движением к цели.",
      projection:
        "Похоже, что фигура человека находится в моменте действия: он наблюдает, преследует или направляет силу в определённую сторону.",
      confidence: "medium",
    },
    sun: {
      detectedType: "sun",
      title: "Похоже на солнечный знак",
      whatItShows:
        "Система обнаружила круговую или лучевую композицию, похожую на знак, а не на обычную сцену.",
      meaning:
        "Такой рисунок может относиться к солнцу, циклу времени, сакральному символу или космическому порядку.",
      projection:
        "Это скорее не сюжет, а знак. Он выглядит как попытка передать идею света, ритма, неба или ритуального значения.",
      confidence: "high",
    },
    abstract: {
      detectedType: "abstract",
      title: "Неоднозначная композиция",
      whatItShows:
        "Система видит набор линий, насечек и форм, но пока недостаточно признаков для уверенного распознавания.",
      meaning:
        "Это может быть абстрактный знак, часть более крупного рисунка или незавершённый мотив.",
      projection:
        "Пока сцена не читается однозначно. Возможно, рисунок только начинает проявляться или требует дополнительных штрихов, чтобы стал понятен сюжет.",
      confidence: "low",
    },
  };
}

export default function StoneWorkshop() {
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFocused(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { publishArtwork } = useGame();
  const { t, lang } = useLang();
  const c = useInterfaceCopy();

  const interpretationLibrary = useMemo(
    () => getInterpretationLibrary(lang),
    [lang],
  );

  const [tool, setTool] = useState<ToolMode>("hammer");
  const [template, setTemplate] = useState<TemplateType>("none");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<StrokePoint[]>([]);
  const [impactPulse, setImpactPulse] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation | null>(
    null,
  );

  const [publishTitle, setPublishTitle] = useState("");
  const [publishAuthor, setPublishAuthor] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishMessage, setPublishMessage] = useState("");

  const toolConfig = useMemo(() => {
    if (tool === "hammer") return { size: 10, density: 6, alpha: 0.18 };
    if (tool === "chisel") return { size: 5, density: 3, alpha: 0.26 };
    return { size: 3, density: 1, alpha: 0.35 };
  }, [tool]);

  useEffect(() => {
  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const drawStoneBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#3a3028");
    gradient.addColorStop(0.5, "#2b241e");
    gradient.addColorStop(1, "#211b16");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 220; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = (height / 10) * i + Math.random() * 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        width * 0.25,
        y + 10,
        width * 0.6,
        y - 10,
        width,
        y + 5,
      );
      ctx.stroke();
    }
  };

  const drawTemplateOverlay = (ctx: CanvasRenderingContext2D) => {
    if (template === "none") return;
    const pathString = templatePaths[template as Exclude<TemplateType, "none">];
    const path = new Path2D(pathString);
    ctx.save();
    ctx.strokeStyle = "rgba(230, 199, 156, 0.18)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.stroke(path);
    ctx.restore();
  };

  const drawStrokes = (ctx: CanvasRenderingContext2D) => {
    for (const point of strokes) {
      if (point.type === "hammer") {
        for (let i = 0; i < 6; i++) {
          const offsetX = (Math.random() - 0.5) * point.size * 1.2;
          const offsetY = (Math.random() - 0.5) * point.size * 1.2;
          ctx.beginPath();
          ctx.arc(
            point.x + offsetX,
            point.y + offsetY,
            Math.random() * point.size,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = `rgba(224, 187, 132, ${point.alpha})`;
          ctx.fill();
        }
      } else if (point.type === "chisel") {
        ctx.beginPath();
        ctx.ellipse(
          point.x,
          point.y,
          point.size * 1.3,
          point.size * 0.55,
          Math.random(),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(231, 198, 144, ${point.alpha})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 214, 172, ${point.alpha})`;
        ctx.fill();
      }
    }
  };

  const drawCanvas = () => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    drawStoneBackground(ctx, width, height);
    drawTemplateOverlay(ctx);
    drawStrokes(ctx);
  };
    drawCanvas();
  }, [strokes, template]);

  const createImpact = (x: number, y: number) => {
    setImpactPulse({ x, y });
    window.setTimeout(() => setImpactPulse(null), 180);
  };

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const addStoneMark = (x: number, y: number) => {
    const newPoints: StrokePoint[] = [];

    for (let i = 0; i < toolConfig.density; i++) {
      newPoints.push({
        x: x + (Math.random() - 0.5) * toolConfig.size * 1.2,
        y: y + (Math.random() - 0.5) * toolConfig.size * 1.2,
        size: Math.max(1.5, toolConfig.size * (0.5 + Math.random() * 0.8)),
        alpha: toolConfig.alpha + Math.random() * 0.08,
        type: tool,
      });
    }

    setStrokes((prev) => [...prev, ...newPoints]);

    if (tool === "hammer") {
      createImpact(x, y);
    }
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const { x, y } = getPointerPos(e);
    addStoneMark(x, y);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary) return;
    if (!isDrawing) return;
    const { x, y } = getPointerPos(e);
    addStoneMark(x, y);
  };

  const handleUp = () => setIsDrawing(false);

  const clearCanvas = () => {
    setStrokes([]);
    setInterpretation(null);
    setPublishMessage("");
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-petroglyph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const detectByHeuristic = (): DetectedType => {
    if (strokes.length < 25) return "abstract";

    const xs = strokes.map((s) => s.x);
    const ys = strokes.map((s) => s.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    let nearCenter = 0;
    for (const s of strokes) {
      const dx = s.x - centerX;
      const dy = s.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.min(width, height) * 0.22) nearCenter++;
    }

    const centerRatio = nearCenter / strokes.length;

    if (centerRatio > 0.28 && Math.abs(width - height) < 90) {
      return "sun";
    }

    if (height > width * 1.3) {
      return "hunter";
    }

    if (width > height * 1.35) {
      return width > 220 ? "deer" : "goat";
    }

    return "abstract";
  };

  const interpretDrawing = () => {
    let detected: DetectedType;

    if (template !== "none") {
      detected = template as Exclude<TemplateType, "none">;
    } else {
      detected = detectByHeuristic();
    }

    setInterpretation(interpretationLibrary[detected]);
    setPublishMessage("");
  };

  const handlePublish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!interpretation) {
      setPublishMessage(t.interpretFirst);
      return;
    }
    if (!publishTitle.trim() || !publishAuthor.trim()) {
      setPublishMessage(t.fillTitleAuthor);
      return;
    }

    publishArtwork({
      title: publishTitle.trim(),
      author: publishAuthor.trim(),
      description: publishDescription.trim() || interpretation.projection,
      imageUrl: canvas.toDataURL("image/png"),
      category: interpretation.detectedType as ArtworkCategory,
    });

    setPublishMessage(t.artworkPublished);
    setPublishTitle("");
    setPublishAuthor("");
    setPublishDescription("");
  };

const templateOptions: { key: TemplateType; label: string }[] = [
    { key: "none", label: t.noTemplate },
    { key: "goat", label: t.goat },
    { key: "deer", label: t.deer },
    { key: "sun", label: t.sunSign },
    { key: "hunter", label: t.hunter },
  ];

  return (
    <div className={focused ? 'stone-desk stone-desk--expanded' : 'stone-desk'}>
      <header className="stone-desk-bar">
        <div className="stone-toolset" role="group" aria-label={t.tools}>
          {[
            { id: 'hammer' as const, label: t.hammer, Icon: Hammer },
            { id: 'chisel' as const, label: t.chisel, Icon: Sparkles },
            { id: 'brush' as const, label: t.softTool, Icon: Brush },
          ].map(({ id, label, Icon }) => (
            <button key={id} aria-pressed={tool === id} onClick={() => setTool(id)}><Icon size={19} />{label}</button>
          ))}
        </div>
        <button className="stone-expand" aria-pressed={focused} onClick={() => setFocused(value => !value)}>
          {focused ? '↙ Esc' : '↗'}
          <span>{lang === 'en' ? 'Canvas' : lang === 'kg' ? 'Кенеп' : 'Холст'}</span>
        </button>
      </header>

      <div className="stone-desk-workspace">
        <section className="stone-desk-stage" aria-label={c.draw}>
          <div className="stone-stage-label"><span>{t.carvingMode}</span><span>900 × 620</span></div>
          <div className="stone-desk-sheet">
            <canvas ref={canvasRef} width={900} height={620} aria-label={t.carvingMode}
              onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}
              onPointerCancel={handleUp} onLostPointerCapture={handleUp} />
            {impactPulse && <span className="stone-impact" style={{ left: (impactPulse.x / 900) * 100 + '%', top: (impactPulse.y / 620) * 100 + '%' }} />}
          </div>
          <div className="stone-stage-footer"><p>{c.toolsHint}</p><button onClick={clearCanvas}><RotateCcw size={15} />{t.clearStone}</button></div>
        </section>

        <aside className="stone-desk-library">
          <span className="stone-eyebrow">01 / {t.template}</span>
          <div className="stone-template-list">
            {templateOptions.map(item => <button key={item.key} aria-pressed={template === item.key} onClick={() => setTemplate(item.key)}>
              <svg viewBox="80 30 380 420" aria-hidden="true">
                {item.key === 'none' ? <path d="M220 180 L320 280 M320 180 L220 280" /> : <path d={templatePaths[item.key]} />}
              </svg><span>{item.label}</span>
            </button>)}
          </div>
          <details className="stone-help"><summary>{t.carvingMode}</summary><p>{t.carvingModeDesc}</p><p>{t.workshopTip}</p></details>
        </aside>
      </div>

      <section className="stone-desk-finish">
        <div><span className="stone-eyebrow">02 / {t.actions}</span><h2>{t.savePetroglyph}</h2><p>{t.publishDesc}</p></div>
        <div className="stone-finish-actions"><button onClick={saveImage}><Download size={18} />PNG</button><button onClick={interpretDrawing}><Search size={18} />{t.interpretDrawing}</button></div>
      </section>
      {interpretation && <section className="stone-desk-story">
        <div><span className="stone-eyebrow">{t.interpretation}</span><h2>{interpretation.title}</h2><p>{interpretation.whatItShows}</p><p>{interpretation.meaning}</p><p>{interpretation.projection}</p><small>{t.mvpNote}</small></div>
        <div className="stone-publish"><h2><Upload size={20} />{t.publishToCommunity}</h2>
          <label>{t.workTitle}<input value={publishTitle} onChange={e => setPublishTitle(e.target.value)} /></label>
          <label>{t.authorName}<input value={publishAuthor} onChange={e => setPublishAuthor(e.target.value)} /></label>
          <label>{t.shortDescription}<textarea rows={3} value={publishDescription} onChange={e => setPublishDescription(e.target.value)} /></label>
          <button onClick={handlePublish}>{t.publishArtwork}</button>
          {publishMessage && <p role="status">{publishMessage}</p>}
        </div>
      </section>}
    </div>
  );
}
