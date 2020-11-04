import React,{useEffect, useState} from 'react';
import {useHistory } from 'react-router-dom'
import Loading from './Loading';


const CreatePost=()=>{
    const history=useHistory();
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
    const data=new FormData();
    const [loader,setLoader]=useState(false)

    useEffect(()=>{
        if(url){
            fetch('/createpost',{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    'Authorization':'Bearer '+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title:title,
                    body:body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                setLoader(false)
                console.log(data)
                history.push('/home')
                
    
            }).catch(err=>{
                console.log(err)
            })

        }

    },[url])

    const postDetails=()=>{
        setLoader(true)
        data.append("file",image);
        data.append("upload_preset","lovegram");
        data.append("cloud_name","manojrayar");

        fetch("https://api.cloudinary.com/v1_1/manojrayar/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(response=>{
            // console.log(response)
            // console.log(response.url)
            setUrl(response.url);
           
        }).catch(err=>{
            console.log(err)
            
        })
       
       
    }

    return(
    <>
        {
            loader
            ?
            <Loading/>
            :
            <div className="card input-field"
            style={{margin:"10px auto",
                    maxWidth:"500px",
                    padding:"20px",
                    textAlign:"center"}}
        >
            <input type="text" placeholder="title" value={title} onChange={e=>{setTitle(e.target.value)}} />
            <input type="text" placeholder="body" value={body} onChange={e=>{setBody(e.target.value)}} />

            <div className="file-field input-field">
                <div className="btn #c2185b pink darken-2">
                    <span>Select image</span>
                    <input type="file" onChange={(e)=>{setImage(e.target.files[0])}} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"  />
                </div>
            </div>
            <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>{postDetails()}} >Post
                </button>

        </div>
        }
        
    </>
    )
 
}

export default CreatePost