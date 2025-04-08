import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material";
import { Be_Vietnam_Pro } from "next/font/google";
import Providers from "./providers";
import theme from "@/theme";

import "./global.css";
import styles from "./styles.module.scss";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export default function RootLayout({ children }: TProps) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <body className={styles.body}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

type TProps = Readonly<{
  children: React.ReactNode;
}>;
