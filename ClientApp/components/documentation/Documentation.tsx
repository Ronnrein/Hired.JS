import * as React from "react";
import * as _ from "lodash";
import { Grid, Input, Header, List, Divider } from "semantic-ui-react";
import { Documentation as IDocumentation } from "../../store/Documentation";
import { convertCode } from "../../utils";

type Props = {
    documentations: IDocumentation[];
}

export default class Documentation extends React.Component<Props, {}> {
    state = {
        selected: this.props.documentations[0],
        filter: ""
    }

    render() {
        const docs = this.state.filter === ""
            ? this.props.documentations
            : _.filter(this.props.documentations, doc => doc.title.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1);
        return (
            <Grid divided columns={2} id="documentation">
                <Grid.Column width={7}>
                    <Input icon="search" iconPosition="left" placeholder="Search..." onChange={(e: any) => this.setState({filter: e.target.value})} fluid />
                    <Divider />
                    <List selection>
                        {docs.map(d =>
                            <List.Item content={d.title} onClick={() => this.setState({ selected: d })} active={this.state.selected === d} />
                        )}
                    </List>
                </Grid.Column>
                <Grid.Column width={9}>
                    {this.state.selected ? (
                        <span>
                            <Header>{this.state.selected.title}</Header>
                            <p dangerouslySetInnerHTML={{ __html: convertCode(this.state.selected.text) }}></p>,
                            <a href={this.state.selected.url} target="_blank">Read more</a>
                        </span>
                    ) : (
                        <Header>Select a documentation to view</Header>
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}
