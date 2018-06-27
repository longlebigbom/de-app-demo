import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './deApp.css';

class deApp extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment()
        };

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
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

    render() {
        const { startDate, endDate } = this.state;

        return (
            <div className="deApp">
                <div className="date start">
                    <span>Start date</span>
                    <DatePicker
                        selected={startDate}
                        onChange={this.handleChangeStart}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                    />
                </div>
                <div className="date start">
                    <span>End date</span>
                    <DatePicker
                        selected={endDate}
                        onChange={this.handleChangeEnd}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                    />
                </div>
                <div className="btn-list">
                    <button>Set</button>
                </div>
            </div>
        );
    }
}

export default deApp;
