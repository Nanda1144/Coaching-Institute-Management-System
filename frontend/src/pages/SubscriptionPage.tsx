import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdCheckCircle, MdCrown, MdArrowBack, MdPayment, MdInfo } from 'react-icons/md'
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

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [status, setStatus] = useState<SubStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true)
    setError('')
    setSuccess('')
    try {
      const res = await subscriptionService.subscribe(planId)
      if (res.data?.success) {
        setSuccess('Subscribed successfully! Redirecting to payment...')
        const plan = plans.find((p) => p.id === planId)
        if (plan) {
          const upiId = 'owner@upi' // Application owner's UPI ID
          const upiUrl = `upi://pay?pa=${upiId}&pn=AppOwner&am=${plan.price}&tn=Subscription-${plan.name}`
          window.location.href = upiUrl
        }
      }
    } catch {
      setError('Subscription failed. Please try again.')
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
            <MdCrown className="text-yellow-500" /> Subscription
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
      {success && (
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
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={subscribing}
              className="btn btn-primary w-full mt-6"
            >
              {subscribing ? 'Processing...' : `Pay ₹${plan.price}`}
            </button>
          </motion.div>
        ))}
      </div>

      {plans.length === 0 && !loading && (
        <div className="text-center py-16 text-neutral-400">
          <MdCrown size={48} className="mx-auto mb-4 opacity-30" />
          <p>No subscription plans available at this time.</p>
        </div>
      )}
    </div>
  )
}
