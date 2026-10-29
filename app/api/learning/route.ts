import { NextResponse } from 'next/server';
import { getMarketSnapshot } from '@/lib/data';

export async function GET() {
  const { learning } = await getMarketSnapshot();
  return NextResponse.json(learning);
}
