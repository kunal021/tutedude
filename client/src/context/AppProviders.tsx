import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="dark" storageKey="devconnect-ui-theme">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default AppProviders;
