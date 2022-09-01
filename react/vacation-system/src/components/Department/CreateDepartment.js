import React, { useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import NavBar from '../NavBar';

const CreateDepartment = () => {
  const [department, setDepartment] = useState("");
  const [jwt, setJwt] = useLocalState("", "jwt");

  function createDepartment() {
    try {
      if (department === "") {
        throw new Error("Input Department Name!");
      }
      const reqBody = {
        name: department
      };

      fetch("/departments", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        method: "post",
        body: JSON.stringify(reqBody),
      }).then((response) => {
        if (response.status === 201) return response.json();
      })
        .then((data) => {
          console.log(data);
          window.location.href = '/department';
        });
    } catch (message) {
      alert(message);
    }
  }

  return (
    <div>
      <NavBar />
      <h1>Department Creation</h1>
      <form>
        <label>
          <div>
            Department Name
          </div>
          <div>
            <input placeholder='Department' value={department} onChange={(event) => setDepartment(event.target.value)} />
          </div>
        </label>
        <br></br>
        <div>
          <button type="button" onClick={() => createDepartment()}>Create</button>
        </div>
      </form>
    </div>
  );
}

export default CreateDepartment;