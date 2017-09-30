import * as React from "react";
import { Grid, Segment, Item, Header, Icon } from "semantic-ui-react";
import { Thread as Thread } from "../../store/Threads";
import ThreadsItem from "./ThreadsItem";
import { default as ThreadComponent } from "./Thread";

type Props = {
    threads: Thread[];
    selectedThread?: Thread;
    isLoading: boolean;
    onThreadClick: Function;
}

export default class Threads extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <Header as="h2" attached="top">
                    <Icon name="file text" />
                    <Header.Content>
                        Threads
                        <Header.Subheader>Your threads and conversations</Header.Subheader>
                    </Header.Content>
                </Header>
                <Segment attached className="no-padding" loading={this.props.isLoading}>
                    <Grid celled stackable className="no-margin">
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Item.Group divided>
                                    {this.props.threads.map(thread =>
                                        <ThreadsItem
                                            key={thread.id}
                                            thread={thread}
                                            onClick={() => this.props.onThreadClick(thread)}
                                            selected={!!this.props.selectedThread && this.props.selectedThread.id === thread.id} />
                                    )}
                                </Item.Group>
                            </Grid.Column>
                            <Grid.Column width={11} className="no-padding">
                                {this.props.selectedThread ? (
                                    <ThreadComponent thread={this.props.selectedThread} />
                                ) : (
                                    <Header as="h2" icon textAlign="center">
                                        <Icon name="mail" />
                                        Messages
                                        <Header.Subheader>Select a message to view</Header.Subheader>
                                    </Header>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment attached="bottom">
                    Test
                </Segment>
            </div>
        );
    }
}
