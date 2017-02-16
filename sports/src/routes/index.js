import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';

import MainLayout from '../layouts/MainLayout/MainLayout';
import NotFound from '../components/NotFound';
import StuList from '../components/StuList';
import GoodsCtrl from '../components/GoodsCtrl'
import { hashHistory } from 'react-router'

const Routes = (history) =>
  <Router history={hashHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={StuList}/>
      <Route path="stulist" component={StuList}></Route>
      <Route path="StuList" component={StuList}></Route>
      <Route path="addgoods" component={GoodsCtrl}></Route>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>



export default Routes;
