import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { ShoppingBag } from "react-feather";
import { Table, Tag } from 'antd';
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import FormikControl from "../../../../components/common/formik/FormikControl";

import * as  gcs from '../../../../services/garbageCollectionService';

toast.configure({ bodyClassName: "customFont" });

const initialValues = {
    voyageData: {},
    issuedBill: {}
}

const GarbageCollectionBillPage = () => {

    const [state, setState] = useState({
        ListOfVoyages: [],
        voyageData: {},
        issuedBill: {}
    });

    const handleSelectedVoyageChanged = (param) => {
        console.log("handleSelectedVoyageChanged -> param", param)
        
    }

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
                                                    options={state.ListOfVoyages ?? []}
                                                    label="Garbage collections tariffs"
                                                    onSelectedChanged={
                                                        handleSelectedVoyageChanged
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </React.Fragment>
                        )
                    }}

            </Formik>
        </React.Fragment> 
    );
}

export default GarbageCollectionBillPage;