import React from 'react';
import './App.css';
import {Route,Switch,Redirect} from 'react-router-dom'
import {routes} from './router'

function App() {
  return (
    <div className="App">
      {/* <Button type="primary">primary</Button> */}
      <Switch>
        {
          routes.map((item)=>{
            return <Route key={item} path={item.path} component={item.component} />
          })
        }
        <Redirect from='/' to="/home" exact />
        <Redirect to='/404' />
      </Switch>
    </div>
  );
}

export default App;
