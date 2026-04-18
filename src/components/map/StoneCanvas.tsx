import { useRef, useState } from 'react'

export default function StoneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [drawing, setDrawing] = useState(false)

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const start = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = '#e0bb84'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    setDrawing(true)
  }

  const move = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => setDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="glow-card panel-ornament rounded-3xl p-5">
      <div className="mb-3">
        <h3 className="text-lg font-bold">Stone Sketch</h3>
        <p className="text-sm text-muted">
          Обведи контур петроглифа или сделай современную интерпретацию.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#2c241d]">
        <canvas
          ref={canvasRef}
          width={560}
          height={300}
          className="w-full cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
        />
      </div>

      <button
        onClick={clearCanvas}
        className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
      >
        Очистить
      </button>
    </div>
  )
}