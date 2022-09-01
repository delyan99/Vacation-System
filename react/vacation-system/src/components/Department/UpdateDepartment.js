import React, { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import NavBar from '../NavBar';

const UpdateDepartment = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [jwt, setJwt] = useLocalState("", "jwt");
    const flag = useRef(true);

    function updateDepartment() {
        try {
            if (name === "") {
                throw new Error("Input Department Name!");
            }
            const reqBody = {
                name: name
            };

            fetch(`/departments/${id}`, {
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
                    window.location.href = '/department';
                });
        } catch (message) {
            alert(message);
        }
    }

    useEffect(() => {
        if (flag.current) {
            flag.current = false;
            setName(localStorage.getItem('departmentName'));
            setId(localStorage.getItem('departmentId'));
        }
    })

    return (
        <div>
            <NavBar />
            <h1>Update Department</h1>
            <form>
                <label>
                    <div>
                        Department Name
                    </div>
                    <div>
                        <input placeholder='Department' value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                </label>
                <br></br>
                <div>
                    <button type="button" onClick={() => updateDepartment()}>Update</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateDepartment;