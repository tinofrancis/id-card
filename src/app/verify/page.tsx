import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

  const title = resolvedParams.name
    ? `HH Goa 2026 Verified Pass — ${resolvedParams.name.toUpperCase()}`
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
