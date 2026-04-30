import TrackingResultView from '@/ui/TrackingResultView';

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function TrackingPage({ params }: Props) {
  const { code } = await params;

  return <TrackingResultView code={decodeURIComponent(code)} />;
}
