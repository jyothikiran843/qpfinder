import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap'; // Make sure to install the necessary packages

export default function DisplayData({ldata}){
    const data=ldata.values;
    const [previewModalShow, setPreviewModalShow] = useState(false);
    const [selectedDriveId, setSelectedDriveId] = useState('');
  
    const openPreviewModal = (driveId) => {
      setSelectedDriveId(driveId);
      setPreviewModalShow(true);
    };
  
    const closePreviewModal = () => {
      setSelectedDriveId('');
      setPreviewModalShow(false);
    };
    console.log(data);
  
    return (
      <div>
        <h2>Google Spreadsheet Data</h2>
        <div className="card-container">
          {data.map((row, index) => (
            <Card key={index}>
              <Card.Body>
                <Card.Title>{row[0]}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{row[1]}</Card.Subtitle>
                <Card.Text>{row[2]}</Card.Text>
                <Button variant="primary" onClick={() => openPreviewModal(row[6])}>
                  Preview
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
  
        <Modal fullscreen={true} show={previewModalShow} onHide={closePreviewModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Preview for</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
                title="Drive Preview"
                src={`https://drive.google.com/file/d/${selectedDriveId}/preview`}
                width="100%"
                height="100%"
            ></iframe>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closePreviewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
};
