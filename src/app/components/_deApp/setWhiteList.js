import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './deApp.css';
import { abiArr, whitelistAbi, inputCtList } from './dataConfig';

class whiteList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment(),
            isError: true,
            errorMess: null
        };

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    handleChangeStart(date) {
        this.setState({
            startDate: date
        });
    }

    handleChangeEnd(date) {
        this.setState({
            endDate: date
        });
    }

    handleOnBlur() {
        const { startDate, endDate } = this.state;
        if (startDate >= endDate) {
            this.setState({
                isError: true
            });
        } else {
            this.setState({
                isError: false
            });
        }
    }

    onSubmit() {
        const { startDate, endDate } = this.state;

        if (startDate >= endDate) {
            this.setState({
                isError: true,
                errorMess: 'End time must be greater than start time'
            });
        } else {
            this.setState({
                isError: false,
                errorMess: null
            });
        }
    }

    render() {
        return <div className="deApp">White list</div>;
    }
}

export default whiteList;
