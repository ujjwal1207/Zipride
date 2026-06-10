import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import RidePopUp from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import CaptainDetails from "../components/CaptainDetails";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking";

function CaptainStart() {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [distanceToPickup, setDistanceToPickup] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", { userId: captain._id, userType: "captain" });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            captainId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    const handleNewRide = (data) => {
      setRide(data);
      setDistanceToPickup(null);
      // A new ride request only ever opens the accept/ignore popup.
      setConfirmRidePopupPanel(false);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride", handleNewRide);
    };
  }, [socket, captain]);

  // Captain accepted the ride: confirm with the backend, and only then
  // move from the accept/ignore popup to the OTP (confirm) panel.
  async function confirmRide() {
    if (!ride || !captain?._id) {
      console.error("Ride or captain data is missing");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE}/rides/confirm`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
          },
        }
      );
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
      alert("Could not accept the ride. It may have been taken already.");
      setRidePopupPanel(false);
    }
  }

  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Live map background */}
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickup={ride?.pickup}
          destination={ride?.destination}
          onDistanceToPickupChange={setDistanceToPickup}
          authToken={localStorage.getItem("captaintoken")}
        />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-5">
        <img className="w-16 drop-shadow-md" src="/zipride captain.png" alt="Zipride" />
        <div className="flex items-center gap-3">
          <Link
            to="/captain-profile"
            className="h-11 w-11 bg-white shadow-md flex items-center justify-center rounded-full"
          >
            <i className="text-xl text-gray-700 ri-user-line"></i>
          </Link>
          <Link
            to="/captain-login"
            className="h-11 w-11 bg-white shadow-md flex items-center justify-center rounded-full"
          >
            <i className="text-xl text-gray-700 ri-logout-box-r-line"></i>
          </Link>
        </div>
      </div>

      {/* Captain details card overlaying the bottom of the map */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-6">
        <CaptainDetails />
      </div>

      {/* Accept / ignore popup */}
      <div
        ref={ridePopupPanelRef}
        className="fixed left-0 right-0 z-30 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.2)] px-5 pt-8 pb-8"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          confirmRide={confirmRide}
          distance={distanceToPickup}
        />
      </div>

      {/* OTP / confirm panel (only after the captain accepts) */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed left-0 right-0 h-screen z-40 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.2)] px-5 pt-10 pb-8"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          distance={distanceToPickup}
        />
      </div>
    </div>
  );
}

export default CaptainStart;
