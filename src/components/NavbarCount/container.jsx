import { useEffect } from "react";
import NavbarCount from "./navbarCount";
import useNavbarCountStore from "@/store/zustand/navbarCount";


export default function ContainerNavbarCount({
    countPage, 
    active,
    title,
    subtitle,
    backAction = () => {

    },
    action1 = {
        icon: null,
        text: '',
        action: () => {

        }
    },
    action2 = {
        icon: null,
        text: '',
        action: () => {

        }
    },
}){
    //const { active, count, updateActive, updateCount } = useNavbarCountStore();

    useEffect(() => {
        updateCount(countPage);
    }, [])

    return(
        <></>
        // <NavbarCount 
        //     count={countPage}
        //     active={active}
        //     backAction={backAction}
        //     title={title}
        //     subtitle={subtitle}
        //     action1={{
        //         icon: action1.icon,
        //         action: action1.action,
        //         text: action1.text
        //     }}
        //     action2={{
        //         icon: action2.icon,
        //         action: action2.action,
        //         text: action2.text
        //     }}
        // />
    )
}