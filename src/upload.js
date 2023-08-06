import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form,Button } from "react-bootstrap";

export default function Upload(){
    const [show,setShow]=useState(true);
    const [institute,setInstitute]=useState('all');
    const [year,setYear]=useState('all');
    const [subject,setSubject]=useState('all');
    const [type,setType]=useState('all');
    // const [time,setTime]=useState('');
    const [sem,setSem]=useState('all');
    var uname=((document.cookie).split(';')[0]).split('=')[1];
    var role=((document.cookie).split(';')[1]).split('=')[1];

    function submitData(){
        const formData = new FormData();
        formData.append('institute', institute);
        formData.append('year', year);
        formData.append('subject', subject);
        formData.append('type', type);
        formData.append('sem', sem);
        formData.append('file', document.getElementById('file_uploaded').files[0]);
        formData.append('uname',uname);
        formData.append('role',role);

        fetch('http://127.0.0.1:3790/upload', {
        method: 'POST',
        body: formData
        })
        .then(response => {
        if (response.ok) {
            // Handle success
            console.log('File uploaded and data recorded successfully.');
        } else {
            // Handle error
            console.error('Error occurred during file upload and data recording.');
        }
        setShow(false);
        })
        .catch(error => {
        console.error('Error occurred during file upload and data recording:', error);
        setShow(false);
        });
    }
    
    return(
        <>
        <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Upload Question Paper:
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <h4>Fill these details</h4>

                        <Form.Group className="mb-3">
                            <Form.Label>From what Institute this Question paper from?</Form.Label>
                            <Form.Control type="text" value={institute} placeholder="Enter Your college name" onChange={(e) => setInstitute(e.target.value)}></Form.Control>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUserType">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" placeholder="Conducted Year" value={year} onChange={(e) => setYear(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOrganization">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="text" value={subject} placeholder="Enter Subject the Question paper belongs to" onChange={(e) => setSubject(e.target.value)} />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" >
                            <Form.Label>Type</Form.Label>
                            <Form.Select as="select" placeholder="Other" value={type} onChange={(e)=>setType(e.target.value)}>
                                <option value='all'>All</option>
                                <option value='1'>Curriculum</option>
                                <option value='2'>Competitive</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Sem</Form.Label>
                            <Form.Select as="select" placeholder="Other" value={sem} onChange={(e)=>setSem(e.target.value)}>
                                <option value='all'>All</option>
                                <option value='1'>Sem-1</option>
                                <option value='2'>Sem-2</option>
                            </Form.Select>
                        </Form.Group>


                        {/* <Form.Group className="mb-3" >
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" placeholder="Other" value={sem} onChange={(e)=>setSem(e.target.value)}></Form.Control>
                        </Form.Group> */}

                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control id="file_uploaded" required type="file" accept="image/*, .pdf" size="lg"></Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={submitData}>
                            Submit
                        </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>setShow(false)}>Ignore</Button>
                    </Modal.Footer>
            </Modal>
        </>
    )
}