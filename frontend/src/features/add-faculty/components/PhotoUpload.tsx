import { useState, useCallback } from 'react'
import { MdCameraAlt, MdClose } from 'react-icons/md'
import type { FieldError } from 'react-hook-form'

interface PhotoUploadProps {
  value: string
  onChange: (value: string) => void
  error?: FieldError
}

export default function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>(value)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        setPreview(dataUrl)
        onChange(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }, [onChange])

  const handleRemove = useCallback(() => {
    setPreview('')
    onChange('')
  }, [onChange])

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        Photo Upload
      </label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <MdCameraAlt className="text-2xl text-gray-400" />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
            >
              <MdClose className="text-xs" />
            </button>
          )}
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <MdCameraAlt className="text-base" />
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  )
}
