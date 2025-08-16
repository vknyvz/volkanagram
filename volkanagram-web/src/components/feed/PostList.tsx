"use client"

import React from 'react'
import PostCard from './PostCard'
import {IPost} from "@/types/post"
import {IPostListProps} from '@/types/props'

const PostList = ({posts}: IPostListProps) => {
  return (
    <>
      {posts.map((post: IPost) => (
        <PostCard key={post._id} post={post}/>
      ))}
    </>
  )
}

export default PostList
