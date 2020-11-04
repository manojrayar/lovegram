import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom'

import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Screens/Home';
import Profile from './Components/Screens/Profile';
import Signin from './Components/Screens/Signin';
import Signup from './Components/Screens/Signup';
import CreatePost from './Components/Screens/CreatePost'
import {initialState,UserReducer} from './Reducers/Reducer'
import Userprofile from './Components/Screens/Userprofile';
import Myfollowingposts from './Components/Screens/Myfollowingposts'
import Verify from './Components/Screens/Verify';
import Resetpassword from './Components/Screens/Resetpassword';
import Newpassword from './Components/Screens/Newpassword';

export const userContext=createContext();

const RenderList= ()=>{
  const histroy=useHistory();
  const {state,dispatch}=useContext(userContext)

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user})
      // histroy.push('/');
    }else{
      if(!histroy.location.pathname.startsWith('/verify')||!histroy.location.pathname.startsWith('/reset')){
        if(!histroy.location.pathname.startsWith('/newpassword')){
          histroy.push('/signin');
        }
        
      }
      
    }
  },[])
  return(
    <Switch>
        <Route exact path='/'>
          <Home/>
        </Route>
        <Route path='/signin'>
          <Signin/>
        </Route>
        <Route path='/signup'>
          <Signup/>
        </Route>
        <Route exact path='/profile'>
          <Profile/>
        </Route>
        <Route path='/createpost'>
          <CreatePost/>
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/profile/:id'>
          <Userprofile />
        </Route>
        <Route path='/myfollowingposts'>
          <Myfollowingposts />
        </Route>
        <Route path='/verify/:token'>
          <Verify/>
        </Route>
        <Route path='/resetpassword'>
          <Resetpassword/>
        </Route>
        <Route path='/newpassword/:token'>
          <Newpassword/>
        </Route>

    </Switch>
  )
}

function App() {
  const [state,dispatch]=useReducer(UserReducer,initialState)
  return (
    <userContext.Provider value={{state:state,dispatch:dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <RenderList/>

      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
