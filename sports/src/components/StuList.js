import React from 'react';
import { Button,Card,Input,Select,Form,Col,Row,Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router';
import $ from 'jquery';


class StuList extends React.Component {
  state = {
    loading: false,
    list: [],
    total: 0,
    page: 1,
    focus: false,      //以下关于搜索
    search: ""
  };

  ajaxData = (page)=>{
    //3333333333333333333
    const _this = this;
    let arr = [];
    for(let i=1;i<32;i++){arr.push({id:i,name:'小明'+i,stuid:'130200310'+i,school:'青岛二中',class:'一年一班',sex:'男',age:18, key: i})}
    //3333333333333333333
    this.setState({
      loading:true
    });
    setTimeout(function(){
      _this.setState({
        list:arr,
        loading:false
      })
    },1000)
  }

  componentDidMount = ()=>{
    this.ajaxData(1);
  }

  pageChange = (e)=>{
    this.ajaxData(e.current);
    this.setState({
      page: e.current
    })
  }

  handleInputChange = (e)=>{
    this.setState({
      search: e.target.value,
    });
  }

  handleFocusBlur = (e)=>{
    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  handleSearch = ()=>{
    this.ajaxData();
  }

  render = ()=>{
//Table表头
    const columns = [{
      title: '学号',
      dataIndex: 'stuid',
      key: 'stuid',
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '学校',
      dataIndex:'school',
      key:'school'
    },{
      title:'班级',
      dataIndex:'class',
      key:'class'
    },{
      title:'性别',
      dataIndex:'sex',
      key:'sex'
    },{
      title:'年龄',
      dataIndex: 'age',
      key: 'age',
    },{
      title:'操作',
      key:'ctr',
      render(text,record){
        return <Link to={{pathname:'/OneStu',query:{id:record.id}}} key={record.id}><Button size='small' type="ghost">查看运动数据</Button></Link>
      }
    }];

    const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return(
      <div style={{padding:10}}>
        <Card title="搜索条件" extra={<Button type="primary" onClick={()=>{this.setState({hideSearch:!this.state.hideSearch})}}>{this.state.hideSearch?"显示条件":"隐藏条件"}</Button>}>
          <Form
            style={{display:this.state.hideSearch?"none":"block"}}
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
          >
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="学号/姓名">
                  {getFieldDecorator(`sInput`)(
                    <Input placeholder="输入学号或姓名搜索"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="选择班级">
                  {getFieldDecorator(`sClass`)(
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
                <Button type="primary" size="large" onClick={this.handleSearch} loading={this.state.loading}>搜索</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <div style={{width:"100%",height:"12px"}}></div>
        <Table loading={this.state.loading} onChange={this.pageChange} className="add-css" columns={columns} dataSource={this.state.list} pagination={{current:parseInt(this.state.page),pageSize:10,total:parseInt(this.state.total)}} bordered />
      </div>
    )
  }

}

const StuListForm = Form.create()(StuList);
export default StuListForm;
