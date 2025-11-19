import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

const features = [
  {
    title: "Free International Shipping",
    description: "Complimentary express delivery over $100 worldwide.",
    icon: HiShoppingBag,
    accent: "from-amber-300 via-orange-400 to-rose-500",
  },
  {
    title: "45-Day Luxe Returns",
    description: "Risk-free try-ons with instant store credit.",
    icon: HiArrowPathRoundedSquare,
    accent: "from-emerald-300 via-teal-300 to-cyan-400",
  },
  {
    title: "Secure Checkout",
    description: "AES-256 encryption & PCI-compliant partners.",
    icon: HiOutlineCreditCard,
    accent: "from-sky-300 via-indigo-400 to-violet-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute w-72 h-72 -left-10 top-10 bg-rose-500/40 blur-[140px]" />
        <div className="absolute w-80 h-80 right-0 bottom-0 bg-sky-500/30 blur-[160px]" />
      </div>

      <div className="container relative px-6 mx-auto lg:px-0">
        <div className="max-w-2xl mx-auto mb-14 text-center space-y-4">
          <p className="inline-flex items-center px-4 py-1 text-xs tracking-[0.35em] uppercase rounded-full bg-white/10 border border-white/20">
            Concierge perks
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Tailored benefits for modern travelers
          </h2>
          <p className="text-sm text-white/70 md:text-base">
            Every order is handled with white-glove care, from packaging to
            doorstep. Enjoy effortless exchanges, real humans on support, and
            payment protection at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon, accent }) => (
            <div
              key={title}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${accent} text-slate-950 shadow-[0_15px_30px_rgba(0,0,0,0.25)]`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="mb-3 text-xl font-semibold tracking-tight">
                {title}
              </h4>
              <p className="text-sm leading-relaxed text-white/70">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
