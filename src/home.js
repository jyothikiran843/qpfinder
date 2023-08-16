import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { useState,useEffect,createContext } from "react";
import { Button } from "react-bootstrap";
import SignUpModal from "./signup";
import Upload from "./upload";
import Data from "./new_data";
import {Navbar, Nav, Container } from 'react-bootstrap';
const UserContextEmail=createContext();


export default function Home(){
  const [user,setUser]=useState('');
  const [access_token, setAccessToken] = useState(false);
  const client_id = '297636216905-t14s0edbqojfp5lph7g9vtq2m01l7gcp.apps.googleusercontent.com';
  const [role,setRole]=useState(null);
  const [uname,setUname]=useState('');
  const [verified,setVerified]=useState(0);
  const[showModal,setShowModal]=useState(false);
  const[showUploadModal,setShowUploadModal]=useState(true);

  useEffect(() => {
    if (!checkForCookie()) {
      const params = new URLSearchParams(document.URL);
      const access_token = params.get('access_token');
      if (access_token) {
        setAccessToken(access_token);
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + access_token)
          .then(response =>
            response.json()
          )
          .then(data => {
            setUser(data.email);
            console.log(user);
            bake_cookie('email',data.email);
            checKForData(data);
          }
          )
          .catch(error =>
            setUser(null)
          )
      }
      else {
        setAccessToken(false);
      }
    }
  },[]);

  function checkForCookie() {
    if(read_cookie('email').length>0) {
      setUser(read_cookie('email'));
      setRole(read_cookie('role'));
      setVerified(read_cookie('verified'));
      setUname(read_cookie('user'));
      return true;
    }
    return false;
  }


  function checKForData(data){
    fetch('http://localhost:3790/?email='+data.email)
    .then(response=>response.json())
    .then((dat)=>
      {
        console.log(dat);
        if(dat.result){
          var data=dat;
          setShowModal(false);
          bake_cookie('user',data.result[0]);
          bake_cookie('email',data.result[1]);
          bake_cookie('role',data.result[2]);
          bake_cookie('branch',data.email[3])
          bake_cookie('verified',data.result[4]);
          bake_cookie('organization',data.result[5]);
          window.location.href = "http://localhost:3000";
        }
        else{
          setShowModal(true);
        }
      
      })
    .catch(error=>{
      console.log(error);
      alert('We cannot save your data to our database');
    });
  }

  function signIn() {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    var params = {
      'client_id': client_id,
      'redirect_uri': 'http://localhost:3000/',
      'response_type': 'token',
      'scope': 'https://www.googleapis.com/auth/userinfo.email',
      'include_granted_scopes': 'true',
      'state': 'pass-through value'
    };
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  function signOut() {
    delete_cookie('user');
    delete_cookie('email');
    delete_cookie('role');
    delete_cookie('verified');
    alert('Signed out successfull');
    setUser('');
    window.location.href = "http://localhost:3000";
  }
  
  return(
      <>
        <UserContextEmail.Provider value={user}>
          <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
              <Navbar.Brand href="#home">QPFinder</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                </Nav>
                <Nav>
                  {user ==='' && <Nav.Link onClick={signIn}>SignUp</Nav.Link>}
                  {user==='' && <Nav.Link onClick={signIn}>SignIn</Nav.Link>}
                  {user!=='' && <Nav.Link onClick={signOut}>SignOut</Nav.Link>}
                  {uname!=='' && <Nav.Link onClick={setShowUploadModal}>Upload</Nav.Link>}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          {showModal && <SignUpModal/>}
          {showUploadModal && <Upload/>}
          <Data/>
        </UserContextEmail.Provider>
      </>
  )
}   