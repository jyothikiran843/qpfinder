import { createContext, useContext, useEffect, useState } from "react";
const UserFilters=createContext();
export default function Data(){
    const [data,setData]=useState({});
    const [loaded,setLoaded]=useState(false);
    // const [error,setError]=useState(false);
    const [sheetName,setSheetName]=useState('main');
    const [apiKey,setApiKey]=useState('AIzaSyDJDdoXnI7QX8theHWfMVGG9_FxtJvxS8g');
    const [spreadsheetId,setSpreadSheetId]=useState('1eShJQhrHY6KmQeB7ByuSrN8hgsrHCggmRuuW8x8_pHI');
    const [sheetNames,setSheetNames]=useState([]);
    var error;
    useEffect(()=>{
        error=false;
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
        fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            setSheetNames(data.sheets.map(sheet => sheet.properties.title));
            setSheetName(document.getElementById('sheet_selected').value)
           const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;
           console.log(url);
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
        }
        ).catch(error=>error=true);
    },[sheetName,spreadsheetId,apiKey]);
    return(
        <>
        <div className="container-fluid">
            <div className='row'>
                <div className="form-group col-md-4">
                    <label htmlFor='apikey' >API Key</label>
                    <input id='apikey' className="form-control" type='text' value={apiKey} onChange={(e)=>setApiKey(e.target.value)} />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor='spreadsheet'>spreadsheet</label>
                    <input id='spreadsheet' className="form-control" key='key123' type='text' value={spreadsheetId} onChange={(e)=>setSpreadSheetId(e.target.value)} />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="sheet_selected">Select A sheet from the spreadsheet</label>
                    {
                    sheetNames.length>0 ? 
                    <select className="form-control" id="sheet_selected" value={sheetName} onChange={(e)=>{setSheetName(e.target.value)}} >
                    <option value=''>None</option>
                    {
                        sheetNames.map((sheet,ind)=>{
                            return <option key={ind} value={sheet}>{sheet}</option>
                    })
                    }
            </select> : <b>Loading sheet list</b>}
                </div>
            </div>
            {error ? <h1>Sheet doesn't exist</h1> : (loaded ? <Table data={data}/> : (sheetName==='' ? <h1>Sheet doesn't exist</h1> : <h1>Loading...</h1>))}
            </div>
        </>
    )
}
function Table({data}){
    const [filters,setFilters]=useState(Array(data.values[0].length).fill(''));
    function filterClicked(e){
        // console.log(e.target.id)
        const nvals=filters.map((text,ind)=>{
            if(ind==e.target.id){
                return e.target.value;
            }
            else{
                return text;
            }
        })
        setFilters(nvals);
    }
    return(
        <UserFilters.Provider value={filters}>
        <div className="table-responsive">
        <table className="table table-hover">
            <thead>
                <tr>
                    {
                        data.values[0].map(
                            (col,ind)=>{
                                if(!ind){
                                    return <th key={ind}></th>
                                }
                                return (
                                <th key={ind}>
                                    <input type='text' placeholder="Search" className="form-control" list={ind+'list'} id={ind} onChange={(e)=>filterClicked(e)}/>
                                    <datalist id={ind+'list'} >
                                        <option value='all'>All</option>
                                        {
                                            Array.from(new Set(data.values.slice(1).map(
                                                (arr,index)=>
                                                {
                                                    return arr[ind]
                                                }
                                                ))).
                                                map(
                                                    (dat,ind)=>
                                                    {
                                                        return <option value={dat} key={ind}>{dat}</option>
                                                    })
                                        }
                                    </datalist>
                                </th>)
                            }
                        )
                    }
                </tr>
                <tr>
                    {data.values[0].map((ele,ind)=>{
                        return <th key={ind}>{ele}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {data.values.slice(1).map((arr,ind)=>{
                    return <TableRow key={ind} row={arr} />
                })}
            </tbody>
        </table>
        </div>
        </UserFilters.Provider>
    )
}
function TableRow({row}){
    const filter=useContext(UserFilters);
    return(
        <tr>
            {row.map((ele,ind)=>{
                if(!row.map((col,ind)=>{
                    if(col.toLowerCase().indexOf(filter[ind].toLowerCase())>=0 || filter[ind].toLowerCase()==='all'){
                        return true;
                    }
                    return false;
                }).includes(false)){
                    return <td key={ind}>{ele}</td>
                }
                return null;
            })}
        </tr>
    )
}