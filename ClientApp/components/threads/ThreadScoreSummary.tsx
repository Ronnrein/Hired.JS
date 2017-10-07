import * as React from "react";
import { Feed, Popup, Icon } from "semantic-ui-react";
import { Line } from "react-chartjs-2";
import { Message, ScoreSummary } from "../../store/Threads";
import TimeAgo from "../shared/TimeAgo";

declare var Chart: any;

type Props = {
    message: Message;
    scoreSummary: ScoreSummary;
}

export default class ThreadScoreSummary extends React.Component<Props, {}> {

    private plugin = {afterDraw: (chart: Chart) => {
        let canvas = chart.canvas;
        let ctx = chart.ctx;
        if (!ctx || !canvas) {
            return;
        }
        let sum = this.state.scoreSummary;
        let script = sum.script;
        let width = chart.chartArea.right - chart.chartArea.left;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "blue";
        let scorePercentage = this.calculateScorePercentage(this.state.scoreSummary.solutionScore);
        let pos = scorePercentage * width;
        ctx.textAlign = scorePercentage < 0.25 ? "left" : scorePercentage > 0.75 ? "right" : "center";
        ctx.fillRect(chart.chartArea.left + pos - 1, chart.chartArea.top, 2, chart.chartArea.bottom - chart.chartArea.top + (ctx.textAlign === "center" ? 50 : 63));
        ctx.fillText(`  AI best: ${this.state.scoreSummary.solutionScore}  `, chart.chartArea.left + pos, chart.chartArea.bottom - chart.chartArea.top + 90);
        ctx.fillStyle = "green";
        scorePercentage = this.calculateScorePercentage(script.score);
        pos = scorePercentage * width;
        ctx.textAlign = scorePercentage < 0.25 ? "left" : scorePercentage > 0.75 ? "right" : "center";
        ctx.fillRect(chart.chartArea.left + pos - 1, chart.chartArea.top, 2, chart.chartArea.bottom - chart.chartArea.top + (ctx.textAlign === "center" ? 30 : 43));
        ctx.fillText(`  Your best: ${script.score} (${script.name})  `, chart.chartArea.left + pos, chart.chartArea.bottom - chart.chartArea.top + 70);
        ctx.restore();
    }}

    state = {
        // Need to store in state to ensure proper rendering with context
        scoreSummary: this.props.scoreSummary
    }

    componentWillMount() {

        // Workaround for missing option property
        let global: any = Chart.defaults.global;
        global.layout.padding = { bottom: 40 };

        Chart.pluginService.register(this.plugin);
    }

    componentWillUnmount() {
        Chart.pluginService.unregister(this.plugin);
    }

    componentWillReceiveProps(next: Props) {
        this.setState({scoreSummary: next.scoreSummary});
    }

    render() {
        let image = `/images/workers/${this.props.message.author.id}.jpg`;
        return (
            <Feed.Event className={this.props.message.author.id === 0 ? "message-ai" : undefined}>
                <Feed.Label image={image} />
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User as="span">{this.props.message.author.name}</Feed.User>
                        <Feed.Date>{this.props.message.author.position} | <TimeAgo date={this.props.message.receivedOn} /></Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                        {this.props.message.text}&nbsp;
                        <Popup trigger={<Icon name="question circle" />} content="To improve your score you might blablabla" basic />
                    </Feed.Extra>
                    <Feed.Extra images>
                        <Line data={{
                            labels: this.props.scoreSummary.labels,
                            datasets: [{
                                label: "Users score curve",
                                backgroundColor: "rgba(75,192,192,0.1)",
                                borderColor: "rgba(75,192,192,0.5)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointHoverRadius: 0,
                                pointRadius: 0,
                                pointHitRadius: 0,
                                data: [...this.props.scoreSummary.scores]
                            }]
                        }} options={{
                            legend: {
                                onClick: () => { }
                            },
                            tooltips: {
                                enabled: false
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        display: false
                                    },
                                    gridLines: {
                                        tickMarkLength: 0
                                    }
                                }]
                            },
                            animation: {
                                duration: 500
                            },
                            responsive: true
                        }} />
                    </Feed.Extra>
                </Feed.Content>
            </Feed.Event>
        );
    }

    calculateScorePercentage(score: number) {
        let sum = this.props.scoreSummary;
        return (score - sum.lowest) / (sum.highest - sum.lowest);
    }

}
