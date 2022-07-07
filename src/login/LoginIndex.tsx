import { Center, useMantineColorScheme } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { ThemeSwitch } from "../components/ThemeSwitch";
import './login.scss';

export function LoginIndex() {
    const { colorScheme } = useMantineColorScheme();
    return (
        <div className={`d-flex flex-column p-2 h-100 main-div ${colorScheme}`}>
            <ThemeSwitch size={"md"} />
            <Center className="h-100">
                <Outlet></Outlet>
            </Center>
        </div>
    );
}