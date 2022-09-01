import { useEffect, useRef, useState } from "react";
import { useLocalState } from "../../util/UseLocalStorage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from '../NavBar';
import './TimeOff.css';

const CreateTimeOff = () => {
  const [timeOffType, setTimeOffType] = useState("");
  const [days, setDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [jwt, setJwt] = useLocalState("", "jwt");
  const flag = useRef(true);
  const currentUserEmail = localStorage.getItem("email");
  const [currentUser, setCurrentUser] = useState([]);
  const [status, setStatus] = useState();
  const [userRole, setUserRole] = localStorage.getItem('userRole');
  const [approvedTimeOffs, setApprovedTimeOffs] = useState([]);
  const timeOffs = [
    { label: "Paid Leave", value: "Paid Leave" },
    { label: "Unpaid Leave", value: "Unpaid Leave" },
    { label: "Sick Leave", value: "Sick Leave" }
  ]
  const [nationalHolidays, setNationalHolidays] = useState([
    new Date(2022, 0, 3),
    new Date(2022, 2, 3),
    new Date(2022, 3, 22),
    new Date(2022, 3, 25),
    new Date(2022, 4, 2),
    new Date(2022, 4, 6),
    new Date(2022, 4, 24),
    new Date(2022, 8, 6),
    new Date(2022, 8, 22),
    new Date(2022, 11, 26),
    new Date(2022, 11, 27),
    new Date(2022, 11, 28)
  ]);

  function getDifferenceInDays(startingDate, endingDate) {
    let count = 0;
    let curDate = new Date(startingDate);
    let endDate = new Date(endingDate);
    let holiday = false;
    while (curDate <= endDate) {
        nationalHolidays.map(day => {
          console.log(day.getTime() === curDate.getTime());
            if (day.getTime() === curDate.getTime()) {
                holiday = true;
            }
        });
        if (holiday === true) {
            holiday = false;
            curDate = new Date(curDate.getTime() + 86400000);
            continue;
        }
        const dayOfWeek = new Date(curDate).getDay();
        const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
        if (!isWeekend) {
            count++;
        }
        curDate = new Date(curDate.getTime() + 86400000);
    }
    return count;
}

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  function submitRequest() {
    try {
      if (days > localStorage.getItem('payedLeaveBalance') && timeOffType === 'Paid Leave') {
        throw new Error('Not enough Paid Leave days :(');
      }
      if (startDate === "") {
        throw new Error('Select Start Date!');
      }
      if (endDate === "") {
        throw new Error('Select End Date!');
      }
      if (timeOffType === "") {
        throw new Error('Select Time Off Type!');
      }

      const reqBody = {
        startDate: startDate,
        endDate: endDate,
        days: days,
        type: timeOffType,
        status: currentUser.manager === null ? 'Approved' : status,
        note: note,
        user: currentUser
      };

      fetch("/requests", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        method: "post",
        body: JSON.stringify(reqBody),
      }).then((res) => {
        if (res.status === 201) return res.json();
      })
        .then((data) => {
          if (userRole === 'admin') {
            window.location.href = '/timeOff';
          } else {
            window.location.href = '/timeOffCurrentUser';
          }
        });
    } catch (message) {
      alert(message);
    }
  }

  // function getUserInfoByEmail() {
  //   fetch("/users/getUserInfoByEmail/" + currentUserEmail.replace("\"", "").replace("\"", ""), {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${jwt}`,
  //     },
  //     method: "get",
  //   })
  //     .then((response) => {
  //       if (response.status === 200) return response.json();
  //     })
  //     .then((data) => {
  //       setCurrentUser(data);
  //     });
  // }

  function getUserInfoByEmail() {
    fetch("/users/getUserInfoByEmail/" + currentUserEmail.replace("\"", "").replace("\"", ""), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((user) => {
        setCurrentUser(user);
        fetch("/requests", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          method: "get",
        })
          .then((response) => {
            if (response.status === 200) return response.json();
          })
          .then((data) => {
            data.map(item => {
              if (item.user.id === user.id && item.status === 'Approved') {
                let startDate = new Date(item.startDate);
                let endDate = new Date(item.endDate);
                while (startDate <= endDate) {
                  const currentDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                  nationalHolidays.push(currentDay);
                  startDate = new Date(startDate.getTime() + 86400000);
                }
              }
            });
          });
      });
  }

  useEffect(() => {
    if (flag.current) {
      flag.current = false;
      getUserInfoByEmail();
    }
  }, []);

  return (
    <div>
      <div><NavBar /></div>
      <div className="timeOffCreation">
        <h1>Time Off Creation</h1>
        <form>
          <div>
            Start Date
          </div>
          <div>
            <DatePicker excludeDates={nationalHolidays} dateFormat="dd/MM/yyyy" popperPlacement="bottom" filterDate={isWeekday} selected={startDate} minDate={new Date()} maxDate={endDate} onChange={(date) => {
              date === null ? setStartDate("") : setStartDate(date);
              if (endDate !== '') {
                setDays(getDifferenceInDays(date, endDate));
              }
            }}></DatePicker>
          </div>
          <div>
            End Date
          </div>
          <div>
            <DatePicker excludeDates={nationalHolidays} dateFormat="dd/MM/yyyy" popperPlacement="bottom" filterDate={isWeekday} selected={endDate} minDate={startDate !== '' ? startDate : new Date()} onChange={(date) => {
              date === null ? setEndDate("") : setEndDate(date);
              if (startDate !== '') {
                setDays(getDifferenceInDays(startDate, date));
              }
            }}></DatePicker>
          </div>
          <label>
            <div>
              Days
            </div>
            <div>
              <input readOnly={true} type={'number'} min="1" value={days}></input>
            </div>
          </label>
          <label>
            <div>
              Type
            </div>
            <div>
              <select value={timeOffType} onChange={(event) => {
                event.target.value === 'Select a Time Off Type' ? setTimeOffType("") : setTimeOffType(event.target.value);
                setStatus(event.target.value === 'Sick Leave' ? 'Approved' : 'Pending');
              }}>
                <option value="Select a Time Off Type"> -- Select a Time Off Type -- </option>
                {timeOffs.map(option => (
                  <option key={option.label} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label>
            <div>
              Note
            </div>
            <div>
              <textarea onChange={(event) => setNote(event.target.value)}></textarea>
            </div>
          </label>
          <br></br>
          <div>
            <button type="button" onClick={() => submitRequest()}>Submit Request</button>
          </div>
        </form>
      </div>
      <div className="nationalHolidays">
        <h1> National Holidays</h1>
        <table>
          <thead>
            <tr>
              <th colSpan="1">Name</th>
              <th colSpan="1">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="1">New Year's holidays</td>
              <td colSpan="1">03-01-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Liberation of Bulgaria</td>
              <td colSpan="1">03-03-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Easter</td>
              <td colSpan="1">22-04-2022 / 25-04-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Labor Day</td>
              <td colSpan="1">02-05-2022</td>
            </tr>
            <tr>
              <td colSpan="1">St George's Day and Day of the Bulgarian Army</td>
              <td colSpan="1">06-05-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Culture and Literacy holiday</td>
              <td colSpan="1">24-05-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Unification of Bulgaria</td>
              <td colSpan="1">06-09-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Independence day</td>
              <td colSpan="1">22-09-2022</td>
            </tr>
            <tr>
              <td colSpan="1">Christmas holidays</td>
              <td colSpan="1">26-12-2022 / 28-12-2022</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default CreateTimeOff;