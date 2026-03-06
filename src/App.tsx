import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirectHandler from "./components/auth/AuthRedirectHandler";
import AppLayout from "./components/layout/AppLayout";
import HostLayout from "./components/layout/HostLayout";
import Index from "./pages/Index";
import Wishlists from "./pages/Wishlists";
import Trips from "./pages/Trips";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HostToday from "./pages/host/HostToday";
import HostCalendar from "./pages/host/HostCalendar";
import HostListings from "./pages/host/HostListings";
import SearchOverlay from "./pages/SearchOverlay";
import SearchResults from "./pages/SearchResults";
import HostMessages from "./pages/host/HostMessages";
import HostMenu from "./pages/host/HostMenu";
import CreateListing from "./pages/host/CreateListing";
import PartnerOnboarding from "./pages/host/PartnerOnboarding";
import EditListing from "./pages/host/EditListing";
import EditListingTitle from "./pages/host/EditListingTitle";
import EditListingDescription from "./pages/host/EditListingDescription";
import EditAmenities from "./pages/host/EditAmenities";
import EditIntro3 from "./pages/host/EditIntro3";
import EditCalendar from "./pages/host/EditCalendar";
import Chat from "./pages/Chat";
import ListingDetail from "./pages/ListingDetail";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Guest Mode Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/wishlists" element={<ProtectedRoute><Wishlists /></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/search" element={<SearchOverlay />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

            {/* Host Mode Routes */}
            <Route path="/host" element={<HostLayout />}>
              <Route index element={<HostToday />} />
              <Route path="calendar" element={<HostCalendar />} />
              <Route path="listings" element={<HostListings />} />
              <Route path="messages" element={<HostMessages />} />
              <Route path="menu" element={<HostMenu />} />
              <Route path="create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/host/onboarding" element={<PartnerOnboarding />} />
            <Route path="/host/edit/:id" element={<EditListing />} />
            <Route path="/host/edit/:id/title" element={<EditListingTitle />} />
            <Route path="/host/edit/:id/description" element={<EditListingDescription />} />
            <Route path="/host/edit/:id/amenities" element={<EditAmenities />} />
            <Route path="/host/edit/:id/intro3" element={<EditIntro3 />} />
            <Route path="/host/edit/:id/pricing" element={<EditCalendar />} />
            <Route path="/terms" element={<Terms />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
