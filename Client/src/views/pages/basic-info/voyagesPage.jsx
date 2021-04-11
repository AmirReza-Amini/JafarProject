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
import { Table, Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import { ShoppingBag, Edit2, CheckSquare, X } from "react-feather";
import * as Yup from "yup";
import { toast } from "react-toastify";
import _, { isDate } from "lodash";
import FormikControl from "../../../components/common/formik/FormikControl";
import antdClass from "antd/dist/antd.css";
import antdClass2 from "../../../assets/css/vendors/customAntdTable.css";
import moment from "jalali-moment";

import {
  addNewVoyageInfo,
  editVoyageInfo,
  getVoyage,
} from "../../../services/voyageService";
import { getVessels } from "../../../services/vesselService";
import { getPorts } from "../../../services/portServices";
import { getShippingLines } from "../../../services/shippingLineService";
import { ToPersianDate } from "../../../utility/tools";
toast.configure({ bodyClassName: "customFont" });

const initialValues = {
  selectVessel: "",
  incomingVoyageNo: "",
  outgoingVoyageNo: "",
  selectOwner: "",
  selectAgent: "",
  eta: "",
  ata: "",
  etd: "",
  atd: "",
  voyageStatus: "",
  selectOriginPort: "",
  selectPreviousPort: "",
  selectNextPort: "",
};
const validationSchema = Yup.object().shape({
  selectVessel: Yup.string().required("Entet Vessel Name!"),
  incomingVoyageNo: Yup.string().required("Enter Incoming Voyage Number!"),
  selectOwner: Yup.string().required("Enter Owner Of Voyage!"),
  selectAgent: Yup.string().required("Enter Agent Of Voyage!"),
  eta: Yup.string().required("Enter ETA Date!")
  // atd: Yup.string()
  //   .when("voyageStatus", {
  //     is: false,
  //     then: Yup.string().test("", "invalid date", (value) => //moment(value, "YYYY-MM-DD HH:mm:ss",true).isValid()

  //     {
  //      const asd = moment(undefined).format('YYYY-MM-DD HH:mm:ss')

  //    //   console.log('asd',asd,value)
  //     }
  //     )
  //   }),
  // voyageStatus: Yup.boolean().required("Select Voyage Status!"),
});
const VoyagesPage = (props) => {
  const onSubmitEditVoyage = (values) => {

     console.log('from edit voyage', values)
    // if (values === state.currentRow) return;
    let parameters = {
      voyageId: values.id,
      voyageNoIn: values.incomingVoyageNo,
      voyageNoOut: values.outgoingVoyageNo,
      voyageVessel: values.incomingVoyageNo + '/' + values.selectVessel.label,
      vesselId: values.selectVessel.value,
      ownerId: values.selectOwner.value,
      agentId: values.selectAgent.value,
      estimatedTimeArrival: values.eta,
      actualTimeArrival: values.ata,
      estimatedTimeDeparture: values.etd,
      actualTimeDeparture: values.atd,
      voyageStatus: values.voyageStatus ? 1 : 0,
      originPort: values.selectOriginPort.value,
      previousPort: values.selectPreviousPort.value,
      nextPort: values.selectNextPort.value
    };
    // console.log('from edit voyage after', parameters)
    editVoyageInfo(parameters)
      .then((response) => {
        // console.log('response',response)
        if (response.data.result) {
          toast.success(response.data.data[0]);
          const lstVoyages = [...state.ListOfVoyages];
          const index = _(lstVoyages).findIndex(
            (c) => c.voyageId === values.id
          );
          lstVoyages[index] = { ...lstVoyages[index] };
          lstVoyages[index].key = values.id;
          lstVoyages[index].voyageId = values.id;
          lstVoyages[index].actualTimeArrival = values.ata;
          lstVoyages[index].actualTimeDeparture = values.atd;
          lstVoyages[index].agentId = values.selectAgent.value;
          lstVoyages[index].agentName = values.selectAgent.label;
          lstVoyages[index].estimatedTimeArrival = values.eta;
          lstVoyages[index].estimatedTimeDeparture = values.etd;
          lstVoyages[index].incomingVoyageNo = values.incomingVoyageNo;
          lstVoyages[index].nextPortId = values.selectNextPort.value;
          lstVoyages[index].nextPortName = values.selectNextPort.label;
          lstVoyages[index].originPortId = values.selectOriginPort.value;
          lstVoyages[index].originPortName = values.selectOriginPort.label;
          lstVoyages[index].outgoingVoyageNo = values.outgoingVoyageNo;
          lstVoyages[index].ownerId = values.selectOwner.value;
          lstVoyages[index].ownerName = values.selectOwner.label;
          lstVoyages[index].previousPortId = values.selectPreviousPort.value;
          lstVoyages[index].previousPortName = values.selectPreviousPort.label;
          lstVoyages[index].vesselId = values.selectVessel.value;
          lstVoyages[index].vesselName = values.selectVessel.label;
          lstVoyages[index].voyageStatus = values.voyageStatus ? "open" : "close";
          lstVoyages[index].voyageStatusCode = values.voyageStatus ? 1 : 0;
          //   console.log("from submuit", lstVoyages[index]);

          setState((prevState) => ({
            ...prevState,
            ListOfVoyages: lstVoyages,
            currentRow: {},
          }));
          editToggle();
        } else {
          toast.error(response.data.data[0]);
        }
      })
  };

  const onSubmitCreateVoyage = (values) => {
    //console.log('from edit voyage', values)
    let parameters = {
      incomingVoyageNo: values.incomingVoyageNo,
      outgoingVoyageNo: values.outgoingVoyageNo,
      voyageVessel: values.incomingVoyageNo + '/' + values.selectVessel.label,
      vesselId: values.selectVessel.value,
      ownerId: values.selectOwner.value,
      agentId: values.selectAgent.value,
      estimatedTimeArrival: values.eta,
      actualTimeArrival: values.ata,
      estimatedTimeDeparture: values.etd,
      actualTimeDeparture: values.atd,
      voyageStatusCode: values.voyageStatus ? 1 : 0,
      originPortId: values.selectOriginPort.value,
      previousPortId: values.selectPreviousPort.value,
      nextPortId: values.selectNextPort.value
    };
    addNewVoyageInfo(parameters)
      .then((response) => {
        // console.log('response',response)
        if (response.data.result) {
          toast.success(response.data.data[0]['message']);

          const lstVoyages = [...state.ListOfVoyages];
          parameters.voyageId = response.data.data[0]['voyageId'];
          parameters.key = response.data.data[0]['voyageId'];
          parameters.agentName = values.selectAgent.label;
          parameters.incomingVoyageNo = values.incomingVoyageNo;
          parameters.nextPortName = values.selectNextPort.label;
          parameters.originPortName = values.selectOriginPort.label;
          parameters.ownerName = values.selectOwner.label;
          parameters.previousPortName = values.selectPreviousPort.label;
          parameters.vesselName = values.selectVessel.label;
          parameters.voyageStatus = values.voyageStatus ? "open" : "close";
          lstVoyages.push(parameters);

          setState((prevState) => ({ ...prevState, ListOfVoyages: lstVoyages, currentRow: {} }));
          createToggle();
        } else {
          toast.error(response.data.data[0]);
        }
      })
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle"> 
          <Button
            className="btn-warning mt-1"
            size="sm"
            onClick={() => handleEditVoyage(record)}
          >
            <Edit2 size={16} />
          </Button>
        </Space>
      ),
    },
    {
      title: "Incoming Voyage No",
      dataIndex: "incomingVoyageNo",
      key: "voyageNoIn",
      sorter: {
        compare: (a, b) => a.incomingVoyageNo.localeCompare(b.incomingVoyageNo),
        multiple: 3,
      },
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Outgoing Voyage No",
      dataIndex: "outgoingVoyageNo",
      key: "voyageNoOut",
      sorter: {
        compare: (a, b) => a.outgoingVoyageNo.localeCompare(b.outgoingVoyageNo),
        multiple: 4,
      },
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Vessel",
      dataIndex: "vesselName",
      key: "vesselName",
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "wner",
    },
    {
      title: "Agent",
      dataIndex: "agentName",
      key: "agent",
    },
    {
      title: "Status",
      dataIndex: "voyageStatus",
      key: "status",
    },
    {
      title: "ETA",
      dataIndex: "estimatedTimeArrival",
      key: "eta",
    },
    {
      title: "ATA",
      dataIndex: "actualTimeArrival",
      key: "ata",
    },
    {
      title: "ETD",
      dataIndex: "estimatedTimeDeparture",
      key: "etd",
    },
    {
      title: "ATD",
      dataIndex: "actualTimeDeparture",
      key: "atd",
    },
    {
      title: "Origin Port",
      dataIndex: "originPortName",
      key: "OriginPort",
    },
    {
      title: "Previous Port",
      dataIndex: "previousPortName",
      key: "previous",
    },
    {
      title: "Next Port",
      dataIndex: "nextPortName",
      key: "nextPort",
    },
  ];

  const [validVoyageStatus, setValidVoyageStatus] = useState({
    message: "",
    result: true,
  });

  const [state, setState] = useState({
    //ListOfUserTypes: [],

    ListOfOriginPorts: [],
    ListOfPreviousPorts: [],
    ListOfNextPorts: [],
    ListOfAgents: [],
    ListOfOwners: [],
    ListOfVessels: [],
    ListOfVoyages: [],
    voyageStatus: 1,
    eta: null,
    ata: null,
    etd: null,
    atd: null,
    editModal: false,
    createModal: false,
    currentRow: {},
  });

  useEffect(() => {
    getVoyage()
      .then((res) => {
         //console.log('response', res.data.data)
        if (res.data.result) {
          const tempList = res.data.data.map((item) => {
            return {
              key: item.voyageId,
              voyageId: item.voyageId,
              incomingVoyageNo: item.incomingVoyageNo,
              outgoingVoyageNo: item.outgoingVoyageNo,
              estimatedTimeArrival: ToPersianDate( item.estimatedTimeArrival),
              actualTimeArrival: ToPersianDate(item.actualTimeArrival),
              estimatedTimeDeparture: ToPersianDate(item.estimatedTimeDeparture),
              actualTimeDeparture: ToPersianDate(item.actualTimeDeparture),
              agentId: item.agentId,
              agentName: item.agentName,
              ownerId: item.ownerId,
              ownerName: item.ownerName,
              vesselId: item.vesselId,
              vesselName: item.vesselName,
              previousPortId: item.previousPortId,
              previousPortName: item.previousPortName,
              nextPortId: item.nextPortId,
              nextPortName: item.nextPortName,
              originPortId: item.originPortId,
              originPortName: item.originPortName,
              voyageStatusCode: item.voyageStatusCode,
              voyageStatus: item.voyageStatus,
            };
          });
          //console.log('templist', tempList)
          setState((prevState) => ({ ...prevState, ListOfVoyages: tempList }));
        }
      })
      .catch((err) => {
        // console.log('error',err)
      });
    getVessels()
      .then((res) => {
        if (res.data.result) {
          const tempList = res.data.data.map((item) => {
            return {
              value: item.VesselId,
              label: item.VesselName,
            };
          });
          setState((prevState) => ({ ...prevState, ListOfVessels: tempList }));
        }
      })
      .catch((err) => { });

    getPorts()
      .then((res) => {
        if (res.data.result) {
          const temp = res.data.data.map((item) => {
            return { label: item.PortName, value: item.PortId };
          });
          setState((prevState) => ({
            ...prevState,
            ListOfOriginPorts: temp,
            ListOfPreviousPorts: temp,
            ListOfNextPorts: temp,
          }));
        }
      })
      .catch((err) => { });

    getShippingLines()
      .then((res) => {
        if (res.data.result) {
          const temp = res.data.data.map((item) => {
            return { label: item.ShippingLineName, value: item.ShippingLineId };
          });
          setState((prevState) => ({
            ...prevState,
            ListOfAgents: temp,
            ListOfOwners: temp,
          }));
        }
      })
      .catch((err) => { });
  }, []);
  const handleEditVoyage = (voyageData) => {
    //console.log('from handel voyage edit', voyageData)
    const Voyage = {
      ..._(state.ListOfVoyages)
        .filter((c) => c.voyageId === voyageData.voyageId)
        .first(),
    };
    //console.log('from handel voyage List of voyage', Voyage)
    const temp = {
      selectVessel: {
        label: Voyage.vesselName,
        value: Voyage.vesselId,
      },
      selectAgent: {
        label: Voyage.agentName,
        value: Voyage.agentId,
      },
      selectOwner: {
        label: Voyage.ownerName,
        value: Voyage.ownerId,
      },
      selectOriginPort: {
        label: Voyage.originPortName,
        value: Voyage.originPortId,
      },
      selectNextPort: {
        label: Voyage.nextPortName,
        value: Voyage.nextPortId,
      },
      selectPreviousPort: {
        label: Voyage.previousPortName,
        value: Voyage.previousPortId,
      },
      eta: Voyage.estimatedTimeArrival,
      ata: Voyage.actualTimeArrival,
      etd: Voyage.estimatedTimeDeparture,
      atd: Voyage.actualTimeDeparture,
      voyageStatus: Voyage.voyageStatus,
      voyageStatusCode: Voyage.voyageStatusCode,
      outgoingVoyageNo: Voyage.outgoingVoyageNo,
      incomingVoyageNo: Voyage.incomingVoyageNo,
      id: Voyage.voyageId,
    };

    setState((prevState) => ({ ...prevState, currentRow: temp }));
    setTimeout(() => {
      //console.log('current row ', temp)
      
    }, 1000);
    editToggle();
  };

  const editToggle = () => {
    setState((prevState) => ({ ...prevState, editModal: !state.editModal }));
  };

  const handleCancelEditVoyage = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    editToggle();
  };

  const handleCreateVoyage = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };

  const createToggle = () => {
    setState((prevState) => ({ ...prevState, createModal: !state.createModal }));
  };

  const handleCancelCreateVoyage = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };
  const handleVesselSelectedChanged = (value) => {
    //console.log("from hande vessel ", value);
  };
  const handleOwnerSelectedChanged = () => { };
  const handleAgentSelectedChanged = () => { };
  const handlePreviousPortSelectedChanged = () => { };
  const handleOriginPortSelectedChanged = () => { };
  const handleNextPortSelectedChanged = () => { };
  const handleStatustSelectedChanged = (value, formik) => {
  // console.log('from handle status ', value)
    if (!value) {

      formik.setFieldTouched('atd',true);
    }
  };
  const dtChange1 = (value) => { };
  const dtChange2 = (value) => { };
  //console.log("from status change", state.currentRow);
  return (
    <React.Fragment>
      <Row className="row-eq-height">
        <Col sm="12" md="12">
          <Card>
            <CardBody>
              {/* <CardTitle>Users</CardTitle> */}
              {/* <CardText>With supporting text below as a natural lead-in to additional content.</CardText> */}
              {/* <Form> */}
              <div className="form-body">
                <Row>
                  <Col md="9">
                    <h4 className="form-section">
                      <ShoppingBag size={20} color="#212529" /> Voyages
                    </h4>
                  </Col>
                  <Col>
                    <Button
                      color="success"
                      type="button"
                      onClick={handleCreateVoyage}
                    >
                      Add New Voyage
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Table
                        className={antdClass + antdClass2}
                        columns={columns}
                        dataSource={state.ListOfVoyages}
                        pagination={{ position: ["bottomCenter"] }}
                        scroll={{ x: 2700, y: 200 }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              {/* </Form> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={state.editModal}
        toggle={editToggle}
        className={props.className}
        backdrop="static"
      >
        <ModalHeader toggle={editToggle}>
          Edit Voyage: {state.currentRow.incomingVoyageNo}
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={state.currentRow}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmitEditVoyage(values);
            }}
            // validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={true}
            enableReinitialize
          >
            {(formik) => {
              return (
                <React.Fragment>
                  <Form>
                    <div className="form-body">
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectVessel"
                            selectedValue={state.currentRow.selectVessel}
                            options={state.ListOfVessels}
                            label="Vessel Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectOriginPort"
                            selectedValue={state.currentRow.selectOriginPort}
                            options={state.ListOfOriginPorts}
                            label="Origin Port Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectNextPort"
                            selectedValue={state.currentRow.selectNextPort}
                            options={state.ListOfNextPorts}
                            label="Next Port Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectPreviousPort"
                            selectedValue={state.currentRow.selectPreviousPort}
                            options={state.ListOfPreviousPorts}
                            label="Previous Port Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectAgent"
                            selectedValue={state.currentRow.selectAgent}
                            options={state.ListOfAgents}
                            label="Agent Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectOwner"
                            selectedValue={state.currentRow.selectOwner}
                            options={state.ListOfOwners}
                            label="Owner Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="inputMaskDebounce"
                            name="incomingVoyageNo"
                            className="ltr"
                            type="text"
                            label="Incoming Voyage No"
                            defaultValue={state.currentRow.incomingVoyageNo}
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="inputMaskDebounce"
                            type="text"
                            name="outgoingVoyageNo"
                            className="ltr"
                            label="Outgoing Voyage No"
                            defaultValue={state.currentRow.outgoingVoyageNo}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="eta"
                            locale="en"
                            label="Estimated Time Arrival"
                            placeholder="Select Enter Date"
                            selectedValue={
                              state.currentRow && state.currentRow.eta
                                ? state.currentRow.eta
                                : null
                            }
                            //defaultValue={{ day: 14, month: 7, year: 1399 }}
                            onSelectedChanged={dtChange1}
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="ata"
                            label="Actual Time Arrival"
                            placeholder="Select Enter Date"
                            selectedValue={
                              state.currentRow && state.currentRow.ata
                                ? state.currentRow.ata
                                : null
                            }
                            //defaultValue={{ day: 10, month: 6, year: 1399 }}
                            onSelectedChanged={dtChange2}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="etd"
                            label="Estimated Time Departure"
                            placeholder="Select Enter Date"
                            selectedValue={
                              state.currentRow && state.currentRow.etd
                                ? state.currentRow.etd
                                : null
                            }
                            //defaultValue={{ day: 14, month: 7, year: 1399 }}
                            onSelectedChanged={dtChange1}
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="atd"
                            label="Actual Time Departure"
                            placeholder="Select Enter Date"
                            selectedValue={
                              state.currentRow && state.currentRow.atd
                                ? state.currentRow.atd
                                : null
                            }
                            onSelectedChanged={dtChange2}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          md="4"
                          style={{
                            justifyContent: "right",
                            direction: "rtl",
                            display: "flex",
                          }}
                        >
                          <FormikControl
                            control="customSwitch"
                            name="voyageStatus"
                            label="Voyage Status"
                            unCheckedChildren="Close"
                            checkedChildren="Open"
                            selectedValue={
                              state.currentRow && state.currentRow.voyageStatus === 'open'? true : false
                            }
                            onSelectedChanged={(value) =>
                              handleStatustSelectedChanged(value, formik)
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="form-actions center">
                      <Button
                        color="primary"
                        type="submit"
                        className="mr-1"
                        disabled={!formik.isValid}
                      >
                        <CheckSquare size={16} color="#FFF" /> Save
                      </Button>
                      <Button
                        color="warning"
                        type="button"
                        onClick={handleCancelEditVoyage}
                      >
                        <X size={16} color="#FFF" /> Cancel
                      </Button>
                    </div>
                  </Form>
                </React.Fragment>
              );
            }}
          </Formik>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={state.createModal}
        toggle={editToggle}
        className={props.className}
        backdrop="static"
      >
        <ModalHeader toggle={createToggle}>
          Add New Voyage
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              onSubmitCreateVoyage(values);
            }}
            // validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={true}
            enableReinitialize
          >
            {(formik) => {
              return (
                <React.Fragment>
                  <Form>
                    <div className="form-body">
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectVessel"
                            options={state.ListOfVessels}
                            label="Vessel Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectOriginPort"
                            options={state.ListOfOriginPorts}
                            label="Origin Port Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectNextPort"
                            options={state.ListOfNextPorts}
                            label="Next Port Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectPreviousPort"
                            options={state.ListOfPreviousPorts}
                            label="Previous Port Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectAgent"
                            options={state.ListOfAgents}
                            label="Agent Name"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customSelect"
                            name="selectOwner"
                            options={state.ListOfOwners}
                            label="Owner Name"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="inputMaskDebounce"
                            name="incomingVoyageNo"
                            className="ltr"
                            type="text"
                            label="Incoming Voyage No"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="inputMaskDebounce"
                            type="text"
                            name="outgoingVoyageNo"
                            className="ltr"
                            label="Outgoing Voyage No"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="eta"
                            locale="en"
                            label="Estimated Time Arrival"
                            placeholder="Select Enter Date"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="ata"
                            label="Actual Time Arrival"
                            placeholder="Select Enter Date"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="etd"
                            label="Estimated Time Departure"
                            placeholder="Select Enter Date"
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="atd"
                            label="Actual Time Departure"
                            placeholder="Select Enter Date"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          md="4"
                          style={{
                            justifyContent: "right",
                            direction: "rtl",
                            display: "flex",
                          }}
                        >
                          <FormikControl
                            control="customSwitch"
                            name="voyageStatus"
                            label="Voyage Status"
                            unCheckedChildren="close"
                            checkedChildren="open"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="form-actions center">
                      <Button
                        color="primary"
                        type="submit"
                        className="mr-1"
                        disabled={!formik.isValid}
                      >
                        <CheckSquare size={16} color="#FFF" /> Save
                      </Button>
                      <Button
                        color="warning"
                        type="button"
                        onClick={handleCancelCreateVoyage}
                      >
                        <X size={16} color="#FFF" /> Cancel
                      </Button>
                    </div>
                  </Form>
                </React.Fragment>
              );
            }}
          </Formik>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default VoyagesPage;
