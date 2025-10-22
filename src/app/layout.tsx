import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unchain Christmas - Help Make Wishes Come True!',
  description: 'Join us in bringing Christmas joy to children in need. View parties, see wishlists, and pledge to make a difference!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden">
        {/* Snow effect */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                fontSize: `${Math.random() * 0.5 + 0.5}rem`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        <header className="relative z-10 bg-gradient-to-r from-unchain-red via-unchain-orange to-unchain-yellow text-white p-6 shadow-lg">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <a href="/" className="text-4xl font-bold animate-float hover:scale-105 transition-transform">🎄 Unchain Christmas 🎄</a>
              <nav className="flex items-center space-x-4">
                <a href="/" className="text-white hover:text-yellow-200 transition-colors font-semibold">🏠 Home</a>
                <a href="/parties" className="text-white hover:text-yellow-200 transition-colors font-semibold">🎪 Parties</a>
                <a href="/admin" className="text-white hover:text-yellow-200 transition-colors font-semibold">⚙️ Admin</a>
              </nav>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg">Every child deserves a magical Christmas! ✨</p>
              <div className="mt-2 flex justify-center space-x-4 text-2xl">
                <span className="animate-sparkle">⭐</span>
                <span className="animate-sparkle" style={{ animationDelay: '0.5s' }}>🎁</span>
                <span className="animate-sparkle" style={{ animationDelay: '1s' }}>❤️</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 container mx-auto p-4">
          {children}
        </main>

        <footer className="relative z-10 bg-unchain-blue text-white text-center p-4 mt-12">
          <p className="text-sm">
            Made with ❤️ for children in need •
            <a
              href="https://www.unchainourchildren.org.za/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-300 hover:text-yellow-100 underline ml-1 font-semibold"
            >
              Unchain Our Children
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}