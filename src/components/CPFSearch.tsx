import { useState } from "react";
import axios from "axios";
import PongGame from "./PongGame";
import { useNavigate } from "react-router-dom";

interface LookupResult {
  cpf: string;
  name: string;
}

const API_URL = "http://localhost:5000";

export default function CPFSearch() {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [showPong, setShowPong] = useState(false);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    setError(null);
    setLookupResult(null);
    if (!/^\d{11}$/.test(cpf)) {
      setError("Please enter a valid CPF (11 digits)");
      return;
    }
    try {
      const response = await axios.get<LookupResult[]>(`${API_URL}/users?cpf=${cpf}`);
      if (response.data.length > 0) {
        setLookupResult(response.data[0]);
      } else {
        setError("No user found with that CPF");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error fetching data");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h2>CPF Lookup</h2>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="cpf">Enter CPF:</label>
        <br />
        <input
          id="cpf"
          type="text"
          placeholder="Enter 11-digit CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "200px",
            textAlign: "center",
            marginTop: "5px"
          }}
        />
        <br />
        <button
          onClick={fetchUserData}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lookupResult && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#e0ffe0",
            borderRadius: "5px",
            display: "inline-block"
          }}
        >
          <p>
            <strong>CPF:</strong> {lookupResult.cpf}
          </p>
          <p>
            <strong>Name:</strong> {lookupResult.name}
          </p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setShowPong((prev) => !prev)}
          style={{
            padding: "10px 20px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {showPong ? "Close Pong" : "Play Pong"}
        </button>
      </div>

      {showPong && <PongGame onClose={() => setShowPong(false)} />}

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/users")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Go to User Manager
        </button>
      </div>
    </div>
  );
}
