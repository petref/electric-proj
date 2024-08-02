import { GridLoader } from "react-spinners";

export default function Loader() {
    return (<div className='flex flex-1 flex-row  place-content-center place-items-center h-screen w-screen justify-self-center'><GridLoader size={100} /></div>)
}