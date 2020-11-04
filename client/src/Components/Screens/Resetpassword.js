import React,{useContext, useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';


const Resetpassword=()=>{
    const history=useHistory();
    const [email,setEmail]=useState("");

    const postData=()=>{
        if(email){
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                M.toast({html:"Invalid Email",classes:"#e53935 red"})
                return
            }

        }
        fetch('/resetpassword',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
            })

        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"});
                return
            }
            M.toast({html: data.message,classes:"#1e88e5 blue darken-1"})

        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="card-heading">Lovegram</h2>
                <input placeholder="E-mail" type="email" className="validate" value={email} onChange={e=>{setEmail(e.target.value) }} />
                <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>{postData()}} >Log-In
                </button>

            </div>
            <footer className="page-footer right" style={{marginTop:130}}>
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

export default Resetpassword