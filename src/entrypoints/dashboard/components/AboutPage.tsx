import { ShieldCheck, ExternalLink, Cpu } from 'lucide-react'
import { BrandIcon } from '@/components/BrandIcon'

interface AboutPageProps {
  version?: string
}

function GithubIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export function AboutPage({ version = '0.5.5' }: AboutPageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-4 border-b border-divider-dim pb-6">
        <BrandIcon size="lg" alt="WYNTab emblem" />
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">WYNTab</h2>
          <p className="text-[13px] text-text-muted mt-0.5">
            Write Your NewTab — Utilitarian custom HTML new tab manager for modern browsers.
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-a2 text-text-secondary border border-divider-dim">
              Version {version}
            </span>
            <a
              href="https://github.com/getwyntab/wyntab"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <GithubIcon className="w-3 h-3" />
              <span>GitHub</span>
              <ExternalLink size={10} className="text-text-subtle" />
            </a>
          </div>
        </div>
      </div>

      {/* Runtime Environment Specs */}
      <section className="bg-bg-a2/40 border border-divider-dim rounded-md p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Cpu size={16} className="text-accent-main" />
          <h3 className="text-[14px] font-semibold text-text-primary">Extension Specifications</h3>
        </div>
        <div className="divide-y divide-divider-dim text-[12px]">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Manifest Specification</span>
            <span className="font-mono text-accent-bright/75">Manifest V3</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Extension Framework</span>
            <span className="font-mono text-accent-bright/75">WXT 0.21 · Vite · React 19</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Code Editor Engine</span>
            <span className="font-mono text-accent-bright/75">CodeMirror 6</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Target Runtime</span>
            <span className="font-mono text-accent-bright/75">Chromium & Gecko Browsers</span>
          </div>
        </div>
      </section>

      {/* Security & Sandbox Policy */}
      <section className="bg-bg-a2/40 border border-divider-dim rounded-md p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-accent-main" />
          <h3 className="text-[14px] font-semibold text-text-primary">Security & Sandbox Policy</h3>
        </div>
        <p className="text-[12px] text-text-muted leading-relaxed">
          All user-authored and uploaded HTML templates execute inside an isolated browser sandbox iframe with strict Content Security Policy, completely isolated from extension privileged APIs. External scripts, React/Vue modules, and CDN packages run safely without exposing browser or extension credentials to guarantee complete privacy and security.
        </p>
      </section>
    </div>
  )
}
