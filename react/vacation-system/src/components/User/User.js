import { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import './User.css'

const User = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [data, setData] = useState([]);
    const [id, setId] = useState("");
    const flag = useRef(true);
    const [userNames, setUserNames] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [departmentNames, setDepartmentNames] = useState([]);
    const [departmentIds, setDepartmentIds] = useState([]);

    function getUsers() {
        fetch("/users", {
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
                data.map(item => setUserIds(current => [...current, item.id]));
                data.map(item => setUserNames(current => [...current, item.firstName + ' ' + item.lastName]));
                setData(data);
            });
    }

    function getDepartments() {
        fetch("/departments", {
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
                data.map(item => setDepartmentIds(current => [...current, item.id]));
                data.map(item => setDepartmentNames(current => [...current, item.name]));
            });
    }

    function setIdToLocalStorage(id, email, firstName, lastName, availableDays, isAdmin) {
        localStorage.setItem('userId', id);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userFirstName', firstName);
        localStorage.setItem('userLastName', lastName);
        localStorage.setItem('userAvailableDays', availableDays);
        localStorage.setItem('userIsAdmin', isAdmin);
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            getUsers();
            getDepartments();
        }
    }, []);

    return (
        <>
            <NavBar />
            <div className="users">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="8">Users</th>
                            <th>
                                <Link to='/createUser'>
                                    <button>Create</button>
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='header'>
                            <td>Id</td>
                            <td colSpan="1">Email</td>
                            <td colSpan="1">First Name</td>
                            <td colSpan="1">Last Name</td>
                            <td colSpan="1">Available Days</td>
                            <td colSpan="1">Department Name</td>
                            <td colSpan="1">Manager</td>
                            <td colSpan="1">Admin</td>
                        </tr>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td align='left'>{item.id}</td>
                                <td align='left'>{item.email}</td>
                                <td align='left'>{item.firstName}</td>
                                <td align='left'>{item.lastName}</td>
                                <td align='left'>{item.availableDays}</td>
                                <td align='left'>{item.department !== null ? departmentNames[departmentIds.indexOf(item.department.id)]: null}</td>
                                <td align='left'>{item.manager !== null ? userNames[userIds.indexOf(item.manager.id)]: null}</td>
                                <td align='left'><input type='checkbox' checked={item.isAdmin} readOnly></input></td>
                                <td>
                                    <Link to='/updateUser'>
                                        <button onClick={() => {
                                            setIdToLocalStorage(item.id, item.email, item.firstName, item.lastName, item.availableDays, item.isAdmin);
                                            window.scrollTo(0, 0);
                                        }}>Update</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

}

export default User;