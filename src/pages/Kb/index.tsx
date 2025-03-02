import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ROUTES } from '../../config/routes'
import EditIntents from './EditKbs'
import Overview from './Overview'
import EditKbs from './EditKbs'

const Knbs = () => {
  return (
    <Switch>
      <Route path={`${ROUTES.KbState}/:id`}>
        <EditKbs />
      </Route>
      <Route path={`${ROUTES.kbs}`}>
        <Overview />
      </Route>
    </Switch>
  )
}

export default Knbs
