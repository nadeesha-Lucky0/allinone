'use client';

import dynamic from 'next/dynamic';

// Dynamically load the main App portal shell purely on the client side
// This permanently solves server-side pre-rendering anomalies and hydration mismatches
const App = dynamic(() => import('../App'), { ssr: false });

export default function Home() {
  return <App />;
}
