import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const metricsPath = path.join(process.cwd(), 'data', 'runtime-metrics.jsonl')

function readAll() {
  if (!fs.existsSync(metricsPath)) return []
  const raw = fs.readFileSync(metricsPath, 'utf-8')
  return raw.split('\n').filter(Boolean).map(l => JSON.parse(l))
}

export async function GET() {
  try {
    const items = readAll()
    const last = items.slice(-50)
    const groups: Record<string, { count: number, total: number }> = {}
    for (const it of last) {
      const k = it.mode || 'cpu'
      if (!groups[k]) groups[k] = { count: 0, total: 0 }
      groups[k].count += 1
      groups[k].total += Number(it.duration_ms || 0)
    }
    const summary = Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.count ? Math.round(v.total / v.count) : 0]))
    return NextResponse.json({ summary, last })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}
