import React, { Component } from 'react';
import {confirmRegistration, login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
class Login extends Component {

  componentWillMount(){
console.log(token);
if(token)
    this.verifyEmail(token);
  }


  verifyEmail(token){
      console.log("connect to backend ... recieved token ="+token);


      confirmRegistration(token)
      .then(response => {
          notification.success({
              message: 'Polling App',
              description: response.message,
            //  description: "Thank you! You're successfully registered. Please Login to continue!",
          });



          this.props.history.push("/login");
      }).catch(error => {
          notification.error({
              message: 'Polling App',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });

    }

    render() {
        console.log(token);
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        // // TODO: check if the path has token



    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                  console.log(JSON.stringify(response));
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'Polling App',
                            description: 'Your Username or Password is incorrect. Please try again!'
                        });
                    } else {
                        notification.error({
                            message: 'Polling App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: 'Please input your username or email!' }],
                    })(
                    <Input
                        prefix={<Icon type="user" />}
                        size="large"
                        name="usernameOrEmail"
                        placeholder="Username or Email" />
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password"
                        type="password"
                        placeholder="Password"  />
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;
