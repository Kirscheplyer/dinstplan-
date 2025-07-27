import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function Auswertung() {
  const { user } = useUser();
  const isAdmin = user?.id === "user_30NpYU323qGA3LO4JedrBWRQXXP";
  const [dienstplan, setDienstplan] = useState([]);
  const [report, setReport] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      setDienstplan(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (dienstplan.length > 0) {
      const auswertung = {};
      dienstplan.forEach((e) => {
        if (!auswertung[e.name]) auswertung[e.name] = 0;
        if (e.schicht.includes("Früh") || e.schicht.includes("Spät")) {
          auswertung[e.name] += 7;
        }
      });
      const tabelle = Object.entries(auswertung).map(([name, stunden]) => ({ name, stunden }));
      setReport(tabelle);
    }
  }, [dienstplan]);

  if (!isAdmin) {
    return <div style={{ padding: "2rem" }}>Kein Zugriff – nur für Admins</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Auswertung: Arbeitszeit</h1>
      <p>Gezählt werden nur Früh- und Spätschichten (je 7 Stunden).</p>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Mitarbeiter</th>
            <th>Stunden</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.stunden} h</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
