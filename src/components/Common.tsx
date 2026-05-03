export const PageHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border bg-muted/20">
    <div className="h-14 w-14 rounded-2xl bg-secondary grid place-items-center mb-4">
      <Icon className="h-6 w-6 text-accent" />
    </div>
    <h3 className="font-medium text-base">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
  </div>
);
