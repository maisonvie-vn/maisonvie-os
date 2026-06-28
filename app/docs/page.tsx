export default function DocsPage() {
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: 'Maison Vie OS (maisonvie-os) is an orchestration platform designed to handle the day-to-day operations of the Maison Vie neoclassical villa. It combines front-of-house seatings, guest CRM data, automated notifications, and AI agents into a single unified workspace.',
    },
    {
      id: 'folder-mapping',
      title: '2. Folder Mapping',
      content: 'The workspace contains specific non-standard folders defined for organizing operating system concerns: \n\n• /app: Client web interface\n• /components: Modular UI blocks\n• /lib: Unified client instances and utilities (e.g. Supabase client initialization)\n• /database: Database SQL files, migrations, schemas, and seeds\n• /prompts: AI Agent templates for guest emails, SOP checks, and reporting\n• /workflows: Orchestrations, deploy scripts, and Edge Functions\n• /agents: Autonomous background script workers and services',
    },
    {
      id: 'supabase-integration',
      title: '3. Supabase Integration',
      content: 'Maison Vie OS uses Supabase as its primary backend, utilizing Supabase Auth, PostgreSQL, and Deno Edge Functions. The client is initialized in `lib/supabase.ts`. Local development environment settings can be configured inside `.env.local` based on `.env.example`. Make sure not to connect production databases directly in development mode.',
    },
    {
      id: 'agents-and-workflows',
      title: '4. Agents & Workflows',
      content: 'Autonomous agents reside in `/agents`. They process tasks such as checking incoming CRM mail, verifying layout rules, and matching guest VIP preferences. Workflows in `/workflows` orchestrate actions (e.g. sending a Slack/Email alert when Chef Joel opens a new special table reservation).',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          System Documentation
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Technical specifications, directory structure details, and operational guides.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-gold tracking-wider uppercase mb-4 px-2">Sections</h3>
          <nav className="flex flex-col gap-1">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="text-xs text-foreground/80 hover:text-gold px-2 py-1.5 rounded hover:bg-gold-muted/10 transition-colors"
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="glass-panel rounded-xl p-6 border border-gold-border space-y-3 scroll-mt-20"
            >
              <h2 className="text-xl font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
                {sec.title}
              </h2>
              <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line font-sans">
                {sec.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
