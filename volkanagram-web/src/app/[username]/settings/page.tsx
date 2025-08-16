"use client"

import AppLayout from "@/components/AppLayout"
import {useEffect, useState, useRef} from "react"
import {DefaultUserProfile, IUserProfile} from "@/types/user"
import {setLoading} from "@/store/loadingSlice"
import {useDispatch} from "react-redux"
import Image from "next/image"
import {getUserImageUrl} from "@/utils/imageHelpers"
import {handleApiError} from "@/utils/errorHandler"
import {profileService} from "@/services/profileService"
import {uploaderService} from "@/services/uploaderService"
import {FORM_CONFIG, UPLOADER_CONFIG} from '@/config'

export default function SettingsPage() {
  const [form, setForm] = useState<IUserProfile>(DefaultUserProfile)

  const dispatch = useDispatch()
  const [uploading, setUploading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [bioCharCount, setBioCharCount] = useState<number>(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(setLoading(true))

        const res = await profileService.getUserData({})

        if (res.data.success) {
          setForm(res.data.data)
          setBioCharCount(res.data.data.bio?.length || 0)
        }
      } catch (e: unknown) {
        handleApiError(e)
      } finally {
        dispatch(setLoading(false))
      }
    }

    void fetchUserData()
  }, [dispatch])

  const handleInputChange = (field: string, value: string) => {
    if (field === 'bio') {
      if (value.length <= FORM_CONFIG.MAX_BIO_LENGTH) {
        setForm(prev => ({...prev, [field]: value}))
        setBioCharCount(value.length)
      }
    } else {
      setForm(prev => ({...prev, [field]: value}))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!UPLOADER_CONFIG.isValidType(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    if (!UPLOADER_CONFIG.isValidSize(file.size)) {
      alert('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoUpload = async () => {
    if (!selectedFile) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append(UPLOADER_CONFIG.FILE_NAME, selectedFile)

      const res = await uploaderService.upload('profile-pictures', formData)

      if (res.data.success) {
        setForm(prev => ({
          ...prev,
          profilePicture: res.data.data.image
        }))

        setPreviewImage(null)
        setSelectedFile(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (e: unknown) {
      handleApiError(e)
    } finally {
      setUploading(false)
    }
  }

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancelUpload = () => {
    setSelectedFile(null)
    setPreviewImage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const res = await profileService.saveProfile({
        fullName: form?.fullName,
        bio: form?.bio,
        website: form?.website,
        profilePicture: form?.profilePicture
      })

      if (res.data.success) {
        setForm(res.data.data)
      }
    } catch (e: unknown) {
      handleApiError(e)
    } finally {
      setSaving(false)
    }
  }

  const currentProfileImage = previewImage || form.profilePicture

  return (
    <AppLayout showRightSide={false}>
      <div className="max-w-2xl mx-auto p-6 bg-white">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">Edit profile</h1>
        </div>

        <div className="bg-gray-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {currentProfileImage ? (
                  <Image
                    src={getUserImageUrl(currentProfileImage)}
                    alt={form.username}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-gray-400 text-lg font-light">
                      {form.fullName?.split(' ').map(name => name[0]).join('') || '?'}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-black">{form.username}</div>
                <div className="text-gray-600 text-sm">{form.fullName}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedFile ? (
                <>
                  <button
                    onClick={handleCancelUpload}
                    disabled={uploading}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleChangePhotoClick}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Change photo
                </button>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-blue-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                {previewImage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={UPLOADER_CONFIG.ALLOWED_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-black font-semibold mb-3">Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-xl border-0 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-3">Bio</label>
            <div className="relative">
            <textarea
              value={form.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-xl border-0 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
              placeholder="Write something about yourself..."
            />
              <div className="absolute bottom-3 right-3 text-gray-400 text-sm">
                {bioCharCount} / {FORM_CONFIG.MAX_BIO_LENGTH}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-black font-semibold mb-3">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-xl border-0 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your website"
            />
          </div>
        </div>

        <div className="mt-8 pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}