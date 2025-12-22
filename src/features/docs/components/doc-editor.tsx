import { useRef, useTransition } from 'react';
import { CodeHighlighterShikiExtension } from '@lexical/code-shiki';
import {
  AutoFocusExtension,
  HorizontalRuleExtension,
  TabIndentationExtension,
} from '@lexical/extension';
import { HistoryExtension } from '@lexical/history';
import { LinkExtension } from '@lexical/link';
import { ListExtension } from '@lexical/list';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextExtension } from '@lexical/rich-text';
import {
  defineExtension,
  EditorState,
  EditorThemeClasses,
  SerializedEditorState,
} from 'lexical';

import { upsertDocument } from '../mutations';

const theme: EditorThemeClasses = {
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
    code: 'bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono',
    hashtag: 'text-blue-500',
    italic: 'italic',
    strikethrough: 'line-through',
    subscript: 'sub',
    superscript: 'sup',
    underline: 'underline',
    underlineStrikethrough: 'underline line-through',
  },
};

const placeholderText = 'Start writing...';

interface DocEditorProps {
  id: string;
  content?: SerializedEditorState;
}

function AutoSavePlugin({ id }: { id: string }) {
  const [isSaving, startSaving] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return (
    <>
      {isSaving && (
        <div className='absolute top-0 right-0 -translate-y-full'>
          Saving...
        </div>
      )}
      <OnChangePlugin
        ignoreSelectionChange
        ignoreHistoryMergeTagChange
        onChange={(editorState: EditorState) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            const content = editorState.toJSON();
            startSaving(async () => {
              await upsertDocument({ data: { id, content } });
            });
          }, 1000);
        }}
      />
    </>
  );
}

export function DocEditor({ id, content }: DocEditorProps) {
  const editorExtension = defineExtension({
    theme,
    name: '[root]',
    namespace: 'Doc Editor',
    dependencies: [
      ListExtension,
      LinkExtension,
      HistoryExtension,
      RichTextExtension,
      AutoFocusExtension,
      TabIndentationExtension,
      HorizontalRuleExtension,
      CodeHighlighterShikiExtension,
    ],
    $initialEditorState: content ? JSON.stringify(content) : undefined,
  });

  return (
    <div className='border w-full h-full'>
      <LexicalExtensionComposer
        extension={editorExtension}
        contentEditable={null}
      >
        <div className='relative min-h-full p-4'>
          <ContentEditable
            aria-placeholder={placeholderText}
            className='outline-none'
            placeholder={
              <div className='text-muted-foreground pointer-events-none absolute top-4 left-4 text-sm select-none'>
                {placeholderText}
              </div>
            }
          />
          <AutoSavePlugin id={id} />
        </div>
        <MarkdownShortcutPlugin />
      </LexicalExtensionComposer>
    </div>
  );
}
