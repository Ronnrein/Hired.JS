import * as React from "react";
import { Popup } from "semantic-ui-react";
import { default as TimeAgoComponent } from "react-timeago";

type Props = {
    date: Date
}

export default class TimeAgo extends React.Component<Props, {}> {
    render() {
        return (
            <Popup
                trigger={<TimeAgoComponent date={this.props.date} component="span" title="" />}
                content={new Date(this.props.date).toLocaleString()}
                size="tiny"
            />
        );
    }
}
