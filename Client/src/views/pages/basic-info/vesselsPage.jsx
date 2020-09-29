import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, FormGroup, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Table, Tag, Space } from 'antd';
import { Formik, Form } from "formik";
import { ShoppingBag, Edit2, CheckSquare, X } from "react-feather";
import * as Yup from "yup";
import { toast } from "react-toastify";
import _ from "lodash";
import FormikControl from "../../../components/common/formik/FormikControl";
import antdClass from 'antd/dist/antd.css';
import antdClass2 from "../../../assets/css/vendors/customAntdTable.css"

import {
    getVessels,
    addNewVesselInfo,
    getVesselTypes, editVesselInfo
} from "../../../services/vesselService";

import { getCountries } from "../../../services/countryService"

toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectVesselType: "",
    callSign: "",
    selectNationality: "",
    vesselName: "",
    vesselLength: "",
    numOfBays: "",
    activeCraneQty: "",
    grossTonage: "",
    selectFlag: ""
};

const validationSchema = Yup.object({
    selectVesselType: Yup.string().required("Entet Vessel Type!"),
    callSign: Yup.string().required("Enter Call Sign!"),
    selectNationality: Yup.string().required("Enter Nationality!"),
    vesselName: Yup.string().required("Enter Vessel Name!"),
    vesselLength: Yup.string().required("Enter Vessel Length!"),
    numOfBays: Yup.string().required("Enter Number Of Bay!"),
    activeCraneQty: Yup.string().required("Enter Active Crane Qty!"),
    grossTonage: Yup.string().required("Enter Vessel Gross Tonage!"),
    selectFlag: Yup.string().required("Enter Flag Of Vessel!"),
});




//#endregion ---------------------------------------------------------------

