import { useState, cloneElement } from "react";

export function Dialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Séparer DialogTrigger et DialogContent
  const trigger = children.find(child => child.type.name === "DialogTrigger");
  const content = children.find(child => child.type.name === "DialogContent");

  return (
    <>
      {trigger && cloneElement(trigger, { setIsOpen })}
      {isOpen && content && cloneElement(content, { setIsOpen })}
    </>
  );
}

export function DialogTrigger({ children, setIsOpen }) {
  return (
    <div onClick={() => setIsOpen(true)} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DialogContent({ children, className, setIsOpen }) {
  return (
    <div
      className={"fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 " + (className || "")}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white p-4 rounded-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}