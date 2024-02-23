import React, { useEffect } from 'react'
import ImageList from './ImageList'
import { io } from 'socket.io-client'
const socket = io('http://192.168.1.130:3002')

function ExperimentChart(props) {
    const [selectedOption, setSelectedOption] = React.useState('Sample1')
    const [data1, setData1] = React.useState(-1)
    const [data2, setData2] = React.useState(-1)
    const [data3, setData3] = React.useState(-1)
    const [Pb1, setPb1] = React.useState(0)
    const [Pb2, setPb2] = React.useState(0)
    const [Pb3, setPb3] = React.useState(0)
    const [value1, setValue1] = React.useState(-1);
    const [value2, setValue2] = React.useState(-1);
    const [value3, setValue3] = React.useState(-1);
    const [iT1,setiT1] = React.useState(0);
    const [iT2,setiT2] = React.useState(0);
    const [iT3,setiT3] = React.useState(0);
    const [Nh3, setNh3] = React.useState(0)
    const [fN1, setfN1] = React.useState(-1)
    const [fN2, setfN2] = React.useState(-1)
    const [fN3, setfN3] = React.useState(-1)
    
    const [b1, setB1] = React.useState(0)
    const [b2, setB2] = React.useState(0)
    const [b3, setB3] = React.useState(0)



  
    useEffect(() => {
        socket.on('Ammonia', (message) => {
            setNh3(message)
          })
        if(props.protein.length>=1){

            setData1(props.protein[0])
        }
        else setData1(-1)
        if(props.benedict.length>=1){
            setData2(props.benedict[0])
        }
        else setData2(-1)
        if(props.iodin.length>=1){
            setData3(props.iodin[0])
        }
        else setData3(-1)
    }, [props])
    const handleSelectChange = (val) => {
        setSelectedOption(val)
        console.log(val)
        if(val==='Sample1'){

            if(props.protein.length>=1){

                setData1(props.protein[0])
            }
            else setData1(-1)
            if(props.benedict.length>=1){
                setData2(props.benedict[0])
            }
            else setData2(-1)
            if(props.iodin.length>=1){
                setData3(props.iodin[0])
            }
            else setData3(-1)
        }
        if(val==='Sample2'){
            if(props.protein.length>=2){

                setData1(props.protein[1])
            }
            else setData1(-1)
            if(props.benedict.length>=2){
                setData2(props.benedict[1])
            }
            else setData2(-1)
            if(props.iodin.length>=2){
                setData3(props.iodin[1])
            }
            else setData3(-1)
        }
        if(val==='Sample3'){
            if(props.protein.length>=3){

                setData1(props.protein[2])
            }
            else setData1(-1)
            if(props.benedict.length>=3){
                setData2(props.benedict[2])
            }
            else setData2(-1)
            if(props.iodin.length>=3){
                setData3(props.iodin[2])
            }
            else setData3(-1)
        }
    }
    
  return (
    <div className=''>
    <label className="block uppercase tracking-wide text-white font-bold  text-4xl text-center mb-4" htmlFor="grid-state">
      Choose Any Sample
    </label>
    <div className="flex justify-around">
      <button 
        className={`transition-all rounded-full h-12 w-12 flex items-center justify-center border border-gray-200 text-white ${selectedOption === 'Sample1' ? 'bg-blue-500 ' : ''}`} 
        onClick={() => handleSelectChange('Sample1')}
      >
        1
      </button>
      <button 
        className={`transition-all rounded-full h-12 w-12 flex items-center justify-center border border-gray-200 text-white ${selectedOption === 'Sample2' ? 'bg-blue-500 text-white' : ''}`}  
        onClick={() => handleSelectChange('Sample2')}
      >
        2
      </button>
      <button 
        className={`transition-all rounded-full h-12 w-12 flex items-center justify-center border border-gray-200 text-white ${selectedOption === 'Sample3' ? 'bg-blue-500 text-white' : ''}`} 
        onClick={() => handleSelectChange('Sample3')}
      >
        3
      </button>
    </div>
    {selectedOption==='Sample1'?<ImageList b={b1} setB={setB1} setData={props.setData} resetData={props.resetData}  grid={props.grid} setGrid={props.setGrid} sample={1} Nh3={Nh3} fn={fN1} setfN={setfN1} it={iT1} setiT={setiT1} val={value1} setVal={setValue1} pb={Pb1} set={setPb1} data1={data1} data2={data2} data3={data3}/>:null}
    {selectedOption==='Sample2'?<ImageList b={b2} setB={setB2} setData={props.setData} resetData={props.resetData}   grid={props.grid} setGrid={props.setGrid} sample={2} Nh3={Nh3} fn={fN2} setfN={setfN2} it={iT2} setiT={setiT2} val={value2} setVal={setValue2} pb={Pb2} set={setPb2} data1={data1} data2={data2} data3={data3}/>:null}
    {selectedOption==='Sample3'?<ImageList b={b3} setB={setB3}  setData={props.setData} resetData={props.resetData}  grid={props.grid} setGrid={props.setGrid} sample={3} Nh3={Nh3} fn={fN3} setfN={setfN3} it={iT3} setiT={setiT3} val={value3} setVal={setValue3} pb={Pb3} set={setPb3} data1={data1} data2={data2} data3={data3}/>:null}
  </div>
  )
}

export default ExperimentChart