import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, title, theme } = body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const logLine = `[${timestamp}] Name: ${name || 'N/A'} | Role: ${role || 'N/A'} | Title: ${title || 'N/A'} | Theme: ${theme || 'N/A'}\n`;

    // File path for data.txt in project root
    const filePath = path.join(process.cwd(), 'data.txt');

    // Append to file (creates the file if it does not exist)
    fs.appendFileSync(filePath, logLine, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error saving client data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
