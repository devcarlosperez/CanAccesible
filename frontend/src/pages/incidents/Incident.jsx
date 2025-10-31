import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Background from "../../components/Background";
import {
  getAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../../services/incidentService";

function Incident() {
  const [incidences, setIncidents] = useState([]);
  const [newIncidence, setNewIncident] = useState({});

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {

    } catch (err) {
      console.error("Error cargando incidencias")
    }
  }

  return (
    <section>
      <Background />
      <Header/>
    </section>
  );
}

export default Incident;
