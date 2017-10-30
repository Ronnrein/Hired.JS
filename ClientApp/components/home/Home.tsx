import * as React from "react";
import * as _ from "lodash";
import { Grid, Statistic, Header, Icon, Segment, List, Image } from "semantic-ui-react"
import * as DocumentationStore from "../../store/Documentation";
import * as ThreadStore from "../../store/Threads";
import * as ConsoleStore from "../../store/Console";
import * as UserStore from "../../store/User";
import Documentation from "../documentation/Documentation";
import Console from "../console/Console";

type HomeProps = {
    threads: ThreadStore.ThreadsState;
    documentation: DocumentationStore.DocumentationState;
    console: ConsoleStore.ConsoleState;
    user: UserStore.UserState;
    selectAssignment: Function;
};

export default class Home extends React.Component<HomeProps, {}> {
    render() {
        const completed = _.filter(this.props.threads.threads, (t: any) => t.assignment && t.assignment.completed);
        return (
            <Grid id="home-grid">
                <Grid.Row columns={1}>
                    <Grid.Column textAlign="center">
                        <Header as="h1" icon>
                            <Icon name="user" />
                            {this.props.user.user ? this.props.user.user.userName : "User"}
                            <Header.Subheader>
                                Welcome to Hired.JS!
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column as={Segment}>
                        <Statistic.Group widths="four">
                            <Statistic>
                                <Statistic.Value>
                                    {completed.length}
                                </Statistic.Value>
                                <Statistic.Label>Completed</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>
                                    {_.filter(this.props.threads.threads, (t: any) => t.assignment && !t.assignment.completed).length}
                                </Statistic.Value>
                                <Statistic.Label>Available</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>
                                    {Math.floor(_.meanBy(completed, (t: ThreadStore.Thread) =>
                                        t.assignment && t.assignment.scoreSummary ? t.assignment.scoreSummary.script.score : 0
                                    ))}
                                </Statistic.Value>
                                <Statistic.Label>Avg. Score</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>
                                    {Math.floor(_.meanBy(completed, (t: ThreadStore.Thread) =>
                                        t.assignment && t.assignment.scoreSummary ? t.assignment.scoreSummary.solutionScore : 0
                                    ))}
                                </Statistic.Value>
                                <Statistic.Label>Avg. AI Score</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column width={11} className="no-padding">
                        <Header as="h2" attached="top">Documentation</Header>
                        <Segment className="home-column scroll-y no-padding" attached="bottom">
                            <Documentation documentations={this.props.documentation.documentations} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Header as="h2" attached="top">Assignments</Header>
                        <Segment className="home-column scroll-y" attached="bottom">
                            <List size="big" selection>
                                {this.props.threads.threads.map((t: ThreadStore.Thread) =>
                                    <List.Item onClick={() => this.props.selectAssignment(t)}>
                                        <List.Icon name={!t.assignment ? "talk" : t.assignment.completed ? "checkmark" : "file text"} />
                                        <List.Content>
                                            <List.Header>{t.title}</List.Header>
                                            <List.Description>{t.assignment ? t.assignment.name : "Social"}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                )}
                            </List>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column className="no-padding">
                        <Console entries={this.props.console.entries} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
