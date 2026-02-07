import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HostLayout from "./components/layout/HostLayout";
import Index from "./pages/Index";
import Wishlists from "./pages/Wishlists";
import Trips from "./pages/Trips";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import HostToday from "./pages/host/HostToday";
import HostCalendar from "./pages/host/HostCalendar";
import HostListings from "./pages/host/HostListings";
import SearchOverlay from "./pages/SearchOverlay";
import SearchResults from "./pages/SearchResults";
import HostMessages from "./pages/host/HostMessages";
import HostMenu from "./pages/host/HostMenu";
import CreateListing from "./pages/host/CreateListing";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Guest Mode Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/wishlists" element={<Wishlists />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/search" element={<SearchOverlay />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/chat" element={<Chat />} />

          {/* Host Mode Routes */}
          <Route path="/host" element={<HostLayout />}>
            <Route index element={<HostToday />} />
            <Route path="calendar" element={<HostCalendar />} />
            <Route path="listings" element={<HostListings />} />
            <Route path="messages" element={<HostMessages />} />
            <Route path="menu" element={<HostMenu />} />
            <Route path="create-listing" element={<CreateListing />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
