import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { ShoppingBag } from "react-feather";
import { Table, Tag } from 'antd';
import { Formik, Form } from "formik";
import { toast } from "react-toastify";


import FormikControl from "../../../../components/common/formik/FormikControl";

import * as  gcs from '../../../../services/garbageCollectionService';

toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectTariff: {}
}

const GarbageCollectionTariffPage = () => {

    const [state, setState] = useState({
        ListOfTariffs: [],
        ListOfTariffDetails: []
    });

    useEffect(() => {
        (async function fetchAllTariffs() {
            const response = await gcs.GetAllTariffs();
            if (response.data.result) {
                let temp = response.data.data.map(m => {
                    return {
                        label: m.Description,
                        value: m.GarbageCollectionTariffId,
                    }
                })
                setState((prevState) => ({ ...prevState, ListOfTariffs: temp }));
            }
            else {
                toast.error(response.data.data[0]);
            }
        })();
    }, [])

    const handleSelectedTariffChanged = async () => {
        let tariff = await gcs.GetTariffDetails(1);
        tariff = tariff.data.data.map(item => {
            return {
                ...item,
                key: item.GarbageCollectionTariffDetailId
            }
        })
        console.log('tariff', tariff)
        setState((prevState) => ({ ...prevState, ListOfTariffDetails: tariff }));

    }

    const RenderColor = (value) => {
        switch (value) {
            case 1: return 'green';
            case 2: return 'green';
            case 4: return 'orange';
            case 10: return 'orange';
            case 40: return 'red';
            case 100: return "red";
        }
    }

    const columns = [
        {
            title: 'Weight',
            dataIndex: 'GrossWeight',
            key: 'GrossWeight'
        },
        {
            title: 'Price',
            dataIndex: 'Price',
            key: 'Price',
            render: p => (
                <Tag color={RenderColor(p)}>{
                    p
                }</Tag>
            )
        }]
    return (
        <React.Fragment>
            <Formik
                initialValues={initialValues}
            >
                {
                    () => {
                        return (
                            <React.Fragment>
                                <Form>
                                    <div className="form-body">
                                        <Row>
                                            <Col md="6">
                                                <FormikControl
                                                    control="customSelect"
                                                    name="selectTariff"
                                                    options={state.ListOfTariffs ?? []}
                                                    label="Garbage collections tariffs"
                                                    onSelectedChanged={
                                                        handleSelectedTariffChanged
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                                {state.ListOfTariffDetails.length == 0
                                    ? <label>Select a tariff from list above</label>
                                    : <Row className="row-eq-height">
                                        <Col sm="12" md="6">
                                            <Card>
                                                <CardBody>
                                                    <div className="form-body">
                                                        <Row>
                                                            <Col md='9'>

                                                                <h4 className="form-section">
                                                                    <ShoppingBag size={20} color="#212529" /> Tariff details
                                    </h4>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup>
                                                                    <Table
                                                                        columns={columns}
                                                                        dataSource={state.ListOfTariffDetails}
                                                                        pagination={{ position: ["bottomCenter"] }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                }
                            </React.Fragment>
                        )
                    }
                }
            </Formik>
        </React.Fragment>
    );
}

export default GarbageCollectionTariffPage;