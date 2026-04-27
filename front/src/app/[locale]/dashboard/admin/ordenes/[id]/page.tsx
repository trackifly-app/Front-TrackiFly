import OrderDetailAdminView from '@/components/dashboardAdmin/OrderDetailAdminView';
import { OrderDetailPageProps } from '@/interfaces/shipment';

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const { userId } = await searchParams;

  return <OrderDetailAdminView orderId={id} userId={userId || ''} />;
}
