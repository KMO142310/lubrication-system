import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'ROADMAP_EVOLUTION.md');
    const content = await readFile(filePath, 'utf8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'ROADMAP_EVOLUTION.md no encontrado' }, { status: 404 });
  }
}
