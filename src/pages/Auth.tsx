import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Waves, ArrowLeft } from "lucide-react";
import heroImg from "@/assets/hero-water.jpg";

const Auth = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) nav("/dashboard");
    });
  }, [nav]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/pending-approval`, data: { full_name: fullName } }
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — awaiting admin approval");
    nav("/pending-approval");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 gradient-deep opacity-80" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center"><Waves className="h-5 w-5" /></div>
              <span className="font-semibold text-lg">IntelliPond</span>
            </div>
            <h2 className="text-4xl font-semibold leading-tight max-w-md">Real-time intelligence for Bangus aquaculture.</h2>
            <p className="mt-4 text-white/70 max-w-md">Monitor water quality, fish behavior and growth — all in one elegant operator console.</p>
          </div>
          <div className="text-xs text-white/50">Capstone research platform · IoT + Machine Learning</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md p-8 border-border/60 shadow-soft">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl gradient-aqua grid place-items-center"><Waves className="h-5 w-5 text-white" /></div>
            <span className="font-semibold">IntelliPond</span>
          </div>
          <h1 className="text-2xl font-semibold">Operator Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your monitoring console.</p>
          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Create account</TabsTrigger></TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-6">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Password</Label>
                    <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                  </div>
                  <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full gradient-aqua text-white border-0 hover:opacity-90" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-6">
                <div><Label>Full name</Label><Input required value={fullName} onChange={e => setFullName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full gradient-aqua text-white border-0 hover:opacity-90" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
export default Auth;
