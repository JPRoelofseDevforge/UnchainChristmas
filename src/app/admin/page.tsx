'use client'

import { useState, useEffect } from 'react'

interface Party {
  id: number
  name: string
  date: string
  location: string
  description: string
  children: any[]
}

interface Child {
  id: number
  name: string
  age: number
  partyId: number
  pledged: boolean
  party: Party
  wishlist: any[]
  pledges: any[]
}

interface WishlistItem {
  id: number
  childId: number
  text: string
  child: Child
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('party')
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  const [partyForm, setPartyForm] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  })

  const [childForm, setChildForm] = useState({
    name: '',
    age: '',
    partyId: '',
    wishlist: [''],
  })

  const [wishlistForm, setWishlistForm] = useState({
    childId: '',
    text: '',
  })

  // CRUD state
  const [parties, setParties] = useState<Party[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [editingParty, setEditingParty] = useState<Party | null>(null)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [editingWishlist, setEditingWishlist] = useState<WishlistItem | null>(null)

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // For simplicity, check against hardcoded values (env vars don't work client-side)
    if (email === 'admin@unchain.org' && password === 'admin123') {
      setIsAuthenticated(true)
      loadData()
      showNotification('success', '🎄 Welcome to the Admin Panel! Ready to spread Christmas magic!!!')
    } else {
      showNotification('error', '❌ Invalid credentials. Please check your email and password.')
    }
  }

  const loadData = async () => {
    try {
      const [partiesRes, childrenRes, wishlistRes] = await Promise.all([
        fetch('/api/admin/party'),
        fetch('/api/admin/child'),
        fetch('/api/admin/wishlist')
      ])

      if (partiesRes.ok) setParties(await partiesRes.json())
      if (childrenRes.ok) setChildren(await childrenRes.json())
      if (wishlistRes.ok) setWishlistItems(await wishlistRes.json())
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...partyForm,
        }),
      })

      if (response.ok) {
        showNotification('success', '🎉 Party created successfully! Children are excited for the celebration!')
        setPartyForm({ name: '', date: '', location: '', description: '' })
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to create party'}`)
      }
    } catch (error) {
      console.error('Error creating party:', error)
      alert('Failed to create party')
    }
  }

  const handleUpdateParty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingParty) return

    try {
      const response = await fetch('/api/admin/party', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          id: editingParty.id,
          ...partyForm,
        }),
      })

      if (response.ok) {
        showNotification('success', '✨ Party updated successfully! The celebration details are now perfect!')
        setPartyForm({ name: '', date: '', location: '', description: '' })
        setEditingParty(null)
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to update party'}`)
      }
    } catch (error) {
      console.error('Error updating party:', error)
      alert('Failed to update party')
    }
  }

  const handleDeleteParty = async (partyId: number) => {
    if (!confirm('Are you sure you want to delete this party? This will also delete all associated children and pledges.')) return

    try {
      const response = await fetch(`/api/admin/party?id=${partyId}&email=${email}&password=${password}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showNotification('info', '🗑️ Party deleted successfully. The celebration has been cancelled.')
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to delete party'}`)
      }
    } catch (error) {
      console.error('Error deleting party:', error)
      alert('Failed to delete party')
    }
  }

  const startEditParty = (party: Party) => {
    setEditingParty(party)
    setPartyForm({
      name: party.name,
      date: new Date(party.date).toISOString().slice(0, 16),
      location: party.location,
      description: party.description || '',
    })
  }

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...childForm,
          wishlist: childForm.wishlist.filter(item => item.trim() !== ''),
        }),
      })

      if (response.ok) {
        showNotification('success', '👶 Child added successfully! Their Christmas wishes are now waiting for a kind heart!')
        setChildForm({ name: '', age: '', partyId: '', wishlist: [''] })
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to create child'}`)
      }
    } catch (error) {
      console.error('Error creating child:', error)
      alert('Failed to create child')
    }
  }

  const handleUpdateChild = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingChild) return

    try {
      const response = await fetch('/api/admin/child', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          id: editingChild.id,
          ...childForm,
          pledged: editingChild.pledged,
          wishlist: childForm.wishlist.filter(item => item.trim() !== ''),
        }),
      })

      if (response.ok) {
        showNotification('success', '✨ Child updated successfully! Their information is now perfect!')
        setChildForm({ name: '', age: '', partyId: '', wishlist: [''] })
        setEditingChild(null)
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to update child'}`)
      }
    } catch (error) {
      console.error('Error updating child:', error)
      alert('Failed to update child')
    }
  }

  const handleDeleteChild = async (childId: number) => {
    if (!confirm('Are you sure you want to delete this child? This will also delete their wishlist and pledges.')) return

    try {
      const response = await fetch(`/api/admin/child?id=${childId}&email=${email}&password=${password}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showNotification('info', '🗑️ Child removed successfully. We hope they find happiness elsewhere.')
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to delete child'}`)
      }
    } catch (error) {
      console.error('Error deleting child:', error)
      alert('Failed to delete child')
    }
  }

  const startEditChild = (child: Child) => {
    setEditingChild(child)
    setChildForm({
      name: child.name,
      age: child.age.toString(),
      partyId: child.partyId.toString(),
      wishlist: child.wishlist.map(item => item.text),
    })
  }

  const handleAddWishlistItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...wishlistForm,
        }),
      })

      if (response.ok) {
        showNotification('success', '🎁 Wish added successfully! Another dream is now waiting to come true!')
        setWishlistForm({ childId: '', text: '' })
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to add wishlist item'}`)
      }
    } catch (error) {
      console.error('Error adding wishlist item:', error)
      alert('Failed to add wishlist item')
    }
  }

  const handleUpdateWishlistItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWishlist) return

    try {
      const response = await fetch('/api/admin/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          id: editingWishlist.id,
          ...wishlistForm,
        }),
      })

      if (response.ok) {
        showNotification('success', '✨ Wish updated successfully! The dream has been perfected!')
        setWishlistForm({ childId: '', text: '' })
        setEditingWishlist(null)
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to update wishlist item'}`)
      }
    } catch (error) {
      console.error('Error updating wishlist item:', error)
      alert('Failed to update wishlist item')
    }
  }

  const handleDeleteWishlistItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this wishlist item?')) return

    try {
      const response = await fetch(`/api/admin/wishlist?id=${itemId}&email=${email}&password=${password}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showNotification('info', '🗑️ Wish removed successfully. The child still has other dreams!')
        loadData()
      } else {
        const error = await response.json()
        showNotification('error', `❌ ${error.error || 'Failed to delete wishlist item'}`)
      }
    } catch (error) {
      console.error('Error deleting wishlist item:', error)
      alert('Failed to delete wishlist item')
    }
  }

  const startEditWishlist = (item: WishlistItem) => {
    setEditingWishlist(item)
    setWishlistForm({
      childId: item.childId.toString(),
      text: item.text,
    })
  }

  const addWishlistItem = () => {
    setChildForm(prev => ({
      ...prev,
      wishlist: [...prev.wishlist, '']
    }))
  }

  const updateWishlistItem = (index: number, value: string) => {
    setChildForm(prev => ({
      ...prev,
      wishlist: prev.wishlist.map((item, i) => i === index ? value : item)
    }))
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-unchain-green">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md border-2 border-unchain-yellow">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-unchain-blue text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back/Home Navigation */}
      <div className="mb-6">
        <a href="/" className="inline-flex items-center bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          ← 🏠 Back to Home
        </a>
      </div>

      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">
              {notification.type === 'success' ? '✅' :
               notification.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-unchain-green animate-float">🎄 Admin Panel 🎄</h1>

      {/* Export to Excel */}
      <div className="mb-8 bg-gradient-to-r from-unchain-blue to-blue-500 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 Export Data to Excel</h2>
            <p className="text-blue-100">Download comprehensive reports of parties, children, and pledges</p>
          </div>
          <button
            onClick={async () => {
              try {
                const response = await fetch(`/api/admin/export?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
                if (response.ok) {
                  const blob = await response.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `unchain-christmas-report-${new Date().toISOString().split('T')[0]}.xlsx`
                  document.body.appendChild(a)
                  a.click()
                  window.URL.revokeObjectURL(url)
                  document.body.removeChild(a)
                  showNotification('success', '✅ Excel report downloaded successfully! Your Christmas data is ready!')
                } else {
                  const error = await response.json()
                  showNotification('error', `❌ ${error.error || 'Failed to export data'}`)
                }
              } catch (error) {
                console.error('Export error:', error)
                showNotification('error', '❌ Failed to export data. Please try again.')
              }
            }}
            className="bg-white text-unchain-blue font-bold px-6 py-3 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            📥 Download Excel Report
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('party')
              setEditingParty(null)
              setPartyForm({ name: '', date: '', location: '', description: '' })
            }}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'party'
                ? 'bg-unchain-blue text-white shadow-lg transform scale-105'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            🎪 Manage Parties
          </button>
          <button
            onClick={() => {
              setActiveTab('child')
              setEditingChild(null)
              setChildForm({ name: '', age: '', partyId: '', wishlist: [''] })
            }}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'child'
                ? 'bg-unchain-blue text-white shadow-lg transform scale-105'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            👶 Manage Children
          </button>
          <button
            onClick={() => {
              setActiveTab('wishlist')
              setEditingWishlist(null)
              setWishlistForm({ childId: '', text: '' })
            }}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'wishlist'
                ? 'bg-unchain-blue text-white shadow-lg transform scale-105'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            🎁 Manage Wishlists
          </button>
        </div>

        {activeTab === 'party' && (
          <div className="space-y-8">
            <form onSubmit={editingParty ? handleUpdateParty : handleCreateParty} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h2 className="text-2xl font-bold mb-6 text-unchain-blue">
                {editingParty ? '✏️ Edit Party' : '🎪 Add New Party'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Party Name</label>
                  <input
                    type="text"
                    value={partyForm.name}
                    onChange={(e) => setPartyForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={partyForm.date}
                    onChange={(e) => setPartyForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">Location</label>
                  <input
                    type="text"
                    value={partyForm.location}
                    onChange={(e) => setPartyForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">Description</label>
                  <textarea
                    value={partyForm.description}
                    onChange={(e) => setPartyForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-unchain-green to-green-500 text-white font-bold px-8 py-3 rounded-full hover:from-green-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {editingParty ? '💾 Update Party' : '🎉 Create Party'}
                </button>
                {editingParty && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingParty(null)
                      setPartyForm({ name: '', date: '', location: '', description: '' })
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Parties List */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h3 className="text-2xl font-bold mb-6 text-unchain-blue">📋 All Parties</h3>
              <div className="space-y-4">
                {parties.map(party => (
                  <div key={party.id} className="bg-gradient-to-r from-white to-unchain-yellow/20 p-6 rounded-xl border-2 border-unchain-yellow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-unchain-blue mb-2">{party.name}</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <p><strong>📅 Date:</strong> {new Date(party.date).toLocaleDateString()}</p>
                          <p><strong>📍 Location:</strong> {party.location}</p>
                          <p><strong>👶 Children:</strong> {party.children.length}</p>
                        </div>
                        {party.description && <p className="mt-2 text-gray-600">{party.description}</p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditParty(party)}
                          className="bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteParty(party.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {parties.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No parties yet. Create your first party above! 🎪</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'child' && (
          <div className="space-y-8">
            <form onSubmit={editingChild ? handleUpdateChild : handleCreateChild} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h2 className="text-2xl font-bold mb-6 text-unchain-blue">
                {editingChild ? '👶 Edit Child' : '👶 Add New Child'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Child Name</label>
                  <input
                    type="text"
                    value={childForm.name}
                    onChange={(e) => setChildForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Age</label>
                  <input
                    type="number"
                    value={childForm.age}
                    onChange={(e) => setChildForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    required
                    min="1"
                    max="18"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">Christmas Party</label>
                  <select
                    value={childForm.partyId}
                    onChange={(e) => setChildForm(prev => ({ ...prev, partyId: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none bg-white"
                    required
                  >
                    <option value="">🎪 Select a party...</option>
                    {parties.map(party => (
                      <option key={party.id} value={party.id}>
                        🎄 {party.name} - {party.location} ({new Date(party.date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">🎁 Wishlist Items</label>
                  {childForm.wishlist.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateWishlistItem(index, e.target.value)}
                        className="flex-1 p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                        placeholder={`What does this child want for Christmas? 🎁`}
                      />
                      {childForm.wishlist.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setChildForm(prev => ({
                              ...prev,
                              wishlist: prev.wishlist.filter((_, i) => i !== index)
                            }))
                          }}
                          className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addWishlistItem}
                    className="bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Add Another Wish
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-unchain-green to-green-500 text-white font-bold px-8 py-3 rounded-full hover:from-green-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {editingChild ? '💾 Update Child' : '🎉 Add Child'}
                </button>
                {editingChild && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingChild(null)
                      setChildForm({ name: '', age: '', partyId: '', wishlist: [''] })
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Children List Grouped by Party */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h3 className="text-2xl font-bold mb-6 text-unchain-blue">👶 Children by Party</h3>
              <div className="space-y-8">
                {parties.map(party => {
                  const partyChildren = children.filter(child => child.partyId === party.id)
                  if (partyChildren.length === 0) return null

                  return (
                    <div key={party.id} className="border-2 border-unchain-yellow/50 rounded-xl p-6 bg-gradient-to-r from-unchain-yellow/10 to-white">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-unchain-yellow">
                        <div>
                          <h4 className="text-xl font-bold text-unchain-blue flex items-center">
                            🎪 {party.name}
                            <span className="ml-3 bg-unchain-blue text-white px-3 py-1 rounded-full text-sm font-bold">
                              {partyChildren.length} children
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            📅 {new Date(party.date).toLocaleDateString()} • 📍 {party.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-unchain-green">
                            🎉 {partyChildren.filter(c => c.pledged).length} Pledged
                          </div>
                          <div className="text-sm font-semibold text-unchain-orange">
                            ⏳ {partyChildren.filter(c => !c.pledged).length} Waiting
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {partyChildren.map(child => (
                          <div key={child.id} className="bg-white p-4 rounded-lg border-2 border-unchain-yellow/30 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-bold text-unchain-blue">{child.name}</h5>
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    child.pledged
                                      ? 'bg-unchain-green text-white'
                                      : 'bg-unchain-orange text-white'
                                  }`}>
                                    {child.pledged ? '🎉' : '⏳'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">🎂 Age: {child.age}</p>
                                <div>
                                  <p className="font-semibold text-sm mb-1">🎁 Wishes:</p>
                                  {child.wishlist.length > 0 ? (
                                    <ul className="list-disc list-inside text-xs space-y-1 text-gray-700">
                                      {child.wishlist.slice(0, 2).map(item => (
                                        <li key={item.id} className="truncate">{item.text}</li>
                                      ))}
                                      {child.wishlist.length > 2 && (
                                        <li className="text-unchain-blue font-medium">
                                          +{child.wishlist.length - 2} more wishes...
                                        </li>
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">No wishes added yet</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 ml-2">
                                <button
                                  onClick={() => startEditChild(child)}
                                  className="bg-unchain-blue text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                  title="Edit child"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteChild(child.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                  title="Delete child"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {children.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No children yet. Add the first child above! 👶</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-8">
            <form onSubmit={editingWishlist ? handleUpdateWishlistItem : handleAddWishlistItem} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h2 className="text-2xl font-bold mb-6 text-unchain-blue">
                {editingWishlist ? '🎁 Edit Wishlist Item' : '🎁 Add Wishlist Item'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">Select Child</label>
                  <select
                    value={wishlistForm.childId}
                    onChange={(e) => setWishlistForm(prev => ({ ...prev, childId: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none bg-white"
                    required
                  >
                    <option value="">👶 Select a child...</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>
                        👶 {child.name} (Age {child.age}) - {child.party.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-semibold">🎁 Wish Description</label>
                  <input
                    type="text"
                    value={wishlistForm.text}
                    onChange={(e) => setWishlistForm(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full p-3 border-2 border-unchain-yellow rounded-lg focus:border-unchain-blue focus:outline-none"
                    placeholder="What does this child want for Christmas?"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-unchain-green to-green-500 text-white font-bold px-8 py-3 rounded-full hover:from-green-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {editingWishlist ? '💾 Update Wish' : '🎉 Add Wish'}
                </button>
                {editingWishlist && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWishlist(null)
                      setWishlistForm({ childId: '', text: '' })
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Wishlist Items List */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-4 border-unchain-yellow">
              <h3 className="text-2xl font-bold mb-6 text-unchain-blue">🎁 All Wishes</h3>
              <div className="space-y-4">
                {wishlistItems.map(item => (
                  <div key={item.id} className="bg-gradient-to-r from-white to-unchain-yellow/20 p-6 rounded-xl border-2 border-unchain-yellow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="text-lg font-bold text-unchain-red">🎁 {item.text}</h4>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>👶 Child:</strong> {item.child.name} (Age {item.child.age})</p>
                          <p><strong>🎪 Party:</strong> {item.child.party.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditWishlist(item)}
                          className="bg-unchain-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWishlistItem(item.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {wishlistItems.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No wishes yet. Add the first wish above! 🎁</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}