import React, { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import './Home.css';
import NavBar from '../NavBar';

const Home = () => {
    const currentUserEmail = localStorage.getItem("email");
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [days, setDays] = useState(null);
    const [payedLeaveUsedDays, setPayedLeaveUsedDays] = useState();
    const [payedLeaveBalance, setPayedLeaveBalance] = useState();
    const [unpayedLeaveUsedDays, setUnpayedLeaveUsedDays] = useState();
    const [sickLeaveUsedDays, setSickLeaveUsedDays] = useState();
    const flag = useRef(true);

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
            .then((result) => {
                setDays(result.availableDays);
                fetch(`/requests/paidLeaveDays/${result.id}`, {
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
                        setPayedLeaveUsedDays(data);
                        localStorage.setItem('payedLeaveBalance', result.availableDays - data);
                        setPayedLeaveBalance(result.availableDays - data);
                    });
                fetch(`/requests/unpaidLeaveDays/${result.id}`, {
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
                        setUnpayedLeaveUsedDays(data);
                    });

                fetch(`/requests/sickLeaveDays/${result.id}`, {
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
                        setSickLeaveUsedDays(data);
                    });
            });
    }

    useEffect(() => {
            getUserInfoByEmail();
        }
    );

    return (
        <>
            <NavBar />
            <div>
                <h1>Home</h1>
            </div>
            <div className="days">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="4">Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='header'>
                            <td>Discription</td>
                            <td>Count</td>
                            <td>Used</td>
                            <td>Balance</td>
                        </tr>
                        <tr>
                            <td align='left'>
                                Paid leave
                            </td>
                            <td>
                                {days}
                            </td>
                            <td>
                                {payedLeaveUsedDays}
                            </td>
                            <td>
                                {payedLeaveBalance}
                            </td>
                        </tr>
                        <tr>
                            <td align='left'>
                                Unpaid leave
                            </td>
                            <td>
                                -
                            </td>
                            <td>
                                {unpayedLeaveUsedDays}
                            </td>
                            <td>
                                -
                            </td>
                        </tr>
                        <tr>
                            <td align='left'>
                                Sick leave
                            </td>
                            <td>
                                -
                            </td>
                            <td>
                                {sickLeaveUsedDays}
                            </td>
                            <td>
                                -
                            </td>
                        </tr>
                        <tr>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Home;