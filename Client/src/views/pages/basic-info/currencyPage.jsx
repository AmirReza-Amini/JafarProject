import React, { Component, useEffect, useState } from 'react';
import * as Yup from "yup";

const initialValues = {
    rate:"",
    date:""
}
const validationSchema = Yup.object({
    rate: Yup.string().required("Enter Daily Doller Rate"),
    date:Yup.string().required("Enter Date")
})
const CurrencyPage = () =>{

    const [state,setState] = useState({});

    const columns = [
        {
            title: 'Rate',
            dataIndex: 'Rate',
            key: 'Rate',           
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date'
        }
    ];

    const onSubmitEditCurrency = (values) => {
        if (values === state.currentRow) return;
        let parameters = {
            currencyId: values.id,
            rate:vlaues.rate,
            date:values.date,
            userId:values.userId
        }
    }
    useEffect(()=>{
        getCurrencies()
    })



}
