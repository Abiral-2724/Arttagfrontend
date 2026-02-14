// app/search/not-found/page.tsx  ← wrap the default export
import SearchNotFoundPage from '@/components/SearchNotFound';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <SearchNotFoundPage></SearchNotFoundPage>
    </Suspense>
  );
}