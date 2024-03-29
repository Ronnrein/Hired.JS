import * as React from "react";
import { Label, Button, Popup, Input, Segment } from "semantic-ui-react";
import { Assignment } from "../../store/Threads";
import { ConsoleEntryStatus } from "../../store/Console";

type Props = {
    assignment: Assignment;
    onRunClick: Function;
    onVerifyClick: Function;
    consoleAppend: Function;
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
            this.props.consoleAppend(
                { icon: "text cursor", status: ConsoleEntryStatus.Error, title: "Argument missing", text: "Please fill in all arguments to run" }
            );
            return;
        }

        this.props.onRunClick(this.state.arguments);
    }

    render() {
        return (
            <Segment attached id="run-input">
                <Label size="large">console.log({this.props.assignment.function}(</Label>
                {this.generateFields()}
                <Label size="large">));</Label>
                <Button positive onClick={() => this.onRunClick()} icon="cube" content="Test" />
                {this.props.assignment.id !== 0 &&
                    <Button primary onClick={() => this.props.onVerifyClick()} icon="cubes" content="Verify" />
                }
            </Segment>
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
