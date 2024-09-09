'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useContract } from '../hooks/useContract'
import Navbar from '../components/Navbar'
import styles from './dashboard.module.css'

export default function DoctorDashboard() {
  const { address } = useAccount();
  const { userRole } = useAuth();
  const { 
    loading, 
    error, 
    initiatePersonalInfoUpdate,
    initiateMedicalHistoryUpdate,
    initiateCurrentHealthUpdate,
    initiateTreatmentRecordAdd
  } = useContract();
  const [patientAddress, setPatientAddress] = useState('');
  const [updateType, setUpdateType] = useState('personalInfo');
  const [dataHash, setDataHash] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patientAddress') setPatientAddress(value);
    if (name === 'updateType') setUpdateType(value);
    if (name === 'dataHash') setDataHash(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      switch (updateType) {
        case 'personalInfo':
          result = await initiatePersonalInfoUpdate(dataHash);
          break;
        case 'medicalHistory':
          result = await initiateMedicalHistoryUpdate(dataHash);
          break;
        case 'currentHealth':
          result = await initiateCurrentHealthUpdate(dataHash);
          break;
        case 'treatmentRecord':
          result = await initiateTreatmentRecordAdd(dataHash);
          break;
        default:
          throw new Error('Invalid update type');
      }
      console.log('Update initiated:', result);
      // Clear form or show success message
    } catch (err) {
      console.error('Error initiating update:', err);
      // Show error message to user
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

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
            name="patientAddress"
            value={patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
          />
          <select
            className={styles.input}
            name="updateType"
            value={updateType}
            onChange={handleInputChange}
            required
          >
            <option value="personalInfo">Personal Info</option>
            <option value="medicalHistory">Medical History</option>
            <option value="currentHealth">Current Health</option>
            <option value="treatmentRecord">Treatment Record</option>
          </select>
          <input
            className={styles.input}
            type="text"
            name="dataHash"
            value={dataHash}
            onChange={handleInputChange}
            placeholder="Data Hash"
            required
          />
          <button className={styles.submitButton} type="submit">Initiate Update</button>
        </form>
      </main>
    </div>
  );
}