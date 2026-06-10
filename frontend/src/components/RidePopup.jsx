import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-full absolute top-0 left-0"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

      <div className="flex items-center justify-between p-4 bg-yellow-400 rounded-xl">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user?.fullname?.firstname}{" "}
            {props.ride?.user?.fullname?.lastname}
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
            <h3 className="text-base font-medium">Pickup</h3>
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
            <p className="text-sm text-gray-600">Cash / UPI</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={() => props.confirmRide()}
          className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer text-white font-semibold py-3 rounded-xl"
        >
          Accept
        </button>
        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="w-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-gray-700 font-semibold py-3 rounded-xl"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
