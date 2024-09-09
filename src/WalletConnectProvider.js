'use client'

import React from 'react'
import { config, projectId, metadata } from './walletConnectConfig'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  metadata,
})

export default function WalletConnectProvider({ children, initialState }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AccountProvider>
          {children}
        </AccountProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function AccountProvider({ children }) {
  const account = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return React.cloneElement(children, { account, connect, disconnect })
}