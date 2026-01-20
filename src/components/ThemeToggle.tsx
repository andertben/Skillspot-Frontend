import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-1 p-1 border rounded-lg bg-background" style={{ borderColor: 'hsl(var(--input))' }}>
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'light' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50'
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'dark' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50'
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
    </div>
  )
}
