'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface WishlistItem {
  id: number
  text: string
}

interface Pledge {
  id: number
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  message?: string
}

interface Child {
  id: number
  name: string
  age: number
  pledged: boolean
  wishlist: WishlistItem[]
  pledges: Pledge[]
}

interface Party {
  id: number
  name: string
  date: string
  location: string
  description: string
  children: Child[]
}

export async function generateStaticParams() {
  // For static export, we need to provide possible party IDs
  // Since we can't query the database at build time, we'll return empty array
  // This means dynamic routes won't be pre-generated, but will work at runtime
  return []
}

export default function PartyPage() {
  const params = useParams()
  const [party, setParty] = useState<Party | null>(null)
  const [loading, setLoading] = useState(true)
  const [pledgeForm, setPledgeForm] = useState<{ [key: number]: boolean }>({})
  const [pledgeData, setPledgeData] = useState<{ [key: number]: { donorName: string; donorEmail: string; donorPhone: string; message: string } }>({})

  useEffect(() => {
    if (params.id) {
      fetch(`/api/parties/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setParty(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching party:', error)
          setLoading(false)
        })
    }
  }, [params.id])

  const handlePledge = async (childId: number) => {
    const data = pledgeData[childId]
    if (!data?.donorName || !data?.donorEmail) {
      alert('Please fill in your name and email so we can thank you! 🎁')
      return
    }

    try {
      const response = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId,
          ...data,
        }),
      })

      if (response.ok) {
        alert('🎉 THANK YOU! You just made Christmas magical for a child! ✨ Your kindness brings hope and joy! 🎄')
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`❌ ${error.error || 'Something went wrong, but thank you for trying to help!'}`)
      }
    } catch (error) {
      console.error('Error making pledge:', error)
      alert('❌ Sorry, there was an issue. Please try again - every child needs your help! 🙏')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl animate-bounce mb-4">🎄</div>
        <p className="text-2xl text-unchain-blue animate-pulse">Finding the children who need your help...</p>
      </div>
    )
  }

  if (!party) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-xl text-gray-600">Party not found, but there are other children waiting for you!</p>
        <a href="/parties" className="inline-block mt-4 bg-unchain-blue text-white px-6 py-3 rounded-full hover:bg-blue-700">
          Find Other Parties
        </a>
      </div>
    )
  }

  const unpledgedChildren = party.children.filter(child => !child.pledged)
  const pledgedChildren = party.children.filter(child => child.pledged)

  return (
    <div className="py-8">
      {/* Back/Home Navigation */}
      <div className="mb-6">
        <a href="/parties" className="inline-flex items-center bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4">
          ← 🎪 Back to Parties
        </a>
        <a href="/" className="inline-flex items-center bg-unchain-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          🏠 Home
        </a>
      </div>

      {/* Party Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-unchain-red animate-float">
          🎪 {party.name} 🎪
        </h1>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl inline-block border-4 border-unchain-yellow">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">📅</div>
              <p className="font-bold text-unchain-blue">
                {new Date(party.date).toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📍</div>
              <p className="font-bold text-unchain-green">{party.location}</p>
            </div>
            <div>
              <div className="text-3xl mb-2">👶</div>
              <p className="font-bold text-unchain-orange">{party.children.length} Children</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 italic text-lg">{party.description}</p>
        </div>
      </div>

      {/* Urgent Call to Action */}
      {unpledgedChildren.length > 0 && (
        <div className="bg-gradient-to-r from-unchain-red to-unchain-orange text-white p-6 rounded-2xl mb-8 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-3">🚨 {unpledgedChildren.length} Children Still Need Your Help! 🚨</h2>
          <p className="text-xl mb-4">
            These amazing kids are dreaming of Christmas magic! Your gift can make their wishes come true! ✨
          </p>
          <div className="text-4xl animate-bounce">🎁 ❤️ 🎄</div>
        </div>
      )}

      {/* Children Grid */}
      <div className="space-y-12">
        {/* Unpledged Children - Most Important */}
        {unpledgedChildren.length > 0 && (
          <div>
            <h2 className="text-4xl font-bold text-center mb-8 text-unchain-red animate-pulse">
              🎄 Children Waiting for Christmas Magic 🎄
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {unpledgedChildren.map((child, index) => (
                <div
                  key={child.id}
                  className="bg-gradient-to-br from-white to-unchain-yellow/20 p-8 rounded-2xl shadow-xl border-4 border-unchain-orange transform hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3 animate-bounce">👶</div>
                    <h3 className="text-3xl font-bold text-unchain-blue mb-2">{child.name}</h3>
                    <div className="bg-unchain-green/20 px-4 py-2 rounded-full inline-block">
                      <span className="font-bold text-unchain-green">Age {child.age}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-4 rounded-xl mb-6">
                    <h4 className="font-bold mb-3 text-unchain-red text-xl flex items-center justify-center">
                      🎁 Wishlist 🎁
                    </h4>
                    <ul className="space-y-2">
                      {child.wishlist.map(item => (
                        <li key={item.id} className="flex items-center text-gray-700">
                          <span className="text-2xl mr-3">⭐</span>
                          <span className="font-medium">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-unchain-red/10 p-4 rounded-xl mb-6 text-center">
                    <p className="text-lg font-bold text-unchain-red mb-2">
                      This child needs YOUR help! 🙏
                    </p>
                    <p className="text-sm text-gray-600">
                      Your generosity can change their Christmas forever! ✨
                    </p>
                  </div>

                  {!pledgeForm[child.id] ? (
                    <button
                      onClick={() => setPledgeForm(prev => ({ ...prev, [child.id]: true }))}
                      className="w-full bg-gradient-to-r from-unchain-red to-unchain-orange text-white font-bold py-4 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg animate-pulse"
                    >
                      🎁 I Want to Help {child.name}! 🎁
                    </button>
                  ) : (
                    <div className="bg-white p-6 rounded-xl space-y-4">
                      <h4 className="font-bold text-center text-unchain-blue text-lg mb-4">
                        ✨ You're About to Make Magic Happen! ✨
                      </h4>

                      <input
                        type="text"
                        placeholder="Your Name (so we can thank you!)"
                        className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                        onChange={(e) => setPledgeData(prev => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], donorName: e.target.value }
                        }))}
                      />

                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                        onChange={(e) => setPledgeData(prev => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], donorEmail: e.target.value }
                        }))}
                      />

                      <input
                        type="tel"
                        placeholder="Your Cellphone Number (optional)"
                        className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                        onChange={(e) => setPledgeData(prev => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], donorPhone: e.target.value }
                        }))}
                      />

                      <textarea
                        placeholder="A special message for the child? (optional)"
                        className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none resize-none"
                        rows={3}
                        onChange={(e) => setPledgeData(prev => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], message: e.target.value }
                        }))}
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePledge(child.id)}
                          className="flex-1 bg-gradient-to-r from-unchain-green to-green-500 text-white font-bold py-3 px-6 rounded-full hover:from-green-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          🎉 Make Their Wish Come True! 🎉
                        </button>
                        <button
                          onClick={() => setPledgeForm(prev => ({ ...prev, [child.id]: false }))}
                          className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pledged Children - Show the success */}
        {pledgedChildren.length > 0 && (
          <div>
            <h2 className="text-4xl font-bold text-center mb-8 text-unchain-green">
              🎉 These Children Have Been Blessed! 🎉
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pledgedChildren.map(child => (
                <div
                  key={child.id}
                  className="bg-gradient-to-br from-unchain-green/20 to-green-100 p-6 rounded-xl border-4 border-unchain-green text-center"
                >
                  <div className="text-4xl mb-2">🎄</div>
                  <h3 className="font-bold text-unchain-green text-xl mb-1">{child.name}</h3>
                  <p className="text-sm text-gray-600">Age {child.age}</p>
                  <div className="mt-3 bg-unchain-green text-white px-3 py-1 rounded-full text-sm font-bold">
                    ❤️ Pledged For! ❤️
                  </div>
                  {child.pledges.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      By: {child.pledges[0].donorName || 'Anonymous'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-unchain-blue to-unchain-green p-8 rounded-2xl shadow-xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            🌟 Your Kindness Changes Lives! 🌟
          </h3>
          <p className="text-xl text-white mb-6">
            Every child you help gets to experience the magic of Christmas.
            <br />
            <span className="font-bold text-yellow-300">Will you be their hero today? 🦸‍♀️</span>
          </p>
          <div className="text-4xl animate-bounce">❤️ 🎁 ✨</div>
        </div>
      </div>
    </div>
  )
}