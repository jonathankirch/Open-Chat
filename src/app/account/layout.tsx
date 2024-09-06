import AuthVerify from "../components/AuthVerify"

interface LayoutProps {
  children: React.ReactNode
}
export default function Layout ({children}: LayoutProps) {
  return (
    <AuthVerify>
      {children}
    </AuthVerify>
  )
}