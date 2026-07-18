"use client"

import { useCallback, useEffect, useRef } from "react"

interface OriginalRailsProps {
  backgroundColor?: string
  lineColor?: string
  barColor?: string
  lineWidth?: number
  animationSpeed?: number
  removeWaveLine?: boolean
}

interface Bar {
  y: number
  height: number
  width: number
}

interface Burst {
  x: number
  y: number
  time: number
  intensity: number
}

const noise = (x: number, y: number, time: number): number => {
  const value =
    Math.sin(x * 0.02 + time) * Math.cos(y * 0.02 + time) +
    Math.sin(x * 0.03 - time) * Math.cos(y * 0.01 + time)
  return (value + 1) / 2
}

const generatePattern = (
  seed: number,
  width: number,
  height: number,
  lineCount: number
): Bar[][] => {
  const pattern: Bar[][] = []
  const lineSpacing = width / lineCount

  for (let line = 0; line < lineCount; line++) {
    const bars: Bar[] = []
    let currentY = 0
    while (currentY < height) {
      const noiseValue = noise(line * lineSpacing, currentY, seed)
      if (noiseValue > 0.5) {
        const barHeight = 10 + noiseValue * 30
        bars.push({
          y: currentY + barHeight / 2,
          height: barHeight,
          width: 2 + noiseValue * 3,
        })
        currentY += barHeight + 15
      } else {
        currentY += 15
      }
    }
    pattern.push(bars)
  }

  return pattern
}

