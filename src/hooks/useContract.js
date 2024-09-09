import { useState } from 'react';
import { useAccount } from 'wagmi';

export function useContract() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'An error occurred');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initiatePersonalInfoUpdate = async (dataHash) => {
    return apiCall('initiate-personal-info-update', 'POST', { patientAddress: address, dataHash });
  };

  const initiateMedicalHistoryUpdate = async (dataHash) => {
    return apiCall('initiate-medical-history-update', 'POST', { patientAddress: address, dataHash });
  };

  const initiateCurrentHealthUpdate = async (dataHash) => {
    return apiCall('initiate-current-health-update', 'POST', { patientAddress: address, dataHash });
  };

  const initiateTreatmentRecordAdd = async (dataHash) => {
    return apiCall('initiate-treatment-record-add', 'POST', { patientAddress: address, dataHash });
  };

  const approveUpdate = async (updateId) => {
    return apiCall('approve-update', 'POST', { updateId });
  };

  const getPersonalInfo = async (patientAddress) => {
    return apiCall(`get-personal-info/${patientAddress}`);
  };

  const requestVerification = useCallback(async (role) => {
    try {
        const response = await fetch('/api/request-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, address })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verification request failed');
        return data.signature;
    } catch (error) {
        handleError(error);
        throw error;
    }
}, [address, handleError]);

const verifyAddress = useCallback(async (role, signature) => {
    try {
        const response = await fetch('/api/verify-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, signature })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Address verification failed');
        await waitForTransaction(data.transactionHash);
        return data.transactionHash;
    } catch (error) {
        handleError(error);
        throw error;
    }
}, [handleError, waitForTransaction]);

  // Add more contract interaction functions as needed

  return {
    loading,
    error,
    requestVerification,
    verifyAddress,
    initiatePersonalInfoUpdate,
    initiateMedicalHistoryUpdate,
    initiateCurrentHealthUpdate,
    initiateTreatmentRecordAdd,
    approveUpdate,
    getPersonalInfo,
    
  };
}