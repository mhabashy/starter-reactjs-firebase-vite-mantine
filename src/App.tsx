import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, FirestoreProvider, StorageProvider, useFirebaseApp } from "reactfire";
import Page404 from "./components/404";
import { Placeholder } from "./components/Placeholder";
import { Home } from "./home/Home";
import { Login } from "./login/Login";
import { LoginIndex } from "./login/LoginIndex";
import { Settings } from "./settings/Settings";
import { userStore } from "./store/userStore";

function App() {

  // COLOR SCHEME
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
  setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  useHotkeys([['mod+J', () => toggleColorScheme()]]);
  // END COLOR SCHEME

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const storage = getStorage(app);
  const firestoreInstance = getFirestore(app);
  const uid = userStore((state: any) => state.uid);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestoreInstance}>
        {/* Might not need storage for all projects */}
        <StorageProvider sdk={storage}>
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
              <NotificationsProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginIndex />}>
                      <Route index element={<Login />} />
                    </Route>
                    {uid && <Route path="/" element={<Home />} >
                      <Route index element={<Placeholder />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>}
                    {!uid && <Route path="/" element={<Navigate to="/login" />} />}
                    <Route path="*" element={<Page404 />} />
                  </Routes>
                </BrowserRouter>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  )
}

export default App
