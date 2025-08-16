import Link from 'next/link'
import AppLayout from "@/components/AppLayout"

export default function NotFound() {
  return (
    <AppLayout showRightSide={false}>
      <div className="md:min-h-screen bg-white px-4 py-4 md:py-0 md:flex md:flex-col md:items-center md:justify-center">
        <div className="text-center max-w-2xl mt-16 md:mt-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Sorry, this page isn&rsquo;t available.
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-5">
            The link you followed may be broken, or the page may have been removed.
          </p>

          <p>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Go back to Homepage
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}