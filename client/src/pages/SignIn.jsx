import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }

  };
  return (
    <>

      <div className="w-[50%] mx-auto p-4">
        <h1 className="  text-3xl text-center pt-10 text-black font-extrabold">
          Sign In
        </h1>



        <form onSubmit={handleSigninSubmit} className="w-[90%] mx-auto flex flex-col gap-5 mt-10 justify-center ">
          <div>
            <p className='text-red-500 mt-5'>
              {error ? error.message || 'Something went wrong' : ""}
            </p>
          </div>

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
            {loading ? " Loading..." : "Sign In"}
          </button>
          <OAuth/>
        </form>
        <div className="w-[90%] mx-auto flex gap-3 mt-4">
          <p>{`Don't Have an Account?`}</p>
          <Link to="/sign-up">
            <span className="text-blue-500 underline">Sign Up</span>
          </Link>
        </div>

      </div>
    </>
  )
}

export default SignIn