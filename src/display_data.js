import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';

export default function DisplayData({ldata}){
    const data=ldata.values;
    const [previewModalShow, setPreviewModalShow] = useState(false);
    const [selectedDriveId, setSelectedDriveId] = useState('');
    const [selectedDriveData,setSelectedDriveData]=useState('');
  
    function openPreviewModal(driveId,row){
        setSelectedDriveData(row);
        setSelectedDriveId(driveId);
        setPreviewModalShow(true);
    };
  
    function closePreviewModal(){
        setSelectedDriveId('');
        setPreviewModalShow(false);
    };
    console.log(data);

    function downloadFile(driveId){
        const downloadUrl = `https://drive.google.com/uc?id=${driveId}`;
        const fileName = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1);
        saveAs(downloadUrl, fileName);
      };
  
    return (
      <div>
        <h2 className='text-center'>Available Question papers:</h2>
        <div className="container-fluid row">
          {data.map((row, index) => (
            <Card style={{width:'18rem'}} className='col-md-2 m-2' key={index}>
                <Card.Img varient='top' src={`https://drive.google.com/thumbnail?id=${row[6]}`} />
              <Card.Body className='text-center'>
                <Card.Title> {row[0]}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{row[1]}</Card.Subtitle>
                <Card.Text>Year Conducted: <b>{row[2]}</b></Card.Text>
                <Card.Text>Subject: <b>{row[3]}</b></Card.Text>
                <Card.Text>Type: <b>{row[4]}</b></Card.Text>
                <Card.Text>Time Uploaded: <b>{row[5]}</b></Card.Text>
                <Card.Text>By: <b>{row[8]}</b></Card.Text>
                <Button variant="primary" onClick={() => openPreviewModal(row[6],row)}>
                  Preview
                </Button>
                <Button className='m-2' variant="secondary" onClick={() => downloadFile(row[6])}>Download</Button>
              </Card.Body>
            </Card>
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
    );
};
