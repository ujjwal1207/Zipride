import React, { useContext, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const FALLBACK_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s";

const resolveAvatar = (pic) => {
  if (!pic) return FALLBACK_AVATAR;
  if (pic.startsWith("http") || pic.startsWith("blob:")) return pic;
  return `${import.meta.env.VITE_BASE}${pic}`;
};

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  const [preview] = useState(resolveAvatar(captain?.profilePicture));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={preview}
            alt=""
          />
          <div>
            <h4 className="text-lg font-medium capitalize leading-tight">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {captain?.vehicle?.number || "Vehicle"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-semibold">₹295.20</h4>
          <p className="text-sm text-gray-600">Today's Earnings</p>
        </div>
      </div>

      <div className="flex p-4 mt-6 bg-gray-100 rounded-2xl justify-between items-start">
        <div className="text-center flex-1">
          <i className="text-3xl mb-1 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center flex-1 border-x border-gray-200">
          <i className="text-3xl mb-1 font-thin ri-route-line"></i>
          <h5 className="text-lg font-medium">37</h5>
          <p className="text-sm text-gray-600">Total Trips</p>
        </div>
        <div className="text-center flex-1">
          <i className="text-3xl mb-1 font-thin ri-star-line"></i>
          <h5 className="text-lg font-medium">4.8</h5>
          <p className="text-sm text-gray-600">Rating</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
