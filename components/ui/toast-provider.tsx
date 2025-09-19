"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast["type"], duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500", 
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  }

  return (
    <div className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 text-white/80 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}