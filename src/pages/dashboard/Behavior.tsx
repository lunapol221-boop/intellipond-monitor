import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, EmptyState } from "@/components/Common";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getSettings, deriveBehavior, Settings, DEFAULT_SETTINGS } from "@/lib/pond";

const colors: Record<string, string> = {
  "Normal": "bg-success text-success-foreground",
  "Low Activity": "bg-warning text-warning-foreground",
  "Stressed": "bg-warning text-warning-foreground",
  "Possible Risk": "bg-destructive text-destructive-foreground",
  "Unknown": "bg-muted text-muted-foreground",
};

const Behavior = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      const s = await getSettings(); setSettings(s);
      const { data } = await supabase.from("sensor_readings").select("*").order("recorded_at", { ascending: false }).limit(50);
      setReadings(data ?? []);
    })();
  }, []);

  return (
    <AppShell>
      <PageHeader title="Bangus Behavior" subtitle="Behavior insights derived from live pond conditions." />
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Behavior Timeline</h3>
        {readings.length === 0 ? (
          <EmptyState icon={Activity} title="No prediction available yet." description="Behavior history will appear once sensor data is recorded." />
        ) : (
          <div className="divide-y divide-border">
            {readings.map(r => {
              const b = deriveBehavior(r, settings);
              return (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="text-sm font-mono text-muted-foreground">{format(new Date(r.recorded_at), "MMM d · HH:mm")}</div>
                  <Badge className={colors[b] + " border-0"}>{b}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </AppShell>
  );
};
export default Behavior;
