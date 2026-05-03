import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Activity, Fish, Bell, ShieldCheck, ArrowRight, Droplets, Thermometer, FlaskConical, Eye } from "lucide-react";
import heroImg from "@/assets/hero-water.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur grid place-items-center"><Waves className="h-5 w-5" /></div>
            <span className="font-semibold tracking-tight">IntelliPond</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#research" className="hover:text-white">Research</a>
          </nav>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">{user ? "Open console" : "Sign in"}</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[92vh] overflow-hidden flex items-center">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 gradient-deep opacity-85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(188_85%_55%/0.4),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-12 gap-10 items-center w-full">
          <div className="lg:col-span-7 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs uppercase tracking-widest text-white/80 mb-6">
              <span className="ripple-dot bg-accent" /> Live aquaculture intelligence
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              Bangus monitoring,<br />
              <span className="text-gradient">re-engineered.</span>
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-xl">
              IntelliPond fuses IoT sensor streams with machine learning to give fishpond operators a calm, clear view of water quality, behavior and growth — in real time.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-6">
                  {user ? "Go to dashboard" : "Get started"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-6 bg-transparent">Explore the platform</Button></a>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 gradient-aqua opacity-30 blur-3xl rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { icon: Droplets, label: "Dissolved O₂", val: "—", unit: "mg/L" },
                  { icon: FlaskConical, label: "pH", val: "—", unit: "" },
                  { icon: Thermometer, label: "Temperature", val: "—", unit: "°C" },
                  { icon: Eye, label: "Turbidity", val: "—", unit: "NTU" },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 text-white">
                    <s.icon className="h-5 w-5 text-accent mb-3" />
                    <div className="text-xs uppercase tracking-wider text-white/60">{s.label}</div>
                    <div className="font-mono text-2xl mt-1">{s.val}<span className="text-sm text-white/60 ml-1">{s.unit}</span></div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-white/50 mt-4">Awaiting first sensor sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-accent font-medium mb-3">Built for operators</div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Everything that matters about your pond — nothing that doesn't.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { icon: Activity, title: "Behavior intelligence", text: "Detect stress, low activity, and risk patterns from live sensor signals." },
              { icon: Fish, title: "Growth monitoring", text: "Track weight, length and feeding cycles with predicted growth status." },
              { icon: Bell, title: "Smart alerts", text: "Get plain-language warnings and recommendations the moment thresholds trip." },
              { icon: ShieldCheck, title: "Role-based access", text: "Operators see clean insights. Admins manage sensors, models and reports." },
            ].map((f, i) => (
              <div key={i} className="stat-tile">
                <f.icon className="h-6 w-6 text-accent mb-4" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-28 px-6 bg-secondary/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent font-medium mb-3">How it works</div>
            <h2 className="text-4xl font-semibold tracking-tight">From sensor signal to operator action — in seconds.</h2>
            <div className="mt-10 space-y-6">
              {[
                { n: "01", t: "Sensors stream", d: "DO, pH, temperature and turbidity readings flow into IntelliPond continuously." },
                { n: "02", t: "Models interpret", d: "Machine learning translates raw signals into behavior and growth predictions." },
                { n: "03", t: "Operators act", d: "A clean dashboard surfaces only what needs attention, with clear recommendations." },
              ].map(s => (
                <div key={s.n} className="flex gap-5">
                  <div className="font-mono text-accent text-sm pt-1">{s.n}</div>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden gradient-deep p-10 text-white shadow-elevated">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(188_85%_55%/0.4),transparent_60%)]" />
            <div className="relative h-full flex flex-col justify-between">
              <Waves className="h-8 w-8" />
              <div>
                <div className="text-5xl font-semibold tracking-tight">Calm.<br />Clear.<br />Continuous.</div>
                <div className="mt-6 text-white/60 text-sm">An academic-grade platform designed for real fishpond operations.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to monitor your pond?</h2>
          <p className="text-muted-foreground mt-3">Sign in or create an operator account to access your dashboard.</p>
          <Link to={user ? "/dashboard" : "/auth"} className="inline-block mt-8">
            <Button size="lg" className="gradient-aqua text-white border-0 hover:opacity-90 h-12 px-8">
              {user ? "Open dashboard" : "Get started"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Waves className="h-4 w-4 text-accent" /> IntelliPond</div>
          <div>© {new Date().getFullYear()} · Capstone research project</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
