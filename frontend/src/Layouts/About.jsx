import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Home, Building2, Key, MapPin, ShieldCheck, PhoneCall, HeartHandshake } from "lucide-react";

// Simple in-view wrapper for staggered animations
const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

// Animated stat counter
const Stat = ({ label, value, suffix = "", delay = 0 }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay } });
      const duration = 1200; // ms
      const start = performance.now();
      const animate = (t) => {
        const progress = Math.min((t - start) / duration, 1);
        setCurrent(Math.floor(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, delay, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={controls}
      className="rounded-2xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-black/5 p-6 text-center hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        {current}
        {suffix}
      </div>
      <p className="mt-2 text-sm sm:text-base text-gray-600">{label}</p>
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white text-gray-900">
      {/* Hero */}
      <section className="relative isolate">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-white/30 backdrop-blur">
                <ShieldCheck className="h-4 w-4" /> Trusted since 2012
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                We help people find homes they love.
              </h1>
              <p className="mt-4 sm:mt-6 text-white/90 text-base sm:text-lg">
                From city apartments to suburban retreats, our local experts
                pair market insight with human care to make your next move
                smooth and memorable.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#story"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-gray-900 px-5 py-3 font-semibold shadow hover:shadow-lg transition-all"
                >
                  Our Story
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl bg-transparent text-white px-5 py-3 font-semibold ring-1 ring-white/40 hover:bg-white/10 transition"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Floating cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 -mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Homes Matched" value={4500} suffix="+" />
          <Stat label="Partner Agents" value={120} suffix="+" delay={0.15} />
          <Stat label="Cities Covered" value={18} suffix="" delay={0.3} />
        </div>
      </section>

      {/* Who we are */}
      <section id="story" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop"
                  alt="Team collaborating in a modern office"
                  className="w-full h-72 sm:h-[420px] object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">A people-first real estate team</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  We started with a simple mission: make buying, renting, and
                  selling property more transparent and less stressful. Today,
                  our seasoned advisors, marketers, and technologists work
                  together to deliver delightful experiences and real results.
                </p>
                <ul className="mt-6 space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 mt-0.5" /> Fair, honest guidance—always.
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 mt-0.5" /> Local relationships that open doors.
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5" /> Neighborhood-level insights and data.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold">What we do</h2>
              <p className="mt-3 text-gray-600">
                Full-service support across buying, renting, investing, and
                property management—backed by smart tech.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Buy & Sell",
                Icon: Home,
                text: "Strategy, pricing, and marketing to maximize value.",
              },
              {
                title: "Commercial",
                Icon: Building2,
                text: "Spaces that grow with your business vision.",
              },
              {
                title: "Leasing",
                Icon: Key,
                text: "From applications to keys-in-hand, we’ve got you.",
              },
              {
                title: "Relocation",
                Icon: MapPin,
                text: "City-to-city moves with local experts on both ends.",
              },
            ].map(({ title, Icon, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-900 transition-colors">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-gray-600">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones / timeline */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold">Our journey</h2>
              <p className="mt-3 text-gray-600">A decade of steady growth and happy clients.</p>
            </div>
          </Reveal>

          <div className="mt-12 relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-100" />
            <div className="space-y-10">
              {[
                { year: "2012", title: "Founded", text: "Started as a two-person shop in a shared workspace." },
                { year: "2016", title: "1000+ Clients", text: "Became a top-rated local agency." },
                { year: "2020", title: "New Cities", text: "Expanded to 10+ markets with local teams." },
                { year: "2024", title: "Tech-forward", text: "Launched our smart search and virtual tours." },
              ].map((m, i) => (
                <Reveal key={m.year} delay={i * 0.05}>
                  <div className="relative grid sm:grid-cols-2 gap-6 items-center">
                    <div className={`order-2 sm:order-${i % 2 ? "2" : "1"} sm:text-right px-4`}>
                      <div className="inline-flex items-center gap-3 text-sm font-semibold text-gray-500">
                        <span className="rounded-full bg-gray-100 px-3 py-1">{m.year}</span>
                      </div>
                      <h4 className="mt-2 text-xl font-semibold">{m.title}</h4>
                      <p className="mt-1 text-gray-600">{m.text}</p>
                    </div>
                    <div className="order-1 sm:order-1 px-4">
                      <div className="relative sm:mx-auto sm:w-3/4">
                        <div className="absolute left-2 sm:left-1/2 -translate-x-1/2 -top-3 w-4 h-4 rounded-full bg-white ring-2 ring-gray-300" />
                        <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-4 hover:shadow-lg transition-shadow">
                          <img
                            src={`https://images.unsplash.com/photo-15${i + 10}1183${i}8710-841dd1904471?q=80&w=1200&auto=format&fit=crop`}
                            alt="Milestone"
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold">Meet the team</h2>
              <p className="mt-3 text-gray-600">Experienced, licensed, and genuinely kind humans.</p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <Reveal key={n} delay={n * 0.05}>
                <div className="group rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-xl transition-all">
                  <div className="relative mx-auto w-full aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={`https://images.unsplash.com/photo-15${n}1190${n}4471-841dd1904471?q=80&w=800&auto=format&fit=crop`}
                      alt="Team member"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">Alex Johnson</h3>
                    <p className="text-sm text-gray-600">Senior Agent</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
              <div className="px-6 sm:px-12 py-12 sm:py-16 grid lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Ready to make your next move?
                  </h3>
                  <p className="mt-2 text-white/80">
                    Our advisors reply within minutes. Let’s talk about your
                    goals and tailor a plan just for you.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-xl bg-white text-gray-900 px-5 py-3 font-semibold shadow hover:shadow-lg transition-all w-full"
                  >
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Book a Call
                  </a>
                  <a
                    href="#"
                    className="hidden sm:inline-flex items-center justify-center rounded-xl bg-transparent text-white px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-white/10 transition-all"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="pb-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YourRealty. All rights reserved.
      </footer>
    </div>
  );
}