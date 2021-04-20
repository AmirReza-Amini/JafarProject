// import external modules
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import _ from 'lodash'

import auth from "../../services/authService";
import config from '../../config.json';
import MainLayout from "../mainLayout";
import urls from '../../urls.json';

const MainLayoutRoute = ({ location, path, render, ...rest }) => {

   const doesCurrentUserHaveAuthorization = (permissions) => {

       console.log('from main route: doesCurrentUserHaveAuthorization', permissions, path);
      if (permissions === null || permissions.length === 0)
         return false;

      const route = _(path)
         .split("/")
         .value()
         .filter((c) => c !== "")
         .map((c) => _.toUpper(c)).join('-');

      if (route.length === 0) return true;

      const result = permissions.filter(c => c.name === route && c.isGranted);
      if (result.length === 1) {
         return true;
      }

      return false;
   }
   const handleRenderMethod = (matchProps) => {

      if (!config.useAuthentication) {
         return <MainLayout>{render(matchProps)}</MainLayout>
      }
      const user = auth.getCurrentUser();
      if (user) {
         //console.log("main rout user:", user);
         if (user.userType === "Admin" || user.userType === "Superuser") {
            return <MainLayout>{render(matchProps)}</MainLayout>
         }
         else if (doesCurrentUserHaveAuthorization(user.permissions)) {
            return <MainLayout>{render(matchProps)}</MainLayout>
         }
         else {
            auth.logout();
            return (<Redirect
               to={{
                  pathname: "/login",
                  state: { message: "Access to this section is forbidden" }
               }}
            />)
         }
      }
      return (<Redirect
         to={{
            pathname: "/login",
            state: { message: "Access to this section is forbidden" }
         }}
      />)
   }
   return (
      <Route
         {...rest}
         path={path}
         render={matchProps => handleRenderMethod(matchProps)}
      />
   );
};

export default MainLayoutRoute;
