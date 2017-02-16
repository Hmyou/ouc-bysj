import React from 'react';
import { Card,Table,Button,Select,Input } from 'antd';
import classNames from 'classnames';
import $ from 'jquery';
const InputGroup = Input.Group;
const Option = Select.Option;

const GoodsList = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchGame:"",
      searchName:"",
      focus:false,
      gamelist:[],
      datalist:[],
      total:"0",
      page:"1"
    };
  },
  ajaxData(page){
    let _this = this;
    this.setState({
      loading:true
    });
    $.ajax({
      url:"http://iwan.addev.com/goods/goodShows",
      type:"get",
      data:{
        page:page||"1",
        pageSize:15,
        GPlatformType:this.props.location.query.GPlatformType || "2",
        gameid:this.state.searchGame,
        goodsname:this.state.searchName
      },
      success:function(response,status){
        var res = JSON.parse(response);
        _this.setState({
          datalist:res.data.list,
          total:res.data.count,
          loading:false
        })
      }
    })
  },
  componentDidMount(){
    this.ajaxData(1);
  },
  componentDidUpdate(props,state){
    if(props.location.query.GPlatformType!==this.props.location.query.GPlatformType){
      this.ajaxData(1);
      this.setState({
        page:1
      })
    }
  },
  pageChange(e){
    this.ajaxData(e.current);
    this.setState({
      page:e.current
    })
  },
  handleInputChange(e) {
    this.setState({
      searchName: e.target.value,
    });
  },
  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  },
  handleSearch() {
    this.ajaxData();
  },
  selectChange(value){
    this.setState({
      searchGame:value
    })
  },
  onSearch(v){
    //搜索游戏
    $.ajax({
      url: 'http://iwan.addev.com/agame/sGameNew?keyword='+v,
      jsonp: 'jsonp',
      dataType: 'jsonp',
      success: function (res, status) {
        if(res.data){
          var arr = [];
          for(var p in res.data){
            arr.push(res.data[p])
          }
          this.setState({
            gamelist:arr
          })
        }
      }.bind(this)
    });
  },
  onSelect(value){
    this.setState({
      searchGame:value
    });
  },
  toH1(record,e){
    window.location.href = "http://iwan.addev.com/goods/searchlog?s="+record.Fid;
  },
  toH2(record,e){
    window.location.href = "http://iwan.addev.com/goods/log?id="+record.Fid;
  },
  ediGoods(record,e){
    let loc = window.location;
    window.location.href = loc.origin + loc.pathname + "#addgoods?Fid=" +record.Fid
  },
  render(){
//Table表头
    let _this = this;
    const columns = [{
      title: '物品编号',
      dataIndex: 'Fid',
      key: 'Fid',
    },{
      title: '物品名称',
      dataIndex: 'GName',
      key: 'GName',
    },{
      title: '物品分类',
      render: function(text,record){
        switch(record.GPlatformType){
          case "1": return "页游";
          case "2": return "手游";
          case "3": return "端游";
          default : return "";
        }
      }
    },{
      title:'发放形式',
      render:function(text,record){
        switch (record.GSort){
          case "7": return "ams形式";
          case "1": return "cdkey形式";
          case "5": return "mp(营销平台)";
          case "3": return "实物奖励";
          case "6": return "预留QQ";
          default: return "";
        }
      }
    },{
      title:'类别',
      render:function(text,record){
        switch (record.GType){
          case "1": return "游戏道具";
          case "5": return "每日礼包";
          case "6": return "抽奖物品";
          case "7": return "白名单";
          case "8": return "7日礼包";
          case "9": return "道具售卖";
          case "10": return "体育";
          case "11": return "奥运";
          default : return "";
        }
      }
    },{
      title:'游戏',
      dataIndex: 'FGameName',
      key: 'FGameName',
    },{
      title:'发放/总数',
      render:function(text,record){
        return record.GSTotal+"/"+record.GTotal;
      }
    },{
      title:'状态',
      render:function(text,record){
        switch (record.status){
          case "0": return "暂停";
          case "1": return "正常";
          case "2": return "测试";
          default : return "";
        }
      }
    },{
      title:'上传时间',
      dataIndex: 'ctime',
      key: 'ctime',
    },{
      title:'到期时间',
      dataIndex: 'GEnd',
      key: 'GEnd',
    },{
      title:'录入人',
      render:function(text,record){
        return record.GExt.createUser;
      }
    },{
      title:'操作',
      render(text,record){
        return <Button type='primary' size='small' onClick={_this.ediGoods.bind(this,record)}>编辑</Button>
      }
    },{
      title:'查看',
      render(text,record){
        return <div><Button type='primary' size='small'><a onClick={_this.toH1.bind(this,record)}>查看</a></Button> <Button type='primary' size='small'><a onClick={_this.toH2.bind(this,record)}>日发放</a></Button></div>
      }
    }];

    //根据不同GPlatformType配置不同信息
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.searchName.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });

    const GPlatformType = {
      1 : '页游',
      2 : '手游',
      3 : '端游'
    };
    const i = this.props.location.query.GPlatformType;
    return(
      <Card title={ i?GPlatformType[i]+'管理':'手游管理' }>
        <div style={{float:'right',marginBottom:14}}>
          <Select showSearch
                  style={{ width: 250 }}
                  placeholder="搜索游戏"
                  optionFilterProp="children"
                  notFoundContent="没有相关数据"
                  onSearch={this.onSearch}
                  onSelect={this.onSelect}
                  filterOption={false}
            >
            <Option value="">全部游戏</Option>
            {
              this.state.gamelist && this.state.gamelist.map((item,index)=>{
                return <Option value={item.FId}><span className="suggestID">[{item.FId}] </span> {item.FGameName}</Option>
              })
            }
          </Select>
          <div className="ant-search-input-wrapper" style={{width:250,marginLeft:20}}>
            <InputGroup className={searchCls}>
              <Input placeholder="请输入物品名称" value={this.state.searchName} onChange={this.handleInputChange}
                     onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
                />
              <div className="ant-input-group-wrap">
                <Button icon="search" className={btnCls} onClick={this.handleSearch} />
              </div>
            </InputGroup>
          </div>
        </div>
        <div className="clearfix"></div>
        <Table loading={this.state.loading} onChange={this.pageChange} className="add-css" columns={columns} dataSource={this.state.datalist} pagination={{current:this.state.page,pageSize:15,total:parseInt(this.state.total)}} bordered></Table>
      </Card>
    )
  }
})

export default GoodsList;
