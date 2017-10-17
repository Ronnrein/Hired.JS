import * as React from "react";
import * as _ from "lodash";
import { Grid, Segment, Item, Header, Icon, Transition } from "semantic-ui-react";
import { Thread as Thread, Message } from "../../store/Threads";
import ThreadsItem from "./ThreadsItem";
import { default as ThreadComponent } from "./Thread";

type Props = {
    threads: Thread[];
    selectedThread?: Thread;
    isLoading: boolean;
    onThreadClick: Function;
}

export default class Threads extends React.Component<Props, {}> {
    state = {
        threads: [] as Thread[],
        timers: [] as number[]
    }

    componentDidMount() {
        this.scheduleMessages(this.props.threads);
    }

    componentWillReceiveProps(next: Props) {
        if(this.props.threads.length === next.threads.length) {
            return;
        }
        this.clearTimers();
        this.scheduleMessages(next.threads);
    }

    componentWillUnmount() {
        this.clearTimers();
    }

    clearTimers() {
        for (let i = 0; i < this.state.timers.length; i++) {
            clearTimeout(this.state.timers[i]);
        }
        this.setState({ timers: [] as number[] });
    }
    
    render() {
        return (
            <div>
                <Header as="h2" attached="top">
                    <Icon name="mail" />
                    <Header.Content>
                        Inbox
                        <Header.Subheader>Your threads and assignments</Header.Subheader>
                    </Header.Content>
                </Header>
                <Segment attached className="no-padding" loading={this.props.isLoading}>
                    <Grid celled stackable className="no-margin">
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Transition.Group as={Item.Group} className="threads-items" divided>
                                    {this.state.threads.map((thread, i) => {
                                        let selected = !!this.props.selectedThread && this.props.selectedThread.id === thread.id;
                                        return <Item
                                            key={i}
                                            onClick={() => this.props.onThreadClick(thread)}
                                            className="cursor-pointer" id={selected ? "selected-thread" : ""}
                                        >
                                            <ThreadsItem thread={thread} selected={selected}/>
                                        </Item>;
                                        }
                                    )}
                                </Transition.Group>
                            </Grid.Column>
                            <Grid.Column width={11} className="no-padding">
                                {this.props.selectedThread ? (
                                    <ThreadComponent thread={this.props.selectedThread} />
                                ) : (
                                    <Header as="h2" icon textAlign="center">
                                        <Icon name="mail" />
                                        Messages
                                        <Header.Subheader>Select a thread to view</Header.Subheader>
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

    scheduleMessages(t: Thread[]) {
        let timers: number[] = [];
        let threads = t.map((thread, i) => {
            thread.messages = thread.messages.filter((message) => {
                if (message.receivedOn < new Date()) {
                    return true;
                }
                let diff = message.receivedOn.getTime() - new Date().getTime();
                timers.push(window.setTimeout(() => {
                    let stateThreads = [...this.state.threads];
                    stateThreads[i].messages.push(message);
                    this.setState({
                        threads: stateThreads
                    });
                }, diff));
                return false;
            });
            return thread;
        });
        this.setState({
            threads: threads,
            timers: timers
        });
    }
}
