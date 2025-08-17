'use client'

import AppLayout from "@/components/AppLayout"
import React, {use, useEffect, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {useUser} from "@/hooks/useUser"
import {setLoading} from "@/store/loadingSlice"
import {useDispatch, useSelector} from "react-redux"
import NotFound from "@/app/not-found"
import {getUserImageUrl} from "@/utils/imageHelpers"
import {RootState} from '@/store'
import {setProfile, updatePostsCount, updateProfileField} from "@/store/profileSlice"
import {getSocketService} from "@/services/socketService"
import {SERVER_EVENTS} from "@/utils/socketEvents"
import {handleApiError} from "@/utils/errorHandler"
import {IPost} from "@/types/post"
import Loader from "@/components/ui/loader/Loader"
import {useLoading} from "@/hooks/useLoading"
import {profileService} from "@/services/profileService"
import ProfilePost from "@/components/profile/ProfilePost"

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const user = useUser()
  const dispatch = useDispatch()
  const {username} = use(params)
  const [userNotFound, setUserNotFound] = useState<boolean>(false)
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false)
  const [posts, setPosts] = useState<IPost[]>([])
  const profile = useSelector((state: RootState) => state.profile.data)
  const isLoading = useLoading()

  useEffect(() => {
    if (!user?._id) {
      return
    }

    getSocketService()
      .identify(user._id)
      .on(SERVER_EVENTS.POST_COUNT_UPDATED, (data: { postsCount: number }) => {
        dispatch(updatePostsCount(data.postsCount))
      })

    return () => getSocketService().disconnect()
  }, [dispatch, user?._id])

  const postsCount = profile.postsCount || 0

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        dispatch(setLoading(true))

        const res = await profileService.getProfile(username)

        if (res.data.success) {
          dispatch(setProfile(res.data.data.profile))

          setPosts(res.data.data.posts)
          setProfileLoaded(true)
        } else {
          setUserNotFound(true)
        }
      } catch (e: unknown) {
        handleApiError(e)

        setUserNotFound(true)
      } finally {
        dispatch(setLoading(false))
      }
    }

    if (username) {
      void fetchProfileData()
    }
  }, [username, dispatch])

  if (userNotFound) {
    return <NotFound />
  }

  if (!profileLoaded) {
    return (
      <AppLayout showRightSide={false} profilePage>
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      </AppLayout>
    )
  }

  const amIProfileOwner = () => {
    if (!user) {
      return false
    }

    return profile.username == user.username
  }

  const doFollow = async (shouldFollow: boolean) => {
    try {
      const res = shouldFollow
        ? await profileService.follow(profile.username)
        : await profileService.unfollow(profile.username)

      if (res.data.success) {
        dispatch(updateProfileField({
          field: "isFollowing",
          value: shouldFollow
        }))
      }
    } catch (e: unknown) {
      handleApiError(e)
    }
  }

  return (
    <AppLayout showRightSide={false} profilePage>
      <div className="w-full p-4 bg-white sm:-mx-4 sm:px-8 mt-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profile.profilePicture ? (
                <Image
                  src={getUserImageUrl(profile.profilePicture)}
                  width={48}
                  height={48}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl font-light">
                    {profile.fullName?.split(' ').map(name => name[0]).join('')}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <h1 className="text-xl font-light">{profile.username}</h1>

              {amIProfileOwner() ? (
                <Link href={`/${profile.username}/settings`}>
                  <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold cursor-pointer font-medium rounded-md transition-colors">
                    Edit profile
                  </button>
                </Link>
              ) : (
                profile.isFollowing ? (
                  <button
                    onClick={() => doFollow(false)}
                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-sm font-semibold cursor-pointer font-medium rounded-md transition-colors">
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => doFollow(true)}
                    className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-sm text-white font-semibold cursor-pointer font-medium rounded-md transition-colors">
                    Follow
                  </button>
                ))}
            </div>

            <div className="flex gap-8 mb-4 text-sm">
              <div className="text-center sm:text-left">
                <span className="font-semibold">{postsCount}</span>
                <span className="text-gray-500 ml-1">posts</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="font-semibold">{profile.followersCount ?? 0}</span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="font-semibold">{profile.followingCount ?? 0}</span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
            </div>

            <div className="text-sm">
              <div className="font-semibold mb-1">{profile.fullName}</div>
              <div className="mb-1">{profile.bio}</div>
              <a
                href={`https://${profile.website?.replace(/^https?:\/\//, '')}`}
                className="text-blue-900 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
            ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post: IPost) => (
                <ProfilePost key={post._id} post={post} user={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