const VesselsPage = (props) => {

    //#region SUBMIT FORMIK ----------------------------------------------------


    const onSubmitEditVessel = (values, props) => {

        if (values === state.currentRow) return;
        let parameters = {
            vesselId: values.id,
            vesselType: values.selectVesselType.value,
            grossTonage: values.grossTonage,
            flag: values.selectFlag.value,
            nationality: values.selectNationality.value,
            vesselLength: values.vesselLength,
            numOfBays: values.numOfBays,
            activeCraneQty: values.activeCraneQty,
            callSign: values.callSign
        };
        editVesselInfo(parameters).then(response => {
            console.log('response', response);
            if (response.data.result) {
                toast.success(response.data.data[0]);
                const lstVessels = [...state.ListOfVessels];
                const index = _(lstVessels).findIndex(c => c.vesselId === values.id)
                lstVessels[index] = { ...lstVessels[index] };
                lstVessels[index].key = values.id;
                lstVessels[index].vesselId = values.id;
                lstVessels[index].vesselName = values.vesselName;
                lstVessels[index].vesselType = values.selectVesselType.value;
                lstVessels[index].vesselTypeName = values.selectVesselType.label;
                lstVessels[index].grossTonage = values.grossTonage;
                lstVessels[index].flag = values.selectFlag.value;
                lstVessels[index].flagName = values.selectFlag.label;
                lstVessels[index].nationality = values.selectNationality.value;
                lstVessels[index].nationalityName = values.selectNationality.label;
                lstVessels[index].vesselLength = values.vesselLength;
                lstVessels[index].numberOfBays = values.numOfBays;
                lstVessels[index].activeCraneQty = values.activeCraneQty;
                lstVessels[index].callSign = values.callSign;
                console.log('from submuit', lstVessels[index])

                setState(prevState => ({ ...prevState, ListOfVessels: lstVessels, currentRow: {} }));
                editToggle();
            }
            else {
                toast.error(response.data.data[0])
            }
        }).catch(error => { })
    };
    const onSubmitCreateVessel = (values, props) => {
        console.log('values', values);
        let parameters = {
            vesselType: values.selectVesselType.value,
            grossTonage: values.grossTonage,
            flag: values.selectFlag.value,
            nationality: values.selectNationality.value,
            vesselLength: values.vesselLength,
            numOfBays: values.numOfBays,
            activeCraneQty: values.activeCraneQty,
            callSign: values.callSign,
            vesselName: values.vesselName
        };
        addNewVesselInfo(parameters).then(response => {
            console.log('response', response);
            if (response.data.result) {
                toast.success(response.data.data[0]);
                const lstVessels = [...state.ListOfVessels];
                getVessels().then(res => {
                    if (res.data.result) {
                        console.log('vessels', res);
                        const tempList = res.data.data.map(item => {
                            return {
                                key: item.VesselId,
                                vesselId: item.VesselId,
                                vesselName: item.VesselName,
                                vesselType: item.VesselType,
                                vesselTypeName: item.VesselTypeName,
                                grossTonage: item.GrossTonage,
                                flag: item.Flag,
                                flagName: item.FlagName,
                                nationality: item.Nationality,
                                nationalityName: item.NationalityName,
                                vesselLength: item.VesselLength,
                                numberOfBays: item.NumOfBays,
                                activeCraneQty: item.ActiveCraneQty,
                                callSign: item.CallSign
                            }
                        })
                        setState(prevState => ({ ...prevState, ListOfVessels: tempList }))
                    }
                }).catch(err => { });

                createToggle();
            }
            else {
                toast.error(response.data.data[0])
            }
        }).catch(error => { })
    };
    //#endregion ---------------------------------------------------------------


    const columns = [
        {
            title: 'Name',
            dataIndex: 'vesselName',
            key: 'vesselName',
            sorter: {
                compare: (a, b) => a.vesselName.localeCompare(b.vesselName),
                multiple: 4
            },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Type',
            dataIndex: 'vesselTypeName',
            key: 'vesselTypeName'
        },
        {
            title: 'Gross Tonage',
            dataIndex: 'grossTonage',
            key: 'grossTonage'
        },
        {
            title: 'Flag',
            dataIndex: 'flagName',
            key: 'flagName',
            render: flag => (
                <Tag color={flag === "Iran" ? "blue" : "volcano"}>{
                    flag
                }</Tag>
            )
        },
        {
            title: 'Nationality',
            dataIndex: 'nationalityName',
            key: 'nationalityName'
        },
        {
            title: 'Length',
            dataIndex: 'vesselLength',
            key: 'vesselLength'
        },
        {
            title: 'Number Of Bays',
            dataIndex: 'numberOfBays',
            key: 'numberOfBays'
        },
        {
            title: 'Active Crane Qty',
            dataIndex: 'activeCraneQty',
            key: 'activeCraneQty'
        },
        {
            title: 'Call Sign',
            dataIndex: 'callSign',
            key: 'callSign'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button className="btn-warning mt-1" size="sm" onClick={() => handleEditVessel(record)}>
                        <Edit2 size={16} />
                    </Button>
                </Space>
            ),
        }
    ];

    //#region SELECTORS AND STATE --------------------------------------------

    const [state, setState] = useState({
        //ListOfUserTypes: [],

        ListOfFlags: [],
        ListOfNationalities: [],
        ListOfVesselTypes: [],
        ListOfVessels: [],
        editModal: false,
        createModal: false,
        currentRow: {}
    });
    // const [editState, setEditState] = useState({});

    //#endregion -------------------------------------------------------------

    //#region INITIAL FUNCTIONS ----------------------------------------------

    useEffect(() => {
        getVessels().then(res => {
            if (res.data.result) {
                console.log('vessels', res);
                const tempList = res.data.data.map(item => {
                    return {
                        key: item.VesselId,
                        vesselId: item.VesselId,
                        vesselName: item.VesselName,
                        vesselType: item.VesselType,
                        vesselTypeName: item.VesselTypeName,
                        grossTonage: item.GrossTonage,
                        flag: item.Flag,
                        flagName: item.FlagName,
                        nationality: item.Nationality,
                        nationalityName: item.NationalityName,
                        vesselLength: item.VesselLength,
                        numberOfBays: item.NumOfBays,
                        activeCraneQty: item.ActiveCraneQty,
                        callSign: item.CallSign
                    }
                })
                setState(prevState => ({ ...prevState, ListOfVessels: tempList }))
            }
        }).catch(err => { });
        // getVesselTypes().then(res => {
        //     if (res.data.result) {
        //         setState({ ListOfVesselTypes: res.data.data });
        //     }
        // }).catch(err=>{});
        getCountries().then(res => {
            if (res.data.result) {
                console.log('country', res)
                const temp = res.data.data.map(item => { return { label: item.CountryName + '-' + item.Symbol, value: item.CountryId } })
                setState(prevState => ({ ...prevState, ListOfNationalities: temp, ListOfFlags: temp }))
            }
        }).catch(err => { });
        getVesselTypes().then(res => {
            if (res.data.result) {
                console.log('vesselTypes', res)
                //setState({ ...state,ListOfNationalities: res.data.data, ListOfFlags: res.data.data });
                setState(prevState => ({ ...prevState, ListOfVesselTypes: res.data.data.map(item => { return { label: item.VesselTypeName, value: item.VesselType } }) }))
            }
        }).catch(err => { });
    }, []);

    //#endregion -------------------------------------------------------------

    //#region EVENT HANDLRES -------------------------------------------------

    const handleEditVessel = (vesselData) => {
        const Vessel = { ..._(state.ListOfVessels).filter(c => c.vesselId === vesselData.vesselId).first() };
        const temp = {
            selectVesselType: {
                label: Vessel.vesselTypeName,
                value: Vessel.vesselType
            },
            selectNationality: {
                label: Vessel.nationalityName,
                value: Vessel.nationality
            },
            selectFlag: {
                label: Vessel.flagName,
                value: Vessel.flag
            },
            callSign: Vessel.callSign,
            vesselName: Vessel.vesselName,
            vesselLength: Vessel.vesselLength,
            numOfBays: Vessel.numberOfBays,
            activeCraneQty: Vessel.activeCraneQty,
            grossTonage: Vessel.grossTonage,
            id: Vessel.vesselId
        }
        setState(prevState => ({ ...prevState, currentRow: temp }));
        editToggle();
    }

    const editToggle = () => {
        setState(prevState => ({ ...prevState, editModal: !state.editModal }))
    }

    const handleCancelEditVessel = () => {
        console.log('handleCancelEditVessel')
        setState(prevState => ({ ...prevState, currentRow: {} }));
        editToggle();
        //setEditState({});
    }

    const handleCreateVessel = () => {
        setState(prevState => ({ ...prevState, currentRow: {} }))
        createToggle();
    }

    const createToggle = () => {
        setState(prevState => ({ ...prevState, createModal: !state.createModal }))
    }

    const handleCancelCreateVessel = () => {
        setState(prevState => ({ ...prevState, currentRow: {} }))
        createToggle();
    }
    const handleVesselTypeSelectedChanged = (value) => {
        //console.log('asdfasdfa', value)
    }
    const handleNationalitySelectedChanged = (value) => {
        //console.log('asdfasdfa', value)
    }
    const handleFlagSelectedChanged = (value) => {

    }

    //#endregion -------------------------------------------------------------

    //console.log('state.currentRow', state.currentRow)
    return (
        <React.Fragment>
            {/* <h4 className="mt-4 mb-0 text-bold-400">Users</h4>
            <p>
                Constrain the width of cards via custom CSS, our predefined grid classes, or with custom styles using our grid
                mixins.
        </p> */}

            <Row className="row-eq-height">
                <Col sm="12" md="12">
                    <Card>
                        <CardBody>
                            {/* <CardTitle>Users</CardTitle> */}
                            {/* <CardText>With supporting text below as a natural lead-in to additional content.</CardText> */}
                            {/* <Form> */}
                            <div className="form-body">
                                <Row>
                                    <Col md='9'>

                                        <h4 className="form-section">
                                            <ShoppingBag size={20} color="#212529" /> Vessels
                                    </h4>
                                    </Col>
                                    <Col>
                                        <Button color="success" type="button" onClick={handleCreateVessel}>Add New Vessel</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <Table
                                                className={antdClass + antdClass2}
                                                columns={columns}
                                                dataSource={state.ListOfVessels}
                                                pagination={{ position: ["bottomCenter"] }}
                                                scroll={{ x: 'max-content', y: 200 }}
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
                <ModalHeader toggle={editToggle} >Edit Vessel:  {state.currentRow.vesselName}</ModalHeader>
                <ModalBody>

                    <Formik
                        initialValues={state.currentRow || initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSubmitEditVessel(values, props);
                        }}
                        validateOnBlur={true}
                        enableReinitialize
                    >
                        {(formik) => {
                            console.log("Formik props values", formik.values);
                            return (
                                <React.Fragment>
                                    <Form>
                                        <div className="form-body">
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectVesselType"
                                                        selectedValue={
                                                            state.currentRow.selectVesselType
                                                        }
                                                        options={state.ListOfVesselTypes}
                                                        label="Vessel Type"
                                                        onSelectedChanged={
                                                            handleVesselTypeSelectedChanged
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectNationality"
                                                        selectedValue={
                                                            state.currentRow.selectNationality
                                                        }
                                                        options={state.ListOfNationalities}
                                                        label="Nationality"
                                                        onSelectedChanged={
                                                            handleNationalitySelectedChanged
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        name="vesselLength"
                                                        className="ltr"
                                                        type='number'
                                                        label="vessel Length"
                                                        defaultValue={
                                                            state.currentRow.vesselLength
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="numOfBays"
                                                        className="ltr"
                                                        label='Num Of Bays'
                                                        defaultValue={
                                                            state.currentRow.numOfBays
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="activeCraneQty"
                                                        className="ltr"
                                                        label="Active Crane Qty"
                                                        defaultValue={
                                                            state.currentRow.activeCraneQty
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="grossTonage"
                                                        className="ltr"
                                                        label="Gross Tonage"
                                                        defaultValue={
                                                            state.currentRow.grossTonage
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="text"
                                                        name="callSign"
                                                        className="ltr"
                                                        label="Call Sign"
                                                        defaultValue={
                                                            state.currentRow.callSign
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectFlag"
                                                        selectedValue={
                                                            state.currentRow.selectFlag
                                                        }
                                                        options={state.ListOfFlags}
                                                        label="Flag"
                                                        onSelectedChanged={
                                                            handleFlagSelectedChanged
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="form-actions center">
                                            <Button color="primary" type="submit" className="mr-1" >
                                                <CheckSquare size={16} color="#FFF" /> Save
                                             </Button>
                                            <Button color="warning" type="button" onClick={handleCancelEditVessel} >
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
                toggle={createToggle}
                className={props.className}
                backdrop="static"
            >
                <ModalHeader toggle={createToggle}>Create New Vessel</ModalHeader>
                <ModalBody>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSubmitCreateVessel(values, props);
                        }}
                        validateOnBlur={true}
                        enableReinitialize
                    >
                        {(formik) => {
                            console.log("Formik props values", formik.values);
                            return (
                                <React.Fragment>
                                    <Form>
                                        <div className="form-body">
                                            <Row>
                                                <Col md="12">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        name="vesselName"
                                                        className="ltr"
                                                        type='text'
                                                        label="vessel Name"
                                                        defaultValue={
                                                            state.currentRow.vesselLength
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectVesselType"
                                                        selectedValue={
                                                            state.currentRow.selectVesselType
                                                        }
                                                        options={state.ListOfVesselTypes}
                                                        label="Vessel Type"
                                                        onSelectedChanged={
                                                            handleVesselTypeSelectedChanged
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectNationality"
                                                        selectedValue={
                                                            state.currentRow.selectNationality
                                                        }
                                                        options={state.ListOfNationalities}
                                                        label="Nationality"
                                                        onSelectedChanged={
                                                            handleNationalitySelectedChanged
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        name="vesselLength"
                                                        className="ltr"
                                                        type='number'
                                                        label="vessel Length"
                                                        defaultValue={
                                                            state.currentRow.vesselLength
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="numOfBays"
                                                        className="ltr"
                                                        label='Num Of Bays'
                                                        defaultValue={
                                                            state.currentRow.numOfBays
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="activeCraneQty"
                                                        className="ltr"
                                                        label="Active Crane Qty"
                                                        defaultValue={
                                                            state.currentRow.activeCraneQty
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="grossTonage"
                                                        className="ltr"
                                                        label="Gross Tonage"
                                                        defaultValue={
                                                            state.currentRow.grossTonage
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="text"
                                                        name="callSign"
                                                        className="ltr"
                                                        label="Call Sign"
                                                        defaultValue={
                                                            state.currentRow.callSign
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="customSelect"
                                                        name="selectFlag"
                                                        selectedValue={
                                                            state.currentRow.selectFlag
                                                        }
                                                        options={state.ListOfFlags}
                                                        label="Flag"
                                                        onSelectedChanged={
                                                            handleFlagSelectedChanged
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="form-actions center">
                                            <Button color="primary" type="submit" className="mr-1" >
                                                <CheckSquare size={16} color="#FFF" /> Save
                         </Button>
                                            <Button color="warning" type="button" onClick={handleCancelCreateVessel} >
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

export default VesselsPage;
