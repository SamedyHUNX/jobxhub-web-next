"use client";

import { ReactNode, useEffect, useState } from "react";

export default function IsBreakpoint({
  breakpoint,
  children,
  otherwise,
}: {
  children: ReactNode;
  otherwise: ReactNode;
  breakpoint: string;
}) {
  const IsBreakpoint = useIsBreakpoint(breakpoint);

  return IsBreakpoint ? children : otherwise;
}

function useIsBreakpoint(breakpoint: string) {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const media = window.matchMedia(`(${breakpoint})`);

    setIsBreakpoint(media.matches);

    media.addEventListener("change", (e) => setIsBreakpoint(e.matches), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [breakpoint]);

  return isBreakpoint;
}
