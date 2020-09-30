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
import { Table, Tag, Space, DatePicker } from "antd";
import { Formik, Form } from "formik";
import { ShoppingBag, Edit2, CheckSquare, X } from "react-feather";
import * as Yup from "yup";
import { toast } from "react-toastify";
import _ from "lodash";
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
toast.configure({ bodyClassName: "customFont" });

const initialValues = {
  selectVessel: "",
  voyageNoIn: "",
  voyageNoOut: "",
  selectOwner: "",
  selectAgent: "",
  eta: null,
  ata: null,
  etd: null,
  atd: null,
  status: "",
  selectOriginPort: "",
  selectPreviousPort: "",
  selectNextPort: "",
};
const validationSchema = Yup.object({
  selectVessel: Yup.string().required("Entet Vessel Name!"),
  voyageNoIn: Yup.string().required("Enter Incoming Voyage Number!"),
  selectOwner: Yup.string().required("Enter Owner Of Voyage"),
  selectAgent: Yup.string().required("Enter Agent Of Voyage!"),
  eta: Yup.string().required("Enter ETA Date!"),
  status: Yup.string().required("Enter Voyage Status!"),
});
const VoyagesPage = (props) => {
  const onSubmitEditVoyage = (values, props) => {};
  const onSubmitCreateVoyage = (values, props) => {};

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
        compare: (a, b) => a.voyageNoIn.localeCompare(b.voyageNoIn),
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
        compare: (a, b) => a.voyageNoOut.localeCompare(b.voyageNoOut),
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
      dataIndex: "ActualTimeArrival",
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

  const [state, setState] = useState({
    //ListOfUserTypes: [],

    ListOfOriginPorts: [],
    ListOfPreviousPorts: [],
    ListOfNextPorts: [],
    ListOfAgents: [],
    ListOfOwners: [],
    ListOfVessels: [],
    ListOfVoyages: [],
    status: 1,
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
        if (res.data.result) {
          const tempList = res.data.data.map((item) => {
            return {
              key: item.voyageId,
              voyageId: item.voyageId,
              incomingVoyageNo: item.incomingVoyageNo,
              outgoingVoyageNo: item.outgoingVoyageNo,
              estimatedTimeArrival: item.estimatedTimeArrival,
              actualTimeArrival: item.actualTimeArrival,
              estimatedTimeDeparture: item.estimatedTimeDeparture,
              actualTimeDeparture: item.actualTimeDeparture,
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
          setState((prevState) => ({ ...prevState, ListOfVoyages: tempList }));
        }
      })
      .catch((err) => {});
    getVessels()
      .then((res) => {
        if (res.data.result) {
          console.log("vessels", res);
          const tempList = res.data.data.map((item) => {
            return {
              value: item.VesselId,
              label: item.VesselName,
            };
          });
          setState((prevState) => ({ ...prevState, ListOfVessels: tempList }));
        }
      })
      .catch((err) => {});

    getPorts()
      .then((res) => {
        if (res.data.result) {
          console.log("ports", res);
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
      .catch((err) => {});

    getShippingLines()
      .then((res) => {
        if (res.data.result) {
          console.log("shippingLines", res);
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
      .catch((err) => {});
  }, []);
  const handleEditVoyage = (voyageData) => {
    const Voyage = {
      ..._(state.ListOfVoyages)
        .filter((c) => c.voyageId === voyageData.voyageId)
        .first(),
    };
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
      outgoingVoyageNo: Voyage.outgoingVoyageNo,
      incomingVoyageNo: Voyage.incomingVoyageNo,
      id: Voyage.voyageId,
    };

    console.log("form edit voyage ", temp);
    setState((prevState) => ({ ...prevState, currentRow: temp }));
    editToggle();
  };

  const editToggle = () => {
    setState((prevState) => ({ ...prevState, editModal: !state.editModal }));
  };

  const handleCancelEditVoyage = () => {
    console.log("handleCancelEditVessel");
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    editToggle();
    //setEditState({});
  };

  const handleCreateVoyage = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };

  const createToggle = () => {
    setState((prevState) => ({
      ...prevState,
      createModal: !state.createModal,
    }));
  };

  const handleCancelCreateVoyage = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };
  const handleVesselSelectedChanged = (value) => {
    console.log("from hande vessel ", value);
  };
  const handleOwnerSelectedChanged = () => {};
  const handleAgentSelectedChanged = () => {};
  const handlePreviousPortSelectedChanged = () => {};
  const handleOriginPortSelectedChanged = () => {};
  const handleNextPortSelectedChanged = () => {};
  const dtChange1 = (value) => {
    console.log(
      "dtChange1",
      moment(
        `${value.year}/${value.month}/${value.day}`,
        "jYYYY/jM/jD HH:mm"
      ).format("YYYY-M-D HH:mm:ss")
    );
  };
  const dtChange2 = (value) => {
    console.log("dtChange2", value);
  };

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
              onSubmitEditVoyage(values, props);
            }}
            validateOnBlur={true}
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
                            selectedValue={()=>{
                              setTimeout(() => {
                                return state.currentRow.selectVessel
                              }, 3000);
                            }}
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
                            name="ate"
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
                    </div>
                    <div className="form-actions center">
                      <Button color="primary" type="submit" className="mr-1">
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
    </React.Fragment>
  );
};
export default VoyagesPage;
