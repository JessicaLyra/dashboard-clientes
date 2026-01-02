'use client'

import { useEffect, useState } from 'react'

/* =======================
   TIPOS
======================= */
type Client = {
  id: string
  name: string
  email: string
}

type Site = {
  id: string
  name: string
  url: string
  status: 'ATIVO' | 'FORA_DO_AR' | 'MANUTENCAO'
  clientId: string
}

/* =======================
   STATUS CONFIG
======================= */
function getStatusConfig(status: Site['status']) {
  switch (status) {
    case 'ATIVO':
      return {
        label: 'Ativo',
        className: 'bg-green-100 text-green-700 border-green-300',
        icon: '🟢',
      }
    case 'FORA_DO_AR':
      return {
        label: 'Fora do ar',
        className: 'bg-red-100 text-red-700 border-red-300',
        icon: '🔴',
      }
    case 'MANUTENCAO':
      return {
        label: 'Manutenção',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: '🟡',
      }
  }
}

export default function Home() {
  /* =======================
     ESTADOS
  ======================= */
  const [clients, setClients] = useState<Client[]>([])
  const [sites, setSites] = useState<Site[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingClientId, setEditingClientId] = useState<string | null>(null)

  const [showSiteModal, setShowSiteModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [siteStatus, setSiteStatus] = useState<Site['status']>('ATIVO')
  const [selectedClient, setSelectedClient] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  /* =======================
     FETCH
  ======================= */
  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(setClients)
    fetch('/api/sites').then(r => r.json()).then(setSites)
  }, [])

  /* =======================
     CLIENTES
  ======================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    if (editingClientId) {
      const res = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingClientId, name, email }),
      })
      const updated = await res.json()
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c))
      setEditingClientId(null)
    } else {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const created = await res.json()
      setClients(prev => [created, ...prev])
    }

    setName('')
    setEmail('')
    setIsLoading(false)
  }

  function handleEditClient(client: Client) {
    setName(client.name)
    setEmail(client.email)
    setEditingClientId(client.id)
  }

  async function handleDeleteClient(id: string) {
    if (!confirm('Excluir cliente?')) return
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })
    setClients(prev => prev.filter(c => c.id !== id))
  }

  /* =======================
     SITES
  ======================= */
  function getSitesByClient(clientId: string) {
    return sites.filter(site => site.clientId === clientId)
  }

  async function handleSaveSite() {
    if (editingSite) {
      const res = await fetch('/api/sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSite.id,
          name: siteName,
          url: siteUrl,
          status: siteStatus,
        }),
      })
      const updated = await res.json()
      setSites(prev => prev.map(s => s.id === updated.id ? updated : s))
    } else {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: siteName,
          url: siteUrl,
          status: siteStatus,
          clientId: selectedClient,
        }),
      })
      const created = await res.json()
      setSites(prev => [created, ...prev])
    }

    setShowSiteModal(false)
    setEditingSite(null)
    setSiteName('')
    setSiteUrl('')
    setSiteStatus('ATIVO')
  }

  async function handleDeleteSite(id: string) {
    if (!confirm('Excluir site?')) return
    await fetch(`/api/sites?id=${id}`, { method: 'DELETE' })
    setSites(prev => prev.filter(s => s.id !== id))
  }

  function handleEditSite(site: Site) {
    setEditingSite(site)
    setSiteName(site.name)
    setSiteUrl(site.url)
    setSiteStatus(site.status)
    setSelectedClient(site.clientId)
    setShowSiteModal(true)
  }

  /* =======================
     JSX
  ======================= */
  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Dashboard de Clientes
      </h1>

      {/* FORM CLIENTE */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-xl space-y-4"
      >
        <input
          className="w-full border border-slate-300 rounded px-3 py-2"
          placeholder="Nome do cliente"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full border border-slate-300 rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
        >
          {editingClientId ? 'Atualizar cliente' : 'Cadastrar cliente'}
        </button>
      </form>

      {/* LISTA */}
      <div className="mt-10 space-y-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-xl shadow-md p-6">
            {/* CLIENTE */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {client.name}
                </p>
                <p className="text-sm text-slate-500">{client.email}</p>
              </div>

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => handleEditClient(client)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>

            {/* ADD SITE */}
            <button
              onClick={() => {
                setSelectedClient(client.id)
                setShowSiteModal(true)
              }}
              className="mt-4 text-sm text-blue-600 font-medium"
            >
              + Adicionar site
            </button>

            {/* SITES */}
            <div className="mt-4 space-y-3">
              {getSitesByClient(client.id).map(site => {
                const status = getStatusConfig(site.status)
                return (
                  <div
                    key={site.id}
                    className="flex justify-between items-center bg-slate-50 border rounded-lg p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-700">{site.name}</p>
                      <p className="text-xs text-slate-500">{site.url}</p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 border rounded-full font-medium ${status.className}`}
                    >
                      {status.icon} {status.label}
                    </span>

                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => handleEditSite(site)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL SITE */}
      {showSiteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            <h2 className="text-lg font-semibold">
              {editingSite ? 'Editar site' : 'Cadastrar site'}
            </h2>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Nome do site"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="URL"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={siteStatus}
              onChange={e => setSiteStatus(e.target.value as Site['status'])}
            >
              <option value="ATIVO">Ativo</option>
              <option value="FORA_DO_AR">Fora do ar</option>
              <option value="MANUTENCAO">Manutenção</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSiteModal(false)}>
                Cancelar
              </button>
              <button
                onClick={handleSaveSite}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
