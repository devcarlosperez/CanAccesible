import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopRoutes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Takes you to the top of the page
  }, [pathname]);

  return null;
};

export default ScrollToTopRoutes;
