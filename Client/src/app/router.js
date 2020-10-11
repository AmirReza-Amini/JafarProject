// import external modules
import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import Spinner from "../components/spinner/spinner";
import { connect } from "react-redux";
// import internal(own) modules
import MainLayoutRoutes from "../layouts/routes/mainRoutes";
import LoginLayoutRoute from "../layouts/routes/loginRoutes"
import ErrorLayoutRoute from "../layouts/routes/errorRoutes";
import LogoutLayoutRoute from "../layouts/routes/logoutRoutes";
import urls from '../urls.json';
const LazyVesselsPage = lazy(() => import("../views/pages/basic-info/vesselsPage"));
const LazyShippingLinesPage = lazy(() => import("../views/pages/basic-info/shippingLinesPage"));
const LazyVoyagesPage = lazy(() => import("../views/pages/basic-info/voyagesPage"));
const LazyCountriesPage = lazy(() => import("../views/pages/basic-info/countriesPage"));
const LazyLoginPage = lazy(() => import("../views/pages/loginPage"));
const LazyUsersPage = lazy(() => import("../views/pages/usersPage"));
const LazyLogout = lazy(() => import("../views/pages/logoutPage"));
const LazyMaintainance = lazy(() => import("../views/pages/maintainance"));
const LazyGarbageCollectionBill = lazy(() => import("../views/pages/billing/garbage-collection/garbageCollectionBillPage"));
const LazyGarbageCollectionList = lazy(() => import("../views/pages/billing/garbage-collection/garbageCollectionInvoiceList"));
const LazyGarbageCollectionTariff = lazy(() => import("../views/pages/billing/garbage-collection/garbageCollectionTariffPage"));
const LazyVesselStoppageBill = lazy(() => import("../views/pages/billing/vessel-stoppage/vessel-stoppageBillPage"));
const LazyVesselStoppageTariff = lazy(() => import("../views/pages/billing/vessel-stoppage/vessel-stoppageTariffPage"));

// Full Layout
const LazyHome = lazy(() => import("../views/dashboard/ecommerceDashboard"));

// Error Pages
const LazyErrorPage = lazy(() => import("../views/pages/error"));

class Router extends Component {
  state = {};
  // componentWillMount() {
  //   const user = auth.getCurrentUser();

  //   this.setState({ user });
  // }
  render() {
    //console.log('from render')
    return (
      // Set the directory path if you are deplying in sub-folder
      <BrowserRouter basename="/">
        <Switch>
          <MainLayoutRoutes
            exact
            path={urls.Home}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>)}
          />
          <MainLayoutRoutes
            exact
            path={urls.Admin.Users}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyUsersPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.Admin.Dashboard}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyMaintainance {...matchprops} />
              </Suspense>
            )}
          />
          <LoginLayoutRoute
            exact
            path={urls.Auth.Login}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.BasicInformation.Vessels}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyVesselsPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.BasicInformation.ShippingLines}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyShippingLinesPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.BasicInformation.Voyages}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyVoyagesPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.BasicInformation.Countries}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyCountriesPage {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.Billing.GarbageCollection.Invoice}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyGarbageCollectionBill {...matchprops} />
              </Suspense>
            )}
          />
            <MainLayoutRoutes
            exact
            path={urls.Billing.GarbageCollection.List}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyGarbageCollectionList {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.Billing.GarbageCollection.Tariff}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyGarbageCollectionTariff {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.Billing.VesselStoppage.Invoice}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyVesselStoppageBill {...matchprops} />
              </Suspense>
            )}
          />
          <MainLayoutRoutes
            exact
            path={urls.Billing.VesselStoppage.Tariff}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyVesselStoppageTariff {...matchprops} />
              </Suspense>
            )}
          />
          <LogoutLayoutRoute
            exact
            path={urls.Auth.Logout}
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyLogout {...matchprops} />
              </Suspense>
            )}
          />
          <ErrorLayoutRoute
            render={(matchprops) => (
              <Suspense fallback={<Spinner />}>
                <LazyErrorPage {...matchprops} />
              </Suspense>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // fetch: () => dispatch(fetchVoyagesTopTenOpen()),
    // fetchOperator:(value)=>dispatch(fetchOperatorInfoBasedOnCode(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
