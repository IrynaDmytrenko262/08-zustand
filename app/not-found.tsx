import css from '@/app/Home.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Not Found',
  description: 'The page you are looking for does not exist.',
  openGraph: {
    title: '404 - Not Found',
    description: 'The page you are looking for does not exist.',
    url: 'https://08-zustand-steel-beta.vercel.app/',
    images: [
      { url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg' },
    ],
  },
};

export default function NotFound() {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}