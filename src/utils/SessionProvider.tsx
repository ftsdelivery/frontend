// src/components/ClientWrapper.tsx
'use client'

import { SessionProvider as ClientWrapper } from 'next-auth/react'
import { ReactNode } from 'react'

export default function SessionProvider({ children }: { children: ReactNode }) {
	return <ClientWrapper>{children}</ClientWrapper>
}
