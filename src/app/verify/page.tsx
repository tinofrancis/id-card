import type { Metadata } from 'next';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import VerifyClient from '@/components/VerifyClient';

interface PageProps {
  searchParams: Promise<{
    id?: string;
    name?: string;
    role?: string;
    title?: string;
    theme?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id || '';

  const headersList = await headers();
  const host = headersList.get('host') || 'hhgoa-id.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const imageUrl = id
    ? `${baseUrl}/api/verify/image?id=${id}`
    : `${baseUrl}/goa-beach-frame.jpg`;

  let displayName = resolvedParams.name || '';
  if (id && !displayName) {
    try {
      await dbConnect();
      const submission = await Submission.findOne({ id });
      if (submission?.name) {
        displayName = submission.name;
      }
    } catch (err) {
      console.error('Failed to fetch name for verify metadata:', err);
    }
  }

  const title = displayName
    ? `HH Goa 2026 Verified Pass — ${displayName.toUpperCase()}`
    : 'HH Goa 2026 | Verified Builder Pass';

  return {
    title,
    description: 'Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.',
    openGraph: {
      title,
      description: 'Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1496,
          alt: 'HH Goa 2026 Builder Pass',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.',
      images: [imageUrl],
      creator: '@HHGoa2026',
    },
  };
}

export default async function VerifyPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <VerifyClient
      id={resolvedParams.id || ''}
      initialName={resolvedParams.name}
      initialRole={resolvedParams.role}
      initialTitle={resolvedParams.title}
      initialTheme={resolvedParams.theme}
    />
  );
}
