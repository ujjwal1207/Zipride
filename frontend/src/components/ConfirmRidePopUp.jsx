import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ConfirmRidePopUp(props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE}/rides/start-ride`,
        {
          params: { rideId: props.ride._id, otp },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
          },
        }
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: response.data } });
      }
    } catch (err) {
      console.error("Error starting ride:", err);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-full absolute top-0 left-0"
        onClick={() => props.setConfirmRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Confirm this ride to Start</h3>

      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-xl">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname?.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {props.distance != null ? `${props.distance.toFixed(1)} KM` : "..."}
        </h5>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-5 p-3 border-b border-gray-200">
          <i className="text-xl text-gray-700 ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-base font-medium">Pickup Location</h3>
            <p className="text-sm text-gray-600">{props.ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3 border-b border-gray-200">
          <i className="text-xl text-gray-700 ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-base font-medium">Destination</h3>
            <p className="text-sm text-gray-600">{props.ride?.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3">
          <i className="text-xl text-gray-700 ri-currency-line"></i>
          <div>
            <h3 className="text-base font-medium">₹{props.ride?.fare}</h3>
            <p className="text-sm text-gray-600">Cash / Online</p>
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler} className="mt-6">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          inputMode="numeric"
          className="bg-gray-100 px-6 py-4 font-mono text-lg rounded-xl w-full"
          placeholder="Enter OTP"
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <button className="w-full mt-4 text-lg bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-xl">
          Confirm
        </button>
        <button
          type="button"
          onClick={() => props.setConfirmRidePopupPanel(false)}
          className="w-full mt-2 text-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 rounded-xl"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ConfirmRidePopUp;
