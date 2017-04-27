import React from 'react';
import moment from 'moment';
import { Button,Card,DatePicker,message,Select,Form,Col,Row,Radio,Spin } from 'antd';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import createG2 from 'g2-react';
import G2, { Stat,Plugin,Frame } from 'g2';

class GradeS3Form extends React.Component{
  state = {
    pieData: [],
    lineData: [],
    searchloading:false,
    searchType: "0",
    hideSearch:false
  };

  handleSearch = ()=>{
    this.props.form.validateFields((err, fieldsValue) => {
      if(err){
        console.log(err);
        return false;
      }else{
        this.setState({
          searchloading:true,
          searchType:fieldsValue['sType']
        });
        let value = {...fieldsValue};
        if(fieldsValue['sType']=="1"){
          value['sDate'] = fieldsValue['sDate'].format('YYYY-MM-DD')
        }
        else if(fieldsValue['sType']=="2"){
          value['sDateRange'] = [
            fieldsValue['sDateRange'][0].format('YYYY-MM-DD'),
            fieldsValue['sDateRange'][1].format('YYYY-MM-DD')
          ]
        }

        let data = [];
        for(let i=1;i<31;i++){
          data.push({
            id:i,
            stuid:'130200310'+i,
            total_time: 30+30*Math.random()-30*Math.random(),
            num: parseInt(i+100*Math.random()-10*Math.random()),
            time: '2017-03-'+i
          })
        }

        setTimeout(()=>{
          this.setState({
            pieData: [
              {class: '一年一班', value: 18 },
              {class: '一年二班', value: 28},
              {class: '一年三班', value: 30},
              {class: '一年四班',  value: 32},
              {class: '一年五班',  value: 12},
              {class: '一年六班',  value: 32},
              {class: '一年七班',  value: 22},
              {class: '一年八班',  value: 32},
            ],
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

  //饼图配置
  Pie = createG2(chart => {
    chart.coord('polar', {
      startAngle: Math.PI, // 起始角度
      endAngle: Math.PI * (3 / 2) // 结束角度
    });
    chart.axis('value', {
      labels: null
    });
    chart.axis('class', {
      gridAlign: 'middle',
      labels: {
        label: {
          textAlign: 'right' // 设置坐标轴 label 的文本对齐方向
        }
      }
    });
    chart.legend('class', {
      position: 'bottom',
      itemWrap: true // 图例需要换行
    });
    chart.interval().position('class*value')
      .color('class','rgb(252,143,72)-rgb(255,215,135)')
      .label('value',{offset: -15,label: {textAlign: 'center', fill: '#000'}})
      .style({
        lineWidth: 1,
        stroke: '#fff'
      });
    chart.render();
  });

  //折线图配置
  Line = createG2(chart => {
    chart.line().position('date*value').color('class').size(2);
    chart.axis('date', {
      title: null
    });
    chart.col('value', {
      alias: '班级平均个数'
    });
    chart.render();
  });

  render = ()=>{
    const { getFieldDecorator,getFieldValue } = this.props.form;
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
              <FormItem {...formItemLayout} label="搜索方式">
                {getFieldDecorator(`sType`,{initialValue:"1"})(
                  <RadioGroup size="large">
                    <RadioButton value="1" key="sType1">单天搜索</RadioButton>
                    <RadioButton value="2" key="sType2">范围搜索</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            {
              getFieldValue("sType")=="1" &&
              <Col span={8}>
                <FormItem {...formItemLayout} label="选择日期">
                  {getFieldDecorator(`sDate`,{
                    initialValue:moment(new Date()),
                    rules:[{type:'object',required:true,message:'请选择日期'}]
                  })(
                    <DatePicker />
                  )}
                </FormItem>
              </Col>
            }
            {
              getFieldValue("sType")=="2" &&
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
            }
            <Col span={8}>
              <FormItem {...formItemLayout} label="选择年级">
                {getFieldDecorator(`sGrade`,{
                  rules: [
                    { required: true, message: '请选择年级进行搜索' },
                  ],
                })(
                  <Select placeholder="请选择年级" allowClear={true}>
                    <Option value="101">一年级</Option>
                    <Option value="102">二年级</Option>
                    <Option value="103">三年级</Option>
                    <Option value="104">四年级</Option>
                  </Select>
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
        {!this.state.searchloading && this.state.searchType=="1" && <div>
          <this.Pie
            data={this.state.pieData}
            width={500}
            height={400}
            forceFit={true}
          />
        </div>
        }
        {!this.state.searchloading && this.state.searchType=="2" && <div>
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

const GradeS3 = Form.create()(GradeS3Form);
export default GradeS3;
