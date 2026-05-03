import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/Common";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Brain, Sliders } from "lucide-react";

const Settings = () => {
  const [s, setS] = useState<any>({ do_min: 4, do_max: 9, ph_min: 6.5, ph_max: 8.5, temp_min: 26, temp_max: 32, turbidity_max: 80, alerts_enabled: true });
  const [model, setModel] = useState("random_forest");
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("admin_settings").select("*").limit(1).maybeSingle();
      if (row) { setS(row); setSettingsId(row.id); }
      const { data: m } = await supabase.from("ml_model_config").select("*").limit(1).maybeSingle();
      if (m) { setModel(m.selected_model); setModelId(m.id); }
    })();
  }, []);

  const saveThresholds = async () => {
    const payload = { do_min: +s.do_min, do_max: +s.do_max, ph_min: +s.ph_min, ph_max: +s.ph_max, temp_min: +s.temp_min, temp_max: +s.temp_max, turbidity_max: +s.turbidity_max, alerts_enabled: s.alerts_enabled, updated_at: new Date().toISOString() };
    const { error } = settingsId
      ? await supabase.from("admin_settings").update(payload).eq("id", settingsId)
      : await supabase.from("admin_settings").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  const saveModel = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { selected_model: model, updated_by: user?.id, updated_at: new Date().toISOString() };
    const { error } = modelId
      ? await supabase.from("ml_model_config").update(payload).eq("id", modelId)
      : await supabase.from("ml_model_config").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Model updated");
  };

  return (
    <AppShell admin>
      <PageHeader title="System Configuration" subtitle="Thresholds, alerting and prediction model." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1"><Sliders className="h-5 w-5 text-accent" /><h3 className="font-semibold">Threshold Configuration</h3></div>
          <p className="text-sm text-muted-foreground mb-5">Control when alerts trigger.</p>
          <div className="space-y-4">
            <Pair l="DO" a={[s.do_min, v => setS({ ...s, do_min: v })]} b={[s.do_max, v => setS({ ...s, do_max: v })]} unit="mg/L" />
            <Pair l="pH" a={[s.ph_min, v => setS({ ...s, ph_min: v })]} b={[s.ph_max, v => setS({ ...s, ph_max: v })]} />
            <Pair l="Temp" a={[s.temp_min, v => setS({ ...s, temp_min: v })]} b={[s.temp_max, v => setS({ ...s, temp_max: v })]} unit="°C" />
            <div>
              <Label>Max turbidity (NTU)</Label>
              <Input type="number" step="0.1" value={s.turbidity_max} onChange={e => setS({ ...s, turbidity_max: e.target.value })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
              <div><div className="font-medium text-sm">Enable alerts</div><div className="text-xs text-muted-foreground">Send notifications when thresholds trip.</div></div>
              <Switch checked={s.alerts_enabled} onCheckedChange={v => setS({ ...s, alerts_enabled: v })} />
            </div>
            <Button className="w-full gradient-aqua text-white border-0" onClick={saveThresholds}>Save thresholds</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1"><Brain className="h-5 w-5 text-accent" /><h3 className="font-semibold">Machine Learning</h3></div>
          <p className="text-sm text-muted-foreground mb-5">Select the prediction model used for behavior and growth analysis. This is hidden from operators.</p>
          <Label>Active model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="random_forest">Random Forest</SelectItem>
              <SelectItem value="linear_regression">Linear Regression</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4 p-4 rounded-lg bg-secondary/40 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Currently selected</div>
            <div className="font-mono">{model === "random_forest" ? "Random Forest" : "Linear Regression"}</div>
          </div>
          <Button className="w-full mt-4 gradient-aqua text-white border-0" onClick={saveModel}>Save model</Button>
        </Card>
      </div>
    </AppShell>
  );
};

const Pair = ({ l, a, b, unit }: any) => (
  <div>
    <Label>{l} range {unit && <span className="text-muted-foreground">({unit})</span>}</Label>
    <div className="grid grid-cols-2 gap-2">
      <Input type="number" step="0.1" value={a[0]} onChange={e => a[1](e.target.value)} placeholder="min" />
      <Input type="number" step="0.1" value={b[0]} onChange={e => b[1](e.target.value)} placeholder="max" />
    </div>
  </div>
);
export default Settings;
