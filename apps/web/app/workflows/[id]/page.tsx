import { CanvasShell } from '../../../components/canvas/CanvasShell';
import { notFound } from 'next/navigation';
import { sdk } from '../../../lib/sdk';

export default async function WorkflowPage({ params }: { params: { id: string } }) {
  const workflow = await sdk.workflows.get(params.id).catch(() => null);
  if (!workflow) {
    notFound();
  }

  return <CanvasShell workflow={workflow} />;
}
