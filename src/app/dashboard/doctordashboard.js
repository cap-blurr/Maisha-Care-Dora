'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import styles from './dashboard.module.css'

export default function DoctorDashboard() {
  const { address } = useAuth()
  const [patientAddress, setPatientAddress] = useState('')

  const handleInputChange = (e) => {
    setPatientAddress(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`Request sent to patient: ${patientAddress}`)
    setPatientAddress('')
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Doctor Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            value={patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
          />
          <button className={styles.submitButton} type="submit">Send Request</button>
        </form>
      </main>
    </div>
  )
}