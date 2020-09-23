import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Row, Col} from "reactstrap";
import { Table } from 'antd';
import { toast } from "react-toastify";
import _ from "lodash";

import antdClass from 'antd/dist/antd.css';
import antdClass2 from "../../../assets/css/vendors/customAntdTable.css"
import { getCountries } from "../../../services/countryService"

toast.configure({ bodyClassName: "customFont" });



const CountriesPage = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'countryName',
            key: 'countryName',
            sorter: {
                compare: (a, b) => a.countryName.localeCompare(b.countryName),
                multiple: 4
            },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol'
        }
    ];

    const [state, setState] = useState({
        listOfCountries: [],
        currentRow: {}
    });

    useEffect(() => {
        getCountries().then(res => {
            if (res.data.result) {
                console.log('Countries', res);
                const tempList = res.data.data.map(item => {
                    return {
                        key: item.CountryId,
                        countryId: item.CountryId,
                        countryName: item.CountryName,
                        symbol: item.Symbol
                    }
                })
                setState(prevState => ({ ...prevState, ListOfCountries: tempList }))
            }
        }).catch(() => { });
    }, []);

    return (
        <React.Fragment>

        <Row className="row-eq-height">
            <Col sm="12" md="12">
                <Card>
                    <CardBody>
                        <div className="form-body">
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Table
                                            className={antdClass + antdClass2}
                                            columns={columns}
                                            dataSource={state.ListOfCountries}
                                            pagination={{ position: ["bottomCenter"] }}
                                            scroll={{ x: 'max-content', y: 200 }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>

       
       </React.Fragment>
        );
}

export default CountriesPage;