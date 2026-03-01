export function MarketingFooter() {
  return (
    <footer className="py-16 lg:py-20 px-4 bg-[hsl(220_30%_12%)] text-[hsl(30_20%_85%)]">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#C97B8E] font-bold text-xl">Apex</span>
              <span className="text-[hsl(30_20%_65%)] text-xl">AI</span>
            </div>
            <p className="text-sm text-[hsl(30_10%_55%)] max-w-[40ch]">
              24/7 AI receptionist for aesthetics clinics. Stop losing bookings to slow replies.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="mailto:hello@apexaisystems.co.uk"
              className="text-[#C97B8E] hover:text-[#E9A8B6] transition-colors"
            >
              hello@apexaisystems.co.uk
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[hsl(30_10%_55%)]">
          <span>&copy; {new Date().getFullYear()} Apex AI</span>
          <span>Built in the UK</span>
        </div>
      </div>
    </footer>
  )
}
