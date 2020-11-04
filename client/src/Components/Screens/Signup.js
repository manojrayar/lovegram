import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import persons from './persons.png'

const Signup=()=>{
    const history=useHistory();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const postData=()=>{
        if(email){
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                M.toast({html:"Invalid Email",classes:"#e53935 red"})
                return
            }

        }
        if(password){
            if(! /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password)){
                M.toast({html:"Password should be 8 to 15 characters, at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",classes:"#e53935 red"})
                return
            }

        }
       
        fetch('/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })

        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"});
                return
            }
            M.toast({html: data.message,classes:"#1e88e5 blue darken-1"});
            history.push('/signin');

        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard" style={{backgroundImage:`url(${persons})`}} >
            <div className="card auth-card input-field">
                <h2 className="card-heading">Lovegram</h2>
                <input placeholder="Name" type="text" className="validate" value={name} onChange={e=>{setName(e.target.value)}} />
                <input placeholder="E-mail" type="email" className="validate" value={email} onChange={e=>{setEmail(e.target.value)}} />
                <input placeholder="Password"  type="password" className="validate" value={password} onChange={e=>{setPassword(e.target.value)}} />
                <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>postData()} >Sign-Up
                </button>
                <h6><Link to='/signin'>Already have an account ?</Link></h6>

            </div>
            <footer className="page-footer right" style={{marginTop:50}}>
                <div class="footer-copyright">
                    <div class="container">
                    © 2020 Mallikarjun Rayar
                    <a class="grey-text text-lighten-4 right" href="https://www.instagram.com/manojrayar">Know more</a>
                    </div>
                </div>
            </footer>
    </div>
    )
}

export default Signup