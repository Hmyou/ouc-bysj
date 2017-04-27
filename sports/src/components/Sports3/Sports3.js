import React from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import ClassS3 from './ClassS3';
import GradeS3 from './GradeS3';
import CompareS3 from './CompareS3';

class Sports3 extends React.Component{
  render = ()=>{
    return(<div style={{padding:15}}>
      <Tabs>
        <TabPane tab="按年级查看" key="1">
          <GradeS3 />
        </TabPane>
        <TabPane tab="按班级查看" key="2">
          <ClassS3 />
        </TabPane>
        <TabPane tab="班级间对比" key="3">
          <CompareS3 />
        </TabPane>
      </Tabs>
    </div>)
  }
}

export default Sports3;
