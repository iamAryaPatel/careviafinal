import FloatingAssistant from './components/FloatingAssistant';
import AIAssistant from './pages/AIAssistant';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PlatformNav from './components/PlatformNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { LoadingScreen, PageTransition, ThemeProvider } from './components/MotionSystem';
import './platform.css';
const Home=lazy(()=>import('./pages/Home')); const Jobs=lazy(()=>import('./pages/Jobs')); const JobDetail=lazy(()=>import('./pages/JobDetail')); const Dashboard=lazy(()=>import('./pages/Dashboard')); const Profile=lazy(()=>import('./pages/Profile')); const CompleteProfile=lazy(()=>import('./pages/CompleteProfile')); const Recruiter=lazy(()=>import('./pages/Recruiter')); const Admin=lazy(()=>import('./pages/Admin')); const Auth=lazy(()=>import('./pages/Auth')); const ResetPassword=lazy(()=>import('./pages/ResetPassword'));
function RoutedApp(){const location=useLocation();return <AnimatePresence mode="wait"><PageTransition key={location.pathname}><Suspense fallback={<div className="route-loader"><span/><b>Loading workspace</b></div>}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/jobs" element={<Jobs/>}/><Route path="/jobs/:id" element={<JobDetail/>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route
  path="/ai-assistant"
  element={
    <ProtectedRoute>
      <AIAssistant />
    </ProtectedRoute>
  }
/><Route path="/complete-profile" element={<ProtectedRoute allowIncomplete={true}><CompleteProfile/></ProtectedRoute>}/><Route path="/recruiter" element={<Recruiter/>}/><Route path="/admin" element={<Admin/>}/><Route path="/auth" element={<Auth/>}/><Route path="/login" element={<Auth/>}/><Route path="/reset-password" element={<ResetPassword/>}/></Routes></Suspense></PageTransition></AnimatePresence>}
export default function App(){ 
  const [booting,setBooting]=useState(true);
  useEffect(()=>{
  const id=setTimeout(()=>setBooting(false),850);
  return()=>clearTimeout(id)
  },[]);
  return ( <ThemeProvider>
  <AnimatePresence>{booting&&<LoadingScreen/>}</AnimatePresence>
  <PlatformNav/>
  <RoutedApp/>
  <FloatingAssistant/>
  <Footer/>
</ThemeProvider>
  );
}

