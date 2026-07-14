import { motion } from 'framer-motion'
import { MdVideocam, MdVideocamOff, MdCameraAlt } from 'react-icons/md'
import type { RecognitionStatusType } from '../types/faceRecognition.types'

interface CameraPreviewProps {
  isCameraOn: boolean
  onStartCamera: () => void
  onStopCamera: () => void
  onCapture: () => void
  status: RecognitionStatusType
}

const statusMessages: Record<RecognitionStatusType, string> = {
  waiting: 'Camera ready',
  detecting: 'Detecting face...',
  detected: 'Face detected!',
  marked: 'Attendance marked successfully!',
  failed: 'Recognition failed. Please try again.',
}

export default function CameraPreview({ isCameraOn, onStartCamera, onStopCamera, onCapture, status }: CameraPreviewProps) {
  const isActive = isCameraOn && status !== 'waiting'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCameraOn ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isCameraOn ? <MdVideocam className="text-green-600 text-lg" /> : <MdVideocamOff className="text-gray-400 text-lg" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Camera Preview</h3>
          <p className="text-xs text-gray-500">{statusMessages[status]}</p>
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-green-700">Live</span>
          </motion.div>
        )}
      </div>

      <div className="p-5">
        <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-[4/3] flex items-center justify-center">
          {isCameraOn ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MdVideocam className="text-6xl text-gray-600 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-gray-500 text-xs">Camera Feed Preview</p>
                  <p className="text-gray-600 text-[10px] mt-1">(Camera placeholder)</p>
                </div>

                {status === 'detecting' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-1/4 left-1/4 right-1/4 h-1/2 border-2 border-cyan-400/60 rounded-xl">
                      <motion.div
                        className="absolute -top-0.5 left-0 right-0 h-1 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                  </motion.div>
                )}

                {status === 'detected' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-1/4 left-1/4 right-1/4 h-1/2 border-2 border-green-400 rounded-xl shadow-lg shadow-green-400/30">
                      <div className="absolute -top-0.5 left-0 right-0 h-1 bg-green-400 shadow-lg shadow-green-400/50" />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <svg className="w-16 h-16 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {status === 'marked' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-green-900/40 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-center"
                    >
                      <svg className="w-20 h-20 text-green-400 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <p className="text-green-300 text-sm font-medium mt-2">Attendance Marked</p>
                    </motion.div>
                  </motion.div>
                )}

                {status === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-red-900/40 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ x: [-4, 4, -4] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        <MdVideocamOff className="text-6xl text-red-400 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-red-300 text-sm font-medium">Recognition Failed</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <MdVideocamOff className="text-6xl text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Camera is off</p>
              <p className="text-gray-500 text-xs mt-1">Click "Start Camera" to begin</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          {!isCameraOn ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <MdVideocam className="text-lg" />
              Start Camera
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStopCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all"
              >
                <MdVideocamOff className="text-lg" />
                Stop Camera
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCapture}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                <MdCameraAlt className="text-lg" />
                Capture Image
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
