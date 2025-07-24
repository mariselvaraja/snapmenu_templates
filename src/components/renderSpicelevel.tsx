import { FaPepperHot } from "react-icons/fa"

interface RenderSpiceInterface {
    spice : string
}

const RenderSpice: React.FC<RenderSpiceInterface>  = ({spice})=>{
    
    let spiceLevel = spice?.toLowerCase()
    if(spiceLevel == "mild")
    {
      return <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full gap-1 capitalize flex items-center max-w-[fit-content]">
      <FaPepperHot className="text-red-500" />
      &nbsp;
      {spice}
      </span>
    }
    else if(spiceLevel == "medium")
    {
      return<span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full  gap-1 capitalize flex items-center max-w-[fit-content]">
       <FaPepperHot className="text-red-500" />
       <FaPepperHot className="text-red-500" />
       &nbsp;
       {spice}
      </span>
    }
    else if(spiceLevel === "hot")
    {
      return <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full  gap-1 capitalize flex items-center max-w-[fit-content]">
      <FaPepperHot className="text-red-500" />
      <FaPepperHot className="text-red-500" />
      <FaPepperHot className="text-red-500" />
      &nbsp;
      {spice}
      </span>
    }
    return null
  }

  export default RenderSpice;