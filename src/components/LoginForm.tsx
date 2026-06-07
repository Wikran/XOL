import React, { useState, useRef, useEffect } from 'react';
import '../styles/LoginForm.css';

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

interface UserData {
  aaXXuX: string;
  aaXrXg: string;
  aaXXoX: string;
  asFTNAME: string;
  asDEPT: string;
  asDIV: string;
  asSTFID: string;
  aaDXtm: string;
  aaXpXt: string;
  asEMAIL: string;
  asAct: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost';
  const MAIN_PROJECT = 'main.html';
  const THRESHOLD_ATTEMPTS = 2;

  const generateOTP = (length: number = 6): string => {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  };

  const generateLOTP = (length: number = 8): string => {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  };

  useEffect(() => {
    setGeneratedOTP(generateOTP());
    localStorage.clear();
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.toLowerCase());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleForgotPassword = async () => {
    setErrorMessage('');
    setIsForgotPassword(true);
    setPasswordAttempts(0);
    
    if (username.trim() === '') {
      setErrorMessage('Username cannot be blank!');
      return;
    }

    try {
      await performLogin(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  const handleLogin = async () => {
    setErrorMessage('');
    
    if (passwordAttempts >= THRESHOLD_ATTEMPTS) {
      setShowForgotPassword(true);
    }

    try {
      await performLogin(false);
      setPasswordAttempts(prev => prev + 1);
    } catch (error) {
      console.error('Login error:', error);
      setPasswordAttempts(prev => prev + 1);
    }
  };

  const performLogin = async (isForgot: boolean) => {
    let loginText = '';
    let tableId = '01f518c9-c818-4e9f-85cb-6245ee1a2637';

    if (isForgot) {
      loginText = `IDUsr='${username}'`;
      tableId = '01f518c9-c818-4e9f-85cb-6245ee1a2999';
    } else {
      if (username === '' || password === '') {
        setErrorMessage('Username and Password cannot be blank!!');
        return;
      }
      loginText = `IDUsr='${username}' and Pword='${password}'`;
    }

    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      
      const requestBody = JSON.stringify({ '@': btoa(loginText) });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: requestBody,
        redirect: 'follow'
      };

      const groupId = 'c80bab4d-1578-4b72-82d9-3e4ebe940384';
      const projectId = 'main';
      const url = `${API_BASE_URL}/DMQ/${projectId}/${groupId}/${tableId}/all`;

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (data && data.length > 0) {
        await handleLoginResponse(data[0], isForgot);
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (passwordAttempts >= THRESHOLD_ATTEMPTS) {
        setErrorMessage('Too many login attempts. Please try again later.');
      } else {
        setErrorMessage('Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginResponse = async (userData: any, isForgot: boolean) => {
    const userMatched = (username === userData.IDUsr && isForgot) || 
                        (password === userData.Pword && !isForgot);

    if (!userMatched) {
      setErrorMessage('Invalid credentials');
      return;
    }

    const needsOTP = userData.otp === 'YES' || userData.otp === '' || !userData.Active || isForgot;

    if (needsOTP) {
      setShowOTP(true);
      if (!isForgot) {
        setPassword('');
      } else {
        setUsername('');
      }

      const newOtp = isForgot ? generateLOTP(8) : generateOTP();
      setGeneratedOTP(newOtp);

      try {
        await sendOtpEmail(userData, newOtp, isForgot);
        setErrorMessage('');
        alert('OTP sent to your email: ' + userData.email);
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      completeLogin(userData);
    }
  };

  const sendOtpEmail = async (userData: any, otpCode: string, isForgot: boolean) => {
    const subject = isForgot ? 'FORGOTTEN PASSWORD - OTP = ' + otpCode : 'OTP = ' + otpCode;
    const body = isForgot 
      ? `Dear ${userData.LGName}, Your OTP for password reset is: ${otpCode}`
      : `Dear ${userData.LGName}, Your OTP is: ${otpCode}`;

    console.log('Sending email to:', userData.email);
    console.log('Subject:', subject);
    console.log('Body:', body);
  };

  const completeLogin = (userData: any) => {
    if (otp && otp !== generatedOTP) {
      setErrorMessage('Invalid OTP');
      return;
    }

    localStorage.setItem('aaXXuX', username);
    localStorage.setItem('aaXrXg', btoa(userData.Gright || ''));
    localStorage.setItem('aaXXoX', btoa(userData.Tkey || ''));
    localStorage.setItem('aaXpXt', userData.PictureLoc || '');
    localStorage.setItem('aaDXtm', userData.Kright || 'generic.softblue');
    localStorage.setItem('asFTNAME', userData.Nickname || '');
    localStorage.setItem('asSTFID', userData.Scopebase || '');
    localStorage.setItem('asDEPT', userData.Department || '');
    localStorage.setItem('asDIV', userData.Division || '');
    localStorage.setItem('asEMAIL', userData.email || '');
    localStorage.setItem('asAct', userData.Active || false);

    const usrProperty: UserData[] = [{
      aaXXuX: username,
      aaXrXg: btoa(userData.Gright || ''),
      aaXXoX: btoa(userData.Tkey || ''),
      asFTNAME: userData.Nickname || '',
      asDEPT: userData.Department || '',
      asDIV: userData.Division || '',
      asSTFID: userData.Scopebase || '',
      aaDXtm: userData.Kright || 'generic.softblue',
      aaXpXt: userData.PictureLoc || '',
      asEMAIL: userData.email || '',
      asAct: userData.Active || false
    }];

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(usrProperty),
      'sBxA017'
    ).toString();
    localStorage.setItem('usrProperty', encryptedData);

    onLoginSuccess(usrProperty[0]);
    window.location.href = MAIN_PROJECT;
  };

  const handleKeyPress = (e: React.KeyboardEvent, nextField?: () => void) => {
    if (e.key === 'Enter' && nextField) {
      e.preventDefault();
      nextField();
    }
  };

  return (
    <div className="login-container">
      <div className="logo-bar">
        <img src="./images/locktonlogo70mmwhite.png" alt="Lockton Logo" className="logo" />
        <div className="title">
          <span className="title-left">Expenses Reimburse</span>
          <span className="title-right" id="aUsrName">User Name</span>
          <span className="title-right form-avatar"></span>
        </div>
      </div>

      <div className="login-popup">
        <div className="popup-header">
          <img src="./images/locktonlogo70mmblack.png" alt="Logo" width="85" />
        </div>

        <div className="popup-content">
          {!showOTP ? (
            <>
              <div className="form-group">
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyPress={(e) => handleKeyPress(e, () => passwordRef.current?.focus())}
                  placeholder="Enter username"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <div className="password-input-wrapper">
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={(e) => handleKeyPress(e, () => handleLogin())}
                    placeholder="Enter password"
                    className="form-input"
                    disabled={loading}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {showForgotPassword && (
                <button
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password
                </button>
              )}
            </>
          ) : (
            <div className="form-group">
              <p className="otp-notice">
                Please get OTP from your registered e-Mail, put here and then press [LOGIN]
              </p>
              <input
                ref={otpRef}
                type="text"
                value={otp}
                onChange={handleOtpChange}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                placeholder="Input OTP and press LOGIN"
                className="form-input"
                disabled={loading}
              />
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'LOGIN'}
            <i className="fas fa-key"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;