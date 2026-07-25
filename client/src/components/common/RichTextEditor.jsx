import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * Custom React 19 RichTextEditor component built directly with Quill.js
 * Reference: https://medium.com/@omotsuebe1/creating-a-modern-quill-editor-for-react-with-typescript-89aefef01ef6
 *
 * @param {Object} props
 * @param {string} props.value - HTML string content
 * @param {function} props.onChange - Handler called when content changes
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.className] - Optional custom CSS wrapper class
 * @param {boolean} [props.readOnly] - Disable editing if true
 */
const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Write article content here...',
  className = '',
  readOnly = false,
}) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep latest onChange in ref to prevent re-initializing Quill on callback change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up container children before creating editor
    container.innerHTML = '';
    const editorDiv = document.createElement('div');
    container.appendChild(editorDiv);

    // Quill Toolbar Options
    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ];

    // Instantiate Quill instance
    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder,
      readOnly,
      modules: {
        toolbar: readOnly ? false : toolbarOptions,
      },
    });

    quillRef.current = quill;

    // Set initial content HTML
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // Listen for text-change events
    quill.on('text-change', () => {
      const editorEl = editorDiv.querySelector('.ql-editor');
      const html = editorEl ? editorEl.innerHTML : '';
      const cleanHtml = html === '<p><br></p>' ? '' : html;

      if (onChangeRef.current) {
        onChangeRef.current(cleanHtml);
      }
    });

    return () => {
      quillRef.current = null;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [placeholder, readOnly, value]); // Run once on mount

  // Sync external value changes (e.g. form resets, loading existing blog for edit)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const editorEl = containerRef.current?.querySelector('.ql-editor');
    if (editorEl) {
      const currentHtml = editorEl.innerHTML === '<p><br></p>' ? '' : editorEl.innerHTML;
      if (value !== currentHtml && value !== undefined) {
        const selection = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(value || '');
        if (selection) {
          quill.setSelection(selection);
        }
      }
    }
  }, [value]);

  // Toggle readOnly mode dynamically
  useEffect(() => {
    const quill = quillRef.current;
    if (quill) {
      quill.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div
      className={`rich-text-editor-wrapper bg-white rounded-lg shadow-sm border border-slate-200 [&_.ql-toolbar.ql-snow]:rounded-t-lg [&_.ql-toolbar.ql-snow]:border-slate-200 [&_.ql-toolbar.ql-snow]:bg-slate-50 [&_.ql-toolbar.ql-snow]:font-sans [&_.ql-container.ql-snow]:rounded-b-lg [&_.ql-container.ql-snow]:border-slate-200 [&_.ql-container.ql-snow]:min-h-[240px] [&_.ql-container.ql-snow]:text-sm [&_.ql-container.ql-snow]:font-sans [&_.ql-editor]:min-h-[240px] [&_.ql-editor]:leading-relaxed [&_.ql-editor.ql-blank::before]:text-slate-400 [&_.ql-editor.ql-blank::before]:not-italic ${className}`}
    >
      <div ref={containerRef} />
    </div>
  );
};

export default RichTextEditor;
