import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "operator" | null;

interface AuthCtx {
  user: User | null;
  session: Session | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchRole(s.user.id), 0);
      } else {
        setRole(null);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchRole(s.user.id);
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchRole = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map(r => r.role);
    setRole(roles.includes("admin") ? "admin" : roles.includes("operator") ? "operator" : null);
    setLoading(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  return <Ctx.Provider value={{ user, session, role, loading, signOut }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
