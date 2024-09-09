'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import styles from '../form.module.css'

export default function Form({ params }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idPhoto: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Form submission failed');
      }
      
      const result = await response.json();
      console.log('Form submitted:', result);
      
      // Redirect to signin page after successful submission
      router.push(`/signin/${params.role}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      idPhoto: e.target.files[0]
    }))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{params.role} Registration Form</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          className={styles.fileInput}
          type="file"
          name="idPhoto"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </div>
  )
}