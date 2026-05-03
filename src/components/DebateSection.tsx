export function DebateSection(props: { transcript: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="mb-2 text-left text-xl font-semibold text-[var(--color-ink)]">
        Convening
      </h2>
      <p className="mb-6 max-w-3xl text-left text-sm text-[var(--color-muted)]">
        Steelman-before-defense keeps the room honest. No verdict — only friction you can
        feel.
      </p>
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-6 text-left">
        <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-ink)]">
          {props.transcript}
        </pre>
      </div>
    </section>
  )
}
