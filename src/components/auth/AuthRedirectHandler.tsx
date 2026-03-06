import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Handles post-authentication redirects:
 * - Magic link hash fragments (#access_token=...)
 * - Redirect after SIGNED_IN when email is confirmed
 * - Prevents verification loop by checking email_confirmed_at
 */
const AuthRedirectHandler = () => {
  const { user, profile, loading, isEmailConfirmed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (loading || hasRedirected.current) return;

    // If user is signed in and email is confirmed, redirect away from auth pages
    if (user && isEmailConfirmed) {
      const authPages = ["/login", "/signup"];
      const isOnAuthPage = authPages.includes(location.pathname);
      
      // Also handle hash fragment redirects (magic link callback)
      const hasHashToken = window.location.hash.includes("access_token");

      if (isOnAuthPage || hasHashToken) {
        hasRedirected.current = true;
        
        // Clear the hash to prevent re-processing
        if (hasHashToken) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }

        // Redirect based on profile completeness
        if (!profile?.full_name) {
          navigate("/host/onboarding", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, profile, loading, isEmailConfirmed, location.pathname, navigate]);

  // Handle the specific case where user lands on onboarding page via magic link
  useEffect(() => {
    if (loading || hasRedirected.current) return;

    const hasHashToken = window.location.hash.includes("access_token");
    if (hasHashToken && user && isEmailConfirmed) {
      hasRedirected.current = true;
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      
      if (!profile?.full_name) {
        navigate("/host/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, isEmailConfirmed, loading, navigate, profile]);

  return null;
};

export default AuthRedirectHandler;
