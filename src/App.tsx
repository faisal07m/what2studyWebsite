import Company from './pages/Company'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { ROUTES } from './config/routes'
import Overview from './pages/Overview'
import User from './pages/users'
import JobOffers from './pages/JobOffers'


import Parse from 'parse'
import Auth from './pages/Auth'
import Impressum from './pages/Impressum'
import 'antd/dist/reset.css';
import Intents from './pages/Intent'
import Monitoring from './pages/Monitoring'

function App() {
  const currentUser = Parse.User.current()
  return (
    <Router> 
      {currentUser ? (
        <Switch>
          <Route path={ROUTES.General}>
            <JobOffers />
          </Route>
          <Route path={ROUTES.GeneralState}>
            <JobOffers />
          </Route>
          <Route path={ROUTES.COMPANY_URL}>
            <Company />

          </Route>
          <Route path={ROUTES.USER_URL}>
            <User />
          </Route>
          <Route path='/what2study/database'>
            <Overview />
           </Route>
           <Route path={ROUTES.Intents}>
            <Intents />
          </Route>
          <Route path={ROUTES.IntentsState}>
            <Intents />
          </Route>
          <Route path='/what2study/monitoring'>
            <Monitoring />
           </Route>
           <Route path='/what2study/Impressum'>
           <Impressum />
           </Route>
           </Switch>
      ) : (
        <Route path='/what2study/home'>
          <Auth />
        </Route>
      )}
    </Router>
  )
}

export default App