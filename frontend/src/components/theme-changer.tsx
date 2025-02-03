"use cleint";
import { useTheme } from "next-themes";

const ThemeChanger = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {children}
    </div>
  );
};

export { ThemeChanger };
