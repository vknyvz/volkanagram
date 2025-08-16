import React, {useState, useRef, useEffect} from 'react'
import {ImagePlus, MapPin, ArrowLeft, X} from 'lucide-react'
import {useUser} from "@/hooks/useUser"
import Image from "next/image"
import {getUserImageUrl} from '@/utils/imageHelpers'
import Avatar from "@/components/ui/Avatar"
import Loader from "@/components/ui/loader/Loader"
import {useRouter} from "next/navigation"
import {DefaultPostForm} from "@/types/post"
import {handleApiError} from "@/utils/errorHandler"
import {UPLOADER_CONFIG} from "@/config"
import {uploaderService} from "@/services/uploaderService"
import {postService} from "@/services/postService"

const CreatePostModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [sharing, setSharing] = useState<boolean>(false)
  const [sharingState, setSharingState] = useState<string>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const user = useUser()
  const [form, setForm] = useState(DefaultPostForm)
  const router = useRouter()
  const [showValidation, setShowValidation] = useState<boolean>(false)

  useEffect(() => {
    if (sharingState === 'loading') {
      const checkmarkTimer = setTimeout(() => setSharingState('checkmark'), 4000)
      return () => clearTimeout(checkmarkTimer)
    }

    if (sharingState === 'checkmark') {
      const completeTimer = setTimeout(() => setSharingState('complete'), 4000)
      return () => clearTimeout(completeTimer)
    }
  }, [sharingState])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 768 && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    if (sharingState === 'complete') {
      const closeTimer = setTimeout(() => {
        setSelectedImage(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        setSharing(false)
        setSharingState('idle')

        onClose()
      }, 1000)

      return () => clearTimeout(closeTimer)
    }
  }, [sharingState, onClose, router])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result)
        }
      }
      reader.readAsDataURL(file)

      await handlePhotoUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files

    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result)
        }
      }
      reader.readAsDataURL(file)

      await handlePhotoUpload(file)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    if (!file) {
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append(UPLOADER_CONFIG.FILE_NAME, file)

      const res = await uploaderService.upload('post-pictures', formData)

      if (res.data.success) {
        setForm(prev => ({
          ...prev,
          photo_url: res.data.data.image
        }))
      }
    } catch (e: unknown) {
      handleApiError(e)

    } finally {
      setUploading(false)
    }
  }

  const handleShare = async () => {
    setShowValidation(true)

    if (selectedImage) {
      setSharing(true)
      setSharingState('loading')

      try {
        await postService.create({
          photo_url: form?.photo_url,
          caption: form?.caption,
          location: form?.location,
        })
      } catch (e: unknown) {
        handleApiError(e)

        setSharing(false)
        setSharingState('idle')
      }
    } else {
      console.log('Please select an image to share')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}))
  }

  const goBack = () => {
    setSelectedImage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/45 md:flex md:items-center md:justify-center md:p-4 z-50 font-sans text-xs">
      <div
        ref={modalContentRef}
        className="w-full h-full md:w-full md:max-w-4xl md:h-auto md:max-h-[90vh] md:rounded-sm md:shadow-2xl flex flex-col overflow-hidden bg-white"
      >
        <div className="border-b border-gray-200 p-2 flex items-center justify-between bg-white">
          {selectedImage ? (
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10"></div>
          )}

          <h2 className="font-semibold text-gray-800 text-base">
            {selectedImage ? 'Create New Post' : 'Add a Photo'}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 -mr-2 md:hidden"
          >
            <X size={20} />
          </button>

          {!selectedImage && (
            <button
              onClick={onClose}
              className="hidden md:block text-gray-600 hover:text-gray-900 p-2 -mr-2"
            >
              <X size={20} />
            </button>
          )}

          {selectedImage && (
            <div className="w-10 hidden md:block"></div>
          )}
        </div>

        {sharing && (
          <div className="absolute top-12 left-0 right-0 bottom-0 bg-black/20 flex items-center justify-center z-10">
            <Loader
              fullScreen={true}
              size={64}
              stage={sharingState}
              message="Your post has been shared" />
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-grow bg-transparent overflow-hidden">
          <div
            className={`flex-1 md:w-3/5 flex items-center justify-center text-gray-600 overflow-hidden ${uploading ? 'bg-gray-50/45' : 'bg-gray-50'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected CreatePost Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <ImagePlus size={64} className="text-gray-400" />

                <p className="mt-4 font-semibold text-lg text-gray-700">Drag photos and videos here</p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
                >
                  Select from computer
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}
          </div>

          <div className="flex-1 md:w-2/5 p-3 flex flex-col bg-white text-sm overflow-y-auto">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {user.profilePicture ? (
                  <Image
                    src={getUserImageUrl(user.profilePicture)}
                    width={40}
                    height={40}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar string={user.fullName} />
                )}
              </div>
              <span className="font-semibold text-gray-800">{user.username}</span>
            </div>

            <textarea
              required
              className={`w-full p-3 text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200 flex-1 min-h-32 md:max-h-48 overflow-y-auto ${
                showValidation && !form.caption.trim()
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-blue-200'
              }`}
              placeholder="Write a caption..."
              value={form.caption}
              onChange={(e) => handleInputChange('caption', e.target.value)}
              onBlur={() => setShowValidation(true)}
              rows={6}
            />

            <div className="flex items-center mt-4 p-3 border-b border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex-shrink-0">
              <input
                type="text"
                placeholder="Add location..."
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
                value={form.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
              <MapPin size={20} className="text-gray-500 ml-2" />
            </div>

            {selectedImage && (
              <div className="flex justify-end p-4 mt-auto">
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className={`bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 ${sharing ? 'bg-blue-300 cursor-not-allowed' : ''}`}
                >
                  {sharing ? 'Sharing' : 'Share'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePostModal
