import type { Metadata } from 'next'
import '../src/index.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Prueba Técnica',
  description: 'Aplicación de usuarios con React y Next.js'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div id="root" style={{ margin: '0 auto', padding: '2rem', textAlign: 'center', width: '100%' }}>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}
