import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-bg-base">
      <Sidebar />
      <main className="flex-1 w-full overflow-x-hidden px-3 py-5 sm:px-6 sm:py-8 lg:px-10 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
