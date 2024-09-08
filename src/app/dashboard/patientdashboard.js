'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import RequestCard from '../components/RequestCard'
import styles from './dashboard.module.css'

export default function PatientDashboard() {
  const { address } = useAuth()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    // Mock data for requests
    setRequests([
      { id: 1, type: 'access', from: '0x1234...5678' },
      { id: 2, type: 'update', from: '0x9876...5432' },
    ])
  }, [])

  const handleRequestAction = (id, action) => {
    console.log(`Request ${id} ${action}`)
    // Update local state
    setRequests(requests.filter(req => req.id !== id))
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Patient Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        <div className={styles.requestsContainer}>
          {requests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onAction={handleRequestAction}
            />
          ))}
        </div>
      </main>
    </div>
  )
}