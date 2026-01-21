'use client';

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  type PropsWithChildren,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { registerCodeHighlighting } from '@lexical/code-shiki';
import { HorizontalRuleNode } from '@lexical/extension';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { type EditorState, type SerializedEditorState } from 'lexical';

import { toast } from '~/components/ui/toast';

import { deleteDocument, upsertDocument } from '../mutations';

function CodeHighlightShikiPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}

function AutoSavePlugin({ id }: { id: string }) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return (
    <OnChangePlugin
      ignoreSelectionChange
      ignoreHistoryMergeTagChange
      onChange={(editorState: EditorState) => {
        console.log('onChange');

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          const content = editorState.toJSON();
          upsertDocument({ id, content }).then((result) => {
            if (result.status === 'error') {
              toast.add({
                title: 'Error',
                description: 'Failed to save document',
              });
            }
          });
        }, 3000);
      }}
    />
  );
}

const BASE_DOC_EDITOR_CONFIG = {
  namespace: 'DocEditor',
  onError: console.error,
  theme: {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder:
      'text-slate-400 absolute top-0 left-0 pointer-events-none select-none',
    paragraph: 'mb-2 last:mb-0 text-sm',
    quote: 'border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4',
    heading: {
      h1: 'text-3xl font-bold mb-4 mt-6 first:mt-0',
      h2: 'text-2xl font-bold mb-3 mt-5 first:mt-0',
      h3: 'text-xl font-bold mb-2 mt-4 first:mt-0',
      h4: 'text-lg font-bold mb-2 mt-3 first:mt-0',
      h5: 'text-base font-bold mb-2 mt-3 first:mt-0',
      h6: 'text-sm font-bold mb-2 mt-3 first:mt-0',
    },
    list: {
      nested: {
        listitem: 'list-none',
      },
      ol: 'list-decimal list-inside ml-4 mb-2',
      ul: 'list-disc list-inside ml-4 mb-2',
      listitem: 'mb-1',
    },
    text: {
      bold: 'font-bold',
      code: 'bg-slate-100 text-slate-800 px-1 py-0.5 text-sm font-mono',
      hashtag: 'text-blue-500',
      italic: 'italic',
      strikethrough: 'line-through',
      subscript: 'sub',
      superscript: 'sup',
      underline: 'underline',
      underlineStrikethrough: 'underline line-through',
    },
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    LinkNode,
    HorizontalRuleNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
  ],
} as const;

export function DocEditorProvider({
  children,
  content,
}: PropsWithChildren & {
  content?: SerializedEditorState | null;
}) {
  return (
    <LexicalComposer
      initialConfig={{
        ...BASE_DOC_EDITOR_CONFIG,
        editorState: content ? JSON.stringify(content) : undefined,
      }}
    >
      {children}
    </LexicalComposer>
  );
}

export function DocEditor({ docId }: { docId: string }) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (id === 'new') {
      window.history.replaceState(null, '', `/docs/${docId}`);
    }
  }, [id, docId]);

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Delete') {
      e.preventDefault();
      startTransition(async () => {
        const result = await deleteDocument(docId);
        if (result.status === 'error') {
          toast.add({
            title: 'Error',
            description: 'Failed to delete document',
          });
        } else {
          toast.add({
            title: 'Deleted',
            description: 'Document deleted successfully',
          });
          router.replace('/docs');
        }
      });
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className='h-full w-full border'>
        <div className='relative min-h-full p-4'>
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={<ContentEditable className='outline-none' />}
            placeholder={
              <div className='text-muted-foreground pointer-events-none absolute top-4 left-4 text-sm select-none'>
                Start writing...
              </div>
            }
          />
        </div>
      </div>
      <AutoSavePlugin id={docId} />
      <MarkdownShortcutPlugin />
      <CodeHighlightShikiPlugin />
      <TabIndentationPlugin />
    </>
  );
}