const OriginalRails = ({
  backgroundColor = "#F0EEE6",
  lineColor = "#444",
  barColor = "#5E5D59",
  lineWidth = 1,
  animationSpeed = 0.005,
  removeWaveLine = true,
}: OriginalRailsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const animateRef = useRef<() => void>(() => {})
  const mouseRef = useRef({ x: 0, y: 0, isDown: false })
  const transitionBursts = useRef<Burst[]>([])

  const getMouseInfluence = (x: number, y: number): number => {
    const deltaX = x - mouseRef.current.x
    const deltaY = y - mouseRef.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    return Math.max(0, 1 - distance / 180)
  }

  const getBurstInfluence = (x: number, y: number, currentTime: number): number => {
    let influence = 0
    transitionBursts.current.forEach((burst) => {
      const age = currentTime - burst.time
      if (age >= 2500) return
      const distance = Math.hypot(x - burst.x, y - burst.y)
      const radius = (age / 2500) * 300
      const proximity = 1 - Math.abs(distance - radius) / 60
      if (proximity > 0) influence += (1 - age / 2500) * burst.intensity * proximity
    })
    return Math.min(influence, 1.5)
  }

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const displayWidth = window.innerWidth
    const displayHeight = window.innerHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    const context = canvas.getContext("2d")
    if (context) context.scale(dpr, dpr)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = event.clientX - rect.left
    mouseRef.current.y = event.clientY - rect.top
  }, [])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    mouseRef.current.isDown = true
    const rect = canvas.getBoundingClientRect()
    transitionBursts.current.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      time: Date.now(),
      intensity: 2,
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const currentTime = Date.now()
    timeRef.current += animationSpeed
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const lineCount = Math.max(1, Math.floor(width / 15))
    const lineSpacing = width / lineCount
    const firstPattern = generatePattern(0, width, height, lineCount)
    const secondPattern = generatePattern(5, width, height, lineCount)
    const baseCycle = timeRef.current % (Math.PI * 2)
    const adjustedCycle = baseCycle + getMouseInfluence(width / 2, height / 2) * 0.5

    let easingFactor = 0
    if (adjustedCycle < Math.PI * 0.1) easingFactor = 0
    else if (adjustedCycle < Math.PI * 0.9)
      easingFactor = (adjustedCycle - Math.PI * 0.1) / (Math.PI * 0.8)
    else if (adjustedCycle < Math.PI * 1.1) easingFactor = 1
    else if (adjustedCycle < Math.PI * 1.9)
      easingFactor = 1 - (adjustedCycle - Math.PI * 1.1) / (Math.PI * 0.8)

    const smoothEasing =
      easingFactor < 0.5
        ? 4 * easingFactor * easingFactor * easingFactor
        : 1 - Math.pow(-2 * easingFactor + 2, 3) / 2

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, width, height)

    for (let line = 0; line < lineCount; line++) {
      const x = line * lineSpacing + lineSpacing / 2
      const lineInfluence = getMouseInfluence(x, height / 2)
      context.beginPath()
      context.strokeStyle = lineColor
      context.lineWidth = lineWidth + lineInfluence * 2
      context.moveTo(x, 0)
      context.lineTo(x, height)
      context.stroke()

      const firstBars = firstPattern[line] || []
      const secondBars = secondPattern[line] || []
      const barCount = Math.max(firstBars.length, secondBars.length)

      for (let barIndex = 0; barIndex < barCount; barIndex++) {
        let firstBar = firstBars[barIndex]
        let secondBar = secondBars[barIndex]
        if (!firstBar) firstBar = { y: secondBar.y - 100, height: 0, width: 0 }
        if (!secondBar) secondBar = { y: firstBar.y + 100, height: 0, width: 0 }

        const mouseInfluence = getMouseInfluence(x, firstBar.y)
        const burstInfluence = getBurstInfluence(x, firstBar.y, currentTime)
        const baseWave =
          Math.sin(line * 0.3 + barIndex * 0.5 + timeRef.current * 2) *
          10 *
          (smoothEasing * (1 - smoothEasing) * 4)
        const mouseWave = mouseInfluence * Math.sin(timeRef.current * 3 + line * 0.2) * 15
        const burstWave =
          burstInfluence * Math.sin(timeRef.current * 4 + barIndex * 0.3) * 20
        const y =
          firstBar.y +
          (secondBar.y - firstBar.y) * smoothEasing +
          baseWave +
          mouseWave +
          burstWave
        const barHeight =
          firstBar.height +
          (secondBar.height - firstBar.height) * smoothEasing +
          mouseInfluence * 5 +
          burstInfluence * 8
        const barWidth =
          firstBar.width +
          (secondBar.width - firstBar.width) * smoothEasing +
          mouseInfluence * 2 +
          burstInfluence * 3

        if (barHeight <= 0.1 || barWidth <= 0.1) continue
        const red = Number.parseInt(barColor.slice(1, 3), 16)
        const green = Number.parseInt(barColor.slice(3, 5), 16)
        const blue = Number.parseInt(barColor.slice(5, 7), 16)
        const intensity = Math.min(1, 0.8 + mouseInfluence * 0.2 + burstInfluence * 0.3)
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${intensity})`
        context.fillRect(x - barWidth / 2, y - barHeight / 2, barWidth, barHeight)
      }
    }

    transitionBursts.current = transitionBursts.current.filter(
      (burst) => currentTime - burst.time < 2500
    )

    if (!removeWaveLine) {
      transitionBursts.current.forEach((burst) => {
        const progress = (currentTime - burst.time) / 2500
        context.beginPath()
        context.strokeStyle = `rgba(100, 100, 100, ${(1 - progress) * 0.2 * burst.intensity})`
        context.lineWidth = 2
        context.arc(burst.x, burst.y, progress * 300, 0, Math.PI * 2)
        context.stroke()
      })
    }

    animationFrameId.current = requestAnimationFrame(() => animateRef.current())
  }, [animationSpeed, backgroundColor, barColor, lineColor, lineWidth, removeWaveLine])

  useEffect(() => {
    animateRef.current = animate
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    resizeCanvas()
    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    animateRef.current()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
      timeRef.current = 0
      transitionBursts.current = []
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, resizeCanvas])

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden" style={{ backgroundColor }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export default OriginalRails
