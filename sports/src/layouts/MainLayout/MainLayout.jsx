import React from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Menu, Row, Col, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const LMenu = React.createClass({
  render() {
    return (
      <div>
        <Menu theme="dark"
              defaultOpenKeys={['sub1']}
              mode="inline"
        >
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>导航一</span></span>}>
            <MenuItemGroup title="分组1">
              <Menu.Item key="1"><Link to={{pathname:'/stulist'}}>学生列表</Link></Menu.Item>
              <Menu.Item key="2">选项2</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title="运动数据">
              <Menu.Item key="3">333</Menu.Item>
              <Menu.Item key="4">选项4</Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>导航二</span></span>}>
            <Menu.Item key="5"><Link to={{pathname:'/sports3'}}>仰卧起坐</Link></Menu.Item>
            <Menu.Item key="6">选项6</Menu.Item>
            <SubMenu key="sub3" title="三级导航">
              <Menu.Item key="7">选项7</Menu.Item>
              <Menu.Item key="8">选项8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub4" title={<span><Icon type="setting" /><span>导航三</span></span>}>
            <Menu.Item key="9">选项9</Menu.Item>
            <Menu.Item key="10">选项10</Menu.Item>
            <Menu.Item key="11">选项11</Menu.Item>
            <Menu.Item key="12">选项12</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  },
});

const MainLayout = ({ children }) => {
  return (
    <div style={{height:"100%"}}>
      <Row style={{height:"100%"}}>
        <Col span={3} style={{height:'100%',background:"#404040"}}>
          <LMenu />
        </Col>
        <Col span={21}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

export default MainLayout;
