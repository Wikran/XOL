import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm';

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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const handleLoginSuccess = (user: UserData) => {
    setUserData(user);
    setIsLoggedIn(true);
    console.log('User logged in:', user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.clear();
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Expenses Reimbursement System (XOL)</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="welcome-message">
            <h2>Welcome, {userData?.asFTNAME || userData?.aaXXuX}!</h2>
            <div className="user-info">
              <p><strong>Username:</strong> {userData?.aaXXuX}</p>
              <p><strong>Department:</strong> {userData?.asDEPT}</p>
              <p><strong>Division:</strong> {userData?.asDIV}</p>
              <p><strong>Email:</strong> {userData?.asEMAIL}</p>
              <p><strong>Status:</strong> {userData?.asAct ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;