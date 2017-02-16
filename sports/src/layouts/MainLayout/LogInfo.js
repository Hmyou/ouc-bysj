import React from 'react';
import { Button } from 'antd';
import $ from 'jquery';
import cookie from 'react-cookie';


const LogInfo = React.createClass({
  getInitialState() {
    return {
      deptname:'',
      chinesename:'',
      loginname:''
    };
  },
  componentDidMount() {
    if(cookie.load('PAS_COOKIE_TICKET')){
      $.ajax({
        url:'http://iwan.addev.com/login/check',
        success: function(res){
          let r = JSON.parse(res);
          if(r.code=='100000'){
            this.setState({
              deptname:r.data.DeptName,
              chinesename:r.data.ChineseName,
              loginname:r.data.LoginName,
            })
          }
        }.bind(this)
      })
    }else{
      //根据url获取ticket设置上cookie
      var url = window.location.search;
      var ticketflag = 0;
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          if(strs[i].split('=')[0]=='ticket'){
            ticketflag = 1;
            var date=new Date();
            date.setTime(date.getTime()+24*3600*1000);
            cookie.save('PAS_COOKIE_TICKET',strs[i].split('=')[1],{expires:date,path: '/'});
            window.location.reload();
          }
        }
      }
      if(ticketflag==0){
        var hrf = window.location.origin+window.location.pathname;
        window.location.href = 'http://passport.oa.com/modules/passport/signin.ashx?url='+encodeURIComponent(hrf);
      }
    }
  },
  render(){
    const {style} = this.props;
    return(
      <div style={this.props.style}>
        <p>{this.state.deptname} {this.state.chinesename}(<span id="createName">{this.state.loginname}</span>)</p>
      </div>
    )
  }
})

export default LogInfo;
