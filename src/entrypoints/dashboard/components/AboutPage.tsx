import { Shield, ExternalLink, Cpu } from 'lucide-react'

interface AboutPageProps {
  version?: string
}

export function AboutPage({ version = '0.5.0' }: AboutPageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-4 border-b border-divider-dim pb-6">
        <div className="w-14 h-14 rounded-lg bg-accent-main/15 border border-accent-main/30 flex items-center justify-center p-3">
          <img
            src="/icon/128.png"
            alt="WYNTab emblem"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">WYNTab</h2>
          <p className="text-[13px] text-text-muted mt-0.5">
            Write Your NewTab — Utilitarian custom HTML new tab manager for modern browsers.
          </p>
          <span className="inline-block mt-2 text-[11px] font-mono px-2 py-0.5 rounded bg-bg-a2 text-text-secondary border border-divider-dim">
            Version {version}
          </span>
        </div>
      </div>

      {/* Runtime Environment Specs */}
      <section className="bg-bg-a2/40 border border-divider-dim rounded-md p-5 space-y-3">
        <div className="flex items-center gap-2 text-text-primary font-semibold text-[14px]">
          <Cpu size={16} className="text-accent-main" />
          <span>Extension Specifications</span>
        </div>
        <div className="divide-y divide-divider-dim text-[12px]">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Manifest Specification</span>
            <span className="font-mono text-text-primary">Manifest V3</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Extension Framework</span>
            <span className="font-mono text-text-primary">WXT 0.21 · Vite · React 19</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Code Editor Engine</span>
            <span className="font-mono text-text-primary">CodeMirror 6</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Target Runtime</span>
            <span className="font-mono text-text-primary">Chromium & Gecko Browsers</span>
          </div>
        </div>
      </section>

      {/* Security Architecture Callout */}
      <section className="border-l-3 border-accent-main bg-bg-a2/40 border-y border-r border-divider-dim rounded-r-md p-5 flex items-start gap-3">
        <Shield size={18} className="text-accent-bright shrink-0 mt-0.5" />
        <div className="text-[12px] space-y-1">
          <h4 className="font-semibold text-text-primary">Sandboxed Execution Model</h4>
          <p className="text-text-muted leading-relaxed">
            All user-uploaded HTML and edited templates execute within sandboxed frames (<code className="text-accent-bright font-mono text-[11px]">allow-scripts allow-forms allow-same-origin</code>)
            isolated from the extension's privileged APIs. External JavaScript and unauthorized iframe embeds are stripped by DOM sanitization upon save.
          </p>
        </div>
      </section>

      {/* Resources & Links */}
      <section className="text-[12px] text-text-muted pt-2 flex items-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-text-primary flex items-center gap-1.5 transition-colors"
        >
          <span>GitHub Repository</span>
          <ExternalLink size={12} />
        </a>
      </section>
    </div>
  )
}

