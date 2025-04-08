import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage';
import SignUpPage from './pages/signUpPage';
import LogInPage from './pages/logInPage';
import SettingsPage from './pages/settingsPage';
import ProfilePage from './pages/profilePage';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import {Loader} from 'lucide-react';

const App = () => {
  const { authUser, checkAuth , isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth]);
  
  console.log({authUser});

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/signup"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LogInPage/> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>

    </div>
  )
}

export default App;



