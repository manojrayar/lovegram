import React, { useContext, useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import {userContext} from '../../App'
import Loading from './Loading';


const Home=()=>{
    const {state,dispatch}=useContext(userContext)
    const [post,setPost]=useState([]);
    const [loader,setLoader]=useState(true)

    useEffect(()=>{
        fetch('/allpost',{
            method:"post",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
            setLoader(false)
            console.log(data.posts)
            setPost(data.posts)
        })

    },[]);

    const likepost=(id)=>{
        // console.log(id)
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedData=post.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }

            })

            setPost(updatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unlikepost=(id)=>{
        // console.log(id)
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedData=post.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }

            })

            setPost(updatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const postComment=(text,id)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text:text,
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result.comments[0])
            const updatedData=post.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }

            })

            setPost(updatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const deletePost=(postId)=>{
        // console.log(postId)
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedData=post.filter(item=>{
                return item._id!=result._id
            })

            setPost(updatedData)
        })
    }

    const deleteComment=(postId,cmtId)=>{
        fetch(`/deletecomment/${postId}/${cmtId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedData=post.map(item=>{
                if(item._id==result._id)
                {
                    return result
                }else{
                    return item
                }
            })

            setPost(updatedData)
        })

    }

    return(
    <>
        {
            loader
            ?
            <Loading/>
            :
            <div className="home">
            {
                post.map(item=>{
                    return(
                        <div className="card home-card #bdbdbd grey lighten-1" key={item.photo}>
                            <h5><Link to={state._id!=item.postedby._id ? "/profile/"+item.postedby._id : "/profile"}>{item.postedby.name}</Link>  <span>{item.postedby._id==state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>} </span></h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content input-field">
                                {item.likes.includes(state._id)
                                ?    
                                    //  dislike button
                                    <i className="material-icons" style={{color:"red"}}
                                        onClick={()=>{
                                                unlikepost(item._id)
                                            }}>
                                        favorite
                                    </i>
                                :    
                                            // LIKE button
                                    <i className="material-icons" style={{color:"red"}}
                                        onClick={()=>{
                                            likepost(item._id)
                                        }}>
                                    favorite_border
                                </i> 
                               }
                               
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title} </h6>
                                <p>{item.body} </p>
                                {item.comments.map(cmt=>{
                                    return <h6 key={cmt._id} ><span style={{fontWeight:"bold"}} >{cmt.postedby.name}</span>  {cmt.text} <span>{cmt.postedby._id==state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>{deleteComment(item._id,cmt._id)}}>delete</i>} </span> </h6>
                                    })
                                }    
                                
                                <form onSubmit={e=>{
                                    e.preventDefault()
                                    // console.log(e.target[0].value)
                                    postComment(e.target[0].value,item._id)
                                    e.target[0].value=""
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                            </div>
                    )
                })
            }
            <footer className="page-footer right" style={{marginTop:130}}>
                <div class="footer-copyright">
                    <div class="container">
                    © 2020 Mallikarjun Rayar
                    <a class="grey-text text-lighten-4 right" href="https://www.instagram.com/manojrayar">Know more</a>
                    </div>
                </div>
            </footer>
        </div>
            
        }
        
    </>
    )
}

export default Home