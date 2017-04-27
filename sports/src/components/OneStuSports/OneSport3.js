import React from 'react';
import moment from 'moment';
import { Row,Col,Form,DatePicker,Spin,Button,Select } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
import createG2 from 'g2-react';
import G2, { Stat,Plugin,Frame } from 'g2';

class OneSport3 extends React.Component {
  state = {
    loading:false,
    lineData:[]
  };
  componentDidMount = ()=>{
    this.ajaxData();
  };
  ajaxData = ()=>{
    this.setState({
      loading:true
    });
    setTimeout(()=>{
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
      this.setState({
        lineData: data,
        loading:false
      })
    },1000)
  };
  handleSearch = ()=>{
    this.props.form.validateFields((err, fieldsValue) => {
      if(err){
        console.log(err);
        return false;
      }else{
        this.setState({
          loading:true,
        });
        let value = {...fieldsValue};
        value['sDateRange'] = [
          fieldsValue['sDateRange'][0].format('YYYY-MM-DD'),
          fieldsValue['sDateRange'][1].format('YYYY-MM-DD')
        ]
        this.ajaxData();
      }
    });
  };
  //双Y轴趋势图配置
  Line = createG2(chart => {
    let Frame = G2.Frame;
    let frame = new Frame(this.state.lineData);
    chart.source(frame, {
      'num': {alias: '次数（个）', min: 0},
      'total_time': {alias: '训练时间（分钟）', min: 0}
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
    return <div>
      <Row>
        <Col span={8}>
          <FormItem {...formItemLayout} label="选择时间">
            {getFieldDecorator(`sDateRange`,{
              initialValue:[moment(new Date(new Date().getTime()-7*24*3600*1000)),moment(new Date())],
              rules:[{type:'array',required:true,message:'请选择时间'}]
            })(
              <RangePicker />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="数据筛选">
            {getFieldDecorator(`sType`,{
              initialValue:"1"
            })(
              <Select style={{width:"100%"}}>
                <Option value="1">全部数据</Option>
                <Option value="2">单天最大</Option>
                <Option value="3">单天平均</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <Button style={{marginLeft:"20px"}} size="large" type="primary" onClick={this.handleSearch}>搜索</Button>
        </Col>
      </Row>
      {this.state.loading && <div style={{textAlign:'center'}}>
        <Spin />
      </div>}
      {!this.state.loading  && <div>
        <this.Line
          data={this.state.lineData}
          width={500}
          height={400}
          forceFit={true}
        />
      </div>
      }
    </div>
  }
}

const OneSports3Form = Form.create()(OneSport3);
export default OneSports3Form;
