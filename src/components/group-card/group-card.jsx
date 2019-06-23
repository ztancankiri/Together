import React from "react";
import { Card, Icon, Image, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import "./group-card.scss";
//
function GroupCard({ group, image_path }) {
    return (
        <Card className="group-card" as={Link} to={"/group-details/" + group.group_id}>
            <Card.Content>
                <Card.Description>
                    <Grid>
                        <Grid.Column width="5" className="group-image">
                            <Image size="small" src={image_path}></Image>
                        </Grid.Column>
                        <Grid.Column width="10" verticalAlign="middle">
                            <h2>{group.group_name}</h2>
                        </Grid.Column>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className="group-details">
                    <span>
                        <Icon name='user' />
                        {group.member_count} members
                    </span>
                </div>
            </Card.Content>
        </Card >
    );
}
export default GroupCard;
