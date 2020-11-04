import React, { useContext, useEffect, useState } from 'react';
import {userContext} from '../../App'

const Profile=()=>{
    const [mypost,setMypost]=useState([])
    const {state,dispatch}=useContext(userContext)

    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
    const data=new FormData();

    useEffect(()=>{
        if(image)
        {
            data.append("file",image);
            data.append("upload_preset","lovegram");
            data.append("cloud_name","manojrayar");
    
            fetch("https://api.cloudinary.com/v1_1/manojrayar/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(response=>{
                console.log(response)
                // console.log(response.url)
                setUrl(response.url);
               
            }).catch(err=>{
                console.log(err)
                
            })
        }
    },[image])

    useEffect(()=>{
        if(url)
        {
            fetch('/updateprofile',{
                method:"put",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    pic:url
                })
            }).then(res=>res.json())
            .then(result=>{
                // console.log(result)
                dispatch({type:"PROFILE",payload:result})
                localStorage.setItem("user",JSON.stringify(result))
            })
            .catch(err=>{
                console.log(err)
            })

        }
    },[url])


    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            setMypost(data.post)
        })

    },[])
    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                        src={state?state.profile:""} 
                        />
                        <div className="file-field input-field">
                            <div className="btn #c2185b pink darken-2">
                                <span>Change Profile</span>
                                <input type="file" onChange={(e)=>{setImage(e.target.files[0])}} />
                            </div>
                            <div className="file-path-wrapper">
                                <input style={{visibility:"hidden"}} className="file-path validate" type="text"  />
                            </div>
                        </div>
                </div>
                <div>
                    <h2>{state?state.name:"loading"} </h2>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h5>{mypost?mypost.length:"..."} posts</h5>
                        <h5>{state?state.followers.length:0} followers</h5>
                        <h5>{state?state.following.length:0} following</h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypost.map(item=>{
                        return(
                            <img key={item.photo} className="item" src={item.photo} />
                        )
                    })
                }
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

export default Profile