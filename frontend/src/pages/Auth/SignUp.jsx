import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper';
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter a valid name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    // SignUp API Call
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password
      })

      // Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      }
      else {
        setError("An unexpected error occured. Please try again!")
      }
    }

  }

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>

      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className='text-5xl font-semibold leading-[58px]'>Join the <br /> Adventure</h4>
            <p className='text-[15px] text-gray-900 leading-6 pr-7 mt-4'>Create an account to start documenting your travels and preserving your memories in your journal.</p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>SignUp</h4>
            <input className='input-box' onChange={({ target }) => { setName(target.value) }} value={name} type="text" placeholder='Full Name' />
            <input className='input-box' onChange={({ target }) => { setEmail(target.value) }} value={email} type="text" placeholder='Email' />
            <PasswordInput onChange={({ target }) => { setPassword(target.value) }} value={password} />
            {
              error && <p className='text-red-500 text-xs pb-1'>{error}</p>
            }
            <button className='btn-primary' type='submit'>Create Account</button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button className="btn-primary btn-light" onClick={() => navigate('/login')} type='submit' >Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp