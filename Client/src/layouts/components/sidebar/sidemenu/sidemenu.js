// import external modules
import React, { Component } from "react";

import { Home, LogIn, ChevronRight, Paperclip, FileText } from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";
import urls from "../../../../urls.json";
import ReactRevealText from "react-reveal-text";
import * as auth from "../../../../services/authService";
import config from '../../../../config.json';

class SideMenuContent extends Component {
  permissionList = [
    { name: "gate", isGranted: false },
    { name: "billing", isGranted: true },
    { name: "warehouse", isGranted: true },
    { name: "strip", isGranted: true },
    { name: "strip-delete", isGranted: false },
  ];
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isAdmin: false,
      hasRoles: false,
      showUserInfo: false,
      menu2: [
        { name: "Gate", key: "gate", child: [] },
        {
          name: "billing",
          key: "billing",
          child: [
            { name: "Warehouse", key: "warehouse", child: [] },
            {
              name: "Strip",
              key: "strip",
              child: [
                { name: "create", key: "strip-create", child: [] },
                { name: "edit", key: "strip-edit", child: [] },
                { name: "delete", key: "strip-delete", child: [] },
                { name: "print", key: "strip-print", child: [] },
              ],
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showUserInfo: true });
    }, 1500);
  }

  componentWillMount() {
    if (!config.useAuthentication) {
      this.setState({ isAdmin: true });
    }
    else {
      const user = auth.getCurrentUser();
      const isAdmin = user.userType === "Admin" ? true : false;
      this.setState({ user, isAdmin });
      // const roles = user.permissions.filter(c => c.isGranted === true);
      // this.setState({ hasRoles: roles.length > 0 ? true : false });
      //console.log('from side cwm')
    }

    function filterData(data, key) {
      var r = data.filter(function (o) {
        if (o.child) o.child = filterData(o.child, key);
        // console.log('from filtr data ', o.child)
        return o.key != key;
      });
      return r;
    }
    let permissions = this.permissionList
      .filter((m) => m.isGranted == false)
      .map((n) => n.name);

    let result = this.state.menu2;
    permissions.forEach((p) => {
      result = filterData(result, p);
    });


    this.setState({ menu2: result });
  }

  render() {
    return (
      <SideMenu
        className="sidebar-content"
        toggleSidebarMenu={this.props.toggleSidebarMenu}
      >
        <SideMenu.MenuSingleItem badgeColor="danger">
          <ReactRevealText
            style={{ color: "White", fontSize: 18 }}
            className="m-3"
            show={this.state.showUserInfo}
            text={"Welcome " + this.state.user.firstName}
          ></ReactRevealText>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to={urls.Home} activeclassname="active">
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Home</span>
          </NavLink>
        </SideMenu.MenuSingleItem>

        <SideMenu.MenuMultiItems
          name="Basic Information"
          Icon={<FileText size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          {/* {this.state.menu2 &&
            this.state.menu2.map((item) => {
              return (
                <NavLink
                  to={urls.BasicInfo.Vessels}
                  exact
                  key={item.key}
                  className="item"
                  activeclassname="active"
                >
                  <span className="menu-item-text">{item.key}</span>
                </NavLink>
              );
            })} */}
          <NavLink to={urls.BasicInfo.Vessels} exact className="item" activeclassname="active">
            <span className="menu-item-text">Vessels</span>
          </NavLink>
          <NavLink to={urls.BasicInfo.ShippingLines} exact className="item" activeclassname="active">
            <span className="menu-item-text">Shipping Lines</span>
          </NavLink>
          <NavLink to={urls.BasicInfo.Voyages} exact className="item" activeclassname="active">
            <span className="menu-item-text">Voyages</span>
          </NavLink>
          <NavLink to={urls.BasicInfo.Countries} exact className="item" activeclassname="active">
            <span className="menu-item-text">Countries</span>
          </NavLink>
        </SideMenu.MenuMultiItems>

        <SideMenu.MenuMultiItems
          name="Garbage collection bill"
          Icon={<Paperclip size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          <NavLink
            to={urls.billing.garbageCollection.invoice}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Invoice</span>
          </NavLink>
          <NavLink 
            to={urls.billing.garbageCollection.list}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">List</span>
          </NavLink>
          <NavLink
            to={urls.billing.garbageCollection.tariff}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Tariff</span>
          </NavLink>
        </SideMenu.MenuMultiItems>

        <SideMenu.MenuMultiItems
          name="Vessel stoppage bill"
          Icon={<Paperclip size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          <NavLink
            to={urls.billing.vesselStoppage.invoice}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Invoice</span>
          </NavLink>
          <NavLink
            to={urls.billing.vesselStoppage.tariff}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Tariff</span>
          </NavLink>
        </SideMenu.MenuMultiItems>

        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to={urls.auth.Logout} activeclassname="active">
            <i className="menu-icon">
              <LogIn size={18} />
            </i>
            <span className="menu-item-text">Logout</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuMultiItems
          //hidden={!this.state.isAdmin}
          name="Admin"
          Icon={<Home size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          <NavLink
            to={urls.admin.Dashboard}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Dashboard</span>
          </NavLink>
          <NavLink
            to={urls.admin.Users}
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Users</span>
          </NavLink>
        </SideMenu.MenuMultiItems>
      </SideMenu>
    );
  }
}

export default SideMenuContent;
