import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const tage = ["Mo", "Di", "Mi", "Do", "Fr"];

export default function Kalender() {
  const [dienstplan, setDienstplan] = useState([]);
  const [antraege, setAntraege] = useState([]);
  const [woche, setWoche] = useState([]);

  useEffect(() => {
    const dp = localStorage.getItem("dienstplan");
    if (dp) setDienstplan(JSON.parse(dp));

    const urlaub = localStorage.getItem("urlaubsantraege");
    if (urlaub) setAntraege(JSON.parse(urlaub));
  }, []);

  useEffect(() => {
    const montags = dienstplan.filter((e) => {
      const d = new Date(e.datum);
      return d.getDay() === 1;
    });

    if (montags.length > 0) {
      const start = new Date(montags[0].datum);
      const tage = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        tage.push(d.toISOString().split("T")[0]);
      }
      setWoche(tage);
    }
  }, [dienstplan]);

  const mitarbeiterNamen = Array.from(new Set(dienstplan.map((e) => e.name)));

  const urlaubMap = {};
  antraege
    .filter((a) => a.status === "Genehmigt")
    .forEach((a) => {
      const start = new Date(a.von);
      const end = new Date(a.bis);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const tag = d.toISOString().split("T")[0];
        urlaubMap[`${a.name}_${tag}`] = true;
      }
    });

  const farbe = (text) => {
    if (text === "Urlaub") return "#ffcc99";
    if (text.includes("Früh")) return "#cce5ff";
    if (text.includes("Spät")) return "#f8d7da";
    if (text.includes("Schule")) return "#fff3cd";
    if (text.includes("Teilzeit")) return "#d1ecf1";
    if (text.includes("Frei")) return "#e2e3e5";
    return "white";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Kalenderansicht – inkl. Urlaub</h1>
      {woche.length === 0 ? (
        <p>Keine Daten verfügbar.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Mitarbeiter</th>
              {woche.map((d, i) => (
                <th key={i}>{tage[i]}<br />{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mitarbeiterNamen.map((name) => (
              <tr key={name}>
                <td><strong>{name}</strong></td>
                {woche.map((tag, i) => {
                  const key = `${name}_${tag}`;
                  const istUrlaub = urlaubMap[key];
                  const eintrag = dienstplan.find((e) => e.name === name && e.datum === tag);
                  const text = istUrlaub ? "Urlaub" : (eintrag?.schicht || "-");
                  return (
                    <td key={i} style={{ backgroundColor: farbe(text) }}>
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
