import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './deApp.css';
import { abiArr } from './dataConfig';

const web3 = global.web3;
class setToken extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment(),
            isLoading: false,
            idTransaction: null,
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
                isError: true,
                errorMess: 'End time must be greater than start time'
            });
        } else {
            setTimeout(() => {
                this.setState({
                    isError: false,
                    errorMess: null
                });
            }, 300);
        }
    }

    onSubmit() {
        const { startDate, endDate } = this.state;
        const errText = 'Some thing went wrong';

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
        const dataSent = contract.setTimeSale.getData(tsStart, tsEnd);

        this.setState({
            isLoading: true
        });
        web3.eth.getTransactionCount(web3.eth.defaultAccount, (err1, resTrans) => {
            if (err1) {
                this.setState({
                    isError: true,
                    errorMess: errText
                });
            } else {
                web3.eth.estimateGas(
                    {
                        to: contractAddress,
                        data: dataSent
                    },
                    (err2, resEstima) => {
                        if (err2) {
                            this.setState({
                                isError: true,
                                errorMess: errText
                            });
                        } else {
                            const dataTrans = {
                                from: web3.eth.defaultAccount,
                                to: contractAddress,
                                nonce: web3.toHex(resTrans),
                                gasPrice: web3.toHex(web3.toWei(0.00000003)),
                                gasLimit: web3.toHex(resEstima),
                                value: '0x00',
                                data: dataSent
                            };
                            web3.eth.sendTransaction(dataTrans, (err3, resSendTrans) => {
                                if (err3) {
                                    this.setState({
                                        isError: true,
                                        errorMess: errText
                                    });
                                } else {
                                    this.intervalId = setInterval(() => {
                                        web3.eth.getTransactionReceipt(resSendTrans, (err5, value) => {
                                            if (err5) {
                                                this.setState({
                                                    isError: true,
                                                    errorMess: errText
                                                });
                                            } else if (value) {
                                                this.setState({
                                                    isError: false,
                                                    isLoading: false,
                                                    errorMess: null,
                                                    idTransaction: value.transactionHash.toString()
                                                });
                                                console.log('result: ', value);
                                                clearInterval(this.intervalId);
                                            }
                                        });
                                    }, 10000);
                                }
                            });
                        }
                    }
                );
            }
        });
    }

    render() {
        const { startDate, endDate, isError, errorMess, idTransaction, isLoading } = this.state;

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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                </div>
                {errorMess && <div className="err">{errorMess}</div>}
                <div className="btn-list">
                    <button className={isError || isLoading ? 'disabled' : ''} onClick={!isError && !isLoading ? this.onSubmit : null}>
                        Set
                    </button>
                </div>
                {isLoading && <div className="loading">Loading...</div>}
                {idTransaction && (
                    <div className="transId">
                        <p className="lblSucc">Successed</p>
                        <p>
                            <strong>TransactionHash: </strong>
                            {idTransaction}
                        </p>
                    </div>
                )}
            </div>
        );
    }
}

export default setToken;
