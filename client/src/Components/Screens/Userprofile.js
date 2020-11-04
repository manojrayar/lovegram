import React, { useContext, useEffect, useState } from 'react';
import {userContext} from '../../App';
import {useParams} from 'react-router-dom'
import Loading from './Loading';

const Userprofile=()=>{
    const [userinfo,setUserinfo]=useState(null)
    const {state,dispatch}=useContext(userContext)
    const params=useParams()
    const {id}=params

    useEffect(()=>{
        // console.log(id)
        fetch(`/profile/${id}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                return alert("User not found")
            }
            setUserinfo(data)
        })

    },[])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setUserinfo(prvs=>{
                return{
                    ...prvs,
                    user:result.user1
                }
            })
            dispatch({type:"UPDATE",payload:result.user2})
            localStorage.setItem("user",JSON.stringify(result.user2))
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setUserinfo(prvs=>{
                return{
                    ...prvs,
                    user:result.user1
                }
            })
            dispatch({type:"UPDATE",payload:result.user2})
        })
    }
    return(
        <>
        {userinfo
        ?
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                        src="https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
                        />
                </div>
                <div>
                    <h2>{userinfo?userinfo.user.name:"loading"} </h2>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h5>{userinfo.posts.length} posts</h5>
                        <h5>{userinfo.user.followers.length} followers</h5>
                        <h5>{userinfo.user.following.length} following</h5>
                    </div>
                    {userinfo.user.followers.includes(state._id)
                    ?
                        <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>{unfollowUser()}} >
                            UnFollow
                        </button>
                    :
                        <button className="btn waves-effect waves-light #c2185b pink darken-2" onClick={()=>{followUser()}} >
                            Follow
                        </button>
                    }
                    
                   
                </div>
            </div>
            <div className="gallery">
                {
                    userinfo.posts.map(item=>{
                        return(
                            <img key={item.photo} className="item" src={item.photo} />
                        )
                    })
                }
            </div>
        </div>
        :
        <Loading/>
        
        }
        </>
        
    )
}

export default Userprofile