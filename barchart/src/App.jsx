import { useState, useEffect } from 'react'
import './App.css'
import BarChart from './components/BarChart';

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

function App() {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const promise = await fetch(URL);
      const res = await promise.json();
      // const data = Array.from(res)
      // console.log(res)
      setDataset(res.data)
    }
    fetchData()
  }, [URL]);

// console.log(dataset)
  return (
    <div className='container'>
      <BarChart dataset={dataset}/>
      <div id="tooltip" ></div>
    </div>
  )
}

export default App
