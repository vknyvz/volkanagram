import React from "react"
import StoryBar from "@/components/feed/StoryBar"
import UserInfo from "@/components/layout/UserInfo"
import MobileNav from "@/components/layout/MobileNav"
import Nav from "@/components/layout/Nav"
import {IAppLayoutProps} from "@/types/props"
import Footer from "@/components/layout/Footer"

export default function AppLayout({
  children,
  showStories = false,
  showRightSide = true,
  profilePage = false,
  stories = []
  }: IAppLayoutProps
) {
  return (
    <div className="min-h-screen flex bg-white text-black overflow-x-hidden">
      <Nav />

      <div className="w-full sm:ml-20 lg:ml-[200px] flex justify-center overflow-x-hidden">
        <main className={`w-full ${profilePage ? 'max-w-3xl' : 'max-w-lg'} lg:mr-8`}>
          {showStories && (
            <div className="w-full bg-white sticky top-0 z-10">
              <div className="px-0 py-4 pb-2 sm:p-4 sm:pb-2">
                <StoryBar stories={stories} />
              </div>
            </div>
          )}

          <div className="w-full pb-20 sm:pb-4 bg-white">
            {children}

            <div className="mt-8 px-4 lg:hidden bg-white">
              <Footer isMobile={true}/>
            </div>
          </div>
        </main>

        {showRightSide && (
          <aside className="hidden lg:block w-80 pl-4 shrink-0 bg-white">
            <div className="sticky top-8">
              <UserInfo />

              <div className="mt-8">
                <Footer isMobile={false}/>
              </div>
            </div>
          </aside>
        )}
      </div>

      <MobileNav />
    </div>
  )
}