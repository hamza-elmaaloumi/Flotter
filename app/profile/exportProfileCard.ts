/**
 * Canvas-based Profile Card Exporter
 * 
 * Generates a beautiful, branded profile card image (PNG)
 * containing the user's achievements, stats, and identity.
 */

type ExportData = {
  name: string
  email: string
  image: string | null
  totalXp: number
  monthlyXp: number
  streakCount: number
  rank: number
  isPro: boolean
  memberSince: string
  // Labels (translated)
  labels: {
    title: string
    totalXp: string
    dayStreak: string
    rank: string
    monthlyXp: string
    memberSince: string
    plan: string
    pro: string
    free: string
    poweredBy: string
  }
}

const CARD_W = 1080
const CARD_H = 1350
const PADDING = 72
const RADIUS = 40

// ─── Helpers ──────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.closePath()
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

// ─── SVG Icons as Path Strings ────────────────────────────

function drawZapIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  const s = size / 24
  ctx.scale(s, s)
  ctx.beginPath()
  ctx.moveTo(13, 2)
  ctx.lineTo(3, 14)
  ctx.lineTo(12, 14)
  ctx.lineTo(11, 22)
  ctx.lineTo(21, 10)
  ctx.lineTo(12, 10)
  ctx.lineTo(13, 2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawFlameIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  const s = size / 24
  ctx.scale(s, s)
  ctx.beginPath()
  // Simplified flame path
  ctx.moveTo(12, 2)
  ctx.bezierCurveTo(12, 2, 4, 12, 4, 16)
  ctx.bezierCurveTo(4, 20.42, 7.58, 22, 12, 22)
  ctx.bezierCurveTo(16.42, 22, 20, 20.42, 20, 16)
  ctx.bezierCurveTo(20, 12, 12, 2, 12, 2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawTrophyIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  const s = size / 24
  ctx.scale(s, s)
  // Cup body
  ctx.beginPath()
  ctx.moveTo(6, 9)
  ctx.bezierCurveTo(6, 9, 6, 15, 12, 17)
  ctx.bezierCurveTo(18, 15, 18, 9, 18, 9)
  ctx.lineTo(18, 3)
  ctx.lineTo(6, 3)
  ctx.closePath()
  ctx.fill()
  // Handle left
  ctx.beginPath()
  ctx.arc(6, 9, 3, Math.PI * 0.5, Math.PI * 1.5, true)
  ctx.stroke()
  // Handle right
  ctx.beginPath()
  ctx.arc(18, 9, 3, Math.PI * 1.5, Math.PI * 0.5, true)
  ctx.stroke()
  // Base
  ctx.fillRect(8, 19, 8, 2)
  ctx.fillRect(6, 21, 12, 2)
  ctx.restore()
}

function drawCrownIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  const s = size / 24
  ctx.scale(s, s)
  ctx.beginPath()
  ctx.moveTo(2, 17)
  ctx.lineTo(5, 7)
  ctx.lineTo(9, 12)
  ctx.lineTo(12, 3)
  ctx.lineTo(15, 12)
  ctx.lineTo(19, 7)
  ctx.lineTo(22, 17)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(2, 19, 20, 3)
  ctx.restore()
}

// ─── Main Export Function ─────────────────────────────────

