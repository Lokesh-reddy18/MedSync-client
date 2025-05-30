import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PaymentSuccess = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        navigate('/my-appointments')
        return
      }

      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/verify-payment',
          { sessionId },
          { headers: { utoken: token } }
        )

        if (data.success) {
          toast.success('Payment successful!')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }

      navigate('/my-appointments')
    }

    verifyPayment()
  }, [searchParams, navigate, backendUrl, token])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processing Payment...</h2>
        <p className="text-gray-600">Please wait while we verify your payment.</p>
      </div>
    </div>
  )
}

export default PaymentSuccess 