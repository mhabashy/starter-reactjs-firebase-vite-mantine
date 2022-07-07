import { Avatar } from '@mantine/core';
import * as React from 'react';

export interface IMyAvatorProps {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    src?: string;
    displayName: string;
}

// get initials from displayName
function getInitials(displayName: string) {
    const names = displayName.split(' ');
    let initials = '';
    names.forEach(name => {
        initials += name[0];
    });
    return initials;
}

export function MyAvator (props: IMyAvatorProps) {
 
  return (
    <>
        {props.src && <Avatar size={props.size || 'md'} src={props.src} />}
        {!props.src && <Avatar size={props.size || 'md'}>
            {getInitials(props.displayName)}
        </Avatar>}
    </>
  );
}
