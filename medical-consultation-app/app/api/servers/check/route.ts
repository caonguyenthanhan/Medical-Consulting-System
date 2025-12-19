import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = String(body.url || '')
    const timeoutMs = Number(body.timeoutMs || 3000)
    if (!url) return NextResponse.json({ error: 'missing_url' }, { status: 400 })
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const headers = { 'ngrok-skip-browser-warning': 'true' } as any
      const base = url.replace(/\/$/, '')
      let resp = await fetch(`${base}/health`, { method: 'GET', signal: controller.signal, headers })
      if (!resp.ok) {
        resp = await fetch(base, { method: 'GET', signal: controller.signal, headers })
      }
      clearTimeout(timer)
      return NextResponse.json({ ok: resp.ok, status: resp.status })
    } catch (err: any) {
      clearTimeout(timer)
      return NextResponse.json({ ok: false, error: 'unreachable' })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'check_error' }, { status: 500 })
  }
}
