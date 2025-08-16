"use client"

import React from 'react'
import {getUserImageUrl} from "@/utils/imageHelpers"
import Image from "next/image"
import Link from "next/link"
import Avatar from "@/components/ui/Avatar"
import {IUserProfile} from "@/types/user"

const StoryBar = ({ stories }: {stories: IUserProfile[]}) => {
  return (
    <div
      className="flex space-x-4 overflow-x-auto stories-container px-4 sm:px-0"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .stories-container::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {stories.map((story) => (
        <Link
          key={story._id}
          href={`/${story.username}`} >
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-white overflow-hidden">
                {story.profilePicture ? (
                  <Image
                    src={getUserImageUrl(story.profilePicture)}
                    alt={story.username}
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <Avatar string={story.fullName} />
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs text-gray-600 max-w-[70px] truncate">
              {story.username}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default StoryBar
