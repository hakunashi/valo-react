import React, { useState, useEffect } from "react";

import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useRef } from "react";

function trierParNom(tableau) {
  return tableau.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexParalax, setIndexPralax] = useState(0);

  const ref = useRef();

  const detectKey = (e) => {
    console.log(e.key);
    if (e.key === "ArrowUp") {
      setIndexPralax((curr) => curr + 1);
    }

    if (e.key === "ArrowDown") {
      setIndexPralax((curr) => curr - 1);
    }
  };

  useEffect(() => {
    // Fonction pour faire la requête API
    const fetchData = async () => {
      try {
        // Appel de l'API
        const response = await fetch(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=fr-FR"
        );
        // Vérification du statut de la réponse
        if (!response.ok) {
          throw new Error("Une erreur est survenue");
        }
        // Récupération des données en format JSON
        const result = await response.json();
        // Mise à jour de l'état avec les données
        setData(result);
      } catch (error) {
        // Gestion des erreurs
        setError(error.message);
      } finally {
        // Arrêter le chargement
        setLoading(false);
      }
    };

    fetchData();

    document.addEventListener("keydown", detectKey);

    console.log(indexParalax);
  }, []); // Le tableau vide [] signifie que la requête est lancée une seule fois au chargement

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const dataSort = trierParNom(data.data);

  return (
    <div>
      <Parallax pages={14} ref={ref}>
        <p> {indexParalax} </p>
        {data &&
          data.data.map((agent, index) => (
            <div key={agent.uuid}>
              <ParallaxLayer
                offset={index}
                speed={0.5}
                style={{
                  backgroundImage: `url(${agent.background})`,
                  backgroundPosition: "left",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              ></ParallaxLayer>

              <ParallaxLayer
                offset={index}
                speed={2}
                style={{
                  backgroundImage: `url(${agent.bustPortrait})`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              ></ParallaxLayer>

              <ParallaxLayer
                offset={index + 0.9}
                speed={1}
                style={{
                  textAlign: "left",
                  fontSize: "3rem",
                  cursor: "pointer",
                  zIndex: "1",
                }}
                onClick={() => {
                  ref.current.scrollTo(index + 1);
                }}
              >
                <h2>{agent.displayName}</h2>
              </ParallaxLayer>

              <ParallaxLayer offset={index} speed={1}>
                <img src={agent.role.displayIcon} alt="" />
              </ParallaxLayer>

              <ParallaxLayer offset={index} speed={1}>
                <ul className="abilities">
                  {agent.abilities.map((ability, i) => (
                    <li
                      key={i}
                      onMouseEnter={() => {
                        //console.log(ability.displayName);
                      }}
                    >
                      <img src={ability.displayIcon} alt="" />
                    </li>
                  ))}
                </ul>
              </ParallaxLayer>
            </div>
          ))}
      </Parallax>
    </div>
  );
}

export default App;
