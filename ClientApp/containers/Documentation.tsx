import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as DocumentationStore from "../store/Documentation";
import { default as DocumentationComponent } from "../components/documentation/Documentation";

type DocumentationProps =
    DocumentationStore.DocumentationState
    & typeof DocumentationStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Documentation extends React.Component<DocumentationProps, {}> {
    componentWillMount() {
        this.props.requestDocumentation();
    }

    public render() {
        return (
            <DocumentationComponent documentations={this.props.documentations} />
        );
    }
}

export default connect(
    (state: ApplicationState) => state.documentation,
    DocumentationStore.actionCreators
)(Documentation);
