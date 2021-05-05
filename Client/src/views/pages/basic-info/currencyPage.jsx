import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Formik, Form } from "formik";
import { Table } from "antd";
import { addNewCurrency, getCurrencies } from "../../../services/currencyService";
import { toast } from "react-toastify";
import _ from "lodash";
import { ShoppingBag, CheckSquare, X } from "react-feather";
import { ToPersianDate } from "../../../utility/tools";
import FormikControl from "../../../components/common/formik/FormikControl";
import antdClass from "antd/dist/antd.css";
import antdClass2 from "../../../assets/css/vendors/customAntdTable.css";
import * as Yup from "yup";
toast.configure({ bodyClassName: "customFont" });
const initialValues = {
  frate: "",
  prate:"",
  date: "",
};
const validationSchema = Yup.object({
  frate: Yup.string().required("Enter Daily Foreign Doller Rate "),
  prate: Yup.string().required("Enter Daily Persian Doller Rate"),
  date: Yup.string().required("Enter Date"),
});
const CurrencyPage = (props) => {
  const [state, setState] = useState({
    listOfCurrencies: [],
    createModal: false,
    currentRow: {},
  });

  const columns = [
    {
      title: "Forieign Rate",
      dataIndex: "frate",
      key: "frate",
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Persian Rate",
      dataIndex: "prate",
      key: "prate",
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // const onSubmitEditCurrency = (values) => {
  //     if (values === state.currentRow) return;
  //     let parameters = {
  //         currencyId: values.id,
  //         rate:vlaues.rate,
  //         date:values.date,
  //         userId:values.userId
  //     }
  // }
  useEffect(() => {
    getCurrencies()
      .then((res) => {
        if (res.data.result) {
          const tempList = res.data.data.map((item) => {
            console.log("persianDate:", ToPersianDate(item.Date), item.Date);
            return {
              key: item.CurrencyId,
              currencyId: item.CurrencyId,
              frate: item.FRate,
              prate: item.PRate,
              //date: moment.from(item.Date,'YYYY/MM/DD hh:mm:ss').locale('fa').format('YYYY/MM/DD hh:mm:ss')
              date: ToPersianDate(item.Date),
            };
          });
          console.log("currencies:", tempList);

          setState((prevState) => ({
            ...prevState,
            listOfCurrencies: tempList,
          }));
        } else {
          return toast.error(res.data.data[0]);
        }
      })
      .catch(() => {});
  }, []);
  const handleCreateCurrency = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };
  const createToggle = () => {
    setState((prevState) => ({
      ...prevState,
      createModal: !state.createModal,
    }));
  };
  const onSubmitCreateCurrency = (values) => {
    console.log("values", values);
    let parameters = {
        frate: values.frate,
        prate: values.prate,
        date:values.date 
       }
       addNewCurrency(parameters).then(response => {
        console.log('response', response);
        if (response.data.result) {
            toast.success(response.data.data[0]);
            const lstCurrencies = [...state.listOfCurrencies];
            getCurrencies().then(res => {
                if (res.data.result) {
                    console.log('currencies', res);
                    const tempList = res.data.data.map(item => {
                        return {
                            key: item.currencyId,
                            frate: item.frate,
                            prate: item.prate,
                            date: item.date
                        }
                    })
                    setState(prevState => ({ ...prevState, listOfCurrencies: tempList }))
                }
                else {
                    return toast.error(res.data.data[0]);
                }
            }).catch(err => { });

            createToggle();
        }
        else {
            toast.error(response.data.data[0])
        }
    }).catch(error => { })
}


  const handleCancelCreateCurrency = () => {
    setState((prevState) => ({ ...prevState, currentRow: {} }));
    createToggle();
  };

  return (
    <React.Fragment>
      <Row className="row-eq-height">
        <Col sm="12" md="12">
          <Card>
            <CardBody>
              <div className="form-body">
                <Row>
                  <Col md="9">
                    <h4 className="form-section">
                      <ShoppingBag size={20} color="#212529" /> Currency Rates
                    </h4>
                  </Col>
                  <Col>
                    <Button
                      color="success"
                      type="button"
                      onClick={handleCreateCurrency}
                    >
                      Add New Currency Rate
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Table
                        className={antdClass + antdClass2}
                        columns={columns}
                        dataSource={state.listOfCurrencies}
                        pagination={{ position: ["bottomCenter"] }}
                        scroll={{ x: "max-content", y: 200 }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={state.createModal}
        toggle={createToggle}
        className={props.className}
        backdrop="static"
      >
        <ModalHeader toggle={createToggle}>Create New Currency</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmitCreateCurrency(values, props);
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
                            name="frate"
                            className="ltr"
                            type="number"
                            label="Currency Foreign Rate"
                            defaultValue={state.currentRow.currencyFRate}
                          />
                          <FormikControl
                            control="inputMaskDebounce"
                            name="prate"
                            className="ltr"
                            type="number"
                            label="Currency Persian Rate"
                            defaultValue={state.currentRow.currencyPRate}
                          />
                        </Col>
                        <Col md="6">
                          <FormikControl
                            control="customDateTimePicker"
                            name="date"
                            label="Date"
                            placeholder="Currency Date"
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
                        onClick={handleCancelCreateCurrency}
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

export default CurrencyPage;
