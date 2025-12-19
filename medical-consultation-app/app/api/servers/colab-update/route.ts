import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const registryPath = path.join(dataDir, 'server-registry.json')
const logsPath = path.join(dataDir, 'server-registry-logs.jsonl')

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(registryPath)) fs.writeFileSync(registryPath, JSON.stringify({ servers: [] }))
  if (!fs.existsSync(logsPath)) fs.writeFileSync(logsPath, '')
}

export async function POST(req: NextRequest) {
  try {
    ensure()
    const body = await req.json()
    const id = String(body.id || '')
    const url = String(body.url || '')
    if (!id || !url) return NextResponse.json({ error: 'missing_id_or_url' }, { status: 400 })
    const reg = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
    const now = new Date().toISOString()
    const idx = Array.isArray(reg.servers) ? reg.servers.findIndex((s: any) => s.id === id) : -1
    const item = { id, url, status: 'active', updated_at: now }
    if (idx >= 0) reg.servers[idx] = { ...reg.servers[idx], ...item }
    else reg.servers = [...(reg.servers || []), item]
    fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2))
    fs.appendFileSync(logsPath, JSON.stringify({ type: 'colab_update', id, url, ts: now }) + '\n')
    return NextResponse.json({ ok: true, item })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'update_error' }, { status: 500 })
  }
}
