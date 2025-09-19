"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hover-lift">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-primary/10">
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-primary/10">
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-primary/10">
          <span className="mr-2 h-4 w-4">💻</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}