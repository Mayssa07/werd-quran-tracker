import { NavLink } from "@/components/NavLink";
import { Home, BookText, Circle, MoreHorizontal } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/adhkar", icon: BookText, label: "Adhkar" },
    { to: "/sebha", icon: Circle, label: "Sebha" },
    { to: "/more", icon: MoreHorizontal, label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-medium z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
              activeClassName="text-primary bg-primary/10 font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
