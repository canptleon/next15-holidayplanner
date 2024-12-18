interface AnalyticsProps {
  totalDays: number;
  totalHolidays: number;
  totalHalfDays: number;
  totalWeekends: number;
}

export default function Analytics({
  totalDays,
  totalHolidays,
  totalHalfDays,
  totalWeekends,
}: AnalyticsProps) {
  
  return (
    <div className="border rounded-lg p-6 bg-white text-black shadow-md">
      <h2 className="text-lg font-bold mb-4 text-center">2025 Yılı Özeti</h2>
      <p className="mb-2">Toplam gün sayısı: <strong>{totalDays}</strong></p>
      <p className="mb-4">Hafta sonu gün sayısı: <strong>{totalWeekends}</strong></p>
      <p className="mb-2">Resmi ve dini tam gün tatiller: <strong>{totalHolidays}</strong></p>
      <p className="mb-2">Resmi ve dini yarım gün tatiller: <strong>{`${totalHalfDays} günde toplam ${totalHalfDays/2}`}</strong></p>
      <p className="mb-2">Haftasonları dahil kesişen günler ile toplam tatil günü: <strong>{totalHolidays}</strong></p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="border-red-500 border w-6 h-6"></div>
          <span>Resmi/Dini Tatil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-dashed border-green-500 border w-6 h-6"></div>
          <span>Yarım Gün Tatil+İzin ile tam gün</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-blue-500 border w-6 h-6"></div>
          <span>Hafta Sonu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-dashed border-red-500 border w-6 h-6"></div>
          <span>Yarım Gün Tatil</span>
        </div>
      </div>
    </div>
  );
}
