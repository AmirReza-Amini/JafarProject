import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { ShoppingBag } from "react-feather";
import { Table, Tag } from 'antd';
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { SetValueLabel } from '../../../../utility/tools'


import FormikControl from "../../../../components/common/formik/FormikControl";

import * as  vss from '../../../../services/vesselStoppageService';

toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    selectTariff: {}
}

const VesselStoppageTariffPage = () => {

    const [state, setState] = useState({
        ListOfTariffs: [],
        ListOfTariffDetails: []
    });

    useEffect(() => {
        (async function fetchAllTariffs() {
            const response = await vss.GetAllTariffs();
            if (response.data.result) {
                let temp = SetValueLabel(response.data.data, 'VesselStoppageTariffId', 'Description')

                setState((prevState) => ({ ...prevState, ListOfTariffs: temp }));
            }
            else {
                toast.error(response.data.data[0]);
            }
        })();
    }, [])

    const handleSelectedTariffChanged = async () => {
        let tariff = await vss.GetTariffDetails(1);
        tariff = tariff.data.data.map(item => {
            return {
                ...item,
                key: item.VesselStoppageTariffDetailId
            }
        })
        console.log('tariff', tariff)
        setState((prevState) => ({ ...prevState, ListOfTariffDetails: tariff }));

    }

    const columns = [
        {
            title: 'Normal Hour',
            dataIndex: 'NormalHour',
            key: 'NormalHour',
        },
        {
            title: 'Vessel Type',
            dataIndex: 'VesselType',
            key: 'VesselType'
        },
        {
            title: 'Normal Price',
            dataIndex: 'NormalPrice',
            key: 'NormalPrice',
            render: p => (
                <Tag color={'green'}>{
                    p + ' $'
                }</Tag>
            )
        },
        {
            title: 'Extra Price',
            dataIndex: 'ExtraPrice',
            key: 'ExtraPrice',
            render: p => (
                <Tag color={'red'}>{
                    p + ' $'
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
                                                    label="Vessel stoppage tariffs"
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
                                                                        pagination={{ position: ["bottomCenter"],pageSize:11 }}
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

export default VesselStoppageTariffPage;