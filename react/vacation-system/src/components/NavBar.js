import { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import './NavBar.css';

const NavBar = () => {
    const [role, setRole] = useState('admin');
    const flag = useRef(true);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const currentUserEmail = localStorage.getItem("email");
    const [isManager, setIsManager] = useState(false);

    function getCurrentUserRole() {
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
            .then((data) => {
                setRole(data.isAdmin === true ? 'admin' : 'regular');
                setIsManager(data.employees.length !== 0);
            });
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            getCurrentUserRole();
        }
    }, []);

    if (role === 'admin') {
        return (
            <>
                <nav className="nav">
                    <a href="/home" className="home">
                        Home
                    </a>
                    <a href="/department" className="department">
                        Departments
                    </a>
                    <a href="/user" className="user">
                        Users
                    </a>
                    <a href="/timeOff" className="timeOff">
                        All Time Offs
                    </a>
                    <a href="/timeOffCurrentUser" className="timeOffCurrentUser">
                        Time Offs (Current User)
                    </a>
                    <a href="/manageTimeOff" className="manageTimeOff">
                        Manage Time Offs
                    </a>
                    <a href="/login" className="logout" onClick={() => localStorage.clear()}>
                        Logout
                    </a>
                </nav>
            </>
        );
    } else if(isManager) {
        return (
            <>
                <nav className="nav">
                    <a href="/home" className="home">
                        Home
                    </a>
                    <a href="/timeOffCurrentUser" className="timeOff">
                        Time Offs
                    </a>
                    <a href="/manageTimeOff" className="manageTimeOff">
                        Manage Time Offs
                    </a>
                    <a href="/login" className="logout" onClick={() => localStorage.clear()}>
                        Logout
                    </a>
                </nav>
            </>
        );
    }else {
        return (
            <>
                <nav className="nav">
                    <a href="/home" className="home">
                        Home
                    </a>
                    <a href="/timeOffCurrentUser" className="timeOff">
                        Time Offs
                    </a>
                    <a href="/login" className="logout" onClick={() => localStorage.clear()}>
                        Logout
                    </a>
                </nav>
            </>
        );
    }
}

export default NavBar;