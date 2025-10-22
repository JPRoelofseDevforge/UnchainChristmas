'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Party {
  id: number
  name: string
  date: string
  location: string
  description: string
  _count: {
    children: number
  }
}

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/parties')
      .then(res => res.json())
      .then(data => {
        setParties(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching parties:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="py-8">
        {/* Back/Home Navigation */}
        <div className="mb-6">
          <a href="/" className="inline-flex items-center bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            ← 🏠 Back to Home
          </a>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl animate-spin mb-4">🎄</div>
          <p className="text-xl text-unchain-blue">Loading magical parties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Back/Home Navigation */}
      <div className="mb-6">
        <a href="/" className="inline-flex items-center bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          ← 🏠 Back to Home
        </a>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-unchain-red animate-float">
          🎪 Christmas Parties 🎪
        </h1>
        <p className="text-2xl text-gray-700 mb-6">
          Choose a party and help make Christmas dreams come true! ✨
        </p>
        <div className="bg-unchain-yellow/20 p-4 rounded-xl inline-block">
          <p className="text-lg font-semibold text-unchain-orange">
            💝 {parties.reduce((total, party) => total + party._count.children, 0)} children are waiting for your kindness!
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {parties.map((party, index) => (
          <div
            key={party.id}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow transform hover:scale-105 transition-all duration-300 animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🎄</div>
              <h2 className="text-2xl font-bold mb-2 text-unchain-blue">{party.name}</h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📅</span>
                <span className="font-medium">
                  {new Date(party.date).toLocaleDateString('en-ZA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📍</span>
                <span>{party.location}</span>
              </div>

              <p className="text-gray-600 italic">{party.description}</p>
            </div>

            <div className="bg-unchain-green/10 p-4 rounded-xl mb-6 text-center">
              <div className="text-3xl font-bold text-unchain-green mb-1">
                {party._count.children}
              </div>
              <p className="text-sm font-medium text-unchain-green">
                Amazing children waiting for gifts! 🎁
              </p>
            </div>

            <Link
              href={`/parties/${party.id}`}
              className="block w-full bg-gradient-to-r from-unchain-red to-unchain-orange text-white text-center font-bold py-4 px-6 rounded-full hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg"
            >
              ✨ Meet the Children ✨
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl inline-block shadow-lg">
          <h3 className="text-2xl font-bold text-unchain-blue mb-3">Remember! 🎄</h3>
          <p className="text-lg text-gray-700">
            Your generosity can change a child's Christmas forever.
            <br />
            <span className="font-bold text-unchain-red">One gift = One miracle! ✨</span>
          </p>
        </div>
      </div>
    </div>
  )
}