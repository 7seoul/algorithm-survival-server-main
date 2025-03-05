import React from 'react';
import { Menu } from 'antd';

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="home">
        <a href="/">Home</a>
      </Menu.Item >
      <Menu.Item key="ranking">
        <a href="/ranking">Ranking</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu