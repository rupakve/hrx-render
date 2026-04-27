import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import logoSvg from "@/assets/logo.svg";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/lib/authStorage";
import userProfile from "@/assets/user_profile.png";

const navLinks = [
  { label: "My Relations", badge: 2 },
  { label: "My Requests" },
  { label: "My Favorites" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("My Relations");
  //const [userEmail, setUserEmail] = useState("");
  const user = getUser();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-[hsl(160_30%_10%/0.6)] border-b border-border rounded-t-[25px] relative z-50">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 shrink-0">
        <img src={logoSvg} alt="CereHRX" className="h-8" />
      </a>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden text-foreground p-2"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Nav links + right section */}
      <div
        className={`${mobileOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0 absolute lg:relative top-full left-0 right-0 lg:top-auto bg-card lg:bg-transparent p-4 lg:p-0 border-b lg:border-0 border-border flex-1 z-50`}
      >
        {/* Center links */}
        <ul className="flex flex-col lg:flex-row gap-1 mx-auto">
          {navLinks.map((link) => (
            <li key={link.label} className="relative">
              <button
                onClick={() => setActiveLink(link.label)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeLink === link.label
                    ? "bg-white/10 text-white shadow-[0_0_15px_hsl(217_85%_55%/0.3)] border border-white/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
              {link.badge && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {link.badge}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Right section */}
        <div className="flex items-center gap-0 ml-auto">
          {/* Bell */}
          <div className="px-6 border-r border-white/10 relative">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
            </button>
          </div>

          {/* Profile */}
          <div className="px-6 relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden border border-white/10">
                  <img
                    src={userProfile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl p-2 shadow-xl z-50 animate-fade-in">
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                    hi, {user?.name}
                  </div>

                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-primary/15">
                    <User size={16} />
                    Profile
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-primary/15">
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
