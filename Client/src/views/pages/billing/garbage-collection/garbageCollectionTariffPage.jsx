import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import _ from "lodash";

import FormikControl from "../../../../components/common/formik/FormikControl";

import * as  gcs from '../../../../services/garbageCollectionService';

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
        ListOfTariffs: [],
        currentTariff: {},
        editModal: false,
        createModal: false
    });

    useEffect(() => {
        gcs.getAllTariffs().then(response => {
            if (response.data.result) {
                setState((prevState) => ({ ...prevState, ListOfTariffs: response.data.data }));
            }
            else {
                return toast.error(response.data.data[0]);
            }
        })
    }, [])

    const onSubmit = (values) => {
        console.log('formik submit values', values);
    }

    const handleVesselTypeSelectedChanged = () => {
        console.log("handleVesselTypeSelectedChanged -> Hello", 'Hello')
    }
    return (
        <React.Fragment>
            <h3>List of tariffs</h3>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => { onSubmit(values); }}
                validateOnBlur={true}
                enableReinitialize
            >
                {
                    (formikProps) => {
                        console.log('formik props values', formikProps.values);
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
                        )
                    }
                }
            </Formik>
        </React.Fragment>
    );
}

export default GarbageCollectionTariffPage;