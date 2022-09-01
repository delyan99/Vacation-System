import React, { useEffect, useRef, useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import NavBar from '../NavBar';

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [availableDays, setAvailableDays] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [departments, setDepartments] = useState([]);
  const [departmentsId, setDepartmentsId] = useState([]);
  const [managerName, setManagerName] = useState();
  const [manager, setManager] = useState();
  const [managerNames, setManagerNames] = useState([]);
  const [managers, setManagers] = useState([]);
  const flag = useRef(true);

  function getDepartments() {
    fetch("/departments", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "get",
    }).then((response) => {
      if (response.status === 200) return response.json();
    })
      .then((data) => {
        data.map(item => setDepartments(current => [...current, item.name]));
        data.map(item => setDepartmentsId(current => [...current, item.id]));
      })
  }

  function getManagers() {
    fetch("/users", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "get",
    }).then((response) => {
      if (response.status === 200) return response.json();
    })
      .then((data) => {
        data.map(item => setManagerNames(current => [...current, item.firstName + ' ' + item.lastName]));
        data.map(item => setManagers(current => [...current, item]));
      })
  }

  useEffect(() => {
    if (flag.current) {
      flag.current = false;
      getDepartments();
      getManagers();
    }
  }, []);

  function createUser() {
    try {
      console.log(availableDays);
      if (email === "") {
        throw new Error('Enter Email!');
      }
      if (password === "") {
        throw new Error('Enter Password!');
      }
      if (firstName === "") {
        throw new Error('Enter First Name!');
      }
      if (lastName === "") {
        throw new Error('Enter Last Name!');
      }
      if (availableDays === '') {
        throw new Error('Enter Available Days!');
      }
      if (department === "") {
        throw new Error('Select Department!');
      }
      const reqBody = {
        name: department,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin,
        availableDays: availableDays,
        department: {"id": departmentId},
        manager: manager
      };

      fetch("/users", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        method: "post",
        body: JSON.stringify(reqBody),
      }).then((response) => {
        if (response.status === 201) {
          return response.json()
        } else if (response.status === 422) {
          throw new Error("Invalid Email format!");
        };
      }).then((data) => {
        console.log(data);
        window.location.href = '/user';
      }).catch((m) => {
        alert(m);
      });
    } catch (message) {
      alert(message);
    }
  }

  return (
    <div>
      <NavBar />
      <h1>User Creation</h1>
      <form>
        <label>
          <div>
            Email
          </div>
          <div>
            <input type="email" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
        </label>
        <label>
          <div>
            Password
          </div>
          <div>
            <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
        </label>
        <label>
          <div>
            First Name
          </div>
          <div>
            <input placeholder='First Name' value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </div>
        </label>
        <label>
          <div>
            Last Name
          </div>
          <div>
            <input placeholder='Last Name' value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
        </label>
        <label>
          <div>
            Available Days
          </div>
          <div>
            <input type="number" pattern="^[0-9]" min={0} placeholder='Available Days' value={availableDays} onChange={(event) => event.target.value ==='' ? setAvailableDays("") : setAvailableDays(parseInt(event.target.value))} />
          </div>
        </label>
        <label>
          <div>
            <br></br>
            <select value={department} onChange={(event) => {
              event.target.value === 'Select department' ? setDepartment('') : setDepartment(event.target.value);
              setDepartmentId(departmentsId[departments.indexOf(event.target.value)]);
            }}>
              <option value="Select department"> -- Select Department -- </option>
              {departments.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label>
          <div>
            <br></br>
            <select value={managerName} onChange={(event) => {
              setManagerName(event.target.value);
              setManager(managers[managerNames.indexOf(event.target.value)]);
            }}>
              <option value="Select Manager"> -- Select Manager -- </option>
              {managerNames.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label>
          <div>
            Admin
          </div>
          <div>
            <input type="checkbox" value={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
          </div>
        </label>
        <br></br>
        <div>
          <button type="button" onClick={() => createUser()}>Create</button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;