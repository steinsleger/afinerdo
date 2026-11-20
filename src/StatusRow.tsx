import type { ReactNode } from 'react'

export function StatusRow({ label, live, children }: { label: string; live: boolean; children?: ReactNode }) {
  return (
    <div className="display-row">
      <span className="display-status" data-live={live}>
        {label}
      </span>
      <span className="display-aside">{children}</span>
    </div>
  )
}
