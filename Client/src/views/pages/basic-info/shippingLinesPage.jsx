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
    getShippingLines,
    addNewshippingLineInfo,
    editShippingLineInfo
} from "../../../services/shippingLineService";

import { getCountries } from "../../../services/countryService"
toast.configure({ bodyClassName: "customFont" });
//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    shippingLineName: "",
    economicCode: "",
    tel: "",
    email: "",
    address: "",
    nationalCode: ""
};

const validationSchema = Yup.object({
    shippingLineName: Yup.string().required("Entet Shipping Line Name!"),
    economicCode: Yup.string().required("Enter Economic Code!"),

});
const ShippingLinesPage = (props) => {
    const onSubmitEditShippingLine = (values, props) => { 
        if (values === state.currentRow) return;
        let parameters = {
            shippingLineId: values.id,
            shippingLineName: values.shippingLineName,
            economicCode: values.economicCode,
            tel: values.tel,
            email: values.email,
            address: values.address,
            nationalCode: values.nationalCode
        };
        editShippingLineInfo(parameters).then(response => {
            console.log('response', response);
            if (response.data.result) {
                toast.success(response.data.data[0]);
                const lstShippingLines = [...state.ListOfShippingLines];
                const index = _(lstShippingLines).findIndex(c => c.shippingLineId === values.id)
                lstShippingLines[index] = { ...lstShippingLines[index] };
                lstShippingLines[index].key = values.id;
                lstShippingLines[index].shippingLineId = values.id;
                lstShippingLines[index].shippingLineName = values.shippingLineName;
                lstShippingLines[index].economicCode = values.economicCode;
                lstShippingLines[index].tel = values.tel;
                lstShippingLines[index].email = values.email;
                lstShippingLines[index].address = values.address;
                lstShippingLines[index].nationalCode = values.nationalCode;
                console.log('from submuit', lstShippingLines[index])

                setState(prevState => ({ ...prevState, ListOfShippingLines: lstShippingLines, currentRow: {} }));
                editToggle();
            }
            else {
                toast.error(response.data.data[0])
            }
        }).catch(error => { })
    }
    const onSubmitCreateShippingLine = (values, props) => {
        console.log('values', values);
        let parameters = {
            shippingLineName: values.shippingLineName,
            economicCode: values.economicCode,
            tel: values.tel,
            email: values.email,
            address: values.address,
            nationalCode: values.nationalCode
        }
        addNewshippingLineInfo(parameters).then(response => {
            console.log('response', response);
            if (response.data.result) {
                toast.success(response.data.data[0]);
                const lstShippingLines = [...state.ListOfShippingLines];
                getShippingLines().then(res => {
                    if (res.data.result) {
                        console.log('shippingLines', res);
                        const tempList = res.data.data.map(item => {
                            return {
                                key: item.ShippingLineId,
                                shippingLineId: item.ShippingLineId,
                                shippingLineName: item.ShippingLineName,
                                economicCode: item.EconomicCode,
                                tel: item.Tel,
                                address: item.Address,
                                email: item.Email,
                                nationalCode: item.NationalCode
                            }
                        })
                        setState(prevState => ({ ...prevState, ListOfShippingLines: tempList }))
                    }
                }).catch(err => { });

                createToggle();
            }
            else {
                toast.error(response.data.data[0])
            }
        }).catch(error => { })
     }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'shippingLineName',
            key: 'shippingLineName',
            sorter: {
                compare: (a, b) => a.shippingLineName.localeCompare(b.shippingLineName),
                multiple: 4
            },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Economic Code',
            dataIndex: 'economicCode',
            key: 'economicCode'
        },
        {
            title: 'Tel',
            dataIndex: 'tel',
            key: 'tel'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'NationalCode',
            dataIndex: 'nationalCode',
            key: 'nationalCode'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button className="btn-warning mt-1" size="sm" onClick={() => handleEditShippingLine(record)}>
                        <Edit2 size={16} />
                    </Button>
                </Space>
            ),
        }
        
    ];

    const [state, setState] = useState({

        ListOfShippingLines: [],
        editModal: false,
        createModal: false,
        currentRow: {}
    });

    useEffect(() => {
        getShippingLines().then(res => {
            if (res.data.result) {
                console.log('shippingLines', res);
                const tempList = res.data.data.map(item => {
                    return {
                        key: item.ShippingLineId,
                        shippingLineId: item.ShippingLineId,
                        shippingLineName: item.ShippingLineName,
                        economicCode: item.EconomicCode,
                        tel: item.Tel,
                        address: item.Address,
                        email: item.Email,
                        nationalCode: item.NationalCode
                    }
                })
                setState(prevState => ({ ...prevState, ListOfShippingLines: tempList }))
            }
        }).catch(err => { });
    }, []);

    const handleEditShippingLine = (shippingLineData) => {
        const ShippingLine = { ..._(state.ListOfShippingLines).filter(c => c.shippingLineId === shippingLineData.shippingLineId).first() };
        const temp = {
            shippingLineName: ShippingLine.shippingLineName,
            tel: ShippingLine.tel,
            email: ShippingLine.email,
            address: ShippingLine.address,
            nationalCode: ShippingLine.nationalCode,
            economicCode: ShippingLine.economicCode,
            id: ShippingLine.shippingLineId
        }
        setState(prevState => ({ ...prevState, currentRow: temp }));
        editToggle();
    }
    const editToggle = () => {
        setState(prevState => ({ ...prevState, editModal: !state.editModal }))
    }
    const handleCancelEditShippingLine = () => {
        setState(prevState => ({ ...prevState, currentRow: {} }));
        editToggle();
    }
    const handleCreateShippingLine = () => {
        setState(prevState => ({ ...prevState, currentRow: {} }))
        createToggle();
    }
    const createToggle = () => {
        setState(prevState => ({ ...prevState, createModal: !state.createModal }))
    }
    const handleCancelCreateShippingLine = () => {
        setState(prevState => ({ ...prevState, currentRow: {} }))
        createToggle();
    }
    return (<React.Fragment>
        <Row className="row-eq-height">
            <Col sm="12" md="12">
                <Card>
                    <CardBody>
                        <div className="form-body">
                            <Row>
                                <Col md='9'>
                                    <h4 className="form-section">
                                        <ShoppingBag size={20} color="#212529" /> Shipping Lines
                                    </h4>
                                </Col>
                                <Col>
                                    <Button color="success" type="button" onClick={handleCreateShippingLine}>
                                        Add New Shipping Line
                                </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Table
                                         className={antdClass + antdClass2}
                                         columns={columns}
                                         dataSource={state.ListOfShippingLines}
                                         pagination={{ position: ["bottomCenter"] }}
                                         scroll={{ x: 'max-content', y: 200 }}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
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
            <ModalHeader toggle={editToggle} >Edit Shipping Line
                <ModalBody>
                    <Formik initialValues={state.currentRow || initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSubmitEditShippingLine(values, props);
                        }}
                        validateOnBlur={true}
                        enableReinitialize>
                        {(formik) => {
                            console.log("Formik props values", formik.values);
                            return (
                                <React.Fragment>
                                    <Form>
                                        <div className="form-body">

                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        name="shippingLineName"
                                                        className="ltr"
                                                        type='text'
                                                        label="shipping Line name"
                                                        defaultValue={
                                                            state.currentRow.shippingLineName
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="economicCode"
                                                        className="ltr"
                                                        label='economic code'
                                                        defaultValue={
                                                            state.currentRow.economicCode
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="number"
                                                        name="tel"
                                                        className="ltr"
                                                        label="tel"
                                                        defaultValue={
                                                            state.currentRow.tel
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="text"
                                                        name="email"
                                                        className="ltr"
                                                        label="email"
                                                        defaultValue={
                                                            state.currentRow.email
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        type="text"
                                                        name="address"
                                                        className="ltr"
                                                        label="address"
                                                        defaultValue={
                                                            state.currentRow.address
                                                        }
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <FormikControl
                                                        control="inputMaskDebounce"
                                                        name="nationalCode"
                                                        type="number"
                                                        label="national code"
                                                        className="ltr"
                                                        defaultValue={
                                                            state.currentRow.nationalCode
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="form-actions center">
                                            <Button color="primary" type="submit" className="mr-1" >
                                                <CheckSquare size={16} color="#FFF" /> Save
                                             </Button>
                                            <Button color="warning" type="button" onClick={handleCancelEditShippingLine} >
                                                <X size={16} color="#FFF" /> Cancel
                                                </Button>

                                        </div>
                                    </Form>
                                </React.Fragment>
                            );
                        }}

                    </Formik>
                </ModalBody>
            </ModalHeader>
        </Modal>

        <Modal
            isOpen={state.createModal}
            toggle={createToggle}
            className={props.className}
            backdrop="static"
        >
            <ModalHeader toggle={createToggle}>Create New Shipping Line</ModalHeader>
            <ModalBody>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        onSubmitCreateShippingLine(values, props);
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
                                                    control="inputMaskDebounce"
                                                    name="shippingLineName"
                                                    className="ltr"
                                                    type='text'
                                                    label="shipping Line name"
                                                    defaultValue={
                                                        state.currentRow.shippingLineName
                                                    }
                                                />
                                            </Col>
                                            <Col md="6">
                                                <FormikControl
                                                    control="inputMaskDebounce"
                                                    type="number"
                                                    name="economicCode"
                                                    className="ltr"
                                                    label='economic code'
                                                    defaultValue={
                                                        state.currentRow.economicCode
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <FormikControl
                                                    control="inputMaskDebounce"
                                                    type="number"
                                                    name="tel"
                                                    className="ltr"
                                                    label="tel"
                                                    defaultValue={
                                                        state.currentRow.tel
                                                    }
                                                />
                                            </Col>
                                            <Col md="6">
                                                <FormikControl
                                                    control="inputMaskDebounce"
                                                    type="text"
                                                    name="email"
                                                    className="ltr"
                                                    label="email"
                                                    defaultValue={
                                                        state.currentRow.email
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <FormikControl
                                                    control="inputMaskDebounce"
                                                    type="text"
                                                    name="address"
                                                    className="ltr"
                                                    label="address"
                                                    defaultValue={
                                                        state.currentRow.address
                                                    }
                                                />
                                            </Col>
                                            <Col md="6">
                                                <FormikControl
                                                    control="inputMaskDebounce"
                                                    name="nationalCode"
                                                    type="number"
                                                    label="national code"
                                                    className="ltr"
                                                    defaultValue={
                                                        state.currentRow.nationalCode
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="form-actions center">
                                        <Button color="primary" type="submit" className="mr-1" >
                                            <CheckSquare size={16} color="#FFF" /> Save
                         </Button>
                                        <Button color="warning" type="button" onClick={handleCancelCreateShippingLine} >
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


    </React.Fragment>);
}

export default ShippingLinesPage;