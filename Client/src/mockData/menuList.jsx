import React from "react";
import { Home, FileText, Monitor, Users, LogOut } from "react-feather";
import urls from '../urls.json';

const MenuList = [
    {
        name: "Home", key: "home", url: urls.Home, icon: () => <Home size={18} />, child: []
    },
    {
        name: "Basic Information",
        key: "BASIC-INFORMATION",
        icon: () => <FileText size={18} />,
        child: [
            { name: "Vessels", key: "BASIC-INFORMATION-VESSELS", url: urls.BasicInformation.Vessels, child: [] },
            { name: "Shipping Lines", key: "BASIC-INFORMATION-SHIPPINGLINES", url: urls.BasicInformation.ShippingLines, child: [] },
            { name: "Voyages", key: "BASIC-INFORMATION-VOYAGES", url: urls.BasicInformation.Voyages, child: [] },
            { name: "Countries", key: "BASIC-INFORMATION-COUNTRIES", url: urls.BasicInformation.Countries, child: [] }
        ]
    }
    ,
    {
        name: "Billing",
        key: "BILLING",
        icon: () => <FileText size={18} />,
        child: [
            {
                name: "Garbage Collection",
                key: "BILLING-GARBAGE-COLLECTION",
                child: [
                    { name: "Invoice", key: "BILLING-GARBAGE-COLLECTION-INVOICE", url: urls.Billing.GarbageCollection.Invoice, child: [] },
                    { name: "List", key: "BILLING-GARBAGE-COLLECTION-LIST", url: urls.Billing.GarbageCollection.List, child: [] },
                    { name: "Tariff", key: "BILLING-GARBAGE-COLLECTION-TARIFF", url: urls.Billing.GarbageCollection.Tariff, child: [] },
                ]
            },
            {
                name: "Vessel Stoppage",
                key: "BILLING-VESSEL-STOPPAGE",
                child: [
                    { name: "Invoice", key: "BILLING-VESSEL-STOPPAGE-INVOICE", url: urls.Billing.VesselStoppage.Invoice, child: [] },
                    { name: "List", key: "BILLING-VESSEL-STOPPAGE-List", url: urls.Billing.VesselStoppage.List, child: [] },
                    { name: "Tariff", key: "BILLING-VESSEL-STOPPAGE-TARIFF", url: urls.Billing.VesselStoppage.Tariff, child: [] },
                ]
            }
        ]
    },
    {
        name: "Admin",
        key: "ADMIN",
        icon: () => <Monitor size={18} />,
        child: [
            { name: "Dashboard", key: "ADMIN-DASHBOARD", url: urls.Admin.Dashboard, child: [] },
            { name: "Users", key: "ADMIN-USERS", url: urls.Admin.Users, icon: () => <Users size={18} />, child: [] }
        ]
    },
    {
        name: "Logout", key: "LOGOUT", url: urls.Auth.Logout, icon: () => <LogOut size={18} />, child: []
    },
];

export default MenuList;