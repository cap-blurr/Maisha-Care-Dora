'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import AnimatedBackground from './components/AnimatedBackground'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useAuth } from './hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { isAuthenticated, isLoading, userRole } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isConnected && isAuthenticated) {
        if (userRole) {
          router.push(`/dashboard/${userRole}`)
        } else {
          router.push('/registration')
        }
      }
    }
  }, [isConnected, isAuthenticated, isLoading, userRole, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className={styles.main}>
      <AnimatedBackground />
      <div className={styles.content}>
        <Image
          src="/img/maisha-care-logo.png"
          alt="Maisha-Care Logo"
          width={200}
          height={200}
        />
        <h1 className={styles.title}>Welcome to Maisha-Care</h1>
        <div className={styles.connectButtonWrapper}>
          <w3m-button />
        </div>
      </div>
    </main>
  )
}