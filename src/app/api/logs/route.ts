import { NextResponse } from 'next/server';

export async function GET() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  // Handle case where KV database is not linked
  if (!kvUrl || !kvToken) {
    return NextResponse.json({
      status: 'No Database Linked',
      vercelLogsInfo: 'You can monitor live downloads in real-time on your Vercel Dashboard under the "Logs" tab.',
      setupInfo: 'To enable persistent log viewing here, go to your Vercel Project Dashboard, click the "Storage" tab, select "KV", and connect it to this project.',
    });
  }

  try {
    // Read the list from Redis KV API
    const res = await fetch(`${kvUrl}/lrange/submissions/0/-1`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: 'no-store', // Disable caching to fetch live logs
    });
    
    const rawData = await res.json();
    const list = rawData.result || [];

    // Parse stringified items back into JSON
    const parsedSubmissions = list.map((item: string) => {
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    });

    return NextResponse.json({
      count: parsedSubmissions.length,
      submissions: parsedSubmissions.reverse(), // Show newest first
    });
  } catch (error: any) {
    console.error('API Error fetching logs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to query database' },
      { status: 500 }
    );
  }
}
