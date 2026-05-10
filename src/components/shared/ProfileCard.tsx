'use client'

import { userLogout } from '@/actions/auth.actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TUser } from '@/types/user.type'
import { LogOut, Settings, User, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

const getProfileLink = (role: string) =>
  role === 'USER'
    ? '/profile/user'
    : role === 'ADMIN'
    ? '/admin/dashboard/profile'
    : role === 'MANAGER'
    ? '/manager/dashboard/profile'
    : '/'

const getSettingsLink = (role: string) =>
  role === 'USER'
    ? '/settings'
    : role === 'MANAGER'
    ? '/manager/dashboard/setting'
    : role === 'ADMIN'
    ? '/admin/dashboard/setting'
    : '/'

export default function ProfileCard({ profile }: { profile: TUser }) {
  if(!profile){
    return null
  }
  const defaultProfile =
    'https://res.cloudinary.com/drmeagmkl/image/upload/v1766941482/chatgpt_m8tmep.png'

  const router = useRouter()

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    const res = await userLogout()
    if (!res.data || !res.success) {
      toast.dismiss(toastId)
      toast.error('Logout failed')
      return
    }
    toast.dismiss(toastId)
    toast.success(res.message || 'Logged out successfully')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          aria-label="Open profile menu"
          className="relative w-10 h-10 rounded-full border border-primary bg-card shadow-md flex items-center justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          whileTap={{ scale: 0.96 }}
        >
          <Image
            src={defaultProfile}
            alt={profile?.name}
            width={40}
            height={40}
            className="object-cover w-10 h-10 rounded-full border-2 border-background"
            priority
          />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 rounded-xl shadow-lg border border-border bg-card mt-3 overflow-hidden">
        <div className="px-6 py-6 flex items-center gap-4 border-b border-border bg-background">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary bg-input flex-shrink-0">
            <Image
              src={profile.image || defaultProfile}
              alt={profile.name}
              width={56}
              height={56}
              className="object-cover w-14 h-14"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate max-w-[160px]">{profile.name}</div>
            <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
          </div>
        </div>
        <DropdownMenuLabel className="mt-2 text-primary font-medium px-6 py-4 bg-card">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border h-px opacity-75" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={getProfileLink(profile.role)}
              className="flex items-center gap-3 w-full px-6 py-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-base"
              tabIndex={0}
            >
              <User className="w-4 h-4 text-muted-foreground" aria-hidden />
              <span className="flex-1 font-medium">Profile</span>
            </Link>
          </DropdownMenuItem>
          {profile.role !== 'Customer' && (
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 w-full px-6 py-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-base"
                tabIndex={0}
              >
                <BarChart3 className="w-4 h-4 text-muted-foreground" aria-hidden />
                <span className="flex-1 font-medium">Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={getSettingsLink(profile.role)}
              className="flex items-center gap-3 w-full px-6 py-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-base"
              tabIndex={0}
            >
              <Settings className="w-4 h-4 text-muted-foreground" aria-hidden />
              <span className="flex-1 font-medium">Settings</span>
              <DropdownMenuShortcut className="text-muted-foreground">⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border h-px opacity-75" />
        <div className="px-6 py-4 bg-card rounded-b-xl">
          <Button
            
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-card-foreground bg-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-primary/90 disabled:opacity-70"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 text-card-foreground" aria-hidden />
            <span className="flex-1 text-base font-medium text-card-foreground">Log out</span>
            <DropdownMenuShortcut className="text-muted-foreground">⇧⌘Q</DropdownMenuShortcut>
          </Button>
        </div>
   
      </DropdownMenuContent>
    </DropdownMenu>
  )
}