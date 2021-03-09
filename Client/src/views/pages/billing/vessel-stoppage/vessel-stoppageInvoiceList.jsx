import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  FormGroup,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { ShoppingBag, Printer } from "react-feather";
import { Table, Tag, Space } from "antd"; import { toast } from "react-toastify";
import antdClass from "antd/dist/antd.css";
import antdClass2 from "../../../../assets/css/vendors/customAntdTable.css";
import style from './style/style.css'

import * as  vss from '../../../../services/vesselStoppageService';

toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const GarbageCollectionListPage = (props) => {


  const [state, setState] = useState({
    PrintModal: false,
    CurrentBill: {},
    ListOfBills: []
  });
  useEffect(() => {
    (async function GetBills() {
      let result = await vss.GetAllBills();
      if (result.data.result) {
        setState((ps) => ({ ...ps, ListOfBills: result.data.data.map(item => { return { ...item, key: item.VesselStopageInvoiceId } }) }));
      }
    })();
  }, []);

  const handlePrintInvoice = (record) => {
    console.log("handleEditVessel -> record", record)
    setState(ps => ({ ...ps, CurrentBill: record }))
    PrintToggle();
  }


  const handleSendToPrinter= async(record)=>{
    let result = (await vss.GetAllBills(record)).data.data[0]
    result.billType = 'Vessel stoppage';
    return props.history.push('/billing/garbage-collection/Invoice-Print', { data: result });
  }

  const PrintToggle = () => {
    setState((prevState) => ({
      ...prevState,
      PrintModal: !state.PrintModal,
    }));
  };

  const columns = [
    {
      title: "Invoice-no",
      dataIndex: "InvoiceNo",
      key: "InvoiceNo",
      render: p => (
        <Tag>{
          p
        }</Tag>
      )
    },
    {
      title: "Voyage / Vessel",
      dataIndex: "VoyageVessel",
      key: "VoyageVessel",
    },
    {
      title: "Dwell",
      dataIndex: "DwellHour",
      key: "DwellHour",
      render: p => (
        <span>{
          p + ' hour(s)'
        }</span>
      )
    },
    {
      title: "Price ($)",
      dataIndex: "PriceD",
      key: "PriceD"
    },
    {
      title: "Price (IRR)",
      dataIndex: "PriceR",
      key: "PriceR",
    },
    {
      title: "Invoice date",
      dataIndex: "InvoiceDate",
      key: "InvoiceDate"
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status"
    },
    {
      title: "Print",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            className="btn-warning mt-1"
            size="sm"
            onClick={() => handlePrintInvoice(record)}
          >
            <Printer size={16} />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <React.Fragment>
      <Row className="row-eq-height">
        <Col sm="12" md="12">
          <Card>
            <CardBody>  <div className="form-body">
              <Row>
                <Col md="9">
                  <h4 className="form-section">
                    <ShoppingBag size={20} color="#212529" /> Garbage collection invoices
                        </h4>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Table
                      columns={columns}
                      dataSource={state.ListOfBills}
                      pagination={{ position: ["bottomCenter"] }}
                      scroll={{ x: "max-content", y: 200 }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            </CardBody>
          </Card>
        </Col>

        <Modal
          isOpen={state.PrintModal}
          toggle={PrintToggle}
          className={props.className}
          backdrop="static"
        >
          <ModalHeader toggle={PrintToggle}>
            Print invoice --- {state.CurrentBill.InvoiceNo}
          </ModalHeader>  
          <ModalBody>
            <div className="row invoiceItem">
              <div className="col">Voyage / Vessel: <b>{state.CurrentBill.VoyageVessel}</b> </div>
            </div>
            <div className="row invoiceItem">
              <div className="col-6">Invoice date: <b>{state.CurrentBill.InvoiceDate}</b></div>
              <div className="col-6">Status: <b>{state.CurrentBill.Status}</b> </div>
            </div>
            <div className="row invoiceItem">
              <div className="col-6">Dwell: <b>{state.CurrentBill.DwellHour}</b></div>
              <div className="col-6">Rate: <b>{state.CurrentBill.Rate}</b> </div>
            </div>

            <div className="row invoiceItem">
              <div className="col-6"><Tag color='geekblue'>Price ($): <b>{state.CurrentBill.PriceD}</b></Tag></div>
              <div className="col-6"><Tag color='geekblue'>Price (IRR): <b>{state.CurrentBill.PriceR} </b></Tag></div>
            </div>
            <Button
              className="btn-success mt-1"
              size="sm"
            onClick={() => handleSendToPrinter(state.CurrentBill.VesselStopageInvoiceId)}
            >
              <Printer size={16} /> Print
          </Button>
          </ModalBody>
        </Modal>

      </Row>
    </React.Fragment>
  );
}

export default GarbageCollectionListPage;