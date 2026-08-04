'use client';

import { useRouter, usePathname, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation';
import NextLink from 'next/link';
import React from 'react';

export function useNavigate() {
  const router = useRouter();
  return (path: string | number, options?: any) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      else if (path === 1) router.forward();
    } else {
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  return {
    pathname: pathname || '',
    search: searchParams && searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null
  };
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = (newParams: any) => {
    const params = new URLSearchParams(newParams);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return [searchParams, setSearchParams] as const;
}

export const useParams = useNextParams;

// Next.js Link doesn't support 'to' prop directly, so we map it
export const Link = React.forwardRef<HTMLAnchorElement, any>(
  ({ to, prefetch = false, ...props }, ref) => {
    return <NextLink href={to || props.href || '#'} prefetch={prefetch} ref={ref} {...props} />;
  }
);
Link.displayName = 'Link';
