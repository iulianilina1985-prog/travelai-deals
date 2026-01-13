import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Routes from "./Routes";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
