import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, EmptyState } from "@/components/Common";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users as UsersIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const load = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    const merged = (profiles ?? []).map(p => ({ ...p, roles: (roles ?? []).filter(r => r.user_id === p.id).map(r => r.role) }));
    setUsers(merged);
  };
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (uid: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) return toast.error(error.message);
    }
    toast.success("Updated"); load();
  };

  return (
    <AppShell admin>
      <PageHeader title="Users" subtitle="Manage operators and admins." />
      {users.length === 0 ? (
        <Card className="p-6"><EmptyState icon={UsersIcon} title="No users yet." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {users.map(u => {
            const isAdmin = u.roles.includes("admin");
            return (
              <div key={u.id} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full gradient-aqua grid place-items-center text-white font-medium">{(u.full_name || u.email || "?")[0]?.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.full_name || "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                {isAdmin && <Badge className="bg-accent text-accent-foreground border-0"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>}
                <Button size="sm" variant="outline" onClick={() => toggleAdmin(u.id, isAdmin)}>{isAdmin ? "Revoke admin" : "Make admin"}</Button>
              </div>
            );
          })}
        </Card>
      )}
    </AppShell>
  );
};
export default Users;
