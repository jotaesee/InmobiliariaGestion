import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen bg-background">
        <div className="max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </>
  )
}
