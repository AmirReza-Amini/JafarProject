
import React from "react";
import bootstrap from './style/bootstrap.min.css'
import style from './style/style.css'
import logo from './logo.jpg'

class Viewer extends React.Component {

    render() {
        let invoiceData = this.props.location.state.data;
        return <React.Fragment>
            <div className="container">
                <div className="col-md-12">
                    <div className="invoice">
                        <div className="invoice-company text-inverse f-w-600">
                            <img src={logo}></img>
                            <span className="header">SIMIN PARS.co</span>
                        </div>
                        <hr/>
                        <div className="invoice-header">
                            <div className="invoice-from">
                                <small>from</small>
                                <address className="m-t-5 m-b-5">
                                    <strong className="text-inverse">Simin pars.co</strong> <br />
                                        Gandi st <br />
                  Tehran-Iran <br />
                                        Phone: (123) 456-7890 <br />
                  Fax: (123) 456-7890
               </address>
                            </div>
                            <div className="invoice-to">
                                <small>to</small>
                                <address className="m-t-5 m-b-5">
                                    <strong className="text-inverse">{invoiceData.ShippingLineName}</strong> <br />
                                        {invoiceData.Address} <br />
                  Phone: {invoiceData.Tel} 
               </address>
                            </div>
                            <div className="invoice-date">
                                <small>Invoice Date</small>
                                <div className="date text-inverse m-t-5">{invoiceData.InvoiceDate}</div>
                                <small>Invoice-no</small>
                                <div className="invoice-detail">
                                    {invoiceData.InvoiceNo} <br />
                                </div>
                                <small>$Rate</small>
                                <div className="invoice-detail">
                                    {invoiceData.Rate.toLocaleString()} <br />
                                </div>
                            </div>
                        </div>
                        <div className="invoice-content">
                            <div className="table-responsive">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th>INVOICE DETAIL</th>
                                            <th className="text-center" width="10%">TYPE</th>
                                            <th className="text-center" width="10%">TONAGE</th>
                                            <th className="text-center" width="10%">DWELL</th>
                                            <th className="text-center" width="10%">FEE</th>
                                            <th className="text-right" width="20%">LINE TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className="text-inverse">{invoiceData.billType}</span> <br />
                                                <small>{invoiceData.VoyageVessel}</small>
                                            </td>
                                            <td className="text-center"> {invoiceData.VesselType}</td>
                                            <td className="text-center">{invoiceData.GrossTonage}T</td>
                                            <td className="text-center">{invoiceData.DwellDate}h</td>
                                            <td className="text-center">${invoiceData.Fee}</td>
                                            <td className="text-right">${invoiceData.PriceD}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="invoice-price">
                                <div className="invoice-price-left">
                                    <div className="invoice-price-row">
                                    </div>
                                </div>
                                <div className="invoice-price-right">
                                    <small>TOTAL</small> <span className="f-w-600">${invoiceData.PriceD}</span><br/>
                                    <span className="f-w-600">IRR {invoiceData.PriceR.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-note">
                            * Make all cheques payable to SIMIN PARS <br />
            * Payment is due within 30 days
         </div>
                    </div>
                </div>
            </div><br/>

        </React.Fragment>
    }

}

export default Viewer;