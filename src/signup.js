import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {Form} from "react-bootstrap";


export default function SignUpModal(){
    const [show,setShow]=useState(true);
    // const user=useContext(UserContextEmail);
    const [uname,setUname]=useState('');
    const [userType,setUserType]=useState('student');
    const [organizationName,setOrganizationName]=useState('');
    const [branch,setBranch]=useState('');

    function checkBoxed(e){
        if(e.target.checked){
            if(read_cookie('email').length>0){
                setUname(read_cookie('email'));
            }
            else{
                setUname('');
            }
        }
        else{
            setUname('');
        }
    }

    function addData(e){
        e.preventDefault();
        fetch("https://qpfinder.onrender.com/submit", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uname: uname,
            role: userType,
            branch: branch,
            organization_name:organizationName,
            email:uname,
        })
        })
        .then(response => response.json())
        .then((data)=>{
            console.log(data);
            if(data.result==='nuname'){
                alert('Username Not Available');
            }
            else if(data.result){
                bake_cookie('user',uname);
                bake_cookie('role',userType);
                bake_cookie('organization',organizationName);
                bake_cookie('verified',0);
                bake_cookie('branch',branch);
                alert("Successfully Updated Your details");
                window.location.href = "http://localhost:3000";
                setShow(false);
            }
            else{
                alert("Your submission didn't work");
            }
        })
        .catch(error=>alert("Some error"));
    }

    return(
        <div>
            <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Enter Your Details:
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <h4>Fill these details</h4>
                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={uname} onChange={(e) => setUname(e.target.value)} placeholder="Enter Username or Select checkbox mail as your username" />
                            <Form.Text required className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" defaultChecked={false} onChange={checkBoxed} label="check to set username as your gmail" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUserType">
                            <Form.Label>User Type</Form.Label>
                            <Form.Control as="select" value={userType} onChange={(e) => setUserType(e.target.value)}>
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                                <option value="aspirant">Aspirant</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUserType">
                            <Form.Label>Branch</Form.Label>
                            <Form.Control as="select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                                <option value="all">all</option>
                                <option value="cse">CSE</option>
                                <option value="ece">ECE</option>
                                <option value="eee">EEE</option>
                                <option value="cv">Civil</option>
                                <option value="mech">Mechanical</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOrganization">
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control type="text" value={organizationName} placeholder="Enter your institute name" onChange={(e) => setOrganizationName(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={addData}>
                            Submit
                        </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>setShow(false)}>Ignore</Button>
                    </Modal.Footer>
            </Modal>
        </div>)
}