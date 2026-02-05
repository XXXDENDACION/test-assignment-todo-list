import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/login';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

function LoginSkeleton() {
  return (
    <Card className="w-full max-w-md animate-pulse">
      <CardHeader className="space-y-1">
        <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm />
      </Suspense>
      <div className="mt-4 text-center text-sm">
        <Link href="/faq" className="text-primary hover:underline">
          Need help? Check our FAQ
        </Link>
      </div>
    </main>
  );
}
