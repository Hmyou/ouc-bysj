import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import MainLayout from './layouts/MainLayout';
import StuList from './components/StuList';
import OneStu from './components/OneStu';
import Sports1 from './components/Sports1/Sports1';
import Sports3 from './components/Sports3/Sports3';
import NotFound from './components/NotFound/NotFound';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={MainLayout}>
        <IndexRoute components={StuList} />
        <Route path="StuList" components={StuList} />
        <Route path="OneStu" components={OneStu} />
        <Route path="Sports1" components={Sports1} />
        <Route path="Sports3" components={Sports3} />
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  );
}

export default RouterConfig;
