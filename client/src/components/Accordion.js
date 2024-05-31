import React, { useState } from "react";
import { Plus, Minus } from 'lucide-react'

const Accordion = ({ title, answer, isFirst }) => {
  const [accordionOpen, setAccordionOpen] = useState(isFirst);

  return (
    <div className="max-w-[1177px] mx-auto my-3 p-4 rounded-lg flex flex-col shadow border-2 border-gray-200">
    {/* // <div className=" py-2"> */}
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        className="flex w-full"
      >
        <span className="text-xl text-notgreen font-bold lg:text-large ml-5">{title}</span>
        <span className="m-auto"></span>
        {accordionOpen ? <span><Minus color="notgreen"/></span> : <span><Plus color="notgreen"/></span>}
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${
          accordionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
            <div className="mt-5 ml-5 mr-20 text-lg text-justify leading-loose text-base font-small">{answer}</div>
        </div>
        
      </div>
    </div>
  );
};

export default Accordion;