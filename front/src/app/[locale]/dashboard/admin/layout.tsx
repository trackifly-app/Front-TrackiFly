import RoleGuard from '@/components/auth/RoleGuard';

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleGuard allowedRoles={['admin', 'superadmin']}>{children}</RoleGuard>;
}
