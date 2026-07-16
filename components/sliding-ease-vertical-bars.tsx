"use client"

import { useCallback, useEffect, useRef } from "react"

interface SlidingEaseVerticalBarsProps {
  backgroundColor?: string
  lineColor?: string
  barColor?: string
  lineWidth?: number
  animationSpeed?: number
  removeWaveLine?: boolean
}

interface ForwardPass {
  startTime: number
  startX: number
  endX: number
  intensity: number
}

interface Burst {
  x: number
  y: number
  time: number
  intensity: number
}

interface SceneBuffers {
  width: number
  height: number
  cellSize: number
  canvases: [HTMLCanvasElement, HTMLCanvasElement]
}

type SceneDrawer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) => void

const ASCII_CELL_SIZE = 13
const ASCII_RAMP = " .,:;i1tfLCJ0Zmwqpdbkhao*#MW&8%B@$"
const SCENE_DURATION = 8200
const SCENE_TRANSITION_START = 0.67
const FORWARD_PASS_DURATION = SCENE_DURATION * (1 - SCENE_TRANSITION_START)
const VISUAL_CENTER_X = 0.72

const hash = (x: number, y: number): number => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return value - Math.floor(value)
}

const smoothstep = (start: number, end: number, value: number): number => {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)))
  return progress * progress * (3 - 2 * progress)
}

const clamp = (value: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, value))

const drawBackdrop = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colors: [string, string, string, string]
) => {
  const background = ctx.createLinearGradient(0, 0, width, height)
  background.addColorStop(0, colors[0])
  background.addColorStop(0.42, colors[1])
  background.addColorStop(0.72, colors[2])
  background.addColorStop(1, colors[3])
  ctx.globalAlpha = 1
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)

  for (let index = 0; index < 3; index++) {
    const x = width * (0.5 + index * 0.2) + Math.sin(time * 0.18 + index * 2.1) * width * 0.08
    const y = height * (0.28 + index * 0.22) + Math.cos(time * 0.15 + index * 1.7) * height * 0.12
    const radius = Math.max(width, height) * (0.18 + index * 0.035)
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, `${colors[(index + 2) % colors.length]}88`)
    glow.addColorStop(1, `${colors[(index + 2) % colors.length]}00`)
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  }
}

const drawNode = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  glow = 0
) => {
  ctx.save()
  if (glow > 0) {
    ctx.shadowColor = color
    ctx.shadowBlur = glow
  }
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

const drawNeuralNetwork: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#0b0f1b", "#211024", "#43101b", "#111b22"])

  const counts = [4, 7, 9, 7, 5, 3]
  const left = width * (VISUAL_CENTER_X - 0.25)
  const right = width * (VISUAL_CENTER_X + 0.25)
  const top = height * 0.1
  const bottom = height * 0.9
  const signal = (time * 0.16) % 1
  const layers = counts.map((count, layerIndex) => {
    const layerProgress = layerIndex / (counts.length - 1)
    const x = left + (right - left) * layerProgress
    return Array.from({ length: count }, (_, nodeIndex) => ({
      x: x + Math.sin(time * 0.34 + layerIndex * 1.3 + nodeIndex) * 0.55,
      y:
        top +
        ((bottom - top) * (nodeIndex + 1)) / (count + 1) +
        Math.cos(time * 0.42 + nodeIndex * 0.9 + layerIndex) * 0.85,
      layerProgress,
    }))
  })

  ctx.lineCap = "round"
  layers.slice(0, -1).forEach((sourceLayer, layerIndex) => {
    const targetLayer = layers[layerIndex + 1]
    sourceLayer.forEach((source, nodeIndex) => {
      const projected = Math.round(
        (nodeIndex / Math.max(1, sourceLayer.length - 1)) * (targetLayer.length - 1)
      )
      const direction = hash(layerIndex + 17, nodeIndex + 31) > 0.5 ? 1 : -1
      const targets = new Set([
        projected,
        clamp(projected + direction, 0, targetLayer.length - 1),
      ])

      targets.forEach((targetIndex) => {
        const target = targetLayer[targetIndex]
        const midpoint = (source.layerProgress + target.layerProgress) / 2
        const activation = Math.max(0, 1 - Math.abs(midpoint - signal) / 0.18)
        const control = (target.x - source.x) * 0.44
        const bend = (hash(layerIndex + 43, nodeIndex * 7 + targetIndex) - 0.5) * height * 0.08
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.bezierCurveTo(
          source.x + control,
          source.y + bend,
          target.x - control,
          target.y - bend,
          target.x,
          target.y
        )
        ctx.strokeStyle = activation > 0.05 ? `rgba(255,126,146,${0.38 + activation * 0.62})` : "rgba(119,124,202,0.34)"
        ctx.lineWidth = 0.65 + activation * 1.35
        ctx.shadowColor = "#ff637d"
        ctx.shadowBlur = activation * 3
        ctx.stroke()
      })
    })
  })

  ctx.shadowBlur = 0
  layers.forEach((layer, layerIndex) => {
    layer.forEach((node, nodeIndex) => {
      const activation = Math.max(0, 1 - Math.abs(node.layerProgress - signal) / 0.15)
      const color = activation > 0.05 ? "#ffd2d9" : layerIndex % 2 === 0 ? "#dc667c" : "#7881d0"
      drawNode(ctx, node.x, node.y, 0.9 + hash(layerIndex + 59, nodeIndex + 73) * 0.45 + activation * 0.65, color, activation * 4)
    })
  })
}

