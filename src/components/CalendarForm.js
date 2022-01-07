import React from "react";
import CalendarAPI from "./CalendarAPI";

class CalendarForm extends React.Component {
    constructor(){
        super()
        this.api = new CalendarAPI();
    }
    state = {
            userName: '',
            userLastName: '',
            userEmail: '',
            date: '',
            time: '',
            infoArray: [],
    }

    render() {
        const {userName, userLastName, userEmail, date, time} = this.state;
        return (
            <form onSubmit = {this.dataValidation} className="form__event">
                <div onChange = {this.inputChange} className="event__insert">
                    <input type="text" name="userName" value={userName} placeholder="First name" className="input__field"></input> 
                    <input type="text" name="userLastName" value={userLastName} placeholder="Last Name" className="input__field"></input>
                    <input type="text" name="userEmail" value={userEmail} placeholder="Email" className="input__field"></input>
                    <input type="date" name="date" value={date} placeholder="Date" className="input__field"></input>
                    <input type="time" name="time" value={time} placeholder="Time" className="input__field"></input>
                    <input type="submit" className="event__submit"></input>
                </div>
                <div className="div__error">
                    {this.renderInformation()}
                </div>
            </form>
        )
    }

    inputChange = e => {
        const {name, value} = e.target;
        this.setState( {
            [name]: value,
        });
    }

    renderInformation() {
        const {infoArray} = this.state;

        if(infoArray.length === 0) {
            return(
                <h1>You can add here new meeting! :)</h1>
            )
        }
        else{
            return infoArray.map(message =>{
                return (
                    <ul className="error__list">
                        <li className="error">{message}</li>
                    </ul>
                )
            })
        }
    }
//refactoring
    dataValidation = (event) => {
        const {userName, userLastName, userEmail, date, time} = this.state;

        const regexNameAndLastName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        const regexHour = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if(userName.length >=2 && userLastName.length >=2 && userEmail.length >=2 && date.length >=2 && time.length >=2) {
            if(regexNameAndLastName.test(userName) && regexNameAndLastName.test(userLastName)) {
                if(regexEmail.test(userEmail)) {
                    if(regexDate.test(date)) {
                        if(regexHour.test(time)) {
                            this.setNewMeetingData(event);
                        }
                        else {
                            event.preventDefault();
                            this.setState({
                                infoArray:['Time is incorrect'],
                            })
                        }
                    }
                    else {
                        event.preventDefault();
                        this.setState({
                            infoArray:['Date is incorrect'],
                        })
                    }
                }
                else {
                    event.preventDefault();
                    this.setState({
                        infoArray:['Email is incorrect'],
                    })
                }
            }
            else {
                event.preventDefault();
                this.setState({
                    infoArray:['Name or surname is incorrect'],
                })
            }
        }
        else {
            event.preventDefault();
            this.setState({
                infoArray:['Fields cannot be empty'],
            });
        }
    }

    setNewMeetingData() {
        const {userName, userLastName, userEmail, date, time, infoArray} = this.state;

        const newMeeting = {
            user: userName,
            lastName: userLastName,
            email: userEmail,
            date: this.setCorrectDate(date),
            time: time,
        }

        this.setState({
            userName: '',
            userLastName: '',
            userEmail: '',
            date: '',
            time: '',
            infoArray: ['New meeting added!'],
        });

        this.sendNewMeeting(newMeeting);
    }

    setCorrectDate(date) {
        let newDate = this.setCorrectMonth(date)
        newDate = this.setCorrectDay(newDate)
        return newDate;
    }

    setCorrectMonth(date){
        console.log('month')
        if(date.charAt(5) === '0') {
            return date.slice(0,5) + date.slice(6, date.length);
        }
        return date;
    }

    setCorrectDay(date) {
        console.log(date);
        if(date.charAt(7) === '0') {
            return date.slice(0,7) + date.slice(8, date.length);
        }
        else if(date.charAt(8) === '0'){
            return date.slice(0,8) + date.slice(9, date.length);
        }

        return date;
    }

    sendNewMeeting(data) {
        const {addData} = this.props;
        return this.api.uploadData(data) 
            .then(resp => addData(resp))
            .catch(err => console.log(err.message))
            .finally('New meeting uploaded');
    }

}

export default CalendarForm;