import { PageLayout } from '@/components/PageLayout';
import { FloatingActions } from '@/components/FloatingActions';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      {children}
      <FloatingActions />
    </PageLayout>
  );
}
