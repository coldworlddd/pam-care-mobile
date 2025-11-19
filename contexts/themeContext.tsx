import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

interface Theme {
  colors: {
    main: string;
    primary: string;
    primary2: string;
    primary3: string;
    primary4: string;
    primary5: string;
    gradientTint:string,
    gradientShade: string,
    secondary: string;
    tertiary: string;
    background: string;
    tabBackground: string;
    cardBackground: string;
    lightCardBackground: string;
    hyperText: string;
    text: string;
    textLight: string;
    textExtraLight: string;
    placeholder: string;
    black: string;
    black3: string;
    black5: string;
    black7: string;
    black8: string;
    white: string;
    buttonBackground: string;
    inputBackground: string;
    yellow: string;
    orange: string;
    green: string;
    lightGreen: string;
    red: string;
    failed: string;
    success: string;
    pending: string;
    shadowColor: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme) {
      setIsDarkTheme(colorScheme === "light" ? false : true);
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Define a base primary color and generate variants
  const basePrimary = isDarkTheme ? "#009321" : "#009321";

  // Utility to add opacity to hex color
  const hexWithAlpha = (hex: string, alpha: number) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const theme: Theme = {
    colors: {
      main: isDarkTheme ? "##404E5C" : "##404E5C",
      primary: basePrimary,
      primary2: hexWithAlpha(basePrimary, 0.8),
      primary3: hexWithAlpha(basePrimary, 0.6),
      primary4: hexWithAlpha(basePrimary, 0.4),
      primary5: hexWithAlpha(basePrimary, 0.2),
      gradientTint:"#55BE5A",
    gradientShade: "#1B3E1C",
      secondary: isDarkTheme ? "#7041FF" : "#F5F5DC",
      tertiary: isDarkTheme ? "#404E5C" : "#404E5C",
      background: isDarkTheme ? "#161E29" : "#ffffff",
      tabBackground: isDarkTheme ? "#0A111B" : "#F8F9FB",
      cardBackground: isDarkTheme ? "#212D3D" : "#EEF1FF",
      lightCardBackground: isDarkTheme ? "#2D4264" : "#dde0ee",
      hyperText: isDarkTheme ? "#8E73D5" : "#1F0047",
      text: isDarkTheme ? "#ffffff" : "#292D32",
      textLight: isDarkTheme ? "#ddd" : "#555",
      textExtraLight: isDarkTheme ? "#ccc" : "#777",
      placeholder: "#aaa",
      black: isDarkTheme ? "#ffffff" : "#292D32",
      black3: isDarkTheme ? "#ffffff" : "#555555",
      black5: isDarkTheme ? "#ffffff" : "#888888",
      black7: isDarkTheme ? "#ffffff" : "#bbbbbb",
      black8: isDarkTheme ? "#ffffff" : "#eeeeee",
      white: "#ffffff",
      buttonBackground: isDarkTheme ? "#7041FF" : "#5338A8",
      inputBackground: isDarkTheme ? "#212D3D" : "#F5F7F7",
      yellow: isDarkTheme ? "#FFFF00" : "#D3BE00",
      orange: isDarkTheme ? "#FE7902" : "#FF5F1F",
      green: isDarkTheme ? "#32C71A" : "#2D9A1C",
      lightGreen: isDarkTheme ? "#32C71A" : "#E5FFE0FF",
      red: isDarkTheme ? "#FF4C4C" : "#ff0000",
      failed: isDarkTheme ? "#FF4C4C" : "#DC3546",
      success: isDarkTheme ? "#32C71A" : "#188754",
      pending: isDarkTheme ? "#FFB800" : "#FFC804",
      shadowColor: isDarkTheme ? "#00000010" : "#00000080",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
