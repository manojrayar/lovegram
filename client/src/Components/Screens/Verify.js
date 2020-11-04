import React, { useEffect } from 'react'
import {useParams,useHistory} from 'react-router-dom'


const Verify=()=>{
    const history=useHistory()
    const {token}=useParams();
    console.log(token)

    useEffect(()=>{
        fetch('/verifyemail',{
            method:"put",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                token:token
            })
            
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            if(result.verify==true){
                history.push('/signin')
            }
        })

    })

    return(
        <div style={{marginLeft:600,marginTop:200}} class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue">
                <div class="circle-clipper left">
                <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
                </div><div class="circle-clipper right">
                <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-red">
                <div class="circle-clipper left">
                <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
                </div><div class="circle-clipper right">
                <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-yellow">
                <div class="circle-clipper left">
                <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
                </div><div class="circle-clipper right">
                <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-green">
                <div class="circle-clipper left">
                <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
                </div><div class="circle-clipper right">
                <div class="circle"></div>
                </div>
            </div>
        </div>
        
    )
}

export default Verify;
