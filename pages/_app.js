import { createTheme, NextUIProvider, Text } from "@nextui-org/react"

const theme = createTheme({
    type: "dark", // it could be "light" or "dark"
    theme: {
        colors: {
            primary: '#e9314a',
            secondary: '#ffeef0',
            error: '#e54e53',
        },
    }
})
export default function App({ Component, pageProps }) {
    return (
        <NextUIProvider theme={theme}>
            <Component {...pageProps} />
        </NextUIProvider>
    );
}
