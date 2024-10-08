'use client';

import { clearAllCookies } from "@/components/cart/actions";

export default function Error({ reset }) {
  const clearCacheAndCookies = () => {
    clearAllCookies()
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Oh no</h2>
      <p className="my-2">
        There was an issue with our app. This could be network issue or a temporary issue on our side, please try your
        action again
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={clearCacheAndCookies}
      >
        Referesh
      </button>
    </div>
  );
}
