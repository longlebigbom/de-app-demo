import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './deApp.css';
import { abiArr, whitelistAbi, inputCtList } from './dataConfig';

const web3 = global.web3;
class setToken extends PureComponent {
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

            return false;
        }

        this.setState({
            isError: false,
            errorMess: null
        });

        const contractAddress = '0xe3e414b735d2af6d24e4d93d00a826f9f08d1743';
        const contract = web3.eth.contract(abiArr).at(contractAddress);
        const tsStart = parseInt(startDate.toDate().getTime() / 1000, 10);
        const tsEnd = parseInt(endDate.toDate().getTime() / 1000, 10);
        const dataSend = contract.setTimeSale.getData(tsStart, tsEnd);

        web3.eth.getTransactionCount(web3.eth.defaultAccount, (e1, count) => {
            web3.eth.estimateGas(
                {
                    to: contractAddress,
                    data: dataSend
                },
                (e2, count) => {}
            );
        });
    }

    render() {
        const { startDate, endDate, isError, errorMess } = this.state;

        return (
            <div className="deApp">
                <div className="date start">
                    <span>Start date</span>
                    <DatePicker
                        selected={startDate}
                        onChange={this.handleChangeStart}
                        showTimeSelect
                        minDate={moment()}
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="DD/MM/YYYY HH:mm"
                        timeCaption="time"
                        onBlur={this.handleOnBlur}
                    />
                </div>
                <div className="date start">
                    <span>End date</span>
                    <DatePicker
                        selected={endDate}
                        onChange={this.handleChangeEnd}
                        showTimeSelect
                        minDate={moment()}
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="DD/MM/YYYY HH:mm"
                        timeCaption="time"
                        onBlur={this.handleOnBlur}
                    />
                </div>
                <div className="btn-list">
                    <button className={isError ? 'disabled' : ''} onClick={!isError ? this.onSubmit : null}>
                        Set
                    </button>
                </div>
            </div>
        );
    }
}

export default setToken;
