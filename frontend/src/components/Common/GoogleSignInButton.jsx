import { useEffect, useRef, useState } from "react";

const GoogleSignInButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);
  const googleScriptLoaded = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    if (!googleScriptLoaded.current) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleScriptLoaded.current = true;
        // Small delay to ensure Google API is fully ready
        setTimeout(initializeGoogleSignIn, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services script");
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    function initializeGoogleSignIn() {
      if (!window.google || !window.google.accounts) {
        console.error("Google Identity Services script not loaded");
        return;
      }
      
      if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        console.error("Google Client ID not configured");
        return;
      }
      
      if (!buttonRef.current) {
        console.error("Button ref not available");
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render the button - make it visible and clickable
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          locale: "en",
          shape: "rectangular",
        });
        
        setIsInitialized(true);
        console.log("Google Sign-In button initialized successfully");
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    }

    function handleCredentialResponse(response) {
      console.log("Google credential response received");
      if (response && response.credential) {
        onSuccess(response.credential);
      } else {
        console.error("No credential in response:", response);
      }
    }

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, [onSuccess]);

  return (
    <div 
      className="w-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect - animated on hover */}
      <div 
        className={`
          absolute -inset-1 rounded-xl transition-all duration-500 ease-out
          ${isHovered 
            ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-60 blur-xl scale-105 animate-pulse' 
            : 'bg-blue-400/20 blur-md opacity-30 scale-100'
          }
        `}
      ></div>
      
      {/* Additional glow layers for depth */}
      {isHovered && (
        <>
          <div className="absolute -inset-0.5 rounded-xl bg-blue-300/40 blur-lg opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-blue-200/30 blur-sm"></div>
        </>
      )}
      
      {/* Google's button container - fully visible and clickable */}
      <div 
        className={`
          relative w-full rounded-xl overflow-hidden
          transition-all duration-300 ease-out
          ${isHovered 
            ? 'ring-2 ring-blue-400/60 ring-offset-2 ring-offset-white shadow-[0_0_30px_rgba(59,130,246,0.6)] transform scale-[1.01]' 
            : 'ring-1 ring-gray-200 shadow-lg hover:shadow-xl'
          }
        `}
        style={{ minHeight: '48px' }}
      >
        {/* Google's actual button - rendered here */}
        <div 
          ref={buttonRef} 
          className="w-full"
          style={{ 
            minHeight: '48px'
          }}
        ></div>
      </div>
    </div>
  );
};

export default GoogleSignInButton;
