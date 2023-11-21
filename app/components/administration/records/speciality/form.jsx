"use client";
import React, { useState } from "react";
import styles from "./form.module.css";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { Container } from "reactstrap";
import Dropzone from "react-dropzone";
import { SHA1 } from "crypto-js";
import Success from "@/app/components/success/Success";
import Warning from "@/app/components/warning/Warning";
import { useRouter } from "next/navigation";
const backendURL = process.env.PUBLIC_BACKEND_URL;
const specializationsURL = `${backendURL}/specializations`;
import { useSelector } from "react-redux";


export default function form({info}) {
  const [registered, setRegistered] = useState(false);
  const [image, setImage] = useState({array:[info.url]})
  const [loading, setLoading] = useState ("")
  const [url, setUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [error, setError]= useState({
    alert:false,
    text:'Error al crear especialidad, el servidor esta caido o la especialidad ya existe'
  })
  const [success,setSuccess]=useState({
    alert:false,
    text:'Especialidad Actualizada exitosamente',
  })
  
  
  

  const onSubmit = (values) => {
    setRegistered(!registered);
    const { description, name } = values;
    
    const data = `${specializationsURL}/${info.id}`;
    const body = {
      description,
      name,
      url: info.url,
    };
    console.log("esto es body: ", body);
    axios
      .put(data, body, { withCredentials: true })
      .then(() => {
        // Código para manejar la respuesta en caso de éxito
        setSuccess({ ...success, alert: true });
      })
      .catch(() => {
        // Código para manejar la respuesta en caso de error
        setError({ ...error, alert: true });
      });
  };

  const handleDrop = (files) => {
    const uploaders = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", `codeinfuse, medium, gist`);
      formData.append("upload_preset", "MedConnect");
      formData.append("api_key", "977319699313977");
      formData.append("timestamp", (Date.now() / 1000) | 0);
      setLoading("true");
      return axios
        .post(
          "https://api.cloudinary.com/v1_1/dipgqcdtq/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          const data = response.data;

          const fileURL = data.secure_url;
          setUrl(data.secure_url);

          let specificArrayInObject = image.array;
          specificArrayInObject.push(fileURL);
          const newobj = { ...image, specificArrayInObject };
          setImage(newobj);
          setPublicId(data.public_id);
        });
    });
    axios.all(uploaders).then(() => {
      setLoading("false");
    });
  };

  const generateSHA1 = (data) => {
    return SHA1(data).toString();
  };

  const generateSinature = (publicId, apiSecret) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  };

  const deleteImag = async () => {
    const url = "https://api.cloudinary.com/v1_1/dipgqcdtq/image/destroy";
    const timestamp = new Date().getTime();
    const apiKey = "977319699313977";
    const apiSecret = "45snDqDmumENYPAmz0UET_PYGH4";
    const signature = generateSHA1(generateSinature(publicId, apiSecret));

    try {
      const response = await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      setImage({ array: [] });
    } catch (error) {}
  };

  function imagePreview() {
    if (loading === "true") {
      return <h3>Cargando Imagenes...</h3>;
    }
    if (loading === "false") {
      return (
        <h3>
          {image.array.length <= 0 ? (
            <h1>No Hay Imagen</h1>
          ) : (
            image.array.map((items, index) => (
              <img
                key={index}
                alt="Imagen"
                // className="h-16 w-28 pr-4 bg-cover "
                style={{
                  width: "125px",
                  height: "70px",
                  backgroundSize: "cover",
                  paddingRight: "15px",
                }}
                src={items}
              ></img>
            ))
          )}
        </h3>
      );
    }
  }
  const [form] = Form.useForm();
  const FinishFailed = () => {
    setError({ ...error, alert: false });
  };
  const successFunc = () => {
    setSuccess({ ...success, alert: false });
  };

  return (

        

  <div className={styles.container + " top-1/3 "}>
    <Warning alert={error.alert} text={error.text} FinishFailed={FinishFailed}></Warning>
    <Success alert={success.alert} text={success.text} success={successFunc} ></Success>
        <h1 className={styles.title}>Editar Especialidad</h1>
          <Form className={styles.form} labelCol={{   span: 6, }} wrapperCol={{   span: 15, }} layout="horizontal" form={form} onFinish={(values)=>{onSubmit(values); form.resetFields(); setImage({array:[]})} }>
    
          <Form.Item name="name" label="Especialidad" 
                rules={[
                  {required:true,
                  message:"Por favor ingrese una especialidad"},
                ]}
                hasFeedback
                initialValue={info.name}
              >
                  <Input
                    name="name"
                   
                    />
              </Form.Item>
                          
              <Form.Item name="description" label="Descripción"
                rules={[
                  {required:true,
                  message:"Por favor ingrese una descripción"},
                ]}
                hasFeedback
                initialValue={info.description}
              >
                  <Input.TextArea
  name="description"
  
  style={{ resize: 'none', overflow: 'hidden',paddingRight: '25px',height:'50px' }}
/>
  
              </Form.Item> 
              <Button  htmlType='submit' className={styles.Button}>Enviar</Button>
            </Form>
        </div>
  )
}

