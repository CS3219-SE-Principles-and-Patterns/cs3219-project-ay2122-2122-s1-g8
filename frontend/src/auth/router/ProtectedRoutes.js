import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import LocalStorageService from '../services/LocalStorageService';

function ProtectedRoutes ({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        LocalStorageService.isAuth() ?
            <div>
              <Component {...props} />
            </div>
          :
          <Redirect to="/login" />
      }
    />
  )
}

export default ProtectedRoutes
