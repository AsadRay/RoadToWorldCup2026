import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BracketProvider } from "./context/BracketContext";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Toast from "./components/Toast";
import GroupsPage from "./pages/GroupsPage";
import ThirdsPage from "./pages/ThirdsPage";
import BracketPage from "./pages/BracketPage";
import "./styles/global.css";

function Layout() {
  return (
    <>
      <Nav />
      <Hero />
      <Routes>
        <Route path="/" element={<GroupsPage />} />
        <Route path="/thirds" element={<ThirdsPage />} />
        <Route path="/bracket" element={<BracketPage />} />
      </Routes>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BracketProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </BracketProvider>
  );
}
