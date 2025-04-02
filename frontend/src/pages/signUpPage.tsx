import { useAuthStore } from '@/store/authStore';
import { useState } from 'react'

const signUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData , setFormData] = useState({
    fullName:"",
    email:"",
    password:"",
  })
  
  const {signup,isSigningUp} = useAuthStore();

  const validateForm =()=>{

  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      signUpPage
    </div>
  )
}

export default signUpPage
