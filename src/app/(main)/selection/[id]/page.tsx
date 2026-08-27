import Centerblock from '@/app/components/Centerblock/Centerblock';

interface SelectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SelectionPage({ params }: SelectionPageProps) {
  const { id } = await params;
  return <Centerblock selectionId={Number(id)} />;
}
