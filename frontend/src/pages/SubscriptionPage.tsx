import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiCrown } from 'react-icons/gi'
import { MdCheckCircle, MdArrowBack, MdInfo, MdClose } from 'react-icons/md'
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa'
import { subscriptionService } from '../services/subscription.service'

interface Plan {
  id: string
  name: string
  durationDays: number
  price: number
  description: string
  features: string[]
}

interface SubStatus {
  status: string
  daysLeft: number
  isPaused: boolean
  isTrial: boolean
  trialEndsAt: string | null
  endDate: string | null
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [status, setStatus] = useState<SubStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [payingPlan, setPayingPlan] = useState<Plan | null>(null)

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    if (paymentStatus === 'success') setSuccess('Payment successful! Your subscription is now active.')
    else if (paymentStatus === 'failed') setError('Payment failed or was cancelled. Please try again.')
  }, [searchParams])

  useEffect(() => {
    Promise.all([
      subscriptionService.getPlans(),
      subscriptionService.getStatus(),
    ]).then(([plansRes, statusRes]) => {
      setPlans(plansRes.data?.data || [])
      setStatus(statusRes.data?.data || null)
    }).catch(() => setError('Failed to load subscription data'))
      .finally(() => setLoading(false))
  }, [])

  const handleRazorpayPay = async (plan: Plan) => {
    setSubscribing(true)
    setError('')
    setSuccess('')
    try {
      const orderRes = await subscriptionService.createRazorpayOrder(plan.id)
      const { orderId, amount, keyId } = orderRes.data?.data || {}

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: keyId,
          amount: amount * 100,
          currency: 'INR',
          name: 'CIMS Subscription',
          description: `${plan.name} Plan`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              const verifyRes = await subscriptionService.verifyRazorpayPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                planId: plan.id,
              })
              if (verifyRes.data?.success) {
                setSuccess('Payment successful! Your subscription is now active.')
                setPayingPlan(null)
                const statusRes = await subscriptionService.getStatus()
                setStatus(statusRes.data?.data || null)
              }
            } catch {
              setError('Payment verification failed. Please contact support.')
            }
          },
          modal: {
            ondismiss: () => setSubscribing(false),
          },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    } catch {
      setError('Failed to initiate payment. Please try again.')
      setSubscribing(false)
    }
  }

  const handlePhonePePay = async (plan: Plan) => {
    setSubscribing(true)
    setError('')
    setSuccess('')
    try {
      const callbackUrl = `${window.location.origin}/api/subscription/phonepe-callback`
      const orderRes = await subscriptionService.createPhonePeOrder(plan.id, callbackUrl)
      const { redirectUrl } = orderRes.data?.data || {}
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        setError('Failed to get PhonePe payment page. Please try Razorpay.')
      }
    } catch {
      setError('Failed to initiate PhonePe payment. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const isPaused = status?.isPaused

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-2">
            <MdArrowBack size={16} /> Back
          </button>
          <h1 className="gradient-text text-3xl font-bold flex items-center gap-2">
            <GiCrown className="text-yellow-500" /> Subscription
          </h1>
          <p className="text-neutral-500 mt-1">
            {status?.isTrial
              ? `You are on a free trial. ${status.daysLeft} days remaining.`
              : status?.status === 'ACTIVE'
                ? `Your plan is active. ${status.daysLeft} days remaining.`
                : 'Choose a plan to continue using all features.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger flex items-center gap-2">
          <MdInfo size={18} /> {error}
        </div>
      )}
      {success && !payingPlan && (
        <div className="bg-success-light border border-success/20 rounded-lg p-4 text-sm text-success flex items-center gap-2">
          <MdCheckCircle size={18} /> {success}
        </div>
      )}

      {isPaused && (
        <div className="bg-warning-light border border-warning/20 rounded-lg p-4 text-sm text-warning flex items-center gap-2">
          <MdInfo size={18} />
          Your subscription has expired. Some features are paused until you subscribe.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`card p-6 flex flex-col ${idx === 1 ? 'border-2 border-primary ring-2 ring-primary/20' : ''}`}
          >
            {idx === 1 && (
              <span className="text-xs font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full self-start mb-3">
                Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
            <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>
            <div className="mt-4 mb-4">
              <span className="text-3xl font-bold text-neutral-900">₹{plan.price}</span>
              <span className="text-sm text-neutral-400 ml-1">
                / {plan.durationDays >= 365 ? 'year' : plan.durationDays >= 180 ? '6 months' : plan.durationDays >= 90 ? 'quarter' : plan.durationDays >= 30 ? 'month' : `${plan.durationDays} days`}
              </span>
            </div>
            <ul className="space-y-2 flex-1">
              {(plan.features || []).map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <MdCheckCircle className="text-success shrink-0 mt-0.5" size={16} />
                  {feat}
                </li>
              ))}
            </ul>
            <div className="space-y-2 mt-6">
              <button
                onClick={() => setPayingPlan(plan)}
                disabled={subscribing}
                className="btn btn-primary w-full"
              >
                Pay ₹{plan.price}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {plans.length === 0 && !loading && (
        <div className="text-center py-16 text-neutral-400">
          <GiCrown size={48} className="mx-auto mb-4 opacity-30" />
          <p>No subscription plans available at this time.</p>
        </div>
      )}

      {payingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setPayingPlan(null); setSubscribing(false) }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <button onClick={() => { setPayingPlan(null); setSubscribing(false) }} className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <MdClose size={20} />
              </button>
              <GiCrown size={32} className="mb-2" />
              <h2 className="text-xl font-bold">Choose Payment Method</h2>
              <p className="text-blue-100 text-sm mt-1">{payingPlan.name} Plan - ₹{payingPlan.price}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-neutral-500 mb-1">Amount to Pay</p>
                <p className="text-4xl font-bold text-neutral-900">₹{payingPlan.price}</p>
              </div>

              <button
                onClick={() => handleRazorpayPay(payingPlan)}
                disabled={subscribing}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <FaCreditCard className="text-white" size={18} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-neutral-900">Pay with Razorpay</p>
                  <p className="text-xs text-neutral-500">Credit/Debit Card, Net Banking, UPI</p>
                </div>
                {subscribing && <span className="text-sm text-neutral-400">Processing...</span>}
              </button>

              <button
                onClick={() => handlePhonePePay(payingPlan)}
                disabled={subscribing}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                  <FaMobileAlt className="text-white" size={18} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-neutral-900">Pay with PhonePe</p>
                  <p className="text-xs text-neutral-500">PhonePe UPI App</p>
                </div>
              </button>

              <button
                onClick={() => { setPayingPlan(null); setSubscribing(false) }}
                className="w-full text-sm text-neutral-500 py-2 hover:text-neutral-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
