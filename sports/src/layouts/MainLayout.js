import React from 'react';
import { Link } from 'dva/router';
import { Menu, Row, Col, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

class LMenu extends React.Component{
  render(){
    return (
      <div>
        <Menu theme="dark"
              defaultOpenKeys={['sub1','sub2']}
              defaultSelectedKeys={['1']}
              mode="inline"
        >
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>学生数据</span></span>}>
            <Menu.Item key="1"><Link to={{pathname:'/StuList'}}>学生列表</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>群体数据</span></span>}>
            <Menu.Item key="2"><Link to={{pathname:'/sports1'}}>折返跑</Link></Menu.Item>
            <Menu.Item key="3"><Link to={{pathname:'/sports2'}}>纵跳摸高</Link></Menu.Item>
            <Menu.Item key="4"><Link to={{pathname:'/sports3'}}>仰卧起坐</Link></Menu.Item>
            <Menu.Item key="5"><Link to={{pathname:'/sports4'}}>换物跑</Link></Menu.Item>
            <Menu.Item key="6"><Link to={{pathname:'/sports5'}}>运球比赛</Link></Menu.Item>
            <Menu.Item key="7"><Link to={{pathname:'/sports6'}}>基础训练</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}

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
