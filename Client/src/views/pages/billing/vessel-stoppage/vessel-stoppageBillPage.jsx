import React, {
  useState,
  useEffect
} from "react";
import { Row, Col } from "reactstrap";
import { SetValueLabel, FormatNumber } from "../../../../utility/tools";
import { Tag } from "antd";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import FormikControl from "../../../../components/common/formik/FormikControl";

import style from "./style/style.css";
import * as vss from "../../../../services/vesselStoppageService";
import * as vs from "../../../../services/voyageService";

toast.configure({ bodyClassName: "customFont" });

const initialValues = {
  ListOfVoyages: [],
  voyageData: {},
  issuedBill: {},
};

const VesselStoppagePage = (props) => {
  const [state, setState] = useState({
    ListOfVoyages: [],
    voyageData: {},
    issuedBill: {},
    createModal: false,
  });

  useEffect(() => {
    (async function fetchAllTariffs() {
      const response = await vs.GetLast10Voyages();
      if (response.data.result) {
        let temp = SetValueLabel(
          response.data.data,
          "VoyageId",
          "VoyageVessel"
        );
        setState((prevState) => ({ ...prevState, ListOfVoyages: temp }));
      } else toast.error(response.data.data[0]);
    })();
  }, []);

  const handleSelectedVoyageChanged = async (param) => {
    await FireUp(param.value);
  };

  const handleInvoicePrint = async () => {
      console.log("resssss",state.voyageData.InvoiceCoverId)
      let result = (await vss.GetAllBills(state.voyageData.InvoiceCoverId)).data
      .data[0];
      result.vsbillType = "Vessel stoppage";
      result.gcbillType = "Garbage Collection";
    return props.history.push("/billing/garbage-collection/Invoice-Print", {
      data: result,
    });
  };

  const handleInvoiceClicked = async (isPreInvoice) => {
    try {
      let result = await vss.Calculate(voyageData.VoyageId, isPreInvoice);
     
      if (result.data.result) {
        let invoice = result.data.data[0];
        
        if (!isPreInvoice) {
          toast.success(
            <div>
              <p>Invoice issued successfully</p>
              <p>Invoice-No: {invoice.icBill.InvoiceCoverNo}</p>
            </div>
          );
          await FireUp(voyageData.VoyageId);
        } else
          toast.success(
            <div>
              <p>Preinvoice issued successfully</p>
              <p>
                Garbage Collection Price($): {FormatNumber(invoice.GcInvoice.data.priceD)}USD,{" "}
                
              </p>
              <p>
              Garbage Collection Price(R): {FormatNumber(invoice.GcInvoice.data.priceR)}IRR,{" "}
               
              </p>
              <p>
                vessel Stoppage Price($): {FormatNumber(invoice.VsInvoice.data.priceD)}USD,{" "}
                
              </p>
              <p>
              vessel Stoppage Price(R): {FormatNumber(invoice.VsInvoice.data.priceR)}IRR,{" "}
                
              </p>
              <p>
                Sum Invoice Price($): {FormatNumber(invoice.icBill.SumInvoicePriceD)}USD,{" "}
                
              </p>
              <p>
              Sum Invoice Price(R): {FormatNumber(invoice.icBill.SumInvoicePriceR)}IRR,{" "}
                
              </p>
            </div>
          );
       // await FireUpPreInvoice(result.data.data[0]);
      }
    } catch (ex) {
      toast.error(ex.message);
    }
  };

  const FireUp = async (voyageId) => {
    let response = await vs.getVoyageDetail(voyageId);
    console.log("response", response);
    if (response.data.result)
      setState((ps) => ({ ...ps, voyageData: response.data.data[0] }));
    else toast.error(response.data.data[0]);
  };
  

  let { voyageData, ListOfVoyages, issuedBill } = state;

  return (
    <React.Fragment>
      <Formik initialValues={initialValues}>
        {() => {
          return (
            <React.Fragment>
              <Form className="custom-background">
                <div className="form-body">
                  <Row>
                    <Col md="6">
                      <FormikControl
                        control="customSelect"
                        name="selectTariff"
                        options={ListOfVoyages ?? []}
                        label="Select voyage"
                        onSelectedChanged={handleSelectedVoyageChanged}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="row details">
                  <div className="col-6">
                    Voyage/vessel:{<span className="invoiceItem">{voyageData.VoyageVessel}</span>} 
                  </div>
                  <div className="col-6">
                    Voyage status:{" "}
                    <Tag color={voyageData.Status == "close" ? "red" : "green"}>
                      {voyageData.Status}
                    </Tag>
                  </div>
                </div>
                <div className="row details">
                  <div className="col-6">
                    Voyage-no (in): {<span className="invoiceItem">{voyageData.VoyageNoIn}</span>}
                  </div>
                  <div className="col-6">
                    Voyage-no (out): {<span className="invoiceItem">{voyageData.VoyageNoOut}</span>} 
                  </div>
                </div>
                <hr />
                <div className="row details">
                  <div className="col-4">
                    Nationality: {<span className="invoiceItem">{voyageData.Nationality}</span>}
                  </div>
                  <div className="col-4">Flag: {<span className="invoiceItem">{voyageData.Flag}</span>}</div>
                  <div className="col-4">Call-sign: {<span className="invoiceItem">{voyageData.CallSign}</span>}</div>
                </div>
                <div className="row details">
                  <div className="col-4">
                    Origin port: {<span className="invoiceItem">{voyageData.OriginPort}</span>}
                  </div>
                  <div className="col-4">
                    Previous port: {<span className="invoiceItem">{voyageData.PreviousPort}</span>}
                  </div>
                  <div className="col-4">Next port: {<span className="invoiceItem">{voyageData.NextPort}</span>}</div>
                </div>
                <div className="row details">
                  <div className="col-4">
                    Vessel type: {<span className="invoiceItem">{voyageData.VesselType}</span>}
                  </div>
                  <div className="col-4">
                    Vessel length:{<span className="invoiceItem">{voyageData.VesselLength}</span>} 
                  </div>
                  <div className="col-4">
                    Gross tonage: {<span className="invoiceItem">{voyageData.GrossTonage}</span>}
                  </div>
                  <div className="col-4">#Bays: {<span className="invoiceItem">{voyageData.NumOfBays}</span>}</div>
                  <div className="col-4">
                    #ActiveCrane: {<span className="invoiceItem">{voyageData.ActiveCraneQty}</span>}
                  </div>
                </div>
                <hr />
                <div className="row details">
                  <div className="col-3">
                    Estimated arrival time: {<span className="invoiceItem">{voyageData.ETA}</span>}
                  </div>
                  <div className="col-3">
                    Estimated departure time: {<span className="invoiceItem">{voyageData.ETD}</span>}
                  </div>
                  <div className="col-3">
                    Actual arrival time: {<span className="invoiceItem">{voyageData.ATA}</span>}
                  </div>
                  <div className="col-3">
                    Actual departure time: {<span className="invoiceItem">{voyageData.ATD}</span>}
                  </div>
                </div>

                {voyageData && voyageData.InvoiceCoverNo && (
                  <React.Fragment>
                    <hr />
                    <div className="row details">
                      <div className="col-3">
                        Garbage Collection Price($):{" "}
                        {<span className="invoiceItem">{FormatNumber(voyageData.gcPriceD)}</span>}
                      </div>
                      <div className="col-3">
                        Garbage Collection Price(R):{" "}
                        {<span className="invoiceItem">{voyageData.gcPriceR}</span>} 
                      </div>
                    </div>
                    <div className="row details">
                      <div className="col-3">
                        Vessel Stopage Price($):{" "}
                        {<span className="invoiceItem">{voyageData.vsPriceD}</span>}
                      </div>
                      <div className="col-3">
                        Vessel Stopage Price(R):{" "}
                        {<span className="invoiceItem">{voyageData.vsPriceR}</span>}
                      </div>
                    </div>
                    <div className="row details">
                      {/* <div className="col-3">
                                                Invoice-no: {issuedBill.icBill.InvoiceCoverNo}
                                            </div> */}
                      <div className="col-3">
                        Invoice Date: {<span className="invoiceItem">{voyageData.InvoiceCoverDate}</span>}
                      </div>
                      <div className="col-3">
                        Sum Invoice Price($):{" "}
                        {<span className="invoiceItem">{voyageData.SumInvoicePriceD}</span>}
                      </div>
                      <div className="col-3">
                        Sum Invoice Price(R):{" "}
                        {<span className="invoiceItem">{voyageData.SumInvoicePriceR}</span>}
                      </div>
                    </div>
                    <hr />
                    
                  </React.Fragment>
                )}
                {voyageData && voyageData.VoyageId &&
                <div className="row">
                <button
                  disabled={
                    voyageData.Status == "open" ||
                    voyageData.InvoiceCoverNo != null
                  }
                  className="btn btn-primary ml-3"
                  onClick={() => handleInvoiceClicked(false)}
                >
                  Invoice
                </button>
                <button
                  disabled={
                    voyageData.Status == "open" ||
                    voyageData.InvoiceCoverNo != null
                  }
                  className="btn btn-secondary ml-1"
                  onClick={() => handleInvoiceClicked(true)}
                >
                  Pre invoice
                </button>
                <button
                  disabled={voyageData.InvoiceCoverNo == null}
                  className="btn btn-secondary ml-1"
                  onClick={() => handleInvoicePrint()}
                >
                  Print
                </button>
              </div>}
              </Form>
            </React.Fragment>
          );
        }}
        
      </Formik>
   
    </React.Fragment>
  );
};

export default VesselStoppagePage;
