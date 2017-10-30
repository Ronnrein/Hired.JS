import * as React from "react";
import { Popup, Menu, Icon } from "semantic-ui-react";
import { Documentation as IDocumentation } from "../../store/Documentation";
import Documentation from "./Documentation";

type Props = {
    documentations: IDocumentation[];
}

export default class DocumentationMenuItem extends React.Component<Props, {}> {

    render() {
        return (
            <Popup
                trigger={<Menu.Item><Icon name="archive" />Documentation<Icon name="dropdown" /></Menu.Item>}
                position="bottom left"
                flowing
                hoverable
                id="documentation-wrapper"
            >
                <Documentation documentations={this.props.documentations} />
            </Popup>
        );
    }
}
