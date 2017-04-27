import React from 'react';
import { Card,Form,Row,Col,Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import OneSport1 from './OneStuSports/OneSport1';
import OneSport2 from './OneStuSports/OneSport2';
import OneSport3 from './OneStuSports/OneSport3';

class OneStu extends React.Component {
  state = {
    tab:"1"
  };

  tabChange = (key)=>{
    this.setState({
      tab: key
    })
  };

  render = ()=>{
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return(<div>
      <Card title="学生信息">
        <Form className="ant-advanced-search-form">
          <Row gutter={40}>
            <Col span={4}>
              <FormItem {...formItemLayout} label="学校">
                中国海洋大学
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label="班级">
                四年一班
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label="学号">
                13020031029
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={4}>
              <FormItem {...formItemLayout} label="姓名">
                何珺
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label="性别">
                男
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label="年龄">
                22
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <div style={{width:"100%",height:"12px"}}></div>
      <Tabs type="card" onChange={this.tabChange}>
        <TabPane tab="折返跑" key="1">
          {this.state.tab=="1" && <OneSport1 />}
        </TabPane>
        <TabPane tab="纵跳摸高" key="2">
          {this.state.tab=="2" && <OneSport2 />}
        </TabPane>
        <TabPane tab="仰卧起坐" key="3">
          {this.state.tab=="3" && <OneSport3 />}
        </TabPane>
        <TabPane tab="换物跑" key="4">
        </TabPane>
        <TabPane tab="运球比赛" key="5">
        </TabPane>
        <TabPane tab="基础训练" key="6">
        </TabPane>
      </Tabs>
    </div>)
  }
}

export default  OneStu;
