
import { useColorScheme } from "react-native";

export default function useTheme(){
    const systemTheme = useColorScheme()
    const theme = systemTheme ?? 'dark'
    return theme
}
    