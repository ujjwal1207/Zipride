import React from "react";

function VehiclePanel(props) {
  if (!props.fare) {
    return <div className="text-center py-8">Loading fares...</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>
      <div
        onClick={() => {
          props.selectVehicleType('car')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src={`${import.meta.env.VITE_BASE}/uploads/car.webp`}
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            ZipzapGo
            <span className="ml-2 text-sm text-gray-600">
              <i className="ri-user-3-fill"></i> 4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.car}</h2>
      </div>
      <div
        onClick={() => {
          props.selectVehicleType('bike')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src={`${import.meta.env.VITE_BASE}/uploads/bike.webp`}
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            Zipbike
            <span className="ml-2 text-sm text-gray-600">
              <i className="ri-user-3-fill"></i> 2
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.bike}</h2>
      </div>
      <div
        onClick={() => {
          props.selectVehicleType('auto')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src={`${import.meta.env.VITE_BASE}/uploads/auto.webp`}
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            ZipAuto
            <span className="ml-2 text-sm text-gray-600">
              <i className="ri-user-3-fill"></i> 3
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.auto}</h2>
      </div>
    </div>
  );
}

export default VehiclePanel;
