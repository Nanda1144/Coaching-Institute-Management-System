import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import Toast from '../components/Toast'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning'
}

interface ToastContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastItem['type']) => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message, type }])
    },
    []
  )

  const showSuccess = useCallback((message: string) => addToast(message, 'success'), [addToast])
  const showError = useCallback((message: string) => addToast(message, 'error'), [addToast])
  const showWarning = useCallback((message: string) => addToast(message, 'warning'), [addToast])

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            isVisible={true}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
