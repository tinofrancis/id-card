import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, title, theme } = body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const logData = {
      timestamp,
      name: name || 'N/A',
      role: role || 'N/A',
      title: title || 'N/A',
      theme: theme || 'N/A',
    };

    const logLine = `[${timestamp}] Name: ${logData.name} | Role: ${logData.role} | Title: ${logData.title} | Theme: ${logData.theme}\n`;

    // 1. Log to server console (Visible in Vercel Logs Dashboard)
    console.log(`DATABASE_LOG: ${logLine.trim()}`);

    // 2. Persist to Vercel KV if connected
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (kvUrl && kvToken) {
      try {
        // Push log object to a Redis list named "submissions"
        await fetch(`${kvUrl}/rpush/submissions/${encodeURIComponent(JSON.stringify(logData))}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
      } catch (err) {
        console.error('Error logging to Vercel KV:', err);
      }
    }

    // 3. Write locally to data.txt for local development
    try {
      const filePath = path.join(process.cwd(), 'data.txt');
      fs.appendFileSync(filePath, logLine, 'utf8');
    } catch (err) {
      // Safe catch for serverless environments where filesystem is read-only
      console.log('Skipped writing to local data.txt (Vercel read-only filesystem)');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error saving client data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
