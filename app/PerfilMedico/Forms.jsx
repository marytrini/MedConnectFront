
"use client"
import style from './Forms.module.css'
import {Button,Form,Input,Radio,Alert, Select} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from "react-redux"
import axios from "axios"
import { getSpeciality, getCities } from "../redux/reducer";
import { Option } from 'antd/es/mentions';

const backendURL = process.env.PUBLIC_BACKEND_URL;
const specializationsURL = `${backendURL}/specializations`;
const citiesURL = `${backendURL}/cities`;
const createMedicsURL = `${backendURL}/medics/create`;


export default function Forms({ userLocal }) {
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const dispatch = useDispatch();
  const especialidades = useSelector((state) => state.speciality.AllSpecial);

  const globalCities = useSelector((state)=>state.speciality.cities)


  
  const filtro = data.filter(e=>e.deletedAt===null)


  async function fetchData() {
    try {
      const response = await axios.get(specializationsURL);
      const resCities = await axios.get(citiesURL)

      dispatch(getSpeciality(response.data));
      dispatch(getCities(resCities.data))
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCities(globalCities)
    setData(especialidades);

  }, [especialidades , globalCities]);


const valoresSubmit = async (values)=>{
const {first_name, last_name, ...a} = values;

const body = {...a, userId:userLocal.id}

const res= await axios.post(createMedicsURL, body);

}

  return (
    <div className={style.container + " top-1/3 "} >
          <h1 className={style.title}>Actualiza tu informacion</h1>
          <Form labelCol={{   span: 0, }} wrapperCol={{   span: 14, }} layout="horizontal" onFinish={(values)=>valoresSubmit(values)} >
           
            <FormItem  name="first_name" label="Nombre" >
              <Input placeholder={userLocal.first_name} disabled={true}/>
            </FormItem>
            <FormItem  name="last_name" label="Apellido" >
                <Input placeholder={userLocal.last_name} disabled={true}/>
            </FormItem>
            <FormItem name="phone" label="Número de telefono" rules={[
                {required:true,
                message:"Por favor ingrese su número de telefono"
            }
            ]}>
                <Input type='number' name='phone'  placeholder='Numero de telefono'/>
            </FormItem>
            <FormItem name="specializations" label="Especialidades" rules={[
              {required:true,
              message:"Escoge una o mas Especialidades"}
            ]}>
              <Select name="specializations" placeholder="Selecciona tus especialidades" showSearch optionFilterProp='children' mode='multiple'>
              {filtro.map((e, index)=>{
                return (
                  <Option key={index} value={e.id}>{e.name}</Option>
                )
              })}
              </Select>
            </FormItem>
            <FormItem name="cityId" label="Ciudad" rules={[
              {required:true,
              message:"Escoge una Ciudad"}
            ]}>
              <Select name="cityId" placeholder="Selecciona tu ciudad" showSearch optionFilterProp='children'>
              {cities.map((e, index)=>{

                return (
                  <Option key={index} value={e.id}>{e.name}</Option>
                )
              })}
              </Select>
              
            </FormItem>
            <Form.Item name="direccion" label="Direccion" rules={[
              {required:true,
              message:"Por favor ingrese su dirección"}
            ]}>
            <Input type='string' name='direccion'  placeholder='Direccion'/>
              {/* {errors.user && (<span>{errors.user}</span>)} */}
              </Form.Item>
              <Button  htmlType='submit' className={style.Button}>Enviar</Button>
            </Form>
        </div>
  )

}
