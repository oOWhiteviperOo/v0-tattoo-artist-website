export function MarketingFooter() {
  return (
    <footer className="py-8 px-4 border-t border-border/30">
      <div className="max-w-content mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="text-accent font-bold">Apex</span>
          <span className="text-foreground/40">Ink</span>
          <span className="ml-2">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="mailto:hello@apexink.uk"
            className="hover:text-foreground transition-colors"
          >
            hello@apexink.uk
          </a>
        </div>
      </div>
    </footer>
  )
}