const drawTransformerFlow: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#0b1220", "#151f37", "#321321", "#1c210d"])

  const scale = Math.min(width, height)
  const tokenX = width * (VISUAL_CENTER_X - 0.23)
  const projectionX = width * (VISUAL_CENTER_X - 0.11)
  const attentionX = width * VISUAL_CENTER_X
  const mlpX = width * (VISUAL_CENTER_X + 0.12)
  const outputX = width * (VISUAL_CENTER_X + 0.22)
  const pulse = (time * 0.2) % 1
  const tokenYs = Array.from({ length: 6 }, (_, index) =>
    height * (0.22 + (index / 5) * 0.56)
  )
  const projectionYs = [height * 0.3, height * 0.5, height * 0.7]

  ctx.lineCap = "round"
  ctx.lineWidth = 0.65
  tokenYs.forEach((tokenY, tokenIndex) => {
    const tokenActivation = Math.max(0, 1 - Math.abs(tokenIndex / 5 - pulse) / 0.22)
    ctx.fillStyle = `rgba(121,146,214,${0.42 + tokenActivation * 0.56})`
    ctx.fillRect(tokenX - scale * 0.075, tokenY - scale * 0.025, scale * 0.15, scale * 0.05)

    projectionYs.forEach((projectionY, projectionIndex) => {
      ctx.beginPath()
      ctx.moveTo(tokenX + scale * 0.08, tokenY)
      ctx.bezierCurveTo(
        width * (VISUAL_CENTER_X - 0.16),
        tokenY,
        width * (VISUAL_CENTER_X - 0.15),
        projectionY,
        projectionX - scale * 0.055,
        projectionY
      )
      ctx.strokeStyle =
        projectionIndex === tokenIndex % 3
          ? `rgba(255,147,169,${0.44 + tokenActivation * 0.48})`
          : "rgba(105,131,190,0.2)"
      ctx.stroke()
    })
  })

  projectionYs.forEach((projectionY, projectionIndex) => {
    const labels = ["Q", "K", "V"]
    ctx.fillStyle = projectionIndex === 1 ? "#8b72c9" : "#b84d68"
    ctx.fillRect(
      projectionX - scale * 0.05,
      projectionY - scale * 0.055,
      scale * 0.1,
      scale * 0.11
    )
    ctx.fillStyle = "#f9dce3"
    ctx.font = `600 ${scale * 0.055}px ui-monospace, monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(labels[projectionIndex], projectionX, projectionY)
    ctx.beginPath()
    ctx.moveTo(projectionX + scale * 0.055, projectionY)
    ctx.lineTo(attentionX - scale * 0.14, height * 0.5)
    ctx.strokeStyle = "rgba(222,178,207,0.58)"
    ctx.stroke()
  })

  const matrixSize = scale * 0.26
  const cells = 5
  const cellSize = matrixSize / cells
  const matrixLeft = attentionX - matrixSize / 2
  const matrixTop = height * 0.5 - matrixSize / 2
  for (let row = 0; row < cells; row++) {
    for (let column = 0; column < cells; column++) {
      const diagonal = Math.max(0, 1 - Math.abs(row - column) / 1.7)
      const moving = Math.max(0, 1 - Math.abs(column / (cells - 1) - pulse) / 0.22)
      const activation = clamp(diagonal * 0.5 + moving * 0.7)
      ctx.fillStyle = `rgba(${Math.round(83 + activation * 170)},${Math.round(
        72 + activation * 72
      )},${Math.round(137 + activation * 80)},${0.38 + activation * 0.6})`
      ctx.fillRect(
        matrixLeft + column * cellSize + 0.4,
        matrixTop + row * cellSize + 0.4,
        cellSize - 0.8,
        cellSize - 0.8
      )
    }
  }

  ctx.strokeStyle = "rgba(226,210,238,0.68)"
  ctx.strokeRect(matrixLeft - 1, matrixTop - 1, matrixSize + 2, matrixSize + 2)
  ctx.beginPath()
  ctx.moveTo(attentionX + matrixSize / 2, height * 0.5)
  ctx.lineTo(mlpX - scale * 0.065, height * 0.5)
  ctx.stroke()

  for (let layer = 0; layer < 4; layer++) {
    const layerX = mlpX - scale * 0.06 + layer * scale * 0.04
    const layerPulse = Math.max(0, 1 - Math.abs(layer / 3 - pulse) / 0.28)
    ctx.fillStyle = `rgba(210,83,111,${0.38 + layerPulse * 0.58})`
    ctx.fillRect(layerX, height * 0.36, scale * 0.025, scale * 0.28)
  }

  tokenYs.forEach((tokenY, tokenIndex) => {
    const outputActivation = Math.max(0, 1 - Math.abs(tokenIndex / 5 - pulse) / 0.2)
    ctx.beginPath()
    ctx.moveTo(mlpX + scale * 0.1, height * 0.5)
    ctx.lineTo(outputX - scale * 0.055, tokenY)
    ctx.strokeStyle = `rgba(127,174,211,${0.2 + outputActivation * 0.65})`
    ctx.stroke()
    drawNode(
      ctx,
      outputX,
      tokenY,
      scale * (0.018 + outputActivation * 0.012),
      outputActivation > 0.05 ? "#ffd3dc" : "#7a9fc8",
      outputActivation * 3
    )
  })
}

const drawRobotArm: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#0d121d", "#182038", "#2a151b", "#1b1b0c"])

  const floorY = height * 0.86
  const scale = Math.min(width, height)
  const shoulder = { x: width * (VISUAL_CENTER_X - 0.07), y: floorY - scale * 0.08 }
  const upperLength = scale * 0.24
  const forearmLength = scale * 0.22
  const cubeSize = scale * 0.075
  const clawLength = scale * 0.06
  const pickup = { x: width * (VISUAL_CENTER_X + 0.14), y: floorY - clawLength - cubeSize }
  const placement = { x: width * (VISUAL_CENTER_X - 0.16), y: floorY - clawLength - cubeSize }
  const home = { x: width * (VISUAL_CENTER_X + 0.05), y: height * 0.39 }
  const lift = { x: width * VISUAL_CENTER_X, y: height * 0.3 }
  const pickupHover = { x: pickup.x, y: pickup.y - scale * 0.13 }
  const placementHover = { x: placement.x, y: placement.y - scale * 0.15 }
  const cycle = (time * 0.17) % 1

  const move = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    start: number,
    end: number
  ) => {
    const progress = smoothstep(start, end, cycle)
    return {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
    }
  }

  let wristTarget = home
  if (cycle < 0.16) wristTarget = move(home, pickupHover, 0, 0.16)
  else if (cycle < 0.26) wristTarget = move(pickupHover, pickup, 0.16, 0.26)
  else if (cycle < 0.34) wristTarget = pickup
  else if (cycle < 0.48) wristTarget = move(pickup, lift, 0.34, 0.48)
  else if (cycle < 0.62) wristTarget = move(lift, placementHover, 0.48, 0.62)
  else if (cycle < 0.72) wristTarget = move(placementHover, placement, 0.62, 0.72)
  else if (cycle < 0.8) wristTarget = placement
  else wristTarget = move(placement, home, 0.8, 1)

  const deltaX = wristTarget.x - shoulder.x
  const deltaY = wristTarget.y - shoulder.y
  const targetDistance = clamp(
    Math.hypot(deltaX, deltaY),
    Math.abs(upperLength - forearmLength) + 0.01,
    upperLength + forearmLength - 0.01
  )
  const elbowOffset = Math.acos(
    clamp(
      (targetDistance * targetDistance - upperLength * upperLength - forearmLength * forearmLength) /
        (2 * upperLength * forearmLength),
      -1,
      1
    )
  )
  const upperAngle =
    Math.atan2(deltaY, deltaX) -
    Math.atan2(
      forearmLength * Math.sin(elbowOffset),
      upperLength + forearmLength * Math.cos(elbowOffset)
    )
  const forearmAngle = upperAngle + elbowOffset
  const elbow = {
    x: shoulder.x + Math.cos(upperAngle) * upperLength,
    y: shoulder.y + Math.sin(upperAngle) * upperLength,
  }
  const wrist = {
    x: elbow.x + Math.cos(forearmAngle) * forearmLength,
    y: elbow.y + Math.sin(forearmAngle) * forearmLength,
  }

  const floor = ctx.createLinearGradient(0, floorY - height * 0.05, 0, height)
  floor.addColorStop(0, "rgba(146,160,78,0.42)")
  floor.addColorStop(1, "rgba(45,50,22,0.08)")
  ctx.fillStyle = floor
  ctx.fillRect(0, floorY - height * 0.05, width, height - floorY)

  ctx.strokeStyle = "rgba(183,203,103,0.68)"
  ctx.lineWidth = 0.8
  ctx.strokeRect(
    placement.x - cubeSize * 0.72,
    floorY - cubeSize * 0.16,
    cubeSize * 1.44,
    cubeSize * 0.16
  )

  ctx.fillStyle = "#8b3345"
  ctx.fillRect(shoulder.x - scale * 0.07, floorY - scale * 0.06, scale * 0.14, scale * 0.07)
  ctx.fillStyle = "#d15d73"
  ctx.fillRect(shoulder.x - scale * 0.045, shoulder.y, scale * 0.09, floorY - shoulder.y)

  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.beginPath()
  ctx.moveTo(shoulder.x, shoulder.y)
  ctx.lineTo(elbow.x, elbow.y)
  ctx.lineTo(wrist.x, wrist.y)
  ctx.strokeStyle = "rgba(29,9,17,0.9)"
  ctx.lineWidth = scale * 0.09
  ctx.stroke()
  ctx.strokeStyle = "#ef8194"
  ctx.lineWidth = scale * 0.055
  ctx.shadowColor = "#ef8194"
  ctx.shadowBlur = 3
  ctx.stroke()
  ctx.shadowBlur = 0

  drawNode(ctx, shoulder.x, shoulder.y, scale * 0.045, "#f6c2ca", 2)
  drawNode(ctx, elbow.x, elbow.y, scale * 0.04, "#8597d8", 2)
  drawNode(ctx, wrist.x, wrist.y, scale * 0.032, "#f6c2ca", 2)

  const gripping = cycle >= 0.26 && cycle < 0.76
  const gripOpen = scale * (gripping ? 0.025 : 0.052)
  ctx.strokeStyle = "#d6dff4"
  ctx.lineWidth = scale * 0.016
  ;[-1, 1].forEach((direction) => {
    const startX = wrist.x + gripOpen * direction
    const startY = wrist.y
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, startY + clawLength)
    ctx.lineTo(startX - gripOpen * 0.35 * direction, startY + clawLength)
    ctx.stroke()
  })

  const carrying = cycle >= 0.29 && cycle < 0.75
  const cubeX = carrying ? wrist.x : cycle >= 0.75 ? placement.x : pickup.x
  const cubeY = carrying ? wrist.y + clawLength + cubeSize / 2 : floorY - cubeSize / 2
  ctx.fillStyle = "#b5cb68"
  ctx.shadowColor = "#d7ed86"
  ctx.shadowBlur = carrying ? 4 : 1
  ctx.fillRect(cubeX - cubeSize / 2, cubeY - cubeSize / 2, cubeSize, cubeSize)
  ctx.shadowBlur = 0
  ctx.strokeStyle = "rgba(243,255,189,0.9)"
  ctx.lineWidth = 0.8
  ctx.strokeRect(cubeX - cubeSize / 2, cubeY - cubeSize / 2, cubeSize, cubeSize)
}

const drawAIChip: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#08141a", "#11293a", "#30131f", "#1d210d"])

  const scale = Math.min(width, height)
  const center = { x: width * VISUAL_CENTER_X, y: height * 0.5 }
  const chipSize = scale * 0.43
  const half = chipSize / 2
  const pulse = (time * 0.24) % 1

  ctx.lineCap = "round"
  for (let index = 0; index < 10; index++) {
    const offset = -half + ((index + 0.5) / 10) * chipSize
    const activation = Math.max(0, 1 - Math.abs(index / 9 - pulse) / 0.2)
    const color = activation > 0 ? `rgba(255,132,154,${0.55 + activation * 0.45})` : "rgba(113,153,205,0.48)"
    ctx.strokeStyle = color
    ctx.lineWidth = 0.7 + activation

    ctx.beginPath()
    ctx.moveTo(center.x - half - scale * 0.16, center.y + offset)
    ctx.lineTo(center.x - half, center.y + offset)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(center.x + half, center.y + offset)
    ctx.lineTo(center.x + half + scale * 0.16, center.y + offset)
    ctx.stroke()

    if (index < 8) {
      const verticalOffset = -half + ((index + 0.5) / 8) * chipSize
      ctx.beginPath()
      ctx.moveTo(center.x + verticalOffset, center.y - half - scale * 0.13)
      ctx.lineTo(center.x + verticalOffset, center.y - half)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(center.x + verticalOffset, center.y + half)
      ctx.lineTo(center.x + verticalOffset, center.y + half + scale * 0.13)
      ctx.stroke()
    }
  }

  ctx.fillStyle = "rgba(28,22,43,0.94)"
  ctx.strokeStyle = "#e17a91"
  ctx.lineWidth = 1.5
  ctx.shadowColor = "#f06f8a"
  ctx.shadowBlur = 4
  ctx.beginPath()
  ctx.roundRect(center.x - half, center.y - half, chipSize, chipSize, scale * 0.055)
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0

  const coreSize = chipSize * 0.68
  const coreLeft = center.x - coreSize / 2
  const coreTop = center.y - coreSize / 2
  const coreCount = 5
  const coreGap = scale * 0.012
  const coreCell = (coreSize - coreGap * (coreCount - 1)) / coreCount

  ctx.strokeStyle = "rgba(125,148,205,0.38)"
  ctx.lineWidth = 0.55
  for (let row = 0; row < coreCount; row++) {
    for (let column = 0; column < coreCount; column++) {
      const coreX = coreLeft + column * (coreCell + coreGap) + coreCell / 2
      const coreY = coreTop + row * (coreCell + coreGap) + coreCell / 2
      if (column < coreCount - 1) {
        ctx.beginPath()
        ctx.moveTo(coreX + coreCell / 2, coreY)
        ctx.lineTo(coreX + coreCell / 2 + coreGap, coreY)
        ctx.stroke()
      }
      if (row < coreCount - 1) {
        ctx.beginPath()
        ctx.moveTo(coreX, coreY + coreCell / 2)
        ctx.lineTo(coreX, coreY + coreCell / 2 + coreGap)
        ctx.stroke()
      }
    }
  }

  for (let row = 0; row < coreCount; row++) {
    for (let column = 0; column < coreCount; column++) {
      const activationPoint = (column + row * 0.42) / (coreCount - 1 + (coreCount - 1) * 0.42)
      const activation = Math.max(0, 1 - Math.abs(activationPoint - pulse) / 0.2)
      const coreX = coreLeft + column * (coreCell + coreGap)
      const coreY = coreTop + row * (coreCell + coreGap)
      ctx.fillStyle = `rgba(${Math.round(72 + activation * 182)},${Math.round(
        76 + activation * 70
      )},${Math.round(137 + activation * 70)},${0.48 + activation * 0.5})`
      ctx.shadowColor = "#ff7892"
      ctx.shadowBlur = activation * 4
      ctx.fillRect(coreX, coreY, coreCell, coreCell)
    }
  }
  ctx.shadowBlur = 0
}

const drawLossOptimization: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#0b111d", "#17253b", "#35141f", "#17220f"])

  const scale = Math.min(width, height)
  const minimum = { x: width * VISUAL_CENTER_X, y: height * 0.56 }
  const rotation = -0.18

  ctx.lineCap = "round"
  for (let level = 0; level < 10; level++) {
    const radiusX = scale * (0.055 + level * 0.038)
    const radiusY = scale * (0.035 + level * 0.025)
    ctx.beginPath()
    for (let point = 0; point <= 72; point++) {
      const angle = (point / 72) * Math.PI * 2
      const wobble = 1 + Math.sin(angle * 3 + level * 0.7) * 0.045
      const localX = Math.cos(angle) * radiusX * wobble
      const localY = Math.sin(angle) * radiusY * wobble
      const x = minimum.x + localX * Math.cos(rotation) - localY * Math.sin(rotation)
      const y = minimum.y + localX * Math.sin(rotation) + localY * Math.cos(rotation)
      if (point === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    const levelPulse = 0.5 + Math.sin(time * 0.7 - level * 0.5) * 0.28
    ctx.strokeStyle =
      level % 2 === 0
        ? `rgba(116,157,211,${0.3 + levelPulse * 0.35})`
        : `rgba(199,91,118,${0.26 + levelPulse * 0.32})`
    ctx.lineWidth = 0.55 + (9 - level) * 0.035
    ctx.stroke()
  }

  const steps = [
    { x: width * (VISUAL_CENTER_X + 0.22), y: height * 0.2 },
    { x: width * (VISUAL_CENTER_X + 0.15), y: height * 0.31 },
    { x: width * (VISUAL_CENTER_X + 0.1), y: height * 0.44 },
    { x: width * (VISUAL_CENTER_X + 0.06), y: height * 0.48 },
    { x: width * (VISUAL_CENTER_X + 0.035), y: height * 0.54 },
    { x: width * (VISUAL_CENTER_X + 0.01), y: height * 0.545 },
    minimum,
  ]

  ctx.beginPath()
  steps.forEach((step, index) => {
    if (index === 0) ctx.moveTo(step.x, step.y)
    else ctx.lineTo(step.x, step.y)
  })
  ctx.strokeStyle = "rgba(255,215,224,0.66)"
  ctx.lineWidth = 0.9
  ctx.stroke()

  steps.forEach((step, index) => {
    drawNode(
      ctx,
      step.x,
      step.y,
      scale * (index === steps.length - 1 ? 0.025 : 0.014),
      index === steps.length - 1 ? "#e8ed91" : "#dca1b4",
      index === steps.length - 1 ? 4 : 1
    )
  })

  const descent = (time * 0.22) % 1
  const pathPosition = descent * (steps.length - 1)
  const segment = Math.min(steps.length - 2, Math.floor(pathPosition))
  const segmentProgress = smoothstep(0, 1, pathPosition - segment)
  const current = {
    x: steps[segment].x + (steps[segment + 1].x - steps[segment].x) * segmentProgress,
    y: steps[segment].y + (steps[segment + 1].y - steps[segment].y) * segmentProgress,
  }
  drawNode(ctx, current.x, current.y, scale * 0.026, "#fff2f5", 5)
}

const drawDiffusionDenoising: SceneDrawer = (ctx, width, height, time) => {
  drawBackdrop(ctx, width, height, time, ["#08131c", "#112638", "#31151d", "#1d230d"])

  const scale = Math.min(width, height)
  const columns = 25
  const rows = 21
  const frameWidth = scale * 0.62
  const frameHeight = scale * 0.52
  const cellWidth = frameWidth / columns
  const cellHeight = frameHeight / rows
  const left = width * VISUAL_CENTER_X - frameWidth / 2
  const top = height * 0.48 - frameHeight / 2
  const cycle = (time * 0.17) % 1
  const denoise = smoothstep(0.08, 0.9, cycle)
  const noiseStep = Math.floor(time * 8)

  ctx.fillStyle = "rgba(7,12,23,0.72)"
  ctx.fillRect(left - 2, top - 2, frameWidth + 4, frameHeight + 4)

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const normalizedX = ((column + 0.5) / columns) * 2 - 1
      const normalizedY = ((row + 0.5) / rows) * 2 - 1
      const face =
        (normalizedX * normalizedX) / (0.57 * 0.57) +
          ((normalizedY - 0.08) * (normalizedY - 0.08)) / (0.66 * 0.66) <=
        1
      const leftEar =
        normalizedY > -0.88 &&
        normalizedY < -0.24 &&
        Math.abs(normalizedX + 0.36) < (normalizedY + 0.88) * 0.48
      const rightEar =
        normalizedY > -0.88 &&
        normalizedY < -0.24 &&
        Math.abs(normalizedX - 0.36) < (normalizedY + 0.88) * 0.48
      const leftEye =
        ((normalizedX + 0.2) * (normalizedX + 0.2)) / 0.007 +
          ((normalizedY + 0.03) * (normalizedY + 0.03)) / 0.0035 <=
        1
      const rightEye =
        ((normalizedX - 0.2) * (normalizedX - 0.2)) / 0.007 +
          ((normalizedY + 0.03) * (normalizedY + 0.03)) / 0.0035 <=
        1
      const nose =
        (normalizedX * normalizedX) / 0.005 +
          ((normalizedY - 0.2) * (normalizedY - 0.2)) / 0.003 <=
        1

      let target = [20, 28, 45]
      if (face || leftEar || rightEar) target = [190, 92, 118]
      if (leftEar || rightEar) target = [147, 73, 126]
      if (leftEye || rightEye) target = [218, 229, 139]
      if (nose) target = [255, 211, 221]

      const noiseRed = Math.round(38 + hash(column + noiseStep * 17, row + 301) * 190)
      const noiseGreen = Math.round(35 + hash(column + 503, row + noiseStep * 19) * 170)
      const noiseBlue = Math.round(48 + hash(column + noiseStep * 23, row + 709) * 185)
      const lockPoint = 0.12 + hash(column + 811, row + 919) * 0.72
      const localDenoise = smoothstep(lockPoint - 0.18, lockPoint + 0.18, denoise)
      const red = Math.round(noiseRed + (target[0] - noiseRed) * localDenoise)
      const green = Math.round(noiseGreen + (target[1] - noiseGreen) * localDenoise)
      const blue = Math.round(noiseBlue + (target[2] - noiseBlue) * localDenoise)
      ctx.fillStyle = `rgb(${red},${green},${blue})`
      ctx.fillRect(
        left + column * cellWidth + 0.25,
        top + row * cellHeight + 0.25,
        cellWidth - 0.5,
        cellHeight - 0.5
      )
    }
  }

  ctx.strokeStyle = `rgba(239,220,231,${0.3 + denoise * 0.55})`
  ctx.lineWidth = 0.8
  ctx.strokeRect(left - 2, top - 2, frameWidth + 4, frameHeight + 4)

  for (let step = 0; step < 8; step++) {
    const stepProgress = step / 7
    const active = Math.max(0, 1 - Math.abs(stepProgress - denoise) / 0.18)
    drawNode(
      ctx,
      left + stepProgress * frameWidth,
      top + frameHeight + scale * 0.09,
      scale * (0.009 + active * 0.008),
      active > 0.05 ? "#ffe3e9" : "#7489b8",
      active * 2
    )
  }
}

const SCENES: SceneDrawer[] = [
  drawNeuralNetwork,
  drawRobotArm,
  drawTransformerFlow,
  drawLossOptimization,
  drawDiffusionDenoising,
  drawAIChip,
]

const createSceneCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return canvas
}

const renderScene = (
  canvas: HTMLCanvasElement,
  sceneIndex: number,
  time: number
): Uint8ClampedArray => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return new Uint8ClampedArray(canvas.width * canvas.height * 4)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  SCENES[sceneIndex](ctx, canvas.width, canvas.height, time)
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data
}

const SlidingEaseVerticalBars = ({
  backgroundColor = "#F0EEE6",
  lineColor = "#444",
  barColor = "#5E5D59",
  lineWidth = 1,
  animationSpeed = 0.005,
  removeWaveLine = true,
}: SlidingEaseVerticalBarsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const animateRef = useRef<() => void>(() => {})
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const burstsRef = useRef<Burst[]>([])
  const forwardPassesRef = useRef<ForwardPass[]>([])
  const lastTransitionCycleRef = useRef(-1)
  const buffersRef = useRef<SceneBuffers | null>(null)
  const sceneEpochRef = useRef(0)

  const getMouseInfluence = (x: number, y: number): number => {
    const distance = Math.hypot(x - mouseRef.current.x, y - mouseRef.current.y)
    return Math.max(0, 1 - distance / 190)
  }

  const getBurstInfluence = (x: number, y: number, currentTime: number): number => {
    let influence = 0
    burstsRef.current.forEach((burst) => {
      const age = currentTime - burst.time
      if (age >= 2400) return
      const radius = (age / 2400) * 320
      const distance = Math.hypot(x - burst.x, y - burst.y)
      const ring = Math.max(0, 1 - Math.abs(distance - radius) / 65)
      influence += ring * (1 - age / 2400) * burst.intensity
    })
    return Math.min(1.5, influence)
  }

  const getForwardInfluence = (x: number, currentTime: number): number => {
    let influence = 0
    forwardPassesRef.current.forEach((pass) => {
      const progress = (currentTime - pass.startTime) / FORWARD_PASS_DURATION
      if (progress < 0 || progress > 1) return
      const eased = smoothstep(0, 1, progress)
      const front = pass.startX + (pass.endX - pass.startX) * eased
      const leading = Math.max(0, 1 - Math.abs(x - front) / 92)
      const trailDistance = front - x
      const trail = trailDistance >= 0 ? Math.max(0, 1 - trailDistance / 270) * 0.3 : 0
      influence += (leading + trail) * pass.intensity
    })
    return Math.min(1.5, influence)
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
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)

    const width = Math.ceil(displayWidth / ASCII_CELL_SIZE)
    const height = Math.ceil(displayHeight / ASCII_CELL_SIZE)
    buffersRef.current = {
      width,
      height,
      cellSize: ASCII_CELL_SIZE,
      canvases: [createSceneCanvas(width, height), createSceneCanvas(width, height)],
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 }
  }, [])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const now = Date.now()
    burstsRef.current.push({ x, y, time: now, intensity: 1.7 })
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || canvas.getClientRects().length === 0) {
      animationFrameId.current = null
      return
    }
    const buffers = buffersRef.current
    if (!buffers) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentTime = Date.now()
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const time = (currentTime / 1000) * (animationSpeed / 0.005)

    const sceneElapsed = Math.max(0, currentTime - sceneEpochRef.current)
    const sceneCycle = Math.floor(sceneElapsed / SCENE_DURATION)
    const scenePhase = (sceneElapsed % SCENE_DURATION) / SCENE_DURATION
    const currentScene = sceneCycle % SCENES.length
    const nextScene = (currentScene + 1) % SCENES.length
    const morph = smoothstep(SCENE_TRANSITION_START, 1, scenePhase)

    if (
      scenePhase >= SCENE_TRANSITION_START &&
      lastTransitionCycleRef.current !== sceneCycle
    ) {
      forwardPassesRef.current.push({
        startTime: currentTime,
        startX: 0,
        endX: width * 1.04,
        intensity: 1.05,
      })
      lastTransitionCycleRef.current = sceneCycle
    }

    forwardPassesRef.current = forwardPassesRef.current.filter(
      (pass) => currentTime - pass.startTime < FORWARD_PASS_DURATION
    )
    burstsRef.current = burstsRef.current.filter((burst) => currentTime - burst.time < 2400)

    const currentPixels = renderScene(buffers.canvases[0], currentScene, time)
    const nextPixels = morph > 0 ? renderScene(buffers.canvases[1], nextScene, time) : currentPixels
    const glyphStep = Math.floor(currentTime / 125)

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.lineWidth = lineWidth
    for (let column = 0; column <= buffers.width; column += 2) {
      const x = column * buffers.cellSize
      ctx.strokeStyle = column % 8 === 0 ? barColor : lineColor
      ctx.globalAlpha = column % 8 === 0 ? 0.13 : 0.34
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    ctx.restore()

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = `12px ui-monospace, SFMono-Regular, Menlo, monospace`

    for (let row = 0; row < buffers.height; row++) {
      for (let column = 0; column < buffers.width; column++) {
        const pixelIndex = (row * buffers.width + column) * 4
        const cellNoise = hash(column + 401, row + 233)
        const columnProgress = column / Math.max(1, buffers.width - 1)
        const switchPoint = clamp(columnProgress * 0.88 + 0.06 + (cellNoise - 0.5) * 0.12)
        const localMorph = smoothstep(switchPoint - 0.1, switchPoint + 0.1, morph)
        const red = Math.round(currentPixels[pixelIndex] * (1 - localMorph) + nextPixels[pixelIndex] * localMorph)
        const green = Math.round(currentPixels[pixelIndex + 1] * (1 - localMorph) + nextPixels[pixelIndex + 1] * localMorph)
        const blue = Math.round(currentPixels[pixelIndex + 2] * (1 - localMorph) + nextPixels[pixelIndex + 2] * localMorph)
        const baseX = (column + 0.5) * buffers.cellSize
        const baseY = (row + 0.5) * buffers.cellSize
        const mouse = getMouseInfluence(baseX, baseY)
        const burst = getBurstInfluence(baseX, baseY, currentTime)
        const forward = getForwardInfluence(baseX, currentTime)
        const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
        const brightness = clamp(luminance * 1.45 + mouse * 0.18 + burst * 0.22 + forward * 0.13)
        const brighten = clamp(mouse * 0.25 + burst * 0.34 + forward * 0.3)
        const tileRed = Math.round(red + (255 - red) * brighten)
        const tileGreen = Math.round(green + (238 - green) * brighten)
        const tileBlue = Math.round(blue + (241 - blue) * brighten)

        ctx.fillStyle = `rgba(${tileRed}, ${tileGreen}, ${tileBlue}, ${0.7 + brightness * 0.26})`
        ctx.fillRect(
          baseX - buffers.cellSize / 2 + 0.45,
          baseY - buffers.cellSize / 2 + 0.45,
          buffers.cellSize - 0.9,
          buffers.cellSize - 0.9
        )

        const glyphNoise = hash(column + glyphStep * 7, row + currentScene * 29)
        const density = clamp(0.035 + brightness * 0.9 + glyphNoise * 0.075)
        const glyphIndex = Math.round(density * (ASCII_RAMP.length - 1))
        const glyph = ASCII_RAMP[glyphIndex]
        if (glyph === " ") continue

        const glyphLift = 0.42 + brightness * 0.5
        const glyphRed = Math.round(tileRed + (255 - tileRed) * glyphLift)
        const glyphGreen = Math.round(tileGreen + (248 - tileGreen) * glyphLift)
        const glyphBlue = Math.round(tileBlue + (250 - tileBlue) * glyphLift)
        ctx.fillStyle = `rgba(${glyphRed}, ${glyphGreen}, ${glyphBlue}, ${0.38 + brightness * 0.6})`
        ctx.fillText(glyph, baseX, baseY + 0.4)
      }
    }

    if (!removeWaveLine) {
      burstsRef.current.forEach((burst) => {
        const age = currentTime - burst.time
        const progress = age / 2400
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,205,213,${(1 - progress) * 0.22})`
        ctx.lineWidth = 1.5
        ctx.arc(burst.x, burst.y, progress * 320, 0, Math.PI * 2)
        ctx.stroke()
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

    sceneEpochRef.current = Date.now()
    lastTransitionCycleRef.current = -1

    const startAnimation = () => {
      if (canvas.getClientRects().length > 0 && animationFrameId.current === null) {
        animateRef.current()
      }
    }
    const handleResize = () => {
      if (canvas.getClientRects().length > 0) resizeCanvas()
      startAnimation()
    }
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("mousedown", handleMouseDown)
    if (canvas.getClientRects().length > 0) resizeCanvas()
    startAnimation()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("mousedown", handleMouseDown)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
      forwardPassesRef.current = []
      burstsRef.current = []
    }
  }, [animate, handleMouseDown, handleMouseLeave, handleMouseMove, resizeCanvas])

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden" style={{ backgroundColor }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export default SlidingEaseVerticalBars
