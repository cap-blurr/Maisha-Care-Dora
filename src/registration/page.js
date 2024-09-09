'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useContract } from '../hooks/useContract'
import styles from './Registration.module.css'

export default function Registration() {
    const router = useRouter()
    const { address } = useAccount()
    const { isAuthenticated, isLoading, userRole, setRole } = useAuth()
    const { requestVerification, verifyAddress, transactionState, resetTransactionState } = useContract()
    const [verificationStep, setVerificationStep] = useState('initial') // 'initial', 'requested', 'verified'

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

    const handleRoleSelection = async (role) => {
        try {
            setVerificationStep('requested')
            const signature = await requestVerification(role)
            setVerificationStep('verified')
            await verifyAddress(role, signature)
            setRole(role)
            router.push(`/dashboard/${role}`)
        } catch (error) {
            console.error('Verification error:', error)
            setVerificationStep('initial')
            // Handle error (e.g., show error message to user)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return null

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Choose Your Role</h1>
            <div className={styles.cardContainer}>
                <div className={styles.card} onClick={() => handleRoleSelection('patient')}>
                    <h2 className={styles.cardTitle}>Patient</h2>
                    <p className={styles.cardDescription}>Register as a patient to manage your health records</p>
                </div>
                <div className={styles.card} onClick={() => handleRoleSelection('doctor')}>
                    <h2 className={styles.cardTitle}>Doctor</h2>
                    <p className={styles.cardDescription}>Register as a doctor to access and update patient records</p>
                </div>
            </div>
            {verificationStep === 'requested' && <p>Verification requested. Please wait...</p>}
            {verificationStep === 'verified' && <p>Verification successful. Registering role...</p>}
            {transactionState.error && <p className={styles.error}>{transactionState.error}</p>}
        </div>
    )
}