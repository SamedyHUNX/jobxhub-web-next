import { ReactNode, Suspense } from "react";

interface AsyncIfProps {
  condition: () => Promise<boolean>;
  children: ReactNode;
  loadingFallback?: ReactNode;
  otherwise?: ReactNode;
}

export default function AsyncIf({
  condition,
  children,
  loadingFallback,
  otherwise,
}: AsyncIfProps) {
  return (
    <Suspense fallback={loadingFallback}>
      <SuspendedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspendedComponent>
    </Suspense>
  );
}

async function SuspendedComponent({
  children,
  condition,
  otherwise,
}: Omit<AsyncIfProps, "loadingFallback">) {
  return (await condition()) ? children : otherwise;
}
