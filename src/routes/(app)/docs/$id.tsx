import { createFileRoute } from '@tanstack/react-router';
import { FileTextIcon } from 'lucide-react';

import { DocEditor } from '~/features/docs/components/doc-editor';
import { DocName } from '~/features/docs/components/doc-name';
import { findDocument } from '~/features/docs/queries';

export const Route = createFileRoute('/(app)/docs/$id')({
  gcTime: 0, // opt out of caching since we have mutations that update the document
  loader: async ({ params }) => {
    return await findDocument({ data: params });
  },
  component: DocPage,
});

function DocPage() {
  const document = Route.useLoaderData();
  const { id } = Route.useParams();

  return (
    <section className='grid gap-4 grid-rows-[auto_1fr] w-full h-full'>
      <header className='p-4 sticky top-0  backdrop-blur-sm shadow-sm border-b'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <DocName id={id} name={document?.name} />
        </h1>
      </header>
      <div className='max-w-(--breakpoint-xl) w-full mx-auto flex justify-between items-stretch p-4'>
        <DocEditor id={id} content={document?.content} />
      </div>
    </section>
  );
}
