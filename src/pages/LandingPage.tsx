import { useNavigate, Link } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-emerald-700">e‑Beer</Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#how" className="hover:text-emerald-700">How it works</a>
            <a href="#benefits" className="hover:text-emerald-700">Benefits</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </nav>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm"
          >
            Login
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <img
          src="/lovable-uploads/hero_ebeer.jpg"   // put your hero image in /public/lovable-uploads/
          alt="Farmers and buyers connecting"
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-70"
        />
        <div className="mx-auto max-w-6xl px-4 py-24">
          <p className="inline-block text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            Fair prices • Direct from farms
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold max-w-3xl">
            Connecting Farmers & Buyers so everyone gets a fair price.
          </h1>
          <p className="mt-5 text-lg max-w-2xl text-slate-700">
            Farmers list produce and set a minimum price. Buyers place transparent bids.
            We coordinate delivery and fast payout. No middlemen.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate("/login")} className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold">
              I’m a Farmer
            </button>
            <button onClick={() => navigate("/login")} className="rounded-full border px-6 py-3 font-semibold">
              I’m a Buyer
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            { title: "Upload Produce", img: "/lovable-uploads/step_upload.jpg", desc: "List quantity, quality, and a minimum price." },
            { title: "Buyers Bid", img: "/lovable-uploads/step_bidding.jpg", desc: "Receive transparent offers—accept the best." },
            { title: "Delivery & Payout", img: "/lovable-uploads/step_delivery.jpg", desc: "We handle logistics; you get paid fast." },
          ].map((s) => (
            <div key={s.title} className="border rounded-2xl overflow-hidden bg-white">
              <img src={s.img} alt={s.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 sm:grid-cols-2">
          <div className="border rounded-2xl p-6 bg-white">
            <h3 className="text-xl font-bold text-emerald-700">For Farmers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Set minimum price and stay in control</li>
              <li>• Transparent bids (no hidden cuts)</li>
              <li>• Managed delivery & faster payouts</li>
            </ul>
          </div>
          <div className="border rounded-2xl p-6 bg-white">
            <h3 className="text-xl font-bold text-emerald-700">For Buyers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Fresh, traceable produce direct from source</li>
              <li>• Competitive, fair pricing via bids</li>
              <li>• Schedule delivery windows that fit you</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} e‑Beer</div>
          <div className="mt-2">Email: hello@ebeer.app</div>
        </div>
      </footer>
    </div>
  );
}

