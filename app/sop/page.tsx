export default function SOPPage() {
  const sops = [
    {
      code: 'SOP-01',
      title: 'VIP Guest Arrival & Reception',
      role: 'Hostess / Front of House',
      steps: [
        'Acknowledge arrival within 15 seconds with a formal greeting: "Welcome to Maison Vie, [Title/Name]".',
        'Verify dietary notes and reservation VIP status on Maison Vie OS.',
        'Escort guests to their assigned private room (e.g., Salon Privé or Le Jardin).',
        'Offer pre-dinner drink options (French neoclassical champagne selections).'
      ]
    },
    {
      code: 'SOP-02',
      title: 'Kitchen & Chef Coordination',
      role: 'Restaurant Manager / Sommelier',
      steps: [
        'Coordinate directly with Chef Joel (Bếp trưởng) regarding custom tasting menu changes.',
        'Log customized allergy lists in the dashboard reservation cards immediately.',
        'Ensure the kitchen table (L\'Art Culinaire) is cleared and reset 30 minutes before booking time.',
        'Alert service staff immediately upon Chef\'s notification that course plating is commencing.'
      ]
    },
    {
      code: 'SOP-03',
      title: 'Ambient Controls & Neoclassical Standards',
      role: 'Operations Lead',
      steps: [
        'Set Facade and facade-led light lines to soft warm gold color (matching #C5A55A ambiance) at sunset.',
        'Background music must remain within classical piano or traditional French acoustic compositions.',
        'Temperature in private rooms must be maintained at a steady 22°C (71.6°F) at all times.',
        'Aroma diffusers must be filled with light white-jasmine essential oil.'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          Standard Operating Procedures
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Formal system guides, villa guest policies, and culinary staff workflows.
        </p>
      </div>

      {/* Grid of SOP files */}
      <div className="grid gap-6 md:grid-cols-3">
        {sops.map((sop) => (
          <div key={sop.code} className="glass-panel rounded-xl p-6 border border-gold-border flex flex-col justify-between hover-gold-glow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono rounded bg-gold-muted border border-gold-border px-2.5 py-0.5 text-gold font-semibold">
                  {sop.code}
                </span>
                <span className="text-[10px] text-foreground/50 italic font-mono">
                  Role: {sop.role}
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                {sop.title}
              </h3>
              <ol className="list-decimal list-inside text-xs text-foreground/80 space-y-2 font-sans pl-1">
                {sop.steps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1 text-[11px]">
                    <span className="text-foreground/90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-t border-gold-border/20 pt-4 mt-6 text-[10px] text-foreground/40 font-mono flex items-center justify-between">
              <span>Status: Active Standard</span>
              <span>Updated: 2026-06-28</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
