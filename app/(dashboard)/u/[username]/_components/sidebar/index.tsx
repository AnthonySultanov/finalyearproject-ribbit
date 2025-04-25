import { Navagation } from "./navagation"
import { Toggle } from "./toggle"
import { Wrapper } from "./wrapper"


export const Sidebar = () => {
    return (
        <Wrapper>
            <Toggle />
            <Navagation />
        </Wrapper>
    )
}
