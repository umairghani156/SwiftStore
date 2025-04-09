import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordAPi } from '../api/authApi';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintPosition, setHintPosition] = useState({ x: 50, y: 50 });
  const [animateCharacter, setAnimateCharacter] = useState(false);
  
  // Animation triggers
  useEffect(() => {
    // Trigger character animation periodically
    const animInterval = setInterval(() => {
      setAnimateCharacter(true);
      setTimeout(() => setAnimateCharacter(false), 1200);
    }, 5000);
    
    // Initial animation
    setTimeout(() => setAnimateCharacter(true), 500);
    setTimeout(() => setAnimateCharacter(false), 1700);
    
    return () => clearInterval(animInterval);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setFormError('Please enter your email address');
      shakeForm();
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address');
      shakeForm();
      return;
    }
    
    setFormError('');
    setIsLoading(true);
    console.log('Email:', email);
    const data = await resetPasswordAPi(email);
    console.log("Data", data);
    if(!data.status){
      setFormError(data.response.data.message || 'An error occurred. Please try again.');
      shakeForm();
      setIsLoading(false);
      return;
    }
    if(data.status){
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        setAnimateCharacter(true);
      }, 1500);
    }
    
    // Simulate API call
   
  };
  
  const shakeForm = () => {
    const form = document.getElementById('password-form');
    form.classList.add('shake-animation');
    setTimeout(() => {
      form.classList.remove('shake-animation');
    }, 500);
  };
  
  const showRandomHint = (e) => {
    const hints = [
      "Try the email you used when signing up",
      "Check for typos in your email",
      "We'll send a secure reset link to this address",
      "Can't remember? Try contacting support",
      "Your password reset link will expire in 24 hours"
    ];
    
    setHintText(hints[Math.floor(Math.random() * hints.length)]);
    setHintPosition({ x: e.clientX, y: e.clientY });
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };
  
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='h-[80vh] w-[90%] max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row relative'>
        {/* Floating hint bubble */}
        {showHint && (
          <div 
            className="absolute z-10 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm max-w-xs animate-fade-in"
            style={{ 
              left: `${Math.min(Math.max(hintPosition.x - 100, 10), window.innerWidth - 220)}px`,
              top: `${Math.min(Math.max(hintPosition.y - 100, 10), window.innerHeight - 100)}px`
            }}
          >
            {hintText}
            <div className="absolute w-3 h-3 bg-blue-900 transform rotate-45 -bottom-1 left-1/2 -ml-1.5"></div>
          </div>
        )}
        
        {/* Form Section */}
        <div className='w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center'>
          <div id="password-form" className='max-w-md mx-auto w-full transition-all duration-300'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Forgot Password?</h1>
            <p className='text-gray-600 mb-8'>
              Don't worry! It happens to the best of us. Enter your email and we'll help you get back in.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className='mb-6 relative'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formError) setFormError('');
                      }}
                      onMouseEnter={showRandomHint}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder='your@email.com'
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                  {formError && (
                    <p className="mt-2 text-sm text-red-600">
                      {formError}
                    </p>
                  )}
                </div>
                
                <button
                  type='submit'
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            ) : (
              <div className='p-6 bg-green-50 border border-green-100 rounded-lg animate-fade-in'>
                <div className='flex items-center mb-4'>
                  <svg className='w-6 h-6 text-green-500 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  <h3 className='text-lg font-medium text-green-800'>Check your email</h3>
                </div>
                <p className='text-green-700 mb-4'>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className='text-sm text-green-600 mb-4'>
                  If you don't see it in your inbox, please check your spam folder.
                </p>
                <div className="w-full bg-white p-3 rounded-md border border-green-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Tip:</span> For security reasons, the reset link will expire in 24 hours.
                  </p>
                </div>
              </div>
            )}
            
            <div className='text-left mt-1'>
              <Link 
                to='/login' 
                className='text-blue-600 hover:text-blue-800 font-medium transition-colors'
              >
                Back to Login
              </Link>
              <span className="inline-block mx-3 text-gray-300">|</span>
              <Link 
                to='/help' 
                className='text-blue-600 hover:text-blue-800 font-medium transition-colors'
              >
                Need Help?
              </Link>
            </div>
          </div>
        </div>
        
        {/* Interactive Illustration Section */}
        <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden justify-center items-center'>
          {/* Person forgetting password illustration */}
          <div className={`relative w-4/5 h-4/5 transition-all duration-700 transform ${animateCharacter ? 'scale-105' : 'scale-100'}`}>
            {/* Head */}
            <div className="absolute w-32 h-32 bg-amber-200 rounded-full left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/4 shadow-md z-20">
              {/* Face */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 w-16 flex justify-between">
                {/* Eyes */}
                <div className={`w-3 h-${animateCharacter ? '1' : '3'} bg-gray-800 rounded-full transition-all duration-200`}></div>
                <div className={`w-3 h-${animateCharacter ? '1' : '3'} bg-gray-800 rounded-full transition-all duration-200`}></div>
              </div>
              {/* Mouth */}
              <div className={`absolute left-1/2 top-2/3 transform -translate-x-1/2 w-8 h-${animateCharacter ? '4' : '2'} rounded-full border-2 border-gray-800 ${animateCharacter ? 'border-t-0' : 'border-b-0'} transition-all duration-200`}></div>
              
              {/* Hair */}
              <div className="absolute w-36 h-20 bg-amber-700 rounded-t-full -top-4 -left-2 z-10"></div>
            </div>
            
            {/* Body */}
            <div className="absolute w-40 h-48 bg-blue-500 rounded-t-3xl left-1/2 top-1/3 transform -translate-x-1/2 z-10">
              {/* Shirt pattern */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-blue-400 rounded-full"></div>
            </div>
            
            {/* Arm scratching head - animated */}
            <div className={`absolute w-8 h-24 bg-amber-200 rounded-full top-1/3 right-1/4 origin-bottom transform ${animateCharacter ? 'rotate-[-60deg]' : 'rotate-[-90deg]'} transition-all duration-500 ease-in-out z-30`}>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full z-10"></div>
              {/* Hand */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-200 rounded-full z-20"></div>
            </div>
            
            {/* Other arm */}
            <div className="absolute w-8 h-24 bg-amber-200 rounded-full top-1/3 left-1/4 transform -rotate-12 z-10">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
            </div>
            
            {/* Question marks floating around */}
            <div className={`absolute -top-4 right-1/4 text-3xl text-blue-600 transform transition-all duration-500 ${animateCharacter ? 'translate-y-[-10px] opacity-100' : 'translate-y-0 opacity-40'}`}>?</div>
            <div className={`absolute -top-8 right-1/3 text-4xl text-indigo-500 transform transition-all duration-700 delay-100 ${animateCharacter ? 'translate-y-[-15px] opacity-100' : 'translate-y-0 opacity-30'}`}>?</div>
            <div className={`absolute top-0 right-1/2 text-5xl text-blue-700 transform transition-all duration-600 delay-200 ${animateCharacter ? 'translate-y-[-12px] opacity-100' : 'translate-y-0 opacity-50'}`}>?</div>
            
            {/* Thought bubble */}
            <div className={`absolute top-8 right-10 transition-all duration-500 transform ${animateCharacter ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}`}>
              <div className="w-4 h-4 bg-white rounded-full absolute bottom-1 left-10"></div>
              <div className="w-6 h-6 bg-white rounded-full absolute bottom-4 left-6"></div>
              <div className="w-32 h-20 bg-white rounded-2xl p-2 text-xs flex items-center justify-center text-center">
                <span className={`text-gray-500 font-medium transition-opacity duration-300 ${animateCharacter ? 'opacity-100' : 'opacity-50'}`}>
                  What was my password again?
                </span>
              </div>
            </div>
            
            {/* Lock icon */}
            <div className={`absolute bottom-10 left-1/4 transition-all duration-700 transform ${animateCharacter ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}`}>
              <div className="w-16 h-12 bg-gray-700 rounded-lg relative">
                <div className="w-8 h-8 rounded-full border-4 border-gray-700 absolute -top-6 left-1/2 transform -translate-x-1/2"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <h2 className="text-xl font-semibold text-blue-800">Can't Remember Your Password?</h2>
            <p className="text-blue-600 mt-2 px-6">
              Don't worry, we'll help you get back in!
            </p>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-40"></div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ForgetPassword;