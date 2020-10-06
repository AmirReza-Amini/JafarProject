import React, { Component } from "react";
import { Button, ButtonGroup, Label, Row, Col, FormGroup } from "reactstrap";
import { Field, ErrorMessage } from "formik";
import _ from "lodash";
import DatePicker, { utils } from "react-modern-calendar-datepicker";
import InputMaskDebounce from "./InputMaskDebounce";
import { TimePicker } from "antd";
import moment from "jalali-moment";
import TextError from "./TextError";

class CustomDateTimePicker extends Component {
  constructor(props) {
    super(props);

    const { selectedValue } = this.props;
    console.log("props from ", this.props);
    this.state = {
      selectedDate: "",
      selectedTime: "",
    };
    if (selectedValue != null && selectedValue !== "") {
      const date = this.convertDateTo(selectedValue, "fa"); // 1392/6/31 23:59:59);
      var formatedDate = {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2]),
      };
      const time = moment(selectedValue, "YYYY-M-D HH:mm:ss")
        .locale("fa")
        .format("HH:mm:ss"); //23:59:59
      this.state = {
        selectedDate: formatedDate,
        selectedTime: time,
      };
    }
  }
  convertDateTo = (date, locale) => {
    switch (locale) {
      case "fa":
        let result = moment(date, "YYYY-M-D HH:mm:ss")
          .locale(locale)
          .format("YYYY/M/D")
          .split("/"); // 1392/6/31);
        return result;
      case "en":
        let result1 = moment.from(date, "fa", "YYYY/M/D").format("YYYY-M-D"); // 2013-8-25 16:40:00
        return result1;
      default:
        break;
    }
  };

  getMiladiDate = (value) => {
    const formatedDate = `${value.year}/${value.month}/${value.day}`;
    const miladiDate = this.convertDateTo(formatedDate, "en");
    return miladiDate;
  };
  handleSelectedDateChanged = (value, form) => {
    const miladiDate = this.getMiladiDate(value);
    this.setState({
      selectedDate: value,
      selectedTime: this.state.selectedTime,
    });
    if (this.props.onSelectedChanged)
      this.props.onSelectedChanged(miladiDate + " " + this.state.selectedTime);

    form.setFieldValue(
      this.props.name,
      miladiDate + " " + this.state.selectedTime
    );
  };

  handleSelectedTimeChanged = (TimeString, form) => {
    this.setState({ ...this.state, selectedTime: TimeString });

    const miladiDate = this.getMiladiDate(this.state.selectedDate);
    if (this.props.onSelectedChanged)
      this.props.onSelectedChanged(miladiDate + " " + TimeString);

    form.setFieldValue(this.props.name, miladiDate + " " + TimeString);
  };

  render() {
    const { label, name, placeholder } = this.props;
    return (
      <FormGroup>
        {label !== null && label !== "" && <Label for={name}>{label}</Label>}
        <Field name={name}>
          {(fieldProps) => {
            const { form, meta } = fieldProps;
            // console.log("meta ", meta);
            return (
              <React.Fragment>
                <Row>
                  <Col md="6" sm="6" style={{ paddingRight: "1px" }}>
                    <DatePicker
                      wrapperClassName="form-control"
                      value={this.state.selectedDate}
                      onChange={(value) =>
                        this.handleSelectedDateChanged(value, form)
                      }
                      colorPrimary="rgb(57, 124, 182)" // added this
                      calendarClassName="custom-calendar" // and this
                      calendarTodayClassName="custom-today-day" // also this
                      locale="fa"
                      inputClassName="customSize"
                      inputPlaceholder={placeholder}
                      shouldHighlightWeekends
                    />
                  </Col>
                  <Col md="6" sm="6" style={{ padding: "1px 15px 1px 1px" }}>
                    <TimePicker
                      disabled={!this.state.selectedDate}
                      value={
                        this.state.selectedTime
                          ? moment(this.state.selectedTime, "HH:mm:ss")
                          : ""
                      }
                      className="form-control"
                      size="large"
                      onChange={(time, TimeString) =>
                        this.handleSelectedTimeChanged(TimeString, form)
                      }
                      onBlur={() => form.setFieldTouched(name, true)}
                    />
                  </Col>
                </Row>
                <ErrorMessage name={name} component={TextError} />
              </React.Fragment>
            );
          }}
        </Field>
      </FormGroup>
    );
  }
}

export default CustomDateTimePicker;
