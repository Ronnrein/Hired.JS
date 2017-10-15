import * as React from "react";
import { Popup } from "semantic-ui-react";
import { default as TimeAgoComponent } from "react-timeago";

type Props = {
    date: Date;
    showTooltip?: boolean;
}

export default class TimeAgo extends React.Component<Props, {}> {
    public static defaultProps: Partial<Props> = {
        showTooltip: true
    };

    render() {
        var el = <TimeAgoComponent date={this.props.date} component="span" title="" />;
        if(!this.props.showTooltip) {
            return el;
        }
        return (
            <Popup
                trigger={el}
                content={new Date(this.props.date).toLocaleString()}
                size="tiny"
            />
        );
    }
}
