import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/Common";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Waves, Database, Bell, Users, Fish, Activity } from "lucide-react";

const AdminOverview = () => {
  const [counts, setCounts] = useState({ ponds: 0, readings: 0, alerts: 0, growth: 0, predictions: 0, users: 0 });
  useEffect(() => {
    const c = async (t: string) => (await supabase.from(t as any).select("id", { count: "exact", head: true })).count ?? 0;
    Promise.all([c("pond_profiles"), c("sensor_readings"), c("alerts"), c("bangus_growth_records"), c("behavior_predictions"), c("profiles")])
      .then(([ponds, readings, alerts, growth, predictions, users]) => setCounts({ ponds, readings, alerts, growth, predictions, users }));
  }, []);

  const tiles = [
    { icon: Waves, label: "Pond profiles", val: counts.ponds },
    { icon: Database, label: "Sensor readings", val: counts.readings },
    { icon: Bell, label: "Alerts", val: counts.alerts },
    { icon: Fish, label: "Growth records", val: counts.growth },
    { icon: Activity, label: "Behavior predictions", val: counts.predictions },
    { icon: Users, label: "Users", val: counts.users },
  ];

  return (
    <AppShell admin>
      <PageHeader title="Admin Console" subtitle="System-wide visibility for IntelliPond." />
      <div className="grid md:grid-cols-3 gap-4">
        {tiles.map(t => (
          <Card key={t.label} className="p-6">
            <t.icon className="h-5 w-5 text-accent mb-3" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t.label}</div>
            <div className="font-mono text-3xl mt-1">{t.val}</div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
};
export default AdminOverview;
