import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      title: 'Operations Dashboard',
      description: 'Real-time metrics, guest statistics, active workflows, and system status.',
      icon: '📊',
      href: '/dashboard',
    },
    {
      title: 'System Docs',
      description: 'Technical and user guides for Maison Vie Operating System architecture.',
      icon: '📖',
      href: '/docs',
    },
    {
      title: 'Standard Operating Procedures',
      description: 'Formal neoclassical villa rules, staff procedures, and dining room protocols.',
      icon: '🏛️',
      href: '/sop',
    },
    {
      title: 'OS Administration',
      description: 'Database configurations, Supabase synchronization, environment checks, and settings.',
      icon: '⚙️',
      href: '/admin',
    },
  ]

  const folders = [
    { name: '/app', desc: 'App router pages & route layout handlers' },
    { name: '/components', desc: 'Shared UI components, cards, lists, & navbars' },
    { name: '/lib', desc: 'Service clients, utilities, and helper libraries (Supabase)' },
    { name: '/database', desc: 'DB schemas, migrations, and seed scripts' },
    { name: '/prompts', desc: 'AI agents templates, System prompt versions' },
    { name: '/workflows', desc: 'Automated orchestrations & Deno Edge Function routines' },
    { name: '/agents', desc: 'Autonomous service definitions & executor scripts' },
  ]

  return (
    <div className="space-y-12 py-4">
      {/* Hero section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <h1 className="text-5xl md:text-6xl font-serif-cormorant font-bold tracking-tight">
          The French Neoclassical <br />
          <span className="gold-gradient-text">Villa Operating System</span>
        </h1>
        <p className="text-foreground/80 font-serif-cormorant italic text-xl tracking-wider">
          {"\"L'art de vivre et la technologie harmonisée.\""}
        </p>
        <p className="text-foreground/60 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          Maison Vie OS coordinates guest experiences, reservation routing, automated agent workflows, 
          and standard operating procedures for our high-end neoclassical restaurant and villa.
        </p>
      </section>

      {/* Grid of Main Features */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feat) => (
          <Link
            key={feat.href}
            href={feat.href}
            className="group glass-panel hover-gold-glow rounded-xl p-6 flex flex-col justify-between transition-all duration-300 min-h-[220px]"
          >
            <div>
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-200">
                {feat.icon}
              </span>
              <h3 className="text-lg font-serif-cormorant font-bold tracking-wide text-gold group-hover:text-gold-hover mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-foreground/70 font-sans leading-relaxed">
                {feat.description}
              </p>
            </div>
            <div className="text-xs font-semibold text-gold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              Access Module <span>→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Directory Layout Section */}
      <section className="glass-panel rounded-2xl p-8 border border-gold-border">
        <div className="border-b border-gold-border/40 pb-4 mb-6">
          <h2 className="text-2xl font-serif-cormorant font-bold tracking-wide text-gold">
            📁 System File Architecture
          </h2>
          <p className="text-xs text-foreground/50 mt-1">
            Standard directory mappings configured for Maison Vie OS developer workflow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => (
            <div key={f.name} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gold-muted/30 transition-colors duration-150">
              <span className="text-xl">📁</span>
              <div>
                <code className="text-xs font-semibold text-gold tracking-wider">{f.name}</code>
                <p className="text-[11px] text-foreground/60 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
