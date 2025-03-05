import React from 'react';
import { Menu } from 'antd';

function RightMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="register">
        <a href="/register">Register</a>
      </Menu.Item>
    </Menu>
  )
}

export default RightMenu;