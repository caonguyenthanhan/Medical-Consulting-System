import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const eventsPath = path.join(dataDir, 'runtime-events.jsonl')

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(eventsPath)) fs.writeFileSync(eventsPath, '')
}

export async function GET() {
  try {
    ensure()
    const raw = fs.readFileSync(eventsPath, 'utf-8')
    const lines = raw.split('\n').filter(Boolean)
    const events = lines.map(l => JSON.parse(l))
    return NextResponse.json({ events })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    ensure()
    fs.writeFileSync(eventsPath, '')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'clear_error' }, { status: 500 })
  }
}
