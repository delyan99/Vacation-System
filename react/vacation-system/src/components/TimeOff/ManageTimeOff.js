import { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import moment from "moment";
import NavBar from '../NavBar';
import './ManageTimeOff.css';

const ManageTimeOff = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [data, setData] = useState([]);
    const flag = useRef(true);
    const currentUserEmail = localStorage.getItem("email");

    function getTimeOffs() {
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
                if (user.isAdmin === true) {
                    localStorage.setItem('userRole', 'admin');
                } else {
                    localStorage.setItem('userRole', 'regular');
                }
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
                        const currentUserTimeOffs = [];
                        data.map(item => {
                            if (user.employees !== null) {
                                user.employees.map((u) => {
                                    if (u.id === item.user.id && item.status === 'Pending') {
                                        const body = {
                                            id: item.id,
                                            startDate: item.startDate,
                                            endDate: item.endDate,
                                            days: item.days,
                                            type: item.type,
                                            status: item.status,
                                            note: item.note,
                                            userId: item.user.id,
                                            userFirstName: item.user.firstName,
                                            userLastName: item.user.lastName
                                        }
                                        console.log(body);
                                        currentUserTimeOffs.push(body);
                                    }
                                })
                            };
                        });
                        setData(currentUserTimeOffs);
                    });
            });
    }

    function manageRequest(timeOffId, startDate, endDate, days, timeOffType, status, note) {
        const reqBody = {
            startDate: startDate,
            endDate: endDate,
            days: days,
            type: timeOffType,
            status: status,
            note: note
        };

        fetch(`/requests/${timeOffId}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "put",
            body: JSON.stringify(reqBody),
        }).then((response) => {
            if (response.status === 200) return response.json();
        })
            .then((data) => {
                console.log(data);
                window.location.href = '/manageTimeOff';
            });
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            getTimeOffs();
            localStorage.setItem('userRole', 'admin');
        }
    }, []);

    return (
        <>
            <NavBar />
            <div>{data.length === 0 ? <h1>Nothing to Approve :)</h1>: 
            <div className="manageTimeOffs">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="11">Manage TimeOffs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='header'>
                            <td colSpan="1">Id</td>
                            <td colSpan="1">Start Date</td>
                            <td colSpan="1">End Date</td>
                            <td colSpan="1">Days</td>
                            <td colSpan="1">Type</td>
                            <td colSpan="1">Note</td>
                            <td colSpan="1">Status</td>
                            <td colSpan="1">Owner</td>
                        </tr>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td align='left'>{item.id}</td>
                                <td align='left'>{moment(item.startDate).format('DD/MM/YYYY')}</td>
                                <td align='left'>{moment(item.endDate).format('DD/MM/YYYY')}</td>
                                <td align='left'>{item.days}</td>
                                <td align='left'>{item.type}</td>
                                <td align='left'>{item.note}</td>
                                <td align='left'>{item.status}</td>
                                <td align='left'>{item.userFirstName} {item.userLastName}</td>
                                <td>
                                    <button onClick={() => {
                                        manageRequest(item.id, item.startDate, item.endDate, item.days, item.type, 'Approved', item.note);
                                        window.scrollTo(0, 0);
                                    }}>Approve</button>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        manageRequest(item.id, item.startDate, item.endDate, item.days, item.type, 'Rejected', item.note);
                                        window.scrollTo(0, 0);
                                    }}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }</div>
        </>
    );
}

export default ManageTimeOff;
