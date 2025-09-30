"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";

const DescriptionField = ({ field, form, disabled, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content: field.value || "",
    onUpdate: ({ editor }) => {
      form.setFieldValue(field.name, editor.getHTML());
    },
    editable: !disabled, // initial state
    immediatelyRender: false,
    plugins: [require("@tailwindcss/typography")],
  });

  // 🔥 fix: update editable state when `disabled` changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // keep field value in sync
  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value || "");
    }
  }, [field.value, editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-wrapper">
      {!disabled && (
        <div className="border border-gray-300 border-b-0 bg-gray-50 px-3 py-2 rounded-t-md">
          <div className="flex items-center space-x-1">
            {/* Bold */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("bold") ? "bg-gray-300" : ""
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            {/* Italic */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("italic") ? "bg-gray-300" : ""
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            {/* Strike */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("strike") ? "bg-gray-300" : ""
              }`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Headings */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
              }`}
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
              }`}
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("bulletList") ? "bg-gray-300" : ""
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("orderedList") ? "bg-gray-300" : ""
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().undo().run()}
              className="p-1 rounded hover:bg-gray-200"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().redo().run()}
              className="p-1 rounded hover:bg-gray-200"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`border border-gray-300 ${
          !disabled ? "rounded-b-md" : "rounded-md"
        } min-h-[120px] p-3 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600`}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none h-full w-full outline-none"
        />
      </div>
    </div>
  );
};

export default DescriptionField;
