import React from "react";

function splitAddress(address) {
  if (!address) return ["", ""];
  const [headline, ...rest] = address.split(",");
  return [headline.trim(), rest.join(",").trim()];
}

function LookingforRider(props) {
  const [pickupHeadline, pickupDetails] = splitAddress(props.Pickup);
  const [destinationHeadline, destinationDetails] = splitAddress(
    props.Destination
  );

  const vehicleImages = {
    car: `${import.meta.env.VITE_BASE}/uploads/car.webp`,
    bike: `${import.meta.env.VITE_BASE}/uploads/bike.webp`,
    auto: `${import.meta.env.VITE_BASE}/uploads/auto.webp`,
  };
  const vehicleImageSrc = vehicleImages[props.vehicleType] || vehicleImages.car;

  return (
    <div>
      <h3 className="text-center text-2xl font-semibold mb-5">
        Looking for Nearby Riders
      </h3>
      <div className="flex gap-2 justify-between items-center flex-col">
        <img
          className="h-20"
          src={vehicleImageSrc}
          alt=""
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{pickupHeadline}</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupDetails}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{destinationHeadline}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationDetails}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.fare?.[props.vehicleType] || props.ride?.fare}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash/UPI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LookingforRider;
