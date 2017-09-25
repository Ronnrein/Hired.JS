import * as React from "react";
import { Label, Button, Popup, Input } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";

type Props = {
    assignment: Assignment;
    onRunClick: Function;
    onVerifyClick: Function;
    addToConsole: Function;
}

class EditorForm extends React.Component<Props, {}> {
    state = {
        arguments: Array()
    };

    componentDidMount() {
        this.setState({
            arguments: Array(this.props.assignment.arguments.length).fill("")
        });
    }

    onArgumentChange(argument: number, value: string) {
        let args = this.state.arguments;
        args[argument] = value;
        this.setState({
            arguments: args
        });
    }

    onRunClick() {
        if (this.state.arguments.indexOf("") !== -1) {
            this.props.addToConsole("Please set arguments to run function");
            return;
        }

        this.props.onRunClick(this.state.arguments);
    }

    render() {
        return (
            <div id="run-input">
                <Label size="large">console.log({this.props.assignment.function}(</Label>
                {this.generateFields()}
                <Label size="large">));</Label>
                <Button positive onClick={() => this.onRunClick()}>Run</Button>
                {this.props.assignment.id !== 0 &&
                    <Button primary onClick={() => this.props.onVerifyClick()}>Verify script</Button>
                }
            </div>
        );
    }

    generateFields() {
        let args = this.props.assignment.arguments;
        let fields: any[] = [];
        for (let i = 0; i < args.length; i++) {
            if (i > 0) {
                fields.push(<Label size="large" key={`l${i}`}>,</Label>);
            }
            fields.push(<Popup
                trigger={<Input placeholder={args[i].description} onChange={(e: any) => this.onArgumentChange(i, e.target.value)} />}
                on="focus"
                content={`Example: ${args[i].example}`}
                position="top center"
                size="tiny"
                inverted
                key={`p${i}`}
            />);
        }
        return fields;
    }
}

export default EditorForm;
