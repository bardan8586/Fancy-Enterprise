import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Women's Top Wear", href: "#" },
  { label: "Women's Bottom Wear", href: "#" },
  { label: "Men's Top Wear", href: "#" },
  { label: "Men's Bottom Wear", href: "#" },
];

const supportLinks = [
  { label: "Help & FAQs", href: "#" },
  { label: "Order Tracking", href: "#" },
  { label: "Gift Cards", href: "#" },
  { label: "Returns Portal", href: "#" },
];

const socialLinks = [
  { icon: TbBrandMeta, label: "Facebook", url: "https://www.facebook.com" },
  { icon: IoLogoInstagram, label: "Instagram", url: "https://www.instagram.com" },
  { icon: RiTwitterXLine, label: "Twitter / X", url: "https://www.twitter.com" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 -right-12 top-10 bg-amber-500/20 blur-[120px]" />
        <div className="absolute w-72 h-72 left-0 bottom-0 bg-rose-500/15 blur-[140px]" />
      </div>

      <div className="container relative grid grid-cols-1 gap-12 px-6 py-16 mx-auto md:grid-cols-2 lg:grid-cols-4 lg:px-0">
        <div className="space-y-5">
          <p className="inline-flex px-4 py-1 text-xs uppercase rounded-full bg-white/10 border border-white/20 tracking-[0.35em]">
            Fancy
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">
            Resort-ready essentials, delivered.
          </h3>
          <p className="text-sm text-white/70">
            We curate limited-edition drops and concierge perks for globetrotters
            who value effortless luxury.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <FiPhoneCall className="text-lg" />
            <span>Concierge: +61 451 451 697</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Shop</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Support</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <h3 className="text-lg font-semibold tracking-tight">Stay in the loop</h3>
          <p className="text-sm text-white/70">
            Subscribe for curated travel edits, exclusive invites, and surprise
            drops. No spam, just love.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 px-4 py-3 text-sm text-white placeholder-white/60 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
              type="email"
              placeholder="Email address"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-[0_15px_35px_rgba(255,122,24,0.35)] hover:shadow-[0_18px_45px_rgba(255,122,24,0.45)]"
            >
              Subscribe
            </button>
          </form>
          <div className="flex items-center gap-4 pt-2">
            {socialLinks.map(({ icon: Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-6 px-6 py-8 mx-auto text-xs uppercase tracking-[0.35em] text-white/60 md:flex-row lg:px-0">
          <p>&copy; {new Date().getFullYear()} Fancy Collective</p>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
