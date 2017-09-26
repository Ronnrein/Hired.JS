import * as React from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Header, Icon } from "semantic-ui-react";
import { VerificationResult } from "../../store/Editor";

type Props = {
    result?: VerificationResult;
}

class EditorSuccess extends React.Component<Props, {}> {
    state = {
        closed: true,
    }

    componentWillReceiveProps(next: Props) {
        if(this.props.result === undefined && next.result !== undefined) {
            this.setState({ closed: false });
        }
    }

    onClose() {
        this.setState({ closed: true });
    }

    render() {
        if(this.props.result === undefined) {
            return null;
        }
        return (
            <Modal
                open={this.props.result.completed === this.props.result.tests && !this.state.closed}
                onClose={() => this.onClose()}
                closeIcon
            >
                <Header icon="checkmark" content="Assignment complete!" />
                <Modal.Content>
                    <p>Completed {this.props.result.completed} of {this.props.result.tests} tests</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button as={Link} to="/assignments" positive>
                        <Icon name="file text" />
                        Go to assignments
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default EditorSuccess;
