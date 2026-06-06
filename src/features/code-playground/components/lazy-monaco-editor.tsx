"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-xs text-neutral-500">
        Loading editor…
      </div>
    ),
  }
)

export type MonacoEditorProps = ComponentProps<typeof MonacoEditor>

export default MonacoEditor
