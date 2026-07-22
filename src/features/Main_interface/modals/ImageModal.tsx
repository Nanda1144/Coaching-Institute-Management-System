import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { useState } from 'react'
import IconButton from '../components/IconButton'
import { modalOverlay } from '../animations/variants'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
}

export default function ImageModal({ isOpen, onClose, src, alt = 'Image' }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.25))
  const rotate = () => setRotation((r) => r + 90)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <div className="relative z-10 flex flex-col items-center gap-4 p-4 max-w-4xl w-full">
            <motion.img
              src={src}
              alt={alt}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl cursor-zoom-in"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
              onClick={zoomIn}
            />

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              <IconButton
                icon={<ZoomIn size={18} />}
                label="Zoom in"
                variant="glass"
                size="sm"
                onClick={zoomIn}
              />
              <IconButton
                icon={<ZoomOut size={18} />}
                label="Zoom out"
                variant="glass"
                size="sm"
                onClick={zoomOut}
              />
              <IconButton
                icon={<RotateCw size={18} />}
                label="Rotate"
                variant="glass"
                size="sm"
                onClick={rotate}
              />
              <div className="w-px h-6 bg-white/20 mx-1" />
              <IconButton
                icon={<X size={18} />}
                label="Close"
                variant="glass"
                size="sm"
                onClick={onClose}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
