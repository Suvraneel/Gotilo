import Navbar from '@components/Layout/Navbar'
import WalletContextProvider from '@components/WalletProvider'
import '@styles/globals.css'
import type { AppProps } from 'next/app'
import NextProgress from "next-progress";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='relative'>
      <NextProgress
        delay={300}
        height="6px"
        options={{
          showSpinner: false,
        }}
        color='#800080'
      />
      <WalletContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </WalletContextProvider>
    </div>
  )
}