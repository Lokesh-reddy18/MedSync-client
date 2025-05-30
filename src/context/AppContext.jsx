import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

      const currencySymbol = '₹'
      const backendUrl = import.meta.env.VITE_BACKEND_URL

      const [doctors, setDoctors] = useState([])
      const [token, setToken] = useState(localStorage.getItem('utoken') ? localStorage.getItem('utoken') : false)
      const [userData, setUserData] = useState(false)

      // Format currency to Indian Rupees
      const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
            }).format(amount);
      }

      const getDoctorsData = async () => {
            try {
                  const { data } = await axios.get(backendUrl + '/api/doctor/list')
                  if (data.success) {
                        setDoctors(data.doctors)
                  } else {
                        toast.error(data.message)
                  }
            } catch (error) {
                  console.log(error);
                  toast.error(error.message)
            }
      }

      const loadUserProfileData = async (req, res) => {
            try {
                  const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { utoken: token } })
                  if (data.success) {
                        setUserData(data.userData)
                  } else {
                        toast.error(data.message)
                  }

            } catch (error) {
                  console.log(error);
                  toast.error(error.message)
            }
      }

      const value = {
            doctors,
            getDoctorsData,
            currencySymbol,
            formatCurrency,
            token,
            setToken,
            backendUrl,
            userData,
            setUserData,
            loadUserProfileData,
      }

      useEffect(() => {
            getDoctorsData()
      }, [])

      useEffect(() => {
            if (token) {
                  loadUserProfileData()
            } else {
                  setUserData(false)
            }
      }, [token])

      return (
            <AppContext.Provider value={value}>
                  {props.children}
            </AppContext.Provider>
      )
}

export default AppContextProvider
