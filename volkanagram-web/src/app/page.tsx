"use client"

import React, {useEffect, useState, useCallback, useRef} from 'react'
import PostList from "@/components/feed/PostList"
import AppLayout from "@/components/AppLayout"
import Loader from "@/components/ui/loader/Loader"
import {handleApiError} from "@/utils/errorHandler"
import {IPost} from "@/types/post"
import {IUserProfile} from "@/types/user"
import {setLoading} from "@/store/loadingSlice"
import {useDispatch} from "react-redux"
import {PAGINATION_CONFIG} from '@/config'
import {feedService} from "@/services/feedService"
import {useLoading} from "@/hooks/useLoading"
import NoPosts from "@/components/profile/NoPosts"

const Volkanagram = () => {
  const [stories, setStories] = useState<IUserProfile[]>([])
  const [feed, setFeed] = useState<IPost[]>([])
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.FEED.INITIAL_PAGE)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const dispatch = useDispatch()
  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoading = useLoading()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await feedService.getStories()

        if (res.data.success) {
          setStories(res.data.data)
        }
      } catch (e: unknown) {
        handleApiError(e)
      }
    }

    void fetchUserData()
  }, [])

  useEffect(() => {
    if (initialLoadDone) {
      return
    }

    const fetchFeedData = async () => {
      try {
        dispatch(setLoading(true))

        const res = await feedService.getFeed(
          PAGINATION_CONFIG.FEED.INITIAL_PAGE,
          PAGINATION_CONFIG.FEED.LIMIT
        )

        if (res.data.success) {
          setFeed(res.data.data.posts)
          setHasMore(res.data.data.pagination.hasMore)
          setCurrentPage(PAGINATION_CONFIG.FEED.INITIAL_PAGE)
        }
      } catch (e: unknown) {
        handleApiError(e)
      } finally {
        dispatch(setLoading(false))
        setInitialLoadDone(true)
      }
    }

    void fetchFeedData()
  }, [dispatch, initialLoadDone])

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore || !initialLoadDone) {
      return
    }

    try {
      setIsLoadingMore(true)

      await new Promise(resolve => setTimeout(resolve, 800))

      const nextPage = currentPage + 1

      const res = await feedService.getFeed(
        nextPage,
        PAGINATION_CONFIG.FEED.LIMIT
      )

      if (res.data.success) {
        setFeed(prevFeed => [...prevFeed, ...res.data.data.posts])
        setCurrentPage(nextPage)
        setHasMore(res.data.data.pagination.hasMore)
      }
    } catch (e: unknown) {
      handleApiError(e)
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, hasMore, initialLoadDone, isLoadingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && initialLoadDone && !isLoadingMore) {
          void loadMorePosts()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px'
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget && initialLoadDone) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMorePosts, hasMore, initialLoadDone, isLoadingMore])

  return (
    <AppLayout showStories={true} stories={stories}>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        feed.length <= 0 ? (
          <NoPosts className="py-8" message="When posts are shared, they&#39;ll appear here."/>
        ) : (
          <PostList posts={feed} />
        )
      )}

      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      )}

      <div ref={observerTarget} className="h-10 w-full"></div>
    </AppLayout>
  )
}

export default Volkanagram