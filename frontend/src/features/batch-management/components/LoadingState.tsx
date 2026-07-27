interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading batches...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
