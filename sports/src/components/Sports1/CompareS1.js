import React from 'react';
import moment from 'moment';
import { Button,Card,DatePicker,message,Select,Form,Col,Row,Radio,Spin } from 'antd';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import createG2 from 'g2-react';
import G2, { Stat,Plugin,Frame } from 'g2';

class CompareS1Form extends React.Component{
  state = {
    lineData: [
      {class:'班级一',date:' ',value:0},
      {class:'班级二',date:' ',value:0},
    ],
    searchloading:false,
    hideSearch:false,
    YItem:"1"
  };

  handleSearch = ()=>{
    this.props.form.validateFields((err, fieldsValue) => {
      if(err){
        console.log(err);
        return false;
      }else{
        this.setState({
          searchloading:true,
          YItem:fieldsValue['sItem']
        });
        let value = {...fieldsValue};
        value['sDateRange'] = [
          fieldsValue['sDateRange'][0].format('YYYY-MM-DD'),
          fieldsValue['sDateRange'][1].format('YYYY-MM-DD')
        ];
        setTimeout(()=>{
          this.setState({
            lineData: [
              {class:'一年一班',date:'2017-04-18',value:30},
              {class:'一年一班',date:'2017-04-19',value:35},
              {class:'一年一班',date:'2017-04-20',value:36},
              {class:'一年一班',date:'2017-04-21',value:31},
              {class:'一年一班',date:'2017-04-22',value:22},
              {class:'一年一班',date:'2017-04-23',value:26},
              {class:'一年一班',date:'2017-04-24',value:33},
              {class:'一年二班',date:'2017-04-18',value:20},
              {class:'一年二班',date:'2017-04-19',value:45},
              {class:'一年二班',date:'2017-04-20',value:26},
              {class:'一年二班',date:'2017-04-21',value:41},
              {class:'一年二班',date:'2017-04-22',value:12},
              {class:'一年二班',date:'2017-04-23',value:32},
              {class:'一年二班',date:'2017-04-24',value:23},
            ],
            searchloading:false
          })
        },1000)
      }
    });
  };

  //对比图配置
  Line = createG2(chart => {
    chart.source(this.state.lineData);
    chart.line().position('date*value').color('class').size(2);
    chart.col('value', {
      alias: this.state.YItem=="1"?'人均强度':'人均训练总时间（分钟）'
    });
    chart.render();
  });

  render = ()=>{
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return(<div>
      <Card title="搜索条件" extra={<Button type="primary" onClick={()=>{this.setState({hideSearch:!this.state.hideSearch})}}>{this.state.hideSearch?"显示条件":"隐藏条件"}</Button>}>
        <Form
          style={{display:this.state.hideSearch?"none":"block"}}
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="班级一">
                {getFieldDecorator(`sClass1`,{
                  rules: [
                    { required: true, message: '请选择班级一' },
                  ],
                })(
                  <Select placeholder="请选择班级" allowClear={true}>
                    <Option value="101">一年一班</Option>
                    <Option value="102">一年二班</Option>
                    <Option value="103">一年三班</Option>
                    <Option value="104">一年四班</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="班级二">
                {getFieldDecorator(`sClass2`,{
                  rules: [
                    { required: true, message: '请选择班级二' },
                  ],
                })(
                  <Select placeholder="请选择班级" allowClear={true}>
                    <Option value="101">一年一班</Option>
                    <Option value="102">一年二班</Option>
                    <Option value="103">一年三班</Option>
                    <Option value="104">一年四班</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="查询项目">
                {getFieldDecorator(`sItem`,{
                  initialValue:"1"
                })(
                  <Select>
                    <Option value="1">人均强度</Option>
                    <Option value="2">人均训练总时间</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="选择日期范围">
                {getFieldDecorator(`sDateRange`,{
                  initialValue:[moment(new Date(new Date().getTime()-7*24*3600*1000)),moment(new Date())],
                  rules:[{type:'array',required:true,message:'请选择日期范围'}]
                })(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="性别筛选">
                {getFieldDecorator(`sGender`,{
                  initialValue:"3"
                })(
                  <Select>
                    <Option value="3">全部</Option>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="btns" span={24} style={{ textAlign: 'center' }}>
              <Button onClick={()=>{this.props.form.resetFields()}} size="large">清除条件</Button>
              <Button type="primary" size="large" onClick={this.handleSearch} loading={this.state.searchloading}>搜索</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <div style={{width:'100%',height:6}}></div>
      <Card title="数据展示">
        {this.state.searchloading && <div style={{textAlign:'center'}}>
          <Spin />
        </div>}
        {!this.state.searchloading && <div>
          <this.Line
            data={this.state.lineData}
            width={500}
            height={400}
            forceFit={true}
          />
        </div>
        }
      </Card>
    </div>)
  }
}

const CompareS1 = Form.create()(CompareS1Form);
export default CompareS1;
