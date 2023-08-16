import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';

export default function DisplayData({ldata}){
    const [data,setData]=useState(ldata.values);
    const [previewModalShow, setPreviewModalShow] = useState(false);
    const [selectedDriveId, setSelectedDriveId] = useState('');
    const [selectedDriveData,setSelectedDriveData]=useState('');
    const [filters, setFilters] = useState(['all','all','all','all','all','all','all','all','all','all']);
    const search_text=['Search By Institute','Search By Year','Search By Subject','Search By Type','Search By TIme','Search By Sem','Search By File','Search By User','Search By Role','Search By Verified']

    function checkForFilter(row) {
  
      for (let i = 0; i < filters.length; i++) {
          if (row[i] === filters[i] || filters[i] === 'all') {
              continue;
          } else {
              return 'none';
          }
      }
  
      return 'block';
  }
  
  
    function openPreviewModal(driveId,row){
        setSelectedDriveData(row);
        setSelectedDriveId(driveId);
        setPreviewModalShow(true);
    };
  
    function closePreviewModal(){
        setSelectedDriveId('');
        setPreviewModalShow(false);
    };
    // console.log(data);

    function downloadFile(driveId){
        const downloadUrl = `https://drive.google.com/uc?id=${driveId}`;
        const fileName = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1);
        saveAs(downloadUrl, fileName);
    };

    function filterApplied(ind){
      const filval=document.getElementById('hifi'+ind).value;
      // console.log(filval);
      setFilters(filters=>filters.map((val,index)=>{
        if(index==ind){
          return filval;
        }
        else{
          return val;
        }
      }));
      // changeData();
    }

  
    return (
      <>
        <div>
            {data[0].map((arr,ind)=>{
              if((JSON.stringify([0,1,2,3,4,5,7,9])).indexOf(ind)!=-1){
                return(
                  <>
                    {/* <div className='container-fluid row'>
                      <div className='col-md-3'> */}
                        <input className='form-inline form-custom' placeholder={search_text[ind]} key={ind} onChange={()=>filterApplied(ind)} id={'hifi'+ind} type='text' list={ind+'list'}/>
                        <datalist id={ind+'list'}>
                          <option key={10000} value='all'>All</option>
                          {
                            Array.from(new Set(data.map(
                              (arr,index)=>{
                                return arr[ind];
                              }
                            )))
                            .map((val,i)=>{
                              return <option key={i} value={val}>{val}</option>
                            })
                          }
                        </datalist>
                      {/* </div>
                    </div> */}
                  </>
                )
              }
            })}
        </div>
        <div>
          <h2 className='text-center m-5'>Available Question papers:</h2>
          <div className="container-fluid row">
            {data.map((row, index) => (
              <div className='col-md-3'>
                <Card style={{width:'100%',display:checkForFilter(row)}} className=' ' key={index}>
                    <Card.Img varient='top' src={`https://drive.google.com/thumbnail?id=${row[6]}`} />
                  <Card.Body className='text-center'>
                    <Card.Title> {row[0]}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{row[1]}</Card.Subtitle>
                    <Card.Text>Year Conducted: <b>{row[2]}</b></Card.Text>
                    <Card.Text>Subject: <b>{row[3]}</b></Card.Text>
                    <Card.Text>Type: <b>{row[4]}</b></Card.Text>
                    <Card.Text>Time Uploaded: <b>{row[5]}</b></Card.Text>
                    <Card.Text>By: <b>{row[7]}</b></Card.Text>
                    <Card.Text>Verified:<b>{row[9]}</b></Card.Text>
                    <Button variant="primary" onClick={() => openPreviewModal(row[6],row)}>
                      Preview
                    </Button>
                    <Button className='m-2' variant="secondary" onClick={() => downloadFile(row[6])}>Download</Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
    
          <Modal fullscreen={true} show={previewModalShow} onHide={closePreviewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{`Preview for ${selectedDriveData[0]} ${selectedDriveData[1]} ${selectedDriveData[2]} ${selectedDriveData[3]} ${selectedDriveData[5]}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <iframe
                  title={`Drive Preview for File: ${selectedDriveData[0]} ${selectedDriveData[1]} ${selectedDriveData[2]} ${selectedDriveData[3]} ${selectedDriveData[5]}`}
                  src={`https://drive.google.com/file/d/${selectedDriveId}/preview`}
                  width="100%"
                  height="100%"
              ></iframe>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={() => downloadFile(selectedDriveId)}>Download</Button>
              <Button variant="secondary" onClick={closePreviewModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
};
