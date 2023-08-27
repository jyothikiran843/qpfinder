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
  // const [access_token, setAccessToken] = useState(false);
  const client_id = '297636216905-t14s0edbqojfp5lph7g9vtq2m01l7gcp.apps.googleusercontent.com';
  const [role,setRole]=useState('');
  const [uname,setUname]=useState('');
  const [verified,setVerified]=useState(0);
  const[showModal,setShowModal]=useState(false);
  const[showUploadModal,setShowUploadModal]=useState(false);
  var access_token=false;

  useEffect(() => {
    if (!checkForCookie()) {
      var params = new URLSearchParams(document.URL);
      var at = params.get('access_token');
      if (at) {
        access_token=at;
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + access_token)
          .then(response =>
            response.json()
          )
          .then(data => {
            setUser(data.email);
            console.log(user);
            bake_cookie('email',data.email);
            checKForData(data);
            access_token=false;
          }
          )
          .catch(error =>
            setUser(null)
          )
      }
      else {
        access_token=false;
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
    fetch('https://qpfinder.onrender.com/?email='+data.email)
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
          bake_cookie('branch',data.result[3])
          bake_cookie('verified',data.result[4]);
          bake_cookie('organization',data.result[5]);
          window.location.reload();
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
    delete_cookie('branch');
    delete_cookie('organization');
    alert('Signed out successfull');
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    access_token=false;
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
                  {role!=='' && <Nav.Link onClick={setShowUploadModal}>Upload</Nav.Link>}
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