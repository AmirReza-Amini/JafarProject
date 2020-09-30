import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, FormGroup, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Table, Tag, Space } from 'antd';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import _ from "lodash";

import FormikControl from "../../../../components/common/formik/FormikControl";

import {garbageCollectionService} from '../../../../services/garbageCollectionService' 

toast.configure({ bodyClassName: "customFont" });

//#region INITIAL VALUES ---------------------------------------------------

const initialValues = {
    description: "",
    effectiveDate: ""
};

const validationSchema = Yup.object({
    effectiveDate: Yup.date().min(new Date(), "Select most be greater than today!"),
    description: Yup.string().max(50, 'Description must be <= 50 characters').required("Enter description!"),
});



const GarbageCollectionTariffPage = (props) => {


    const [state, setState] = useState({
        //ListOfUserTypes: [],

        ListOfTariffs: [],
        currentTariff: {},
        editModal: false,
        createModal: false
    });
    
const handleVesselTypeSelectedChanged = () => {
    console.log("handleVesselTypeSelectedChanged -> Hello", 'Hello')
}
    return (
        <React.Fragment>
            <h3>List of tariffs</h3>
        <Form>
            <div className="form-body">
                <Row>
                    <Col md="6">
                        <FormikControl
                            control="customSelect"
                            name="selectVesselType"
                            selectedValue={
                                state.currentTariff
                            }
                            options={state.ListOfTariffs}
                            label="Vessel Type"
                            onSelectedChanged={
                                handleVesselTypeSelectedChanged
                            }
                        />
                    </Col>
                </Row>
            </div>
        </Form>
    </React.Fragment>
        );
}

export default GarbageCollectionTariffPage;