import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggleMobile() {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ]

  return (
    <div className="flex flex-col border-t border-border pt-4 mt-4">
      <div className="px-4 pb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Tema
        </span>
      </div>
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-base transition-colors duration-200 relative",
            theme === value
              ? "text-foreground bg-accent/50"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
          {theme === value && (
            <Check className="w-4 h-4 ml-auto text-primary" />
          )}
        </button>
      ))}
    </div>
  )
}
