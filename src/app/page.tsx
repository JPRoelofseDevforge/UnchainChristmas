export default function Home() {
  return (
    <div className="text-center py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 text-unchain-red animate-float">
          🎅 Unchain our Children Christmas! 🎅
        </h2>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-4 border-unchain-yellow mb-8">
          <p className="text-2xl mb-6 text-gray-700 font-medium">
            Every child deserves the magic of Christmas! ✨
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-unchain-blue to-blue-400 p-6 rounded-xl text-white">
              <div className="text-4xl mb-2">🎄</div>
              <h3 className="font-bold text-lg mb-2">Find Parties</h3>
              <p className="text-sm">Discover Christmas parties near you</p>
            </div>

            <div className="bg-gradient-to-br from-unchain-green to-green-400 p-6 rounded-xl text-white">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-bold text-lg mb-2">See Wishes</h3>
              <p className="text-sm">Read children's heartfelt wishlists</p>
            </div>

            <div className="bg-gradient-to-br from-unchain-orange to-orange-400 p-6 rounded-xl text-white">
              <div className="text-4xl mb-2">❤️</div>
              <h3 className="font-bold text-lg mb-2">Make Magic</h3>
              <p className="text-sm">Pledge to bring joy to a child</p>
            </div>
          </div>

          <div className="bg-unchain-red text-white p-6 rounded-xl mb-6">
            <h3 className="text-2xl font-bold mb-3">Your Help Can Change Lives! 🌟</h3>
            <p className="text-lg">
              Just one gift can make Christmas unforgettable for a child in need.
              Every pledge brings hope, joy, and smiles to faces that need them most.
            </p>
          </div>

          <a
            href="/parties"
            className="inline-block bg-gradient-to-r from-unchain-red to-unchain-orange text-white text-xl font-bold px-8 py-4 rounded-full hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg animate-pulse"
          >
            🎁 Start Making Wishes Come True! 🎁
          </a>
        </div>

        <div className="text-center text-gray-600">
          <p className="text-lg mb-2">Join thousands of kind hearts making Christmas magical</p>
          <div className="flex justify-center space-x-2 text-2xl">
            <span>🎄</span>
            <span>⭐</span>
            <span>🎅</span>
            <span>❄️</span>
            <span>🎁</span>
          </div>
        </div>
      </div>
    </div>
  )
}