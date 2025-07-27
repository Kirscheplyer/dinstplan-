import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function Mitarbeiter() {
  const { user } = useUser();
  const isAdmin = user?.id === "user_30NpYU323qGA3LO4JedrBWRQXXP";

  const [liste, setListe] = useState([]);
  const [name, setName] = useState("");
  const [rolle, setRolle] = useState("Azubi");
  const [regel, setRegel] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("mitarbeiterListe");
    if (data) {
      setListe(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(liste));
  }, [liste]);

  const hinzufuegen = () => {
    if (!name.trim()) return;
    const neu = { name, rolle, regel };
    setListe([...liste, neu]);
    setName("");
    setRolle("Azubi");
    setRegel("");
  };

  const bearbeiten = (index, feld, wert) => {
    const kopie = [...liste];
    kopie[index][feld] = wert;
    setListe(kopie);
  };

  const loeschen = (index) => {
    const kopie = [...liste];
    kopie.splice(index, 1);
    setListe(kopie);
  };

  if (!isAdmin) {
    return <div style={{ padding: "2rem" }}>Kein Zugriff – nur für Admins</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Mitarbeiterverwaltung</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Neuen Mitarbeiter hinzufügen</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={rolle} onChange={(e) => setRolle(e.target.value)}>
          <option value="Azubi">Azubi</option>
          <option value="ZFA">ZFA</option>
          <option value="Teamleitung">Teamleitung</option>
          <option value="Admin">Admin</option>
        </select>
        <input type="text" placeholder="Schulzeit-Regel (optional)" value={regel} onChange={(e) => setRegel(e.target.value)} />
        <button onClick={hinzufuegen}>Hinzufügen</button>
      </div>

      <h2>Aktuelle Mitarbeiter</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rolle</th>
            <th>Schulzeit-Regel</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((m, index) => (
            <tr key={index}>
              <td>
                <input value={m.name} onChange={(e) => bearbeiten(index, "name", e.target.value)} />
              </td>
              <td>
                <select value={m.rolle} onChange={(e) => bearbeiten(index, "rolle", e.target.value)}>
                  <option value="Azubi">Azubi</option>
                  <option value="ZFA">ZFA</option>
                  <option value="Teamleitung">Teamleitung</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <input value={m.regel} onChange={(e) => bearbeiten(index, "regel", e.target.value)} />
              </td>
              <td>
                <button onClick={() => loeschen(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
