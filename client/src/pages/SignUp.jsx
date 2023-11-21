import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";



const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        // setFormData({});
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
    }

  };

  return (
    <>
      <div className="w-[50%] mx-auto p-4">
        <h1 className="  text-3xl text-center pt-10 text-black font-extrabold">
          Sign Up
        </h1>
        <div>
          {error && (
            <p className="text-red-500 text-center mt-5">
              Something went wrong
            </p>
          )}
        </div>
        <form onSubmit={handleSignupSubmit} className="w-[90%] mx-auto flex flex-col gap-5 mt-10 justify-center ">
          <input
            type="text"
            placeholder="Username"
            id="username"
            className=" bg-slate-100 p-3 rounded"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className=" bg-slate-100 p-3 rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className=" bg-slate-100 p-3 rounded"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            type="submit"
            className=" bg-slate-700 p-3 rounded text-white hover:opacity-90"
          >
            {loading ? " Loading..." : "Sign Up"}
          </button>
          <OAuth/>
        </form>
        <div className="w-[90%] mx-auto flex gap-3 mt-4">
          <p>Have an Account?</p>
          <Link to="/sign-in">
            <span className="text-blue-500 underline">Sign In</span>
          </Link>
        </div>

      </div>
    </>
  );
};

export default SignUp;
