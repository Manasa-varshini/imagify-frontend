import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [state, setState] = useState('Login'); // Login or Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { setUser, setShowLogin } = useContext(AppContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Login or Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      state === 'Login'
        ? 'https://imagify-backend-3.onrender.com/api/user/login'
        : 'https://imagify-backend-3.onrender.com/api/user/register';

    const payload =
      state === 'Login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowLogin(false);
        alert(`${state} successful`);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!forgotEmail || !newPassword) {
      alert('Please enter both email and new password');
      return;
    }

    try {
      const res = await fetch(
        'https://imagify-backend-3.onrender.com/api/user/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail, newPassword }),
        }
      );

      const data = await res.json();
      console.log('Forgot Password Response:', data);

      if (res.ok) {
        alert('Password reset successful. You can now login.');
        setShowForgotPassword(false);
        setForgotEmail('');
        setNewPassword('');
      } else {
        alert(data.message || 'Password reset failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== 'Login' && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.profile_icon} alt="User Icon"  className="w-4 h-4"  />
            <input
              type="text"
              className="outline-none text-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="Email Icon"  className="w-4 h-4"  />
          <input
            type="email"
            className="outline-none text-sm"
            placeholder="Email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="Lock Icon"  className="w-4 h-4" />
          <input
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p
          className="text-sm text-blue-600 my-4 cursor-pointer"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot password?
        </p>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full"
        >
          {state === 'Login' ? 'Login' : 'Create Account'}
        </button>

        {state === 'Login' ? (
          <p className="mt-5 text-center">
            Don't have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState('Sign Up')}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState('Login')}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm relative">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Reset Password
            </h2>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <button
              onClick={handleForgotPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Reset Password
            </button>

            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotEmail('');
                setNewPassword('');
              }}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
