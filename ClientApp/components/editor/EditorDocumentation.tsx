import * as React from "react";
import { Feed } from "semantic-ui-react";
import { Documentation } from "../../store/Threads";
import { convertCode } from "../../utils";

type Props = {
    doc: Documentation;
}

export default class EditorDocumentation extends React.Component<Props, {}> {
    render() {
        return (
            <Feed.Event>
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User as="span">{this.props.doc.title}</Feed.User>
                        <Feed.Date as="a" target="_blank" href={this.props.doc.url}>More info</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra><span dangerouslySetInnerHTML={{ __html:convertCode(this.props.doc.text) }}></span></Feed.Extra>
                </Feed.Content>
            </Feed.Event>
        );
    }
}
