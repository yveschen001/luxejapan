"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light")
        }}
      />
      <Label htmlFor="dark-mode" className="text-sm">深色模式</Label>
    </div>
  )
} 