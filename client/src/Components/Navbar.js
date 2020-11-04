import React, { useContext, useEffect, useRef, useState } from 'react';
import {Link, useHistory} from 'react-router-dom'
import {userContext} from '../App'
import M from 'materialize-css'

const Navbar=()=>{
  const searchModal=useRef(null);
  const [search,setSearch]=useState("");
  const [searchresults,setSearchresults]=useState([""]);
  const {state,dispatch}=useContext(userContext);
  const history=useHistory();

  useEffect(()=>{
    M.Modal.init(searchModal.current)

  },[])

  const searchuser=(query)=>{
    setSearch(query);
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query:query
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      setSearchresults(result.users)
    })

  }

  const Logout=()=>{
    dispatch({type:"CLEAR"});
    localStorage.clear();
    history.push('/signin')
  }
  const renderList=()=>{
    if(state){
      return [
        <li><input placeholder="search" type="email" className=" validate modal-trigger" data-target="modal1" /></li>,
        <li><i className="large material-icons modal-trigger" data-target="modal1">search</i></li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/createpost">Create</Link></li>,
        <li><Link to="/myfollowingposts">My-Following</Link></li>,
        <button className="btn waves-effect waves-light #6a1b9a purple darken-3" style={{marginRight:10}}
          onClick={()=>{Logout()}}>
            LogOut
        </button>
      ]
    }else{
      return [
        <li><Link to="/signin">SignIn</Link></li>,
        <li><Link to="/signup">SignUP</Link></li>
      ]

    }
  }
    return(
      <nav>
        <div className="nav-wrapper orange darken-3">
          <Link to={state?'/':'/signin'} className="brand-logo left ">Lovegram</Link>
          <ul id="nav-mobile" className="right ">
            {renderList()}
           
          </ul>
        </div>
          <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
            <div className="modal-content">
              <input placeholder="search" type="email" className="validate" value={search} onChange={e=>{searchuser(e.target.value)}} />
                <ul className="collection" >
                  {searchresults.map(item=>{
                    return(
                      <Link to={state?state._id !=item._id ?"/profile/"+item._id:"/profile":""} style={{color:"black"}}
                          onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close()
                            setSearch('')
                          }}
                          >
                             <li class="collection-item avatar">
                                <img src={item.profile} alt="profile pic" class="circle" />
                                <span class="title">{item.name} </span>
                                <p> {item.email}</p>
                              </li>
                      </Link>
                    ) 
                  })}
                  
                </ul>
            </div>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves-green btn-flat #f44336 red" onClick={()=>{setSearch('')}}>Close</button>
            </div>
          </div>
      </nav>
      
    )
}


export default Navbar