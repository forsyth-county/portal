import { useEffect, useState } from "react";
import Toastify from "toastify-js";
import { schoolLocations, getDistance } from "./schoolGeo";

export function WelcomeNotification() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || shown) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = null;
        let minDist = Infinity;
        schoolLocations.forEach((school) => {
          const dist = getDistance(latitude, longitude, school.lat, school.lng);
          if (dist < minDist) {
            minDist = dist;
            closest = school.name;
          }
        });
        if (minDist < 20 && closest) {
          Toastify({
            text: `Welcome ${closest}!`,
            duration: 6000,
            gravity: "top",
            position: "center",
            backgroundColor: "#4caf50",
            stopOnFocus: true,
          }).showToast();
          setShown(true);
        }
      },
      (error) => {
        // Permission denied or error: do nothing or show generic
        // Toastify({ text: "Welcome!", ... })
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [shown]);

  return null;
}
