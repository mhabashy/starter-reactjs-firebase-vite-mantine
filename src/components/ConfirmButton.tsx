import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Center, Popover, Text } from "@mantine/core";
import { useState } from "react";


export interface IThemeSwitchProps {
  size: 'xs' | 'sm' | 'md' | 'lg';
  icon?: any;
  text?: string;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray' | 'black' | 'white';
  loading?: boolean;
  message?: string;
  onConfirm: () => any;
}


function ConfirmButton(params: IThemeSwitchProps) {

  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={<Button 
        leftIcon={params.icon ?? <FontAwesomeIcon icon={faTrash} />}
        size={params.size ?? "xs"}
        color={params.color ?? "red"}
        loading={params.loading ?? false}
        onClick={() => setOpened((o) => !o)}>{params.text ?? "Delete"}</Button>}
      position="top"
      width={260}
      withArrow
    >
      <div>
        <Center>
            <Text className="mb-2" >{params.message ?? 'Confirm Delete?'}</Text>
        </Center>
        <div className="d-flex flex-row justify-content-between">
            <Button
                color='red'
                size="xs"
                onClick={() => setOpened(false)}
            >Cancel
            </Button>
            <Button 
                color='green'
                size="xs"
                onClick={() => {
                    setOpened(false);
                    params.onConfirm();
                }}
            >
                Yes
            </Button>
        </div>
      </div>
    </Popover>
  );
}

export default ConfirmButton;