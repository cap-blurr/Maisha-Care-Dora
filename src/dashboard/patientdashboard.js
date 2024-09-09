'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useContract } from '../hooks/useContract'
import Navbar from '../components/Navbar'
import RequestCard from '../components/RequestCard'
import styles from './dashboard.module.css'

export default function PatientDashboard() {
  const { address } = useAccount();
  const { userRole } = useAuth();
  const { 
    loading, 
    error, 
    getPersonalInfo, 
    approveUpdate 
  } = useContract();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (address) {
      fetchPersonalInfo();
      fetchRequests();
    }
  }, [address]);

  const fetchPersonalInfo = async () => {
    try {
      const info = await getPersonalInfo(address);
      setPersonalInfo(info);
    } catch (err) {
      console.error('Error fetching personal info:', err);
    }
  };

  const fetchRequests = async () => {
    // In a real application, you would fetch pending requests from the backend
    // For now, we'll use mock data
    setRequests([
      { id: 1, type: 'Personal Info Update', from: '0x1234...5678' },
      { id: 2, type: 'Medical History Update', from: '0x9876...5432' },
    ]);
  };

  const handleRequestAction = async (id, action) => {
    if (action === 'accept') {
      try {
        await approveUpdate(id);
        // Remove the request from the list
        setRequests(requests.filter(req => req.id !== id));
      } catch (err) {
        console.error('Error approving update:', err);
      }
    } else {
      // Handle decline action (you might want to add a declineUpdate function)
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Patient Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        
        {personalInfo && (
          <div className={styles.infoSection}>
            <h2>Personal Information</h2>
            <p>Name: {personalInfo.name}</p>
            <p>Email: {personalInfo.email}</p>
            {/* Add more fields as needed */}
          </div>
        )}

        <div className={styles.requestsContainer}>
          <h2>Pending Requests</h2>
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
  );
}