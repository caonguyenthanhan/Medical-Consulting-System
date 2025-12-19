import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const logsPath = path.join(process.cwd(), 'data', 'server-registry-logs.jsonl')

export async function GET() {
  try {
    if (!fs.existsSync(logsPath)) return NextResponse.json({ logs: [] })
    const raw = fs.readFileSync(logsPath, 'utf-8')
    const lines = raw.split('\n').filter(Boolean)
    const logs = lines.map(l => JSON.parse(l))
    return NextResponse.json({ logs })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}
