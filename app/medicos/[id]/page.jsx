"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import Warning from "../../components/warning/Warning";

const backendURL = process.env.PUBLIC_BACKEND_URL;
const medicsURL = `${backendURL}/medics`;


export default function Page() {
  const [error, setError] = useState({
    text: "",
    alert: false,
  });
  const [data, setData] = useState({});

  const { id } = useParams();

  async function fetchData(id) {
    try {
      const response = await axios.get(`${medicsURL}/${id}`);
      setData(response.data);
    } catch (error) {
      setError({ ...error, text: error.message, alert: true });
    }
  }
  useEffect(() => {
    fetchData(id);
  }, [id]);
  const FinishFailed = () => {
    setError({ ...error, text: "", alert: false });
  };
  const espe = data.id && data.specializations.map((spec) => spec.name);
  console.log(data);
  return (
    <div>
      <Warning
        alert={error.alert}
        text={error.text}
        FinishFailed={FinishFailed}
      ></Warning>
      <section className={styles.container}>
        <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="flex flex-wrap items-center mx-auto max-w-7xl">
            <div className="w-full lg:max-w-lg lg:w-1/2 rounded-xl">
              <div>
                <div className="relative w-full max-w-lg">
                  <div className="absolute top-0 rounded-full bg-violet-300 -left-4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>

                  <div className="absolute rounded-full bg-fuchsia-300 -bottom-24 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <Image
                      className="object-cover object-center mx-auto rounded-lg shadow-2xl max-w-[70%] sm:w-full md:w-full"
                      alt="NOT_FOUNT"
                      src="https://img.freepik.com/vector-gratis/ilustracion-clinica-doctor_1270-69.jpg?w=2000"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start mt-12 mb-12 text-left lg:flex-grow lg:w-1/2 lg:pl-6 xl:pl-14 md:mb-0 xl:mt-0">
              <h1 className="mb-8 text-4xl font-sans leading-none tracking-tighter text-neutral-600 md:text-7xl lg:text-5xl">
                {data.id
                  ? `Dr. ${data.user.first_name} ${data.user.last_name}`
                  : "...Loading"}
              </h1>
              <ul className=" text-base flex leading-relaxed text-left text-gray-500 font-bold">
                Especialidades:{" "}
                {data.id &&
                  espe.map((data) => (
                    <li className="flex font-sans ml-8" key={data}>
                      <span> 🟣 {data}</span>
                    </li>
                  ))}
              </ul>
              <div className="flex-col mt-0 lg:mt-6 max-w-7xl sm:flex">
                <dl className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  <div>
                    <dd className="flex-grow">
                      <h2 className="mb-3 text-lg font-sans tracking-tighter text-neutral-600">
                        Titulo:{" "}
                        {data.medicoCalification
                          ? data.medicoCalification.academic_degree
                          : "..."}
                      </h2>
                      <ul className="text-base leading-relaxed text-gray-400">
                        {data.medicoCalification
                          ? data.medicoCalification.certifications.map(
                              (cer) => <li key={cer}>{cer}</li>
                            )
                          : "..."}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dd className="flex-grow">
                      <h2 className="mb-3 text-lg font-sans tracking-tighter text-neutral-600">
                        Contactos:{" "}
                      </h2>
                      <p className="text-base leading-relaxed text-gray-400">
                        {data.phone}
                      </p>
                    </dd>
                    <h2>Años de Experiencia: </h2>
                    <p>
                      {data.medicoCalification
                        ? data.medicoCalification.years_of_experience
                        : "..."}{" "}
                      Años
                    </p>
                    {data.id ? (
                      <>
                        <p>
                          Horario: de{" "}
                          {data.schedules.length &&
                            data.schedules[0].start_time}{" "}
                          hasta {data.schedules[0].end_time}{" "}
                        </p>
                      </>
                    ) : (
                      <p>No tiene horarios...</p>
                    )}
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Link href="/" as="/">
        <button
          type="button"
          className={`btn_return_home text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${styles.btn_return_home}`}
        >
          Inicio
        </button>
      </Link>{" "}
      <Link href="/citas" as="/citas">
        <button
          // onClick={goBack}
          type="button"
          className={`btn_return_citas text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${styles.btn_return_citas}`}
        >
          Citas
        </button>
      </Link>
    </div>
  );
}
