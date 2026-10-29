import { NextResponse } from 'next/server';
import { getMarketSnapshot } from '@/lib/data';

export async function GET() {
  const data = await getMarketSnapshot();
  return NextResponse.json(data);
}
