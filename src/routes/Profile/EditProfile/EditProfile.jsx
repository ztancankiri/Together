import React, { useState, useEffect } from "react";
import { Icon, Container, Dropdown, Form, Header, Image } from "semantic-ui-react";
import { useForm } from "hooks/useForm";
import api from "api.js";

import './EditProfile.scss';

function EditProfile({ userData }) {
  const [fullName, setFullName] = useState(userData.first_name + ' ' + userData.last_name);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllCities();
  }, [])

  const getAllCities = (async () => {
    try {
      const { data } = await api.getAllCities();
      setCities(data.map((item, index) => {
        const city = {};
        city.key = index;
        city.text = item.name;
        city.value = item.name;
        return city;
      }));
    } catch (error) {
      console.error(error)
    }
  });

  const validate = () => {
    let errors = {}

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  }

  const submitGroupForm = () => {

  }

  const { values, handleChange, handleSubmit, errors } = useForm(validate, submitGroupForm);

  return (
    <div>
      <Container className="edit-profile-container">
        <Header as="h1"><Icon name="edit" />Edit Profile</Header>
        <Form>
          <Header as="h3">Change display name</Header>
          <Form.Group widths="equal">
            <Form.Input error={errors.firstname && errors.firstname.length !== 0} fluid name='firstname' value={values.firstname || userData.first_name} onChange={handleChange} label='First Name' placeholder='First Name' />
            <Form.Input error={errors.lastname && errors.lastname.length !== 0} fluid name='lastname' value={values.lastname || userData.last_name} onChange={handleChange} label='Last Name' placeholder='Last Name' />
          </Form.Group>
          <Header as="h3">Change city</Header>
          <Form.Field>
            <Dropdown name='city' search clearable selection value={values.city || userData.location} onChange={(e, data) => {
              handleChange(data);
            }} options={cities}></Dropdown>
          </Form.Field>
          {errors.firstname && (<p className="error">{errors.firstname}</p>)}
          {errors.lastname && (<p className="error">{errors.lastname}</p>)}
          <Header as="h3">Change password</Header>
          <Form.Field error={errors.password && errors.password.length !== 0}>
            <label>Password</label>
            <Form.Input name='password' value={values.password || ''} onChange={handleChange} placeholder='Password' />
            <label>Re-type your password</label>
            <Form.Input name='confirm_password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder='Confirm Password' />
            {errors.password && (<p className="error">{errors.password}</p>)}
          </Form.Field>
          <Form.Button color="green" loading={isLoading} onClick={handleSubmit}>Confirm Changes</Form.Button>
        </Form>
      </Container>
    </div>
  );
}

export default EditProfile;