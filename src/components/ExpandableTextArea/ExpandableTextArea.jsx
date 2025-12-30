import { useRef, useEffect, useState } from "react";

const ExpandableTextArea = (props) => {
  const textareaRef = useRef(null);
  const [isGrow, setIsGrow] = useState(false)

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = '12px';
      
      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 12), 100);
      setIsGrow(newHeight > 16)
      textarea.style.height = `${newHeight}px`;
    }
  }, [props.value]);

  return (
    <div className={`w-full max-h-[100px] min-h-[32px] ${isGrow ? "p-3" : "px-3"} flex items-center rounded-lg border border-[#868686]`}>
        <textarea
            {...props}
            ref={textareaRef}
            className={`w-full my-auto min-h-[12px] max-h-[76px] outline-none resize-none overflow-y-auto text-[12px] leading-[15.6px] font-medium ${props.textareaClassname}`}
            style={{
                height: '12px',
            }}
        />
    </div>
  );
};

export default ExpandableTextArea;