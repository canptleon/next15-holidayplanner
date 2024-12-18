'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const [days, setDays] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDays = parseInt(days, 10);

    if (!isNaN(parsedDays) && parsedDays >= 0 && parsedDays <= 30) {
      router.push(`/calendar/${parsedDays}`);
    } else {
      alert('Lütfen 0 ile 30 arasında bir sayı giriniz.');
      router.push('/');
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Kaç günlük izin hakkınız var?</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="1-30"
            className="border text-blue-500 rounded p-2 w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600 transition"
          >
            Hesapla
          </button>
        </form>
      </div>
    </div>
  );
}