import * as React from "react";
import { Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import Editor from "./components/Editor";
import AssignmentList from "./components/AssignmentList";

export const routes = <Layout>
    <Route exact path="/" component={Home} />
    <Route path="/editor/:id?" component={Editor} />
    <Route path="/assignments" component={AssignmentList} />
</Layout>;
