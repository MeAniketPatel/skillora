"use client";

import { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, Terminal, Code, Sparkles } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_CODE = {
  javascript: `// Write some JavaScript code here
const message = "Hello from Skillora Playground!";
console.log(message);

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
`,
  html: `<!-- Write some HTML code here -->
<div class="card">
  <h1>Welcome to Skillora!</h1>
  <p>Learn coding step-by-step with interactive play tools.</p>
</div>

<style>
  .card {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    padding: 24px;
    border-radius: 16px;
    font-family: sans-serif;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
</style>
`,
  css: `/* Write some CSS code here */
body {
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
`,
};

export function CodePlayground() {
  const [language, setLanguage] = useState<"javascript" | "html" | "css">("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [htmlPreview, setHtmlPreview] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLanguageChange = (value: "javascript" | "html" | "css") => {
    setLanguage(value);
    setCode(DEFAULT_CODE[value]);
    setConsoleLogs([]);
    setHtmlPreview("");
  };

  const handleRun = () => {
    setConsoleLogs([]);
    setHtmlPreview("");

    if (language === "javascript") {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" "));
        },
        error: (...args: any[]) => {
          logs.push("🔴 Error: " + args.join(" "));
        },
        warn: (...args: any[]) => {
          logs.push("⚠️ Warning: " + args.join(" "));
        },
      };

      try {
        // Safe-ish client side execution using Function wrapper
        const runFn = new Function("console", code);
        runFn(customConsole);
        setConsoleLogs(logs.length === 0 ? ["Code executed successfully (no logs)."] : logs);
        toast.success("Code executed successfully!");
      } catch (err: any) {
        setConsoleLogs([...logs, `🔴 Error: ${err.message}`]);
        toast.error("Execution encountered an error.");
      }
    } else if (language === "html") {
      setHtmlPreview(code);
      toast.success("Preview updated!");
    } else {
      toast.info("CSS syntax highlighted. Wrap in HTML to preview style changes!");
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[language]);
    setConsoleLogs([]);
    setHtmlPreview("");
    toast.info("Editor reset to defaults.");
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-indigo-500" />
          <div>
            <CardTitle className="text-xs font-bold text-neutral-850 dark:text-neutral-50">Skillora Sandbox Playground</CardTitle>
            <p className="text-[9px] text-neutral-450">Write, execute, and verify code live in your browser.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(val: any) => handleLanguageChange(val)}>
            <SelectTrigger className="h-8 text-xs font-semibold rounded-lg w-28 bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs gap-1 font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>

          <Button
            onClick={handleRun}
            size="sm"
            className="h-8 rounded-lg text-xs gap-1 font-bold bg-indigo-650 hover:bg-indigo-750 text-white"
          >
            <Play className="h-3.5 w-3.5" /> Run Code
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 h-[400px]">
        {/* Editor Pane */}
        <div className="border-r border-neutral-150 dark:border-neutral-800/60 h-full relative">
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
            }}
          />
        </div>

        {/* Output Console / Preview Pane */}
        <div className="h-full bg-neutral-950 text-neutral-100 flex flex-col justify-between">
          <div className="p-3 border-b border-neutral-850 flex items-center gap-1.5 shrink-0">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Execution Output</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 selection:bg-neutral-800">
            {language === "javascript" ? (
              consoleLogs.length === 0 ? (
                <span className="text-neutral-500 italic">Console is empty. Click &apos;Run Code&apos; to execute logs.</span>
              ) : (
                consoleLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap leading-relaxed">
                    {log}
                  </div>
                ))
              )
            ) : htmlPreview ? (
              <iframe
                title="Preview"
                ref={iframeRef}
                srcDoc={htmlPreview}
                className="w-full h-full bg-white rounded-lg border-0"
                sandbox="allow-scripts"
              />
            ) : (
              <span className="text-neutral-500 italic">
                HTML Output Preview. Click &apos;Run Code&apos; to load the page content inside the preview iframe.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
