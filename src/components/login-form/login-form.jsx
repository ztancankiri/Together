import React, { useState, useContext } from "react";
import { AppContext } from 'context/Context.jsx';
import api from 'api.js';
import { Button, Form } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import "./login-form.scss";
import { useForm } from "hooks/useForm";

function LoginForm({ history }) {
  const { dispatch } = useContext(AppContext);
  const [registerView, setRegisterView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, handleChange, handleSubmit, errors } = useForm(validate, login, registerView, signUp);

  async function signUp() {
    setIsLoading(true);
    try {
      await api.signUp(values);
      setRegisterView(false);
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  async function login() {
    setIsLoading(true);
    try {
      const res = await api.login(values);
      api.setAuthToken(res.data.token);
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('token', res.data.token);
      const { data } = await api.getProfileData();
      dispatch({ type: "SET_USER_DATA", data: data })
      history.push("/");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  //Validation Rules
  function validate(values) {
    let errors = {};
    if (registerView) {
      if (!values.email) {
        errors.email = 'Email address is required';
      }
      if (!values.firstname) {
        errors.firstname = 'First name is required';
      }
      if (!values.lastname) {
        errors.lastname = 'Last name is required';
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
      }
      else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };


  return (
    <div>
      <Button.Group>
        <Button color="orange" onClick={() => setRegisterView(false)}>Login</Button>
        <Button.Or />
        <Button color="red" onClick={() => setRegisterView(true)}>Sign Up</Button>
      </Button.Group>
      <Form>
        {registerView ? <h1>Sign Up</h1> : <h1>Login</h1>}
        {registerView ?
          <Form.Field error={errors.email && errors.email.length !== 0}>
            <label>Email</label>
            <input name='email' value={values.email || ''} onChange={handleChange} placeholder='Email' />
            {errors.email && (<p className="error">{errors.email}</p>)}
          </Form.Field> : ''}
        {registerView ?
          <Form.Group widths='equal'>
            <Form.Input error={errors.firstname && errors.firstname.length !== 0} fluid name='firstname' value={values.firstname || ''} onChange={handleChange} label='First Name' placeholder='First Name' />
            {errors.firstname && (<p className="error">{errors.firstname}</p>)}
            <Form.Input error={errors.lastname && errors.lastname.length !== 0} fluid name='lastname' value={values.lastname || ''} onChange={handleChange} label='Last Name' placeholder='Last Name' />
            {errors.lastname && (<p className="error">{errors.lastname}</p>)}
          </Form.Group>
          : ''}
        <Form.Field error={errors.username && errors.username.length !== 0}>
          <label>Username</label>
          <input name='username' value={values.username || ''} onChange={handleChange} placeholder='Username' />
          {errors.username && (<p className="error">{errors.username}</p>)}
        </Form.Field>
        <Form.Field error={errors.password && errors.password.length !== 0}>
          <label>Password</label>
          <input name='password' value={values.password || ''} onChange={handleChange} placeholder='Password' />
          {errors.password && (<p className="error">{errors.password}</p>)}
        </Form.Field>
        {registerView ?
          <Form.Field error={errors.confirmPassword && errors.confirmPassword.length !== 0}>
            <label>Confirm Password</label>
            <input name='confirmPassword' value={values.confirmPassword || ''} onChange={handleChange} placeholder='Confirm Password' />
            {errors.confirmPassword && (<p className="error">{errors.confirmPassword}</p>)}
          </Form.Field> : ''}
        <div className="button-area">
          <Form.Button color="green" loading={isLoading} onClick={handleSubmit}>Submit</Form.Button>
        </div>
      </Form>
    </div>);

}
export default withRouter(LoginForm);