export async function generateProfileCard(data: ExportData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')!

  // ── Background ──
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  bgGrad.addColorStop(0, '#0F0F14')
  bgGrad.addColorStop(0.5, '#121218')
  bgGrad.addColorStop(1, '#0A0A10')
  ctx.fillStyle = bgGrad
  roundRect(ctx, 0, 0, CARD_W, CARD_H, RADIUS)
  ctx.fill()

  // ── Subtle grid pattern (background texture) ──
  ctx.strokeStyle = 'rgba(255,255,255,0.015)'
  ctx.lineWidth = 1
  for (let i = 0; i < CARD_W; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CARD_H); ctx.stroke()
  }
  for (let i = 0; i < CARD_H; i += 40) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CARD_W, i); ctx.stroke()
  }

  // ── Top accent glow ──
  const topGlow = ctx.createRadialGradient(CARD_W / 2, 0, 0, CARD_W / 2, 0, 500)
  topGlow.addColorStop(0, data.isPro ? 'rgba(250,204,21,0.08)' : 'rgba(59,130,246,0.08)')
  topGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topGlow
  ctx.fillRect(0, 0, CARD_W, 500)

  // ── Pro / Free Badge (top right) ──
  const badgeText = data.isPro ? data.labels.pro : data.labels.free
  const badgeColor = data.isPro ? '#FACC15' : '#6B7280'
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  const badgeWidth = ctx.measureText(badgeText.toUpperCase()).width + 40
  const badgeX = CARD_W - PADDING - badgeWidth
  const badgeY = PADDING
  roundRect(ctx, badgeX, badgeY, badgeWidth, 44, 22)
  ctx.fillStyle = badgeColor + '15'
  ctx.fill()
  ctx.strokeStyle = badgeColor + '40'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = badgeColor
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(badgeText.toUpperCase(), badgeX + badgeWidth / 2, badgeY + 29)

  // ── Pro Crown ──
  if (data.isPro) {
    ctx.fillStyle = '#FACC15'
    ctx.strokeStyle = '#FACC15'
    ctx.lineWidth = 2
    drawCrownIcon(ctx, badgeX - 20, badgeY + 22, 26)
  }

  // ── Avatar ──
  const avatarSize = 160
  const avatarX = CARD_W / 2
  const avatarY = 230

  // Avatar ring glow
  const ringGlow = ctx.createRadialGradient(avatarX, avatarY, avatarSize / 2, avatarX, avatarY, avatarSize / 2 + 30)
  ringGlow.addColorStop(0, data.isPro ? 'rgba(250,204,21,0.25)' : 'rgba(59,130,246,0.25)')
  ringGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ringGlow
  drawCircle(ctx, avatarX, avatarY, avatarSize / 2 + 30)
  ctx.fill()

  // Avatar ring
  ctx.lineWidth = 4
  ctx.strokeStyle = data.isPro ? '#FACC15' : '#3B82F6'
  drawCircle(ctx, avatarX, avatarY, avatarSize / 2 + 6)
  ctx.stroke()

  // Avatar circle clip
  ctx.save()
  drawCircle(ctx, avatarX, avatarY, avatarSize / 2)
  ctx.clip()

  if (data.image) {
    try {
      const img = await loadImage(data.image)
      ctx.drawImage(img, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize)
    } catch {
      // Fallback: grey circle with initial
      ctx.fillStyle = '#2D2D2F'
      drawCircle(ctx, avatarX, avatarY, avatarSize / 2)
      ctx.fill()
      ctx.fillStyle = '#6B7280'
      ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((data.name || '?')[0].toUpperCase(), avatarX, avatarY)
    }
  } else {
    ctx.fillStyle = '#2D2D2F'
    drawCircle(ctx, avatarX, avatarY, avatarSize / 2)
    ctx.fill()
    ctx.fillStyle = '#6B7280'
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((data.name || '?')[0].toUpperCase(), avatarX, avatarY)
  }
  ctx.restore()

  // ── Name ──
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 46px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.fillText(data.name || 'Learner', CARD_W / 2, avatarY + avatarSize / 2 + 60)

  // ── Email ──
  ctx.fillStyle = '#9CA3AF'
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.fillText(data.email, CARD_W / 2, avatarY + avatarSize / 2 + 100)

  // ── Stats Row ──
  const statsY = 570
  const statsH = 200
  const statW = (CARD_W - PADDING * 2 - 32) / 3
  const stats = [
    {
      value: formatNumber(data.totalXp),
      label: data.labels.totalXp,
      color: '#FACC15',
      drawIcon: drawZapIcon,
    },
    {
      value: data.streakCount.toString(),
      label: data.labels.dayStreak,
      color: '#EF4444',
      drawIcon: drawFlameIcon,
    },
    {
      value: `#${data.rank}`,
      label: data.labels.rank,
      color: '#3B82F6',
      drawIcon: drawTrophyIcon,
    },
  ]

  stats.forEach((stat, i) => {
    const sx = PADDING + i * (statW + 16)
    
    // Card background
    roundRect(ctx, sx, statsY, statW, statsH, 24)
    ctx.fillStyle = '#1C1C1E'
    ctx.fill()
    ctx.strokeStyle = stat.color + '20'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Icon
    ctx.fillStyle = stat.color
    ctx.strokeStyle = stat.color
    ctx.lineWidth = 2.5
    stat.drawIcon(ctx, sx + statW / 2, statsY + 50, 36)

    // Value
    ctx.fillStyle = stat.color
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(stat.value, sx + statW / 2, statsY + 126)

    // Label
    ctx.fillStyle = '#6B7280'
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    ctx.fillText(stat.label.toUpperCase(), sx + statW / 2, statsY + 168)
  })

  // ── Monthly XP Bar ──
  const barY = statsY + statsH + 36
  const barW = CARD_W - PADDING * 2
  const barH = 110
  roundRect(ctx, PADDING, barY, barW, barH, 24)
  ctx.fillStyle = '#1C1C1E'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#6B7280'
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(data.labels.monthlyXp.toUpperCase(), PADDING + 28, barY + 42)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(formatNumber(data.monthlyXp) + ' XP', PADDING + 28, barY + 84)

  // ── Member Since ──
  const memberY = barY + barH + 36
  const memberH = 80
  roundRect(ctx, PADDING, memberY, barW, memberH, 24)
  ctx.fillStyle = '#1C1C1E'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#6B7280'
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(data.labels.memberSince.toUpperCase(), PADDING + 28, memberY + 34)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.fillText(data.memberSince, PADDING + 28, memberY + 64)

  // ── Plan info (right side of member row) ──
  ctx.fillStyle = '#6B7280'
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(data.labels.plan.toUpperCase(), CARD_W - PADDING - 28, memberY + 34)

  const planColor = data.isPro ? '#FACC15' : '#6B7280'
  ctx.fillStyle = planColor
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.fillText(data.isPro ? data.labels.pro : data.labels.free, CARD_W - PADDING - 28, memberY + 64)

  // ── Bottom branding ──
  const bottomY = CARD_H - 80
  ctx.textAlign = 'center'
  ctx.fillStyle = '#3B3B40'
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
  ctx.fillText(data.labels.poweredBy, CARD_W / 2, bottomY)

  // ── Decorative corner dots ──
  const dotColor = data.isPro ? 'rgba(250,204,21,0.15)' : 'rgba(59,130,246,0.15)'
  ctx.fillStyle = dotColor
  drawCircle(ctx, 40, 40, 6); ctx.fill()
  drawCircle(ctx, CARD_W - 40, 40, 6); ctx.fill()
  drawCircle(ctx, 40, CARD_H - 40, 6); ctx.fill()
  drawCircle(ctx, CARD_W - 40, CARD_H - 40, 6); ctx.fill()

  // ── Export as Blob ──
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      'image/png',
      1.0
    )
  })
}

/**
 * Triggers a browser download of the profile card image.
 */
export async function downloadProfileCard(data: ExportData): Promise<void> {
  const blob = await generateProfileCard(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flotter-profile-${data.name?.replace(/\s+/g, '-').toLowerCase() || 'card'}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Tries Web Share API first, falls back to download.
 */
export async function shareProfileCard(data: ExportData): Promise<'shared' | 'downloaded'> {
  const blob = await generateProfileCard(data)

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'flotter-profile.png', { type: 'image/png' })
    const shareData = { files: [file], title: 'My Flotter Profile' }

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return 'shared'
      } catch {
        // User cancelled or share failed — fall through to download
      }
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flotter-profile-${data.name?.replace(/\s+/g, '-').toLowerCase() || 'card'}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return 'downloaded'
}
