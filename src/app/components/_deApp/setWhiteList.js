import React, { PureComponent } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import './deApp.css';
import { whitelistAbi } from './dataConfig';

const callMethod = (method, ...params) => {
    return new Promise((resolve, rejects) => {
        method(...params, (err, result) => {
            if (err) {
                rejects(err);
            } else {
                resolve(result);
            }
        });
    });
};

const web3 = global.web3;
class setWhiteList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isError: true,
            errorMess: null,
            listAdd: [],
            minCap: 0.1,
            maxCap: 5,
            idTransaction: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.hanleChange = this.hanleChange.bind(this);
    }

    hanleChange(e) {
        let getAdds = e.target.value.trim();
        if (getAdds.length > 0) {
            getAdds = getAdds.split('\n');

            this.setState({
                listAdd: getAdds,
                errorMess: null,
                isError: false
            });
        }
    }

    onSubmit() {
        const { listAdd, minCap, maxCap } = this.state;
        const regexWalletAdress = /^(0x)?[0-9a-f]{40}$/i;

        const isValid = listAdd.length && listAdd.every(item => regexWalletAdress.test(item));

        if (!isValid) {
            this.setState({
                errorMess: 'One of addresses is invalid',
                isError: true
            });

            return false;
        }

        this.setState({
            errorMess: null,
            isError: false,
            isLoading: true
        });
        const errText = 'Some thing went wrong';
        const contractAddress = '0xda1e36e8b0f441f6a59957a3dac20389ba4a260f';
        // 0x2fAEFB5bAf61A38A25fdF0A177C45A1fcd3b89B2
        const contract = web3.eth.contract(whitelistAbi).at(contractAddress);
        const dataSend = contract.listAddress.getData(listAdd, minCap, maxCap);

        (async () => {
            const getTransaction = callMethod(web3.eth.getTransactionCount, web3.eth.defaultAccount);
            const getEstGas = callMethod(web3.eth.estimateGas, { to: contractAddress, data: dataSend });
            await getTransaction;
            await getEstGas;

            const rawTransaction = {
                from: web3.eth.defaultAccount,
                to: contractAddress,
                nonce: web3.toHex(getTransaction),
                gasPrice: web3.toHex(web3.toWei(0.00000003)),
                gasLimit: web3.toHex(getEstGas),
                value: '0x00',
                data: dataSend
            };
            const getSendTrans = await callMethod(web3.eth.sendTransaction, rawTransaction);

            this.intervalId = setInterval(() => {
                web3.eth.getTransactionReceipt(getSendTrans, (errGetTrans, value) => {
                    if (errGetTrans) {
                        this.setState({
                            isError: true,
                            errorMess: errText
                        });
                        clearInterval(this.intervalId);
                    } else if (value) {
                        console.log('value: ', value);
                        this.setState({
                            isError: false,
                            isLoading: false,
                            errorMess: null,
                            idTransaction: value.transactionHash.toString()
                        });
                        clearInterval(this.intervalId);
                    }
                });
            }, 10000);
        })();
    }

    render() {
        const { isError, errorMess, isLoading, minCap, maxCap, idTransaction } = this.state;

        return (
            <div className="deApp">
                <div className="address">
                    <label>Address</label>
                    <p className="each-row">
                        <textarea className="add" type="text" onChange={this.hanleChange} />
                    </p>
                </div>
                <div className="date start">
                    <span>Min cap</span>
                    <p className="each-row">
                        <input className="txtInput" type="text" disabled value={minCap} />
                    </p>
                </div>
                <div className="date start">
                    <span>Max cap</span>
                    <p className="each-row">
                        <input className="txtInput" type="text" disabled value={maxCap} />
                    </p>
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

export default setWhiteList;
