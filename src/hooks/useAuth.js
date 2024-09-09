import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export function useAuth() {
  const { address, isConnected } = useAccount()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true)
      if (isConnected && address) {
        setIsAuthenticated(true)
        const storedRole = localStorage.getItem(`userRole_${address}`)
        if (storedRole) {
          setUserRole(storedRole)
        }
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [isConnected, address])

  const setRole = (role) => {
    setUserRole(role)
    localStorage.setItem(`userRole_${address}`, role)
  }

  const clearRole = () => {
    setUserRole(null)
    localStorage.removeItem(`userRole_${address}`)
  }

  return { isAuthenticated, isLoading, address, userRole, setRole, clearRole }
}