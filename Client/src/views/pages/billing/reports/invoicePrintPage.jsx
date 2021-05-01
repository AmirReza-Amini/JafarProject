import React from "react";
import bootstrap from "./style/bootstrap.min.css";
import style from "./style/style.css";
import logo from "./logo.jpg";
import { SetValueLabel, FormatNumber } from "../../../../utility/tools";
import { Button } from "reactstrap";
class Viewer extends React.Component {
  render() {
    let invoiceData = this.props.location.state.data;
     return (
      <React.Fragment>
        <div className="container">
          <div id="print-area" className="col-md-12">
            <div className="invoice">
              <div className="invoice-company text-inverse f-w-600">
                <img src={logo}></img>
                <span className="header">SIMIN PARS.co</span>
              </div>
              <hr />
              <row>
                <col />
                <div className="invoice-header">
                  <small className="col-md">
                    Invoice-no:{" "}
                    <strong className="text-inverse">
                      {invoiceData.InvoiceCoverNo}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    Invoice Date:{" "}
                    <strong className="text-inverse">
                      {invoiceData.InvoiceCoverDate}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    Dollar Rate:{" "}
                    <strong className="text-inverse">{invoiceData.Rate}</strong>{" "}
                  </small>
                </div>
                <col />
                <col />
                <div className="invoice-header">
                  <small className="col-md">
                    Seller:{" "}
                    <strong className="text-inverse">Simin pars.co</strong>{" "}
                  </small>
                  <small className="col-md">
                    Address:{" "}
                    <strong className="text-inverse">
                      No.35 13th avenue Gandi st Tehran Iran{" "}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    ID No: <strong className="text-inverse">1010114364 </strong>{" "}
                  </small>
                  <small className="col-md">
                    Economic No:{" "}
                    <strong className="text-inverse">411-1135-5887 </strong>{" "}
                  </small>
                </div>
                <col />
                <col className="invoice-from" />
                <div className="invoice-header">
                  <small className="col-md">
                    Buyer:{" "}
                    <strong className="text-inverse">
                      {invoiceData.ShippingLineName}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    Address:{" "}
                    <strong className="text-inverse">
                      {invoiceData.Address}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    ID No:{" "}
                    <strong className="text-inverse">
                      {invoiceData.NationalCode}{" "}
                    </strong>{" "}
                  </small>
                  <small className="col-md">
                    Economic No:{" "}
                    <strong className="text-inverse">
                      {invoiceData.EconomicCode}{" "}
                    </strong>{" "}
                  </small>
                </div>
                <col />
              </row>
              <div className="row">
                <div className="invoice-detail col">
                  Vessel/voyage: {invoiceData.VoyageVessel}
                </div>
                <div className="invoice-detail col-3">
                  Actual arrival: {invoiceData.ATA}
                </div>
                <div className="invoice-detail col-3">
                  Actual leave: {invoiceData.ATD}
                </div>
                <div className="invoice-detail col-2">
                  Dwell: {invoiceData.DwellDate}h
                </div>
              </div>
              <div className="invoice-content">
                <div className="table-responsive">
                  <table className="table table-invoice">
                    <thead>
                      <tr>
                        <th>Invoice Detail</th>
                        <th className="text-center" width="10%">
                          Tonage
                        </th>
                        <th className="text-center" width="10%">
                          Actual arrival
                        </th>
                        <th className="text-center" width="10%">
                          Actual leave
                        </th>
                        <th className="text-center" width="10%">
                          Dwell
                        </th>
                        <th className="text-center" width="10%">
                          Vessel Name
                        </th>
                        <th className="text-center" width="10%">
                          Dollar Rate
                        </th>
                        <th className="text-center" width="10%">
                          Flag
                        </th>
                        <th className="text-right" width="10%">
                          Price($)
                        </th>
                        <th className="text-right" width="10%">
                          Price(R)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-center" width="10%">
                          {invoiceData.vsbillType}
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.GrossTonage} T
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.ATA}
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.ATD}
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.DwellDate} h
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.VesselName}
                        </th>
                        <th className="text-center" width="10%">
                          {FormatNumber(invoiceData.Rate)}
                        </th>
                        <th className="text-right" width="10%">
                          {invoiceData.Flag}
                        </th>
                        <th className="text-right" width="10%">
                          {FormatNumber(invoiceData.vsPriceD)}
                        </th>
                        <th className="text-right" width="10%">
                          {FormatNumber(invoiceData.vsPriceR)}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center" width="10%">
                          {invoiceData.gcbillType}
                        </th>
                        <th className="text-center" width="10%">
                          {FormatNumber(invoiceData.GrossTonage)} T
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.ATA}
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.ATD}
                        </th>
                        <th className="text-center" width="10%">
                          {Math.ceil(invoiceData.DwellDate/24)} D
                        </th>
                        <th className="text-center" width="10%">
                          {invoiceData.VesselName}
                        </th>
                        <th className="text-center" width="10%">
                          {FormatNumber(invoiceData.Rate)}
                        </th>
                        <th className="text-right" width="10%">
                          {invoiceData.Flag}
                        </th>
                        <th className="text-right" width="10%">
                          {FormatNumber(invoiceData.gcPriceD)}
                        </th>
                        <th className="text-right" width="10%">
                          {FormatNumber(invoiceData.gcPriceR)}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="invoice-price">
                  <div className="invoice-price-left">
                    <div className="invoice-price-row">
                        خواهشمند است مبلغ {FormatNumber(invoiceData.SumInvoicePriceR)}  ریال به حساب شماره 0106003276003 نزد بانک ملی و یا حساب شبا IR740170000000106003276003 به نام شرکت توسعه خدمات دریایی و بندری سینا واریز نمایید.
                    </div>
                  </div>
                  <div className="invoice-price-right">
                    <small>TOTAL</small>{" "}
                    <span className="f-w-600">{FormatNumber(invoiceData.SumInvoicePriceD)} $</span>
                    <br />
                    <span className="f-w-600">{FormatNumber(invoiceData.SumInvoicePriceR)} IRR</span>
                  </div>
                </div>

              </div>
              <div className="invoice-note">
                * Make all cheques payable to SIMIN PARS <br />* Payment is due
                within 30 days
              </div>
            </div>
          </div>
        </div>
        <br />
      </React.Fragment>
    );
  }
}

export default Viewer;
