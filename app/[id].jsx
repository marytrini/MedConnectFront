import style from "detail.module.css";

export default function Detail({ data }) {
  return (
    <div className={style.containAll}>
      <img src={data.image} alt="NOT FOUND" width={500} height={300} />
      <h1>{data.name}</h1>
      <h4>{data.description}</h4>
    </div>
  );
}

const backendURL = process.env.PUBLIC_BACKEND_URL;
const specializationsURL = `${backendURL}/specializations`;

export async function getStaticPaths() {
  try {
    const res = await fetch(
      specializationsURL
    );
    const data = await res.json();
    const paths = data.map(({ id }) => ({ params: { id: `${id}` } }));

    console.log(paths);
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(
      `${specializationsURL}/${params.id}`
    );
    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
