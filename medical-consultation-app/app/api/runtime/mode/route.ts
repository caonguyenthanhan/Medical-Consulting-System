import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const modePath = path.join(dataDir, 'runtime-mode.json')
const eventsPath = path.join(dataDir, 'runtime-events.jsonl')

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(modePath)) fs.writeFileSync(modePath, JSON.stringify({ target: 'cpu', updated_at: new Date().toISOString() }))
  if (!fs.existsSync(eventsPath)) fs.writeFileSync(eventsPath, '')
}

export async function GET() {
  try {
    ensure()
    const raw = fs.readFileSync(modePath, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    ensure()
    const body = await req.json()
    const target = body?.target === 'gpu' ? 'gpu' : 'cpu'
    const gpu_url = target === 'gpu' && typeof body?.gpu_url === 'string' ? body.gpu_url : undefined
    const now = new Date().toISOString()
    const payload: any = { target, gpu_url, updated_at: now }
    fs.writeFileSync(modePath, JSON.stringify(payload, null, 2))
    fs.appendFileSync(eventsPath, JSON.stringify({ type: 'mode_change', target, gpu_url, ts: now }) + '\n')
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
      await fetch(`${backendUrl}/v1/runtime/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {})
    } catch {}
    return NextResponse.json({ ok: true, mode: payload })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'write_error' }, { status: 500 })
  }
}
