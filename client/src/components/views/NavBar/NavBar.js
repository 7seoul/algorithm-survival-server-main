import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CodeFilled } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Sections/Navbar.css';

function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <div className="menu__logo">
      <a href="/">
          <CodeFilled style={{ fontSize: '24px', marginRight: '8px' }} />
          Algorithm Survival
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_right">
          <RightMenu mode="horizontal" />
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          onClose={onClose}
          open={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;