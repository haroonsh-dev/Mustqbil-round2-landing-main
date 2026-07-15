export function Comparison() {
  return (
    <>
      {/* Competitor Comparison Section (Product Manager Improvement #2) */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 bg-background border-t border-border/60">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Market Comparison
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
            Why builders choose Clarity over legacy tools
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Traditional project management applications are built for loggers. Clarity is built for
            developers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 font-bold">
                <th className="p-4">Feature Matrix</th>
                <th className="p-4 text-primary">Clarity</th>
                <th className="p-4">Jira Software</th>
                <th className="p-4">Linear</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 font-semibold">Board experience</td>
                <td className="p-4 font-bold text-primary">Focused and lightweight</td>
                <td className="p-4 text-muted-foreground">Highly configurable</td>
                <td className="p-4 text-muted-foreground">Fast and structured</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Repository workflow</td>
                <td className="p-4 font-bold text-primary">Designed around PR visibility</td>
                <td className="p-4 text-muted-foreground">Available with setup</td>
                <td className="p-4 text-muted-foreground">Available with setup</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Workspace configuration setup</td>
                <td className="p-4 font-bold text-primary">Simple team-first defaults</td>
                <td className="p-4 text-muted-foreground">Deep admin configuration</td>
                <td className="p-4 text-muted-foreground">Opinionated defaults</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Legacy data migration</td>
                <td className="p-4 font-bold text-primary">CSV/JSON import path</td>
                <td className="p-4 text-muted-foreground">Import tools available</td>
                <td className="p-4 text-muted-foreground">Import tools available</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Pricing structure transparency</td>
                <td className="p-4 font-bold text-primary">Clear plan tiers</td>
                <td className="p-4 text-muted-foreground">Multiple package tiers</td>
                <td className="p-4 text-muted-foreground">Standard seat rates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
