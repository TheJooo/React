import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface User {
  cpf: string;
  nome: string;
  anoNascimento: number;
  endereco: string;
  genero: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    cpf: "",
    nome: "",
    anoNascimento: new Date().getFullYear(),
    endereco: "",
    genero: "Masculino"
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(res.data);
    } catch {
      setError("Erro ao buscar usuários");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "anoNascimento" ? parseInt(value) : value
    }));
  };

  const handleCreate = async () => {
    if (formData.cpf.length !== 11) {
      return setError("CPF deve conter 11 dígitos");
    }
    try {
      await axios.post(`${API_URL}/users`, formData);
      setFormData({ cpf: "", nome: "", anoNascimento: new Date().getFullYear(), endereco: "", genero: "Masculino" });
      setError(null);
      loadUsers();
    } catch {
      setError("Erro ao criar usuário");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/users/${formData.cpf}`, formData);
      setFormData({ cpf: "", nome: "", anoNascimento: new Date().getFullYear(), endereco: "", genero: "Masculino" });
      setEditing(false);
      setError(null);
      loadUsers();
    } catch {
      setError("Erro ao atualizar usuário");
    }
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditing(true);
  };

  const handleDelete = async (cpf: string) => {
    try {
      await axios.delete(`${API_URL}/users/${cpf}`);
      loadUsers();
    } catch {
      setError("Erro ao deletar usuário");
    }
  };

  const resetForm = () => {
    setFormData({ cpf: "", nome: "", anoNascimento: new Date().getFullYear(), endereco: "", genero: "Masculino" });
    setEditing(false);
    setError(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, textAlign: "center" }}>
      <h2>Gerenciador de Usuários</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          name="cpf"
          value={formData.cpf}
          disabled={editing}
          onChange={handleChange}
          placeholder="CPF (11 dígitos)"
        />
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
          style={{ marginLeft: "5px" }}
        />
        <input
          name="anoNascimento"
          type="number"
          value={formData.anoNascimento}
          onChange={handleChange}
          placeholder="Ano de nascimento"
          style={{ marginLeft: "5px" }}
        />
        <input
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          placeholder="Endereço"
          style={{ marginLeft: "5px" }}
        />
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          style={{ marginLeft: "5px" }}
        >
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
        </select>

        <button
          onClick={editing ? handleUpdate : handleCreate}
          style={{ marginLeft: "10px" }}
        >
          {editing ? "Atualizar" : "Criar"}
        </button>

        {editing && (
          <button onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.cpf}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginTop: "10px",
              textAlign: "left"
            }}
          >
            <strong>Nome:</strong> {user.nome}<br />
            <strong>CPF:</strong> {user.cpf}<br />
            <strong>Ano de Nascimento:</strong> {user.anoNascimento}<br />
            <strong>Endereço:</strong> {user.endereco}<br />
            <strong>Gênero:</strong> {user.genero}<br />
            <button onClick={() => handleEdit(user)} style={{ marginRight: "10px" }}>
              Editar
            </button>
            <button onClick={() => handleDelete(user.cpf)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
