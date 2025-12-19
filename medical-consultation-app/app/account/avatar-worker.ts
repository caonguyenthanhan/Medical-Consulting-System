self.onmessage = async (e: MessageEvent) => {
  const file = e.data as File
  if (!file) {
    ;(self as any).postMessage({ error: 'no_file' })
    return
  }
  try {
    const bitmap = await (self as any).createImageBitmap(file)
    const maxSide = 512
    const ratio = Math.min(maxSide / bitmap.width, maxSide / bitmap.height, 1)
    const targetW = Math.max(1, Math.round(bitmap.width * ratio))
    const targetH = Math.max(1, Math.round(bitmap.height * ratio))
    const canvas = new OffscreenCanvas(targetW, targetH)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      ;(self as any).postMessage({ error: 'ctx_failed' })
      return
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH)
    const blob = await (canvas as any).convertToBlob({ type: 'image/jpeg', quality: 0.82 })
    ;(self as any).postMessage({ ok: true, blob })
  } catch (err: any) {
    ;(self as any).postMessage({ error: String(err?.message || 'process_failed') })
  }
}
