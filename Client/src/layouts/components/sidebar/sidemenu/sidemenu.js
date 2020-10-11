// import external modules
import React, { Component } from "react";

import { ChevronRight } from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";
import ReactRevealText from "react-reveal-text";
import * as auth from "../../../../services/authService";
import config from '../../../../config.json';
import menuList from '../../../../mockData/menuList';
import _ from 'lodash';

class SideMenuContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      showUserInfo: false,
      menuList: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showUserInfo: true });
    }, 1500);
  }

  componentWillMount() {
    if (!config.useAuthentication) {
      this.setState({ menuList: menuList });
    }
    else {
      const user = auth.getCurrentUser();
      if (user.userType === "Admin") {
        this.setState({ menuList: menuList, user: user });
        return;
      }
      else {

        function filterData(data, key) {
          var r = data.filter(function (o) {
            if (o.child) o.child = filterData(o.child, key);
            return o.key != key;
          });
          return r;
        }

        let permissions = user.permissions
          .filter((m) => m.isGranted == false)
          .map((n) => n.name);

        console.log(permissions)
        let result = menuList;
        permissions.forEach((p) => {
          result = filterData(result, p);
        });

        this.setState({ menuList: result, user: user });
      }
    }
  }
  showMenus = () => {
    let menu = _.cloneDeep(this.state.menuList);
    // console.log(menu);

    let travers = tree => {

      return tree.map(item => {
        if (item.child.length == 0) {
          if (item.url && item.url !== "") {
            return (
              <NavLink to={item.url} key={item.key} exact className="item" activeclassname="active">
                {item.icon &&
                  <i className="menu-icon">
                    {item.icon()}
                  </i>}
                <span className="menu-item-text">{item.name}</span>
              </NavLink>
            )
          }
          else{
            return (
              <React.Fragment key={item.key}>
                <div hidden={true}></div>
              </React.Fragment>
            )
          }
          //return null
        }
        else {
          return (
            <SideMenu toggleSidebarMenu={this.props.toggleSidebarMenu} key={item.key}>
              <SideMenu.MenuMultiItems
                key={item.key}
                name={item.name}
                Icon={item.icon ? item.icon() : ''}
                ArrowRight={<ChevronRight size={16} />}
                collapsedSidebar={this.props.collapsedSidebar}
              >
                {travers(item.child)}
              </SideMenu.MenuMultiItems>
            </SideMenu>
          )
        }
      })
    }

    return menu.map(item => {
      if (item.child.length == 0) {
        //console.log(item)
        return (
          <SideMenu.MenuSingleItem badgeColor="danger" key={item.key} >
            <NavLink to={item.url} activeclassname="active">
              <i className="menu-icon">
                {item.icon && item.icon()}
              </i>
              <span className="menu-item-text">{item.name}</span>
            </NavLink>
          </SideMenu.MenuSingleItem>)
      }
      else {
        // console.log('node - child > 0', item.child)
        return (
          <SideMenu.MenuMultiItems
            key={item.key}
            name={item.name}
            Icon={item.icon ? item.icon() : ''}
            ArrowRight={<ChevronRight size={16} />}
            collapsedSidebar={this.props.collapsedSidebar}
          >
            {travers(item.child)}
          </SideMenu.MenuMultiItems>

        )
      }
    })
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

        {
          this.state.menuList && this.showMenus(this.state.menuList)
        }

        //#region  Old Structure
        {/* <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to={urls.Home} activeclassname="active">
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Home</span>
          </NavLink>
        </SideMenu.MenuSingleItem> */}

        {/* <SideMenu.MenuMultiItems
          name="Basic Information"
          Icon={<FileText size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
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
        </SideMenu.MenuMultiItems> */}

        {/* <SideMenu.MenuMultiItems
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
        </SideMenu.MenuMultiItems> */}
      //#endregion 

      </SideMenu >
    );
  }
}

export default SideMenuContent;
