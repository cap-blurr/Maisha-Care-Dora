'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import styles from './Registration.module.css'

export default function Registration() {
  const router = useRouter()
  const { isAuthenticated, isLoading, userRole, setRole } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (userRole) {
      router.push(`/dashboard/${userRole}`)
    }
  }, [isAuthenticated, isLoading, userRole, router])

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) return null

  const handleCardClick = (role) => {
    setRole(role)
    router.push(`/verify/${role}`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Choose Your Role</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => handleCardClick('patient')}>
          <h2 className={styles.cardTitle}>Patient</h2>
          <p className={styles.cardDescription}>Register as a patient to manage your health records</p>
        </div>
        <div className={styles.card} onClick={() => handleCardClick('doctor')}>
          <h2 className={styles.cardTitle}>Doctor</h2>
          <p className={styles.cardDescription}>Register as a doctor to access and update patient records</p>
        </div>
      </div>
    </div>
  )
}