import { createContext, useEffect, useState } from "react";
import DisplayData from "./display_data";
const UserFilters=createContext();
export default function Data(){
    const [data,setData]=useState({});
    const [loaded,setLoaded]=useState(false);
    var error;
    useEffect(()=>{
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1lD1BmlTbO7F-iaIOE1aPJuQ4A22jbjwRMhLvh8-_CVQ/values/main?key=AIzaSyDJDdoXnI7QX8theHWfMVGG9_FxtJvxS8g`;
    fetch(url)
    .then(response => response.json())
    .then(dat => {
        if(dat.values){
            setData(dat);
            // console.log(dat);
            setLoaded(true);
            // setError(false);
            error=false;
        }
        else{
            setLoaded(false);
        }
    })
    .catch((err) =>
    {
        // setError(false);
        error=true;
        // setError(true);
    })
},[]);

    return(
        <>
            {error ? <h1>Sheet doesn't exist</h1> : (loaded ? <DisplayData ldata={data}/> : <h1>Loading...</h1>)}
        </>
    )
}
