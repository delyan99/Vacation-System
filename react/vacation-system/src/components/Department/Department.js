import { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import './Department.css';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';

const Department = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [data, setData] = useState([]);
    const [id, setId] = useState("");
    const flag = useRef(true);

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
                setData(data);
            });
    }

    function setIdToLocalStorage(id, name) {
        localStorage.setItem('departmentId', id);
        localStorage.setItem('departmentName', name);
    }

    function onDelete(id) {
        fetch(`/departments/${id}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "delete",
        })
            .then((response) => {
                if (response.status === 200) return response.json();
            })
            .then(() => {
                window.location.reload(false);
            });
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            getDepartments();
        }
    }, []);

    return (
        <>
            <NavBar />
            <div className="departments">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">Departments</th>
                            <th>
                                <Link to='/createDepartment'>
                                    <button>Create</button>
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='header'>
                            <td>Id</td>
                            <td colSpan="1">Name</td>
                        </tr>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td align='left'>{item.id}</td>
                                <td align='left'>{item.name}</td>
                                <td>
                                    <Link to='/updateDepartment'>
                                        <button onClick={() => setIdToLocalStorage(item.id, item.name)}>Update</button>
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => onDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Department;
