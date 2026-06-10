import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password,
    };

    const response = await axios.post(
  `${import.meta.env.VITE_BASE}/captains/login`,
  captain
);

    if (response.status === 200) {
      const data = response.data;

      setCaptain(data.captain);
      localStorage.setItem("captaintoken", data.captaintoken);
      navigate("/captain-start");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-20 mb-6" src="/zipride captain.png" alt="Zipride Captain" />

        <form onSubmit={(e) => submitHandler(e)}>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 mb-6 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            className="bg-gray-100 mb-6 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
          />

          <button className="bg-black text-white font-semibold mb-3 rounded-xl px-4 py-3 w-full text-base hover:bg-gray-800 transition-colors">
            Login
          </button>
        </form>
        <p className="text-center text-gray-600">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-black font-medium hover:underline">
            Register as a Captain
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/login"
          className="bg-black flex items-center justify-center text-white font-semibold mb-5 rounded-xl px-4 py-3 w-full text-base hover:bg-gray-800 transition-colors"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};
export default Captainlogin;
