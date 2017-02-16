import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Card,Form,Input,Tabs,Checkbox,Upload,Button,Icon,message,Select,Tooltip,Switch,DatePicker,Col,Radio,Modal,TimePicker } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

let GoodsCtrl = React.createClass({
  getInitialState(){
    return{
      data:[],   //搜索游戏自动补全
      changeData:null,    //新增or修改
      kindskey:'7',      //上方选项卡
      // ams自动填写涉及到的数据
      startDate:"",
      endDate:"",
      Gtime:"",
      limitRadio:'1',   //领取限制的Radio
      limitNum:'1',     //领取限制每日个数
      goodsName:'',
      goodsNum:'',
      goodsIntro:'',
      //Checkbox和Radio和Select关联的隐藏input
      GIsTao:false,
      GSType:'1',
      reserveTelephone:true,
      reservesPlat:true,
      androidapp:true,
      GPlatformType:"",
      GGameId:"",
      btndis:false    //保存按钮禁用，点击一次后等接口返回在开启
    }
  },
  componentDidMount(){
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };
    //如果是修改页面，将state中的changeData设置上
    if(this.props.location.query.Fid){
      let _this = this;
      $.ajax({
        url:"http://iwan.addev.com/goods/show?id="+this.props.location.query.Fid,
        async:false,
        success:function(response,status){
          if(response.indexOf("没有权限")>=0){
            alert("您没有权限操作"+_this.props.location.query.Fid);
            window.location.href="http://iwan.addev.com/goodsManage/dist/index.html";
            return;
          }
          let iValue = JSON.parse(response).data;
          _this.setState({
            changeData:iValue,
            kindskey:iValue.GSort,
            startDate:iValue.GStart,
            endDate:iValue.GEnd,
            Gtime:iValue.Gtime,
            limitRadio:iValue.GAccount,
            limitNum:iValue.GZLimit,
            goodsName:iValue.GName,
            goodsNum:iValue.GTotal,
            goodsIntro:iValue.GIntro.replace(/<br>|<br \/>|<br\/>/g,"\r\n"),
            GIsTao:iValue.GIsTao=='1',
            GSType:iValue.GSType,
            reserveTelephone:iValue.GExt.reserveTelephone=='1',
            reservesPlat:iValue.GExt.reservesPlat=='1',
            androidapp:iValue.GExt.androidapp=='1',
            GPlatformType:iValue.GPlatformType,
            GGameId:iValue.GGameId
          })
        }
      })
    }
    //通过接口获取要修改的数据，然后修改
    //设置完changeData后要单独设置的state 在initialState里之下的全部
  },
  amsInput(){
    var intext = $('.get-input').val();
    try{
      //添入参数的截断
      //IEGAMS-18483-112871&132169(单号&礼包组)
      var activityId = intext.split('-')[1];
      var moduleId = intext.split('-')[2].split('&')[0];
      var groupId = intext.split('-')[2].split('&')[1];

      $.ajax({
        url:'http://iwan.addev.com/redirect/geInterfaceData?url="http://10.153.96.69/cgi-bin/module/lottery/v2.0/lottery_backend/lotteryadmintools.cgi?iSubmit=getbasicInfo|iModuleId='+moduleId+'"&host=ams.ied.com',
        async:false,  //两个ajax都结束后给出自动填写结果提示，以下一个请求结束为准，故此ajax同步
        success:function(result,status){
          let res = JSON.parse(result);
          //自动填写起止时间
          this.setState({
            startDate:res.basicInfo.dtBeginTime,
            endDate:res.basicInfo.dtEndTime
          })
        }.bind(this)
      });
      $.ajax({
        url:'http://iwan.addev.com/redirect/geInterfaceData?url="http://10.153.96.69/cgi-bin/module/lottery/v2.0/lottery_backend/lotteryadmintools.cgi?iSubmit=queryAllPackageInfo|iAMSActivityId='+activityId+'|iModuleId='+moduleId+'"&host=ams.ied.com',
        success:function(result,status){
          result = decodeURIComponent(result);
          let res = JSON.parse(result);
          let groupList = res.AllInfo;
          for(let i=0,l=groupList.length;i<l;i++){
            if(groupId==groupList[i].sGroupId){
              var item = groupList[i];
              break;
            }
          }
          try {
            //自动填写总量，礼包名
            item.allnum = item.packageList[0].sPackageControlInfo.split('|')[4];
            this.setState({
              goodsNum: item.allnum,
              goodsName: item.sGroupName
            })
            //自动填写日/周/总领取限制
            let plist = item.packageList[0];
            item.daynum = plist.sPackageControlPerUinInfo.split('|')[1];
            item.weeknum = plist.sPackageControlPerUinInfo.split('|')[2];
            item.allpernum = plist.sPackageControlPerUinInfo.split('|')[4];
            let limitstr = '；';
            if (item.allpernum == '1') {
              this.setState({
                limitRadio: '2'
              });
              limitstr += '单帐号仅能领取1次';
            } else if (item.weeknum == '1') {
              this.setState({
                limitRadio: '3'
              });
              limitstr += '单帐号本周仅能领取1次';
            } else {
              this.setState({
                limitRadio: '1',
                limitNum: item.daynum
              });
              limitstr = limitstr + '单帐号日限制' + item.daynum;
            }
            //自动填写物品名称
            let introStr = "";
            if(item.iTypeForShippingPackageGroup=="抽奖"){
              introStr += "随机发放以下道具之一：\r\n";
            }
            $.each(item.packageList,function(i,v){
              $.each(v.itemList,function(i,el){
                let num = el.iItemCount;
                let name = el.itemName;
                introStr = introStr + name+"*"+num+"\r\n";
              })
            });
            //let ilist = item.packageList[0].itemList;
            //for(let i=0,l=ilist.length;i<l;i++){
            //  let num = ilist[i].iItemCount;
            //  let name = ilist[i].itemName;
            //  introStr = introStr + name+'*'+num+'\r\n';
            //}
            this.setState({
              goodsIntro: introStr
            });
            Modal.success({
              title: '自动填写成功',
              content: '填写数据有：礼包名称：' + item.sGroupName + '；起止时间：' + this.state.startDate + '至' + this.state.endDate + '；礼包总数：' + item.allnum + limitstr + '；物品说明：' + introStr
            })
          }catch(err){console.log(err);Modal.error({
            title: "自动填写失败",
            content:"填入参数获取不到礼包信息"
          })}
        }.bind(this)
      })
    }catch(err){console.log(err);Modal.error({
      title: "自动填写失败",
      content:"参数格式不合样例规则。例如：IEGAMS-18483-112871&132169(单号&礼包组)"
    })}
  },
  handleSubmit(e){
    let _this = this;
    e.preventDefault();
    this.setState({
      btndis:true
    });
    //表单完整性验证
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        _this.setState({
          btndis:false
        });
        return;
      }
      var formData = new FormData($('#postForm')[0]);
      if(this.props.location.query.Fid){
        formData.append("id",this.props.location.query.Fid); //修改 加上FId参数
      }
      let gIntro = this.state.goodsIntro.replace(/\n|\r\n/g,"<br />");
      formData.append("GIntro",gIntro);
      formData.append("GYScore",values.GPrice*1000); //原积分=价值*1000
      formData.append("GFuliintro",values.GTips); //福利箱子信息 = 弹窗信息 （实物奖励）
      formData.append("admin_rtx",$("#createName").text());
      const infoModal = Modal.info({
        title: '保存数据中...',
      });
      $.ajax({
        url: 'http://iwan.addev.com/goods/editGood' ,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          infoModal.destroy();
          var res = JSON.parse(response);
          if(res.error=='成功'){
            Modal.success({
              title: '保存成功',
              onOk:function(){
                window.location.href = "http://iwan.addev.com/goodsManage/dist/index.html#/goodslist?GPlatformType="+_this.state.GPlatformType;
              }
            });
            _this.setState({
              btndis:false
            });
          }else{
            Modal.error({
              title: "保存失败",
              content: res.error
            });
            _this.setState({
              btndis:false
            });
          }
        },
        error: function (response) {
          Modal.error({
            title: "保存失败",
            content: response
          });
          _this.setState({
            btndis:false
          });
        }
      })
    });
  },
  onSearch(v){
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
            data:arr
          })
        }
      }.bind(this)
    });
  },
  onChange(value){
    let vArr = value.split('*');
    this.setState({
      GGameId:vArr[0],
      GPlatformType:vArr[1]
    });
  },
  render(){
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
    };
    const iValue = this.state.changeData;
    return(<Card title={iValue?"修改物品":"新增物品"}>
      <Form id="postForm">
        <Tabs activeKey={this.state.kindskey} onChange={key=>this.setState({kindskey:key})}>
          <TabPane tab="ams形式" key="7">
            <FormItem
              {...formItemLayout}
              label="参数"
              help="例如：IEGAMS-18483-112871&132169(单号&礼包组)"
              >
              <Input
                className="get-input"
                name="GParam3"
                {...getFieldProps('GParam3',this.state.kindskey=='7'?{
                  rules:[
                    {required:true,message:'请填写参数'}
                  ],
                  initialValue:iValue&&this.state.kindskey=='7'?iValue.GParam:""
                }:{initialValue:iValue&&this.state.kindskey=='7'?iValue.GParam:""})}
                />
              <Button onClick={this.amsInput}
                      style={{position:'absolute',top:0,left:'100%',marginLeft:14}}>快速填写</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="说明文字"
              >
              <Input
                name="IdipIntro3"
                {...getFieldProps('IdipIntro3',this.state.kindskey=='7'?{
                  rules:[
                    {required:true,message:'请填写说明文字'}
                  ],
                  initialValue:iValue&&this.state.kindskey=='7'?iValue.IdipIntro:""
                }:{initialValue:iValue&&this.state.kindskey=='7'?iValue.IdipIntro:""})}
                />
            </FormItem>
          </TabPane>
          <TabPane tab="cdkey形式" key="1">
            <FormItem
              {...formItemLayout}
              label="淘号"
              >
              <Checkbox defaultChecked={this.state.GIsTao} onChange={e=>this.setState({GIsTao:e.target.checked})}></Checkbox>
              {this.state.GIsTao && <input type="hidden" name="GIsTao" value="1"/>}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上传cdkey"
              help="（csv文件）"
              >
              <input type="file" name="cdkFile" className="ant-btn ant-btn-ghost file-input"/>
            </FormItem>
          </TabPane>
          <TabPane tab="mp(营销平台)" key="5">
            <FormItem
              {...formItemLayout}
              label="参数"
              help="例如：MA20130322163937576&PID21458130322164019717&DNFHZ"
              >
              <Input
                name="GParam1"
                {...getFieldProps('GParam1',this.state.kindskey=='5'?{
                  rules:[
                    {required:true,message:'请填写参数'}
                  ],
                  initialValue:iValue&&this.state.kindskey=='5'?iValue.GParam:""
                }:{initialValue:iValue&&this.state.kindskey=='5'?iValue.GParam:""})}
                />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="说明文字"
              >
              <Input
                name="IdipIntro1"
                {...getFieldProps('IdipIntro1',this.state.kindskey==5?{
                  rules:[
                    {required:true,message:'请填写说明文字'}
                  ],
                  initialValue:iValue&&this.state.kindskey=='5'?iValue.IdipIntro:""
                }:{initialValue:iValue&&this.state.kindskey=='5'?iValue.IdipIntro:""})}
                />
            </FormItem>
            <FormItem
              >
              <Col span="3"></Col>
              <RadioGroup defaultValue={this.state.GSType} onChange={e=>this.setState({GSType:e.target.value})}>
                <Radio style={{display:'block'}} key="1" value='1'>直接发送到QQ账号（红钻/黄钻/1个月会员）</Radio>
                <Radio style={{display:'block'}} key="2" value='2'>线上cdkey</Radio>
                <Radio style={{display:'block'}} key="3" value='3'>游戏cdkey（有区服）</Radio>
                <Radio style={{display:'block'}} key="7" value='7'>游戏cdkey（无区服,适用：tnt游戏）</Radio>
              </RadioGroup>
              {(this.state.GSType=='1'||this.state.GSType=='2'||this.state.GSType=='3'||this.state.GSType=='7') &&
              <input type="hidden" name="GSType" value={this.state.GSType}/>
              }
            </FormItem>
          </TabPane>
          <TabPane tab="实物奖励" key="3">
            <FormItem
              {...formItemLayout}
              label="弹窗信息"
              >
              <Input
                {...getFieldProps('GTips',this.state.kindskey=='3'?{
                  rules:[
                    {required:true,message:'请填写弹窗信息'}
                  ],
                  initialValue:iValue?iValue.GTips:""
                }:{initialValue:iValue?iValue.GTips:""})}
                /><span className="red-help">适用预留QQ,实物，出现在iwan 福利箱</span>
            </FormItem>
          </TabPane>
          <TabPane tab="预约" key="6">
            <FormItem
              labelCol={{span:3}}
              wrapperCol={{span:16}}
              label="预留"
              >
              <Checkbox defaultChecked={this.state.reserveTelephone} onChange={e=>this.setState({reserveTelephone:e.target.checked})}>预留手机号</Checkbox>
              <Checkbox defaultChecked={this.state.reservesPlat} onChange={e=>this.setState({reservesPlat:e.target.checked})}>平台</Checkbox>
              <Checkbox defaultChecked={this.state.androidapp} onChange={e=>this.setState({androidapp:e.target.checked})}>push应用宝</Checkbox>
              {this.state.reserveTelephone && <input type="hidden" name="reserveTelephone" value="1"/>}
              {this.state.reservesPlat && <input type="hidden" name="reservesPlat" value="1"/>}
              {this.state.androidapp && <input type="hidden" name="androidapp" value="1"/>}
            </FormItem>
          </TabPane>
        </Tabs>
        <input type="hidden" name="GSort" value={this.state.kindskey}/>
        <input type="hidden" name="GTips" value={getFieldProps('GTips').value||""}/>
        <div className="line"></div>
        <FormItem
          {...formItemLayout}
          label="关注人RTX"
          >
          <Input
            name="attentionUser"
            {...getFieldProps('attentionUser',{initialValue:iValue?iValue.GExt.attentionUser:""})}
            type="textarea"
            />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
          >
          <Select {...getFieldProps('status',{initialValue:iValue?iValue.status:"2"})}>
            <Option value="2">测试</Option>
            <Option value="1">正常</Option>
            <Option value="0">暂停</Option>
          </Select>
          <input type="hidden" name="status" value={getFieldProps('status').value}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="测试QQ"
          help='线上测试专用,QQ用","分割 例如 439884988,123456'
          className="help-box"
          >
            <Input
              name="GTest"
              {...getFieldProps('GTest',{initialValue:iValue?iValue.GTest:""})}
              />
            <Tooltip title='线上测试专用,QQ用","分割 例如 439884988,123456' trigger='hover' placement="top">
              <Icon type="question-circle-o" className="input-help" />
            </Tooltip>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否输入验证码"
          >
          <Switch checkedChildren="是" unCheckedChildren="否" {...getFieldProps('GVcode',{initialValue:iValue?(iValue.GVcode==1):false,valuePropName:'checked'})} />
          {getFieldProps('GVcode').value && <input type="hidden" name="GVcode" value="1"/>}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="QQ号质量判断"
          >
          <Checkbox
            {...getFieldProps('GQqLevel',{valuePropName:'checked',initialValue:iValue?(iValue.GQqRule.GQqLevel==1):false})}
            >
            QQ 等级 <Input style={{width:60}} disabled={!getFieldProps('GQqLevel').value} name="GQqLevelValue"
            {...getFieldProps('GQqLevelValue',{initialValue:iValue?iValue.GQqRule.GQqLevelValue:""})}
            /> 级以上
            {getFieldProps('GQqLevel').value&& <input type="hidden" name="GQqLevel" value="1"/>}
          </Checkbox>
          <br/>
          <Checkbox
            {...getFieldProps('GQqAge',{valuePropName:'checked',initialValue:iValue?(iValue.GQqRule.GQqAge==1):false})}
            >
            QQ 年龄 <Input style={{width:60}} disabled={!getFieldProps('GQqAge').value} name="GQqAgeValue"
            {...getFieldProps('GQqAgeValue',{initialValue:iValue?iValue.GQqRule.GQqAgeValue:""})}/> 年以上
            {getFieldProps('GQqAge').value&& <input type="hidden" name="GQqAge" value="1"/>}
          </Checkbox>
          <br/>
          <Checkbox {...getFieldProps('GQqVip',{valuePropName:'checked',initialValue:iValue?(iValue.GQqRule.GQqVip==1):false})}>会员</Checkbox>
          {getFieldProps('GQqVip').value&& <input type="hidden" name="GQqVip" value="1"/>}
          <Checkbox {...getFieldProps('GQqSVip',{valuePropName:'checked',initialValue:iValue?(iValue.GQqRule.GQqSVip==1):false})}>超级会员</Checkbox>
          {getFieldProps('GQqSVip').value&& <input type="hidden" name="GQqSVip" value="1"/>}
          <br/>
          不满足条件提示语： <Input style={{width:350}} name="GQqTips" {...getFieldProps('GQqTips',{initialValue:iValue?iValue.GQqRule.GQqTips:'您未满足领取条件'})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="好莱坞等级"
          >
          <Select {...getFieldProps('filmLevel',{initialValue:iValue?iValue.GExt.filmLevel:"0"})}>
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
          </Select>
          <input type="hidden" name="filmLevel" value={getFieldProps('filmLevel').value}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="自定义提示（选填）"
          >
          <Input style={{marginBottom:10}} name="errorcode100000" {...getFieldProps('errorcode100000',{initialValue:iValue?iValue.GExt.errorcode[100000]:" "})}/><span className="red-help">领取成功提示文案</span>
          <Input style={{marginBottom:10}} name="errorcode100003" {...getFieldProps('errorcode100003',{initialValue:iValue?iValue.GExt.errorcode[100003]:"今天已经领过啦~"})}/><span className="red-help" style={{top:42}}>单日仅能领取一次的礼包错误提示</span>
          <Input style={{marginBottom:10}} name="errorcode100004" {...getFieldProps('errorcode100004',{initialValue:iValue?iValue.GExt.errorcode[100004]:"您已经领过啦"})}/><span className="red-help" style={{top:84}}>单帐号仅能领取一次的礼包错误提示</span>
        </FormItem>
        <div className="line"></div>
        <FormItem
          {...formItemLayout}
          label="物品名称"
          required
          >
          <Input className="get-name"
                 name="GName"
                 value={this.state.goodsName}
                 onChange={e=>this.setState({goodsName:e.target.value})}
            />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="物品类别"
          >
          <Select {...getFieldProps('GType',{initialValue:iValue?iValue.GType:"1"})}>
            <Option value="1">游戏道具</Option>
            <Option value="6">抽奖物品</Option>
            <Option value="7">白名单</Option>
            <Option value="9">道具售卖</Option>
            <Option value="8">七日签到礼包</Option>
            <Option value="10">体育</Option>
            <Option value="11">奥运</Option>
          </Select>
          <input type="hidden" name="GType" value={getFieldProps('GType').value}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="属于游戏"
          >
          {
            iValue &&
            <div><span className="suggestID">[{iValue.GGameId}] </span> {iValue.FGameName}</div>
          }
          <Select showSearch
                  placeholder="搜索游戏"
                  optionFilterProp="children"
                  notFoundContent="没有相关数据"
                  onSearch={this.onSearch}
                  onChange={this.onChange}
                  filterOption={false}
                  allowClear
            >
            { this.state.data &&
            this.state.data.map((d) => {
              return <Option value={d.FId+'*'+d.GPlatformType}><span className="suggestID">[{d.FId}] </span> {d.FGameName}</Option>;
            })
            }
          </Select>
          <input type="hidden" name="GGameId" value={this.state.GGameId}/>
          <input type="hidden" name="GPlatformType" value={this.state.GPlatformType}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="价值"
          >
          <Input
            name="GPrice"
            {...getFieldProps('GPrice',{
              rules:[
                {required:true,message:'请填写物品价值'}
              ],
              initialValue:iValue?iValue.GPrice:""
            })}
            addonAfter="Q 币"
            />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="积分"
          >
          <Input
            name="GScore"
            {...getFieldProps('GScore',{
              rules:[
                {required:true,message:'请填写积分'}
              ],
              initialValue:iValue?iValue.GScore:""
            })}
            />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="起止时间"
          required
          >
          <Col span="8">
            <FormItem>
              <DatePicker format="yyyy-MM-dd" placeholder="请选择开始时间" value={this.state.startDate} onChange={value=>this.setState({startDate:value.Format("yyyy-MM-dd")})}/>
              <input type="hidden" name="GStart" value={this.state.startDate}/>
            </FormItem>
          </Col>
          <Col span="1">
            <p className="ant-form-split">-</p>
          </Col>
          <Col span="8">
            <FormItem>
              <DatePicker format="yyyy-MM-dd" placeholder="请选择结束时间" value={this.state.endDate} onChange={value=>this.setState({endDate:value.Format("yyyy-MM-dd")})}/>
              <input type="hidden" name="GEnd" value={this.state.endDate}/>
            </FormItem>
          </Col>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="每日发放时间"
          >
          <TimePicker value={this.state.Gtime} onChange={(time,timeString)=>this.setState({Gtime:timeString})} />
          <input type="hidden" name="Gtime" value={this.state.Gtime}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="发放总量"
          required
          >
          <Col span="6">
            <FormItem>
              <Input className="get-allnum" name="GTotal" value={this.state.goodsNum} onChange={e=>this.setState({goodsNum:e.target.value})}/>
            </FormItem>
          </Col>
          <Col span="2" style={{marginLeft:20}}>
            <p className="ant-form-split">已发：</p>
          </Col>
          <Col span="6">
            <FormItem className="help-box">
              <Input disabled name="GSTotal" {...getFieldProps('GSTotal',{initialValue:iValue?iValue.GSTotal:0})}/>
              <input type="hidden" name="GSTotal" value={iValue?iValue.GSTotal:""}/>
              <Tooltip title='对外展示数量 = 已发*123' trigger='hover' placement="top">
                <Icon type="question-circle-o" className="input-help" />
              </Tooltip>
            </FormItem>
          </Col>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="每日库存"
          >
          <Input name="GKLimit"
            {...getFieldProps('GKLimit',{
              rules:[
                {required:true,message:'请填写每日库存'}
              ],
              initialValue:iValue?iValue.GKLimit:""
            })}
            />
        </FormItem>
        <FormItem>
          <Col span="3"></Col>
          <RadioGroup className="get-radio" value={this.state.limitRadio} onChange={e=>this.setState({limitRadio:e.target.value})}>
            <Radio style={{display:'block'}} key="1" value='1'>单帐号日限制 <Input name="GZLimit" className="get-daynum" value={this.state.limitNum} onChange={e=>this.setState({limitNum:e.target.value})} style={{width:50}}/>（填0则为无限制）</Radio>
            <Radio style={{display:'block'}} key="2" value='2'>单帐号仅能领取1次</Radio>
            <Radio style={{display:'block'}} key="3" value='3'>单帐号本周仅能领取1次</Radio>
          </RadioGroup>
          <input type="hidden" name="GAccount" value={this.state.limitRadio}/>
        </FormItem>
        <FormItem
          labelCol={{span:3}}
          wrapperCol={{span:16}}
          label="发放平台"
          required
          >
          <Checkbox {...getFieldProps('GPlatform1',{initialValue:iValue?(iValue.GPlatform.indexOf('1')>-1):false,valuePropName:'checked'})}>PC(电脑)</Checkbox>
          <Checkbox {...getFieldProps('GPlatform2',{initialValue:iValue?(iValue.GPlatform.indexOf('2')>-1):false,valuePropName:'checked'})}>移动端活动</Checkbox>
          <Checkbox {...getFieldProps('GPlatform3',{initialValue:iValue?(iValue.GPlatform.indexOf('3')>-1):false,valuePropName:'checked'})}>爱玩APP（安卓）</Checkbox>
          <Checkbox {...getFieldProps('GPlatform5',{initialValue:iValue?(iValue.GPlatform.indexOf('5')>-1):false,valuePropName:'checked'})}>新闻APP 安卓</Checkbox>
          <Checkbox {...getFieldProps('GPlatform6',{initialValue:iValue?(iValue.GPlatform.indexOf('6')>-1):false,valuePropName:'checked'})}>新闻APP IOS</Checkbox>
          <Checkbox {...getFieldProps('GPlatform8',{initialValue:iValue?(iValue.GPlatform.indexOf('8')>-1):false,valuePropName:'checked'})}>视频APP 安卓</Checkbox>
          <Checkbox {...getFieldProps('GPlatform9',{initialValue:iValue?(iValue.GPlatform.indexOf('9')>-1):false,valuePropName:'checked'})}>视频APP IOS</Checkbox>
          {getFieldProps('GPlatform1').value && <input type="hidden" name="GPlatform1" value="1"/>}
          {getFieldProps('GPlatform2').value && <input type="hidden" name="GPlatform2" value="2"/>}
          {getFieldProps('GPlatform3').value && <input type="hidden" name="GPlatform3" value="3"/>}
          {getFieldProps('GPlatform5').value && <input type="hidden" name="GPlatform5" value="5"/>}
          {getFieldProps('GPlatform6').value && <input type="hidden" name="GPlatform6" value="6"/>}
          {getFieldProps('GPlatform8').value && <input type="hidden" name="GPlatform8" value="8"/>}
          {getFieldProps('GPlatform9').value && <input type="hidden" name="GPlatform9" value="9"/>}
        </FormItem>
        <div className="line"></div>
        <FormItem
          {...formItemLayout}
          label="图片地址1"
          >
          <Input name="GPicUrl"
            {...getFieldProps('GPicUrl',{
              rules:[
                {required:true,message:'请填写图片地址'}
              ],
              initialValue:iValue?iValue.GPicUrl:""
            })}
            /><span className="red-help">大小 50*50</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图片地址2"
          >
          <Input name="GPicUrl1"
            {...getFieldProps('GPicUrl1',{
              rules:[
                {required:true,message:'请填写图片地址'}
              ],
              initialValue:iValue?iValue.GPicUrl1:""
            })}
            /><span className="red-help">大小 210*142</span>
        </FormItem>
        <FormItem
        {...formItemLayout}
        label="物品兑换地址"
        >
        <Input name="GUrl"
          {...getFieldProps('GUrl',{
            initialValue:iValue?iValue.GUrl:""
          })}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="物品说明"
          required
          >
          <Input value={this.state.goodsIntro} onChange={e=>this.setState({goodsIntro:e.target.value})} type="textarea"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="帐号说明"
          >
          <Input name="GAccountIntro"
            {...getFieldProps('GAccountIntro',{
              initialValue:iValue?iValue.GExt.GAccountIntro:""
            })}
            type="textarea"
            />
        </FormItem>
        <div className="line"></div>
        <FormItem wrapperCol={{ span: 20, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" onClick={this.handleSubmit} loading={this.state.btndis}>保存</Button>
        </FormItem>
      </Form>
    </Card>)
  }
});

GoodsCtrl = createForm()(GoodsCtrl);
export default GoodsCtrl;
