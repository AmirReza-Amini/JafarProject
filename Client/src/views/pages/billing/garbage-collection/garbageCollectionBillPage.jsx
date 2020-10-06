import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { SetValueLabel } from '../../../../utility/tools'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import FormikControl from "../../../../components/common/formik/FormikControl";

// import * as  gcs from '../../../../services/garbageCollectionService';
import * as  vs from '../../../../services/voyageService';

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

    useEffect(() => {
        (async function fetchAllTariffs() {
            const response = await vs.GetLast10Voyages();
            // console.log('voyageList',response)
            if (response.data.result) {
                let temp = SetValueLabel(response.data.data, 'VoyageId', 'VoyageNoIn');

                setState((prevState) => ({ ...prevState, ListOfVoyages: temp }));
            }
            else {
                toast.error(response.data.data[0]);
            }
        })();
    }, [])

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