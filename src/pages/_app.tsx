import { FirebaseProvider } from '@/providers/FirebaseProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaProviders } from '../providers/SolanaProviders'
import { Toaster } from 'react-hot-toast'
import { TransactionProvider } from '@/providers/TransactionProvider'
import Layout from '@/components/Layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaProviders>
      <TransactionProvider>
        <FirebaseProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster position='bottom-center' />
          </Layout>
        </FirebaseProvider>
      </TransactionProvider>
    </SolanaProviders>
  )
}
