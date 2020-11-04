import React,{useContext, useState} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';


const Newpassword=()=>{
    const history=useHistory();
    const {token}=useParams()
    const [password,setPassword]=useState("");
    const [cpassword,setCPassword]=useState("");

    const postData=()=>{
        
        if(password==cpassword){
            fetch('/set-newpassword',{
                method:"put",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    token:token,
                    password:password
                })
    
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error,classes:"#e53935 red darken-1"});
                    return
                }
                M.toast({html: data.message,classes:"#1e88e5 blue darken-1"})
                history.push('/signin')
    
            }).catch(err=>{
                console.log(err)
            })
           
        }else{
            M.toast({html:"Passwords not matching",classes:"#e53935 red"})

        }
        
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="card-heading">Lovegram</h2>
                <input placeholder="Password" type="password" className="validate" value={password} onChange={e=>{setPassword(e.target.value) }} />
                <input placeholder="Confirm Password" type="password" className="validate" value={cpassword} onChange={e=>{setCPassword(e.target.value) }} />
                <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>{postData()}} >Update Password
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

export default Newpassword