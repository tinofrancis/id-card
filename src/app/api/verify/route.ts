import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    // 1. Try local JSON first (for local environment lookup)
    try {
      const localPath = path.join(process.cwd(), 'submissions.json');
      if (fs.existsSync(localPath)) {
        const submissions = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        if (submissions[id]) {
          return NextResponse.json({ success: true, data: submissions[id] });
        }
      }
    } catch (e) {
      console.log('Skipped local JSON reading or file not present');
    }

    // 2. Try Vercel KV if connected
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/get/submission:${id}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        const result = await response.json();
        if (result.result) {
          return NextResponse.json({ success: true, data: JSON.parse(result.result) });
        }
      } catch (err) {
        console.error('Error fetching from Vercel KV:', err);
      }
    }

    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
