import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type ServerItem = {
  id: string
  name?: string
  url: string
  status: 'active' | 'inactive' | 'unknown'
  updated_at: string
}

type Registry = {
  servers: ServerItem[]
}

const dataDir = path.join(process.cwd(), 'data')
const registryPath = path.join(dataDir, 'server-registry.json')
const logsPath = path.join(dataDir, 'server-registry-logs.jsonl')

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(registryPath)) fs.writeFileSync(registryPath, JSON.stringify({ servers: [] }))
  if (!fs.existsSync(logsPath)) fs.writeFileSync(logsPath, '')
}

function readRegistry(): Registry {
  ensureFiles()
  const raw = fs.readFileSync(registryPath, 'utf-8')
  return JSON.parse(raw)
}

function writeRegistry(reg: Registry) {
  fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2))
}

function appendLog(entry: any) {
  fs.appendFileSync(logsPath, JSON.stringify(entry) + '\n')
}

export async function GET() {
  try {
    const reg = readRegistry()
    return NextResponse.json(reg)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id = String(body.id || '')
    const url = String(body.url || '')
    const name = body.name ? String(body.name) : undefined
    const status = (body.status || 'unknown') as ServerItem['status']
    if (!id || !url) return NextResponse.json({ error: 'missing_id_or_url' }, { status: 400 })
    const reg = readRegistry()
    const now = new Date().toISOString()
    const idx = reg.servers.findIndex(s => s.id === id)
    const item: ServerItem = { id, url, name, status, updated_at: now }
    if (idx >= 0) {
      reg.servers[idx] = item
      appendLog({ type: 'update', id, url, status, name, ts: now })
    } else {
      reg.servers.push(item)
      appendLog({ type: 'add', id, url, status, name, ts: now })
    }
    writeRegistry(reg)
    return NextResponse.json({ ok: true, item })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'write_error' }, { status: 500 })
  }
}
