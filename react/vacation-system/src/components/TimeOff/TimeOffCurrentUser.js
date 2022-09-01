import { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import moment from "moment";
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import './TimeOff.css';

const TimeOffCurrentUser = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [data, setData] = useState([]);
    const flag = useRef(true);
    const currentUserEmail = localStorage.getItem("email");

    function getCurrentUserTimeOffs() {
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
                        console.log(data);
                        const currentUserTimeOffs = [];
                        data.map(item => {
                            if (item.user.id === user.id) {
                                const body = {
                                    id: item.id,
                                    startDate: item.startDate,
                                    endDate: item.endDate,
                                    days: item.days,
                                    type: item.type,
                                    status: item.status,
                                    note: item.note,
                                    userId: item.user.id
                                }
                                console.log(body);
                                currentUserTimeOffs.push(body);
                            }
                        });
                        setData(currentUserTimeOffs);
                    });
            });
    }

    function setIdToLocalStorage(id, startDate, endDate, days, type, note) {
        localStorage.setItem('timeOffId', id);
        localStorage.setItem('timeOffStartDate', startDate);
        localStorage.setItem('timeOffEndDate', endDate);
        localStorage.setItem('timeOffDays', days);
        localStorage.setItem('timeOffType', type);
        localStorage.setItem('timeOffNote', note);
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            getCurrentUserTimeOffs();
        }
    }, []);

    return (
        <>
            <NavBar />
            <div className="timeOffs">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="7">TimeOffs</th>
                            <th>
                                <Link to='/createTimeOff'>
                                    <button>Create</button>
                                </Link>
                            </th>
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
                                <td>
                                    {item.status === 'Pending' &&
                                        <Link to='/updateTimeOff'>
                                            <button onClick={() => {
                                                setIdToLocalStorage(item.id, item.startDate, item.endDate, item.days, item.type, item.note);
                                                window.scrollTo(0, 0);
                                            }}>Update</button>
                                        </Link>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default TimeOffCurrentUser;
