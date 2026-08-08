import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, title, theme, image } = body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const logData = {
      timestamp,
      id: id || 'N/A',
      name: name || 'N/A',
      role: role || 'N/A',
      title: title || 'N/A',
      theme: theme || 'N/A',
      image: image || null,
    };

    const logLine = `[${timestamp}] ID: ${logData.id} | Name: ${logData.name} | Role: ${logData.role} | Title: ${logData.title} | Theme: ${logData.theme}\n`;

    // 1. Log to server console (Visible in Vercel Logs Dashboard)
    console.log(`DATABASE_LOG: ${logLine.trim()}`);

    // 2. Persist to MongoDB
    if (id) {
      try {
        await dbConnect();
        await Submission.findOneAndUpdate(
          { id },
          {
            id,
            name: name || 'N/A',
            role: role || 'N/A',
            title: title || 'N/A',
            theme: theme || 'N/A',
            imageUrl: image || null,
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Error saving to MongoDB:', err);
      }
    }

    // 3. Persist to Vercel KV if connected
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (kvUrl && kvToken) {
      try {
        // Push log object to a Redis list named "submissions" (logs dashboard)
        await fetch(`${kvUrl}/rpush/submissions/${encodeURIComponent(JSON.stringify(logData))}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });

        // Set key lookup for scannable validation
        if (id) {
          await fetch(`${kvUrl}/set/submission:${id}/${encodeURIComponent(JSON.stringify(logData))}`, {
            headers: { Authorization: `Bearer ${kvToken}` },
          });
        }
      } catch (err) {
        console.error('Error logging to Vercel KV:', err);
      }
    }

    // 3. Write locally to submissions.json for local development lookup
    if (id) {
      try {
        const filePath = path.join(process.cwd(), 'submissions.json');
        let submissions: Record<string, any> = {};
        if (fs.existsSync(filePath)) {
          try {
            submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          } catch (e) {
            submissions = {};
          }
        }
        submissions[id] = logData;
        fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf8');
      } catch (err) {
        console.log('Skipped writing to local submissions.json (Vercel read-only filesystem)');
      }
    }

    // 4. Write locally to general data.txt log file
    try {
      const filePath = path.join(process.cwd(), 'data.txt');
      fs.appendFileSync(filePath, logLine, 'utf8');
    } catch (err) {
      console.log('Skipped writing to local data.txt (Vercel read-only)');
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
