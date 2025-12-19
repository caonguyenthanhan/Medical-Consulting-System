export default function StatisticsPage() {
  const cards = [
    { title: 'Lượt tư vấn', value: '1,248', trend: '+8.2%' },
    { title: 'Bài sàng lọc', value: '532', trend: '+4.5%' },
    { title: 'Tỷ lệ hài lòng', value: '94%', trend: '+1.1%' },
  ]
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Trang thống kê</h1>
      <p className="text-slate-600 mt-1">Theo dõi số liệu hoạt động</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.title} className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{c.title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{c.value}</span>
              <span className="text-sm text-accent">{c.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">Biểu đồ hoạt động sẽ được tích hợp tại đây.</p>
      </div>
    </div>
  )
}
