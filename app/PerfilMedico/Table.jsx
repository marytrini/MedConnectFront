"use client";
import style from "./page.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Cita from "./Cita";

const backendURL = process.env.PUBLIC_BACKEND_URL;
const appointmentURL = `${backendURL}/appointment`;

export default function Table() {
  const [citas, setCitas] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const userLocal = useSelector((state) => state.login.userLocal);

  useEffect(() => {
    if (!citas.id) {
      axios
        .get(appointmentURL)
        .then((res) => {
          setCitas(res.data);
          setLoading(false); // Marcar la carga como completa
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Marcar la carga como completa, incluso si hay error
        });
    }
  }, [citas.id]);

  const getCitasPerfil = () => {
    return citas?.filter((e) => e.user.first_name === userLocal?.first_name);
  };

  const handleCheckChange = async (citaId, scheduledDate, scheduledTime, status) => {
    try {
      const response = await axios.put(`${appointmentURL}/${citaId}`, {
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        status: status,
      });
      console.log("Estado de la cita actualizado:", response.data);
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      // Podrías agregar lógica para manejar errores aquí
    }
  };

  useEffect(() => {
    const citasP = getCitasPerfil();
    console.log("get citas perfil: ", citasP);
  }, [citas]);



  return (
    <div
      className={
        style.table_cont + "relative overflow-x-auto shadow-md sm:rounded-lg"
      }
    >
      <h1
        className={
          style.title +
          " mb-8 text-4xl font-sans leading-none tracking-tighter text-neutral-600 md:text-7xl lg:text-5xl"
        }
      >
        Citas Agendadas
      </h1>
      {getCitasPerfil && (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                n#
              </th>
              <th scope="col" className="px-6 py-3">
                Paciente
              </th>
              <th scope="col" className="px-6 py-3">
                Dia
              </th>
              <th scope="col" className="px-6 py-3">
                hora
              </th>

              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Marcar como completado
              </th>
            </tr>
          </thead>
          <tbody>
            {getCitasPerfil &&
              getCitasPerfil?.map((cita, index) => (
                <Cita
                  handleCheckChange={handleCheckChange}
                  cita={cita}
                  index={index}
                />
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
