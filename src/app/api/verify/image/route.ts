import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id parameter', { status: 400 });
    }

    await dbConnect();
    const submission = await Submission.findOne({ id });
    if (!submission || !submission.cardImageUrl) {
      return new NextResponse('Card image not found', { status: 404 });
    }

    // cardImageUrl is a base64 Data URL, e.g.: "data:image/png;base64,iVBORw0KG..."
    const base64Data = submission.cardImageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Failed to serve verification card image:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
