import React from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import ClassS1 from './ClassS1';
import GradeS1 from './GradeS1';
import CompareS1 from './CompareS1';

class Sports1 extends React.Component{
  render = ()=>{
    return(<div style={{padding:15}}>
      <Tabs>
        <TabPane tab="按年级查看" key="1">
          <GradeS1 />
        </TabPane>
        <TabPane tab="按班级查看" key="2">
          <ClassS1 />
        </TabPane>
        <TabPane tab="班级间对比" key="3">
          <CompareS1 />
        </TabPane>
      </Tabs>
    </div>)
  }
}

export default Sports1;
