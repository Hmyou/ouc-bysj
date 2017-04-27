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

class ClassS1Form extends React.Component{
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
        for(let i=1;i<=31;i++){
          data.push({
            id:i,
            stuid:'130200310'+i,
            total_time: 30+30*Math.random()-30*Math.random(),
            num: parseInt(i+100*Math.random()-10*Math.random()),
            time: '2017-03-'+i
          })
        }
        for(let i=1;i<=30;i++){
          data.push({
            id:i,
            stuid:'130200310'+i,
            total_time: 30+30*Math.random()-30*Math.random(),
            num: parseInt(i+100*Math.random()-10*Math.random()),
            time: '2017-04-'+i
          })
        }

        setTimeout(()=>{
          this.setState({
            pieData: [
              {name: '0-10个', value: 1 },
              {name: '11-30个', value: 10},
              {name: '31-70个', value: 12},
              {name: '71-100个',  value: 14},
              {name: '101-150个', value: 3},
              {name: '151个以上', value: 1}
            ],
            lineData: data,
            searchloading:false
          })
        },1000)
      }
    });
  };

  //饼图配置
  Pie = createG2(chart => {
    chart.coord('theta', {
      radius: 0.8 // 设置饼图的大小
    });
    chart.legend('name', {
      position: 'bottom'
    });
    chart.tooltip({
      title: null,
      map: {
        value: 'value'
      }
    });
    chart.intervalStack()
      .position(Stat.summary.percent('value'))
      .color('name')
      .label('name*..percent',function(name, percent){
        percent = (percent * 100).toFixed(2) + '%';
        return name + ' ' + percent;
      });
    chart.render();
    // 设置默认选中
    let geom = chart.getGeoms()[0]; // 获取所有的图形
    let items = geom.getData(); // 获取图形对应的数据
    geom.setSelected(items[1]); // 设置选中
  });

  //双Y轴趋势图配置
  Line = createG2(chart => {
    let Frame = G2.Frame;
    let frame = new Frame(this.state.lineData);
    chart.source(frame, {
      'num': {alias: '人均次数（个）', min: 0},
      'total_time': {alias: '人均训练总时间（分钟）', min: 0}
    });
    // 去除 X 轴标题
    chart.axis('time', {
      title: null
    });
    chart.legend(false);// 不显示图例
    chart.intervalStack().position('time*num').color('num', ['#348cd1']); // 绘制层叠柱状图
    chart.line().position('time*total_time').color('#5ed470').size(2).shape('smooth'); // 绘制曲线图
    chart.point().position('time*total_time').color('#5ed470'); // 绘制点图
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
              <FormItem {...formItemLayout} label="选择班级">
                {getFieldDecorator(`sClass`,{
                  rules: [
                    { required: true, message: '请选择班级进行搜索' },
                  ],
                })(
                  <Select placeholder="请选择班级" allowClear={true}>
                    <Option value="1001">一年一班</Option>
                    <Option value="1002">一年二班</Option>
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
          <span style={{position:'absolute',top:70,left:20}}>数据为所做强度人数分布图</span>
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

const ClassS1 = Form.create()(ClassS1Form);
export default ClassS1;
