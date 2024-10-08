'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e) {
    e.preventDefault();
  
    const val = e.target;
    const search = val.search;
    const newParams = new URLSearchParams(searchParams.toString());
  
    if (search.value) {
      newParams.set('q', search.value);
      
      // Update recent search keywords in localStorage
      const recentSearchKeywords = JSON.parse(localStorage.getItem('recent-search-keywords')) || [];
      if (!recentSearchKeywords.includes(search.value) && recentSearchKeywords.length > 1) {
        recentSearchKeywords.push(search.value);
        localStorage.setItem('recent-search-keywords', JSON.stringify(recentSearchKeywords));
      }
    } else {
      newParams.delete('q');
    }
    
    router.push(`/search?${newParams.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}
