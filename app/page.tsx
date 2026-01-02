'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: string;
  name: string;
  email: string;
};

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

async function handleLogout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login';
}

  // Buscar clientes ao abrir a página
  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
      });
  }, []);


async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  if (!name || !email) {
    setError('Preencha nome e email');
    return;
  }

  if (!email.includes('@')) {
    setError('Email inválido');
    return;
  }

  setIsLoading(true);

  try {
    // 🟡 EDIÇÃO
    if (editingClientId) {
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingClientId,
          name,
          email,
        }),
      });


      setClients((prev) =>
        prev.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );

      setEditingClientId(null);
      setName('');
      setEmail('');
      return;
    }

    // 🟢 CRIAÇÃO
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const newClient = await response.json();

    setClients((prev) => [...prev, newClient]);
    setName('');
    setEmail('');
  } finally {
    setIsLoading(false);
  }
}
async function confirmDelete() {
  if (!clientToDelete) return;

  setIsLoading(true);

  try {
    await fetch(`/api/clients?id=${clientToDelete}`, {
      method: 'DELETE',
    });

    setClients((prev) =>
      prev.filter((client) => client.id !== clientToDelete)
    );
  } finally {
    setIsLoading(false);
    setShowModal(false);
    setClientToDelete(null);
  }
}

function cancelDelete() {
  setShowModal(false);
  setClientToDelete(null);
}




async function handleDelete(id: string) {
  const confirmed = window.confirm(
    'Tem certeza que deseja excluir este cliente?'
  );

  if (!confirmed) return;

  setIsLoading(true);

  try {
    await fetch(`/api/clients?id=${id}`, {
      method: 'DELETE',
    });

    setClients((prev) =>
      prev.filter((client) => client.id !== id)
    );
  } finally {
    setIsLoading(false);
  }
}


const [editingClientId, setEditingClientId] = useState<string | null>(null);
function handleEdit(client: any) {
  setName(client.name);
  setEmail(client.email);
  setEditingClientId(client.id);
}


const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <main style={{ padding: 40 }}>
      <h1 className="text-gray-800 font-bold text-center mb-5 text-2xl">Cadastro de Clientes</h1>
      <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Sair
        </button>

{error && (
  <p className="text-red-600 text-sm">{error}</p>
)


}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-600">
        Confirmar exclusão
      </h2>

      <p className="mb-6 text-gray-600">
        Tem certeza que deseja excluir este cliente?
      </p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={cancelDelete}
          disabled={isLoading}
          className="px-4 py-2 rounded border border-gray-400 text-gray-400"
        >
          Cancelar
        </button>

        <button
          onClick={confirmDelete}
          disabled={isLoading}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-4">
       <input
  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
  placeholder="Nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>


<button
  type="submit"
  disabled={isLoading}
  className={`w-full py-2 rounded transition text-white ${
    isLoading
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'
  }`}
>
  {isLoading
    ? 'Salvando...'
    : editingClientId
    ? 'Atualizar'
    : 'Salvar'}
</button>

      </form>

      <hr />

      <h2 className="text-gray-800 font-bold text-center mt-5">Clientes cadastrados</h2>

     <ul className="mt-6 space-y-3">
  {clients.map((client) => (
    <li
      key={client.id}
      className="flex justify-between items-center border rounded p-3"
    >
      <div>
        <p className="font-semibold text-gray-600">{client.name}</p>
        <p className="text-sm text-gray-600">{client.email}</p>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => handleEdit(client)}
          className="text-blue-600 hover:underline"
        >
          Editar
        </button>

                <button
          onClick={() => {
            setClientToDelete(client.id);
            setShowModal(true);
          }}
          className="text-red-600 hover:underline"
        >
          Excluir
        </button>

      </div>
    </li>
  ))}
</ul>

    </main>
      </div>
</div>
  );



}
