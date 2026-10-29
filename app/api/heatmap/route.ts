import { NextResponse } from 'next/server';

export async function GET() {
  const matrix = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    level: Math.min(1, (Math.sin(index * 0.4) + 1.2) / 2.2),
    tone: index % 5 === 0 ? 'liquidation' : index % 3 === 0 ? 'support' : 'volume',
  }));

  return NextResponse.json({ matrix, generatedAt: new Date().toISOString() });
}
