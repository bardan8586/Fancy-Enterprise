import { useState } from "react";
import { Link } from "react-router-dom";
import register from "../assets/register.webp";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered In:", { email, password });
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Fancy</h2>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-center">Hey there 👋 </h2>
          <p className="mb-6 text-center">
            Enter your details below to register
          </p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Register
          </button>

          <p className="mt-6 text-sm text-center">
            Already have an account?
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden w-1/2 bg-gray-800 md:block">
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src={register}
            alt="Login to Account"
            className="object-cover w-full h-[750px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
