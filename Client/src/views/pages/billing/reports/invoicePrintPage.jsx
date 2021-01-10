
import React from "react";
import bootstrap from './style/bootstrap.min.css'
import style from './style/style.css'
import logo from './logo.jpg'

class Viewer extends React.Component {

    render() {
        return <React.Fragment>
            <div className="container">
                <div className="col-md-12">
                    <div className="invoice">
                        <div className="invoice-company text-inverse f-w-600">
                            <img src={logo}></img>
                            <span className="header">SIMIN PARS.co</span>
                        </div>
                        <div className="invoice-header">
                            <div className="invoice-from">
                                <small>from</small>
                                <address className="m-t-5 m-b-5">
                                    <strong className="text-inverse">Simin pars.co</strong> <br/>
                                        Gandi st <br/>
                  Tehran-Iran <br/>
                                        Phone: (123) 456-7890 <br/>
                  Fax: (123) 456-7890
               </address>
                            </div>
                            <div className="invoice-to">
                                <small>to</small>
                                <address className="m-t-5 m-b-5">
                                    <strong className="text-inverse">Lyan Container</strong> <br/>
                                        keyhan st <br/>
                                            Tangestan-Boushehr <br/>
                  Phone: (123) 456-7890 <br/>
                  Fax: (123) 456-7890
               </address>
                            </div>
                            <div className="invoice-date">
                                <small>Invoice Date</small>
                                <div className="date text-inverse m-t-5">1399/10/17</div>
                                <small>Invoice-no</small>
                                <div className="invoice-detail">
                                    13990000001 <br/>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-content">
                            <div className="table-responsive">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th>TASK DESCRIPTION</th>
                                            <th className="text-center" width="10%">RATE</th>
                                            <th className="text-center" width="10%">HOURS</th>
                                            <th className="text-right" width="20%">LINE TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className="text-inverse">Garbage collection</span> <br/>
                                                <small>Shabdis-0054G.</small>
                                            </td>
                                            <td className="text-center">$3.00</td>
                                            <td className="text-center">20</td>
                                            <td className="text-right">$60.00</td>
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
                                    <small>TOTAL</small> <span className="f-w-600">$60.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-note">
                            * Make all cheques payable to SIMIN PARS <br/>
            * Payment is due within 30 days
         </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

}
 
export default Viewer;