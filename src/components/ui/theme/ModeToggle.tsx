
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={toggleDarkMode}
        >
            {theme === "dark" ? (
                <Sun className={`h-[1.2rem] w-[1.2rem]`} />
            ) : (
                <Moon className={`h-[1.2rem] w-[1.2rem]`} />
            )}
        </Button>
    )
}
