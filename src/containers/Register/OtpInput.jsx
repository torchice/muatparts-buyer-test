import { useRef, useEffect } from 'react';

const OtpInput = ({ otp, setOtp }) => {
	const inputRefs = useRef([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, 6);
	}, []);

	const handleChange = (element, index) => {
		const value = element.value;
		if (isNaN(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value !== "" && index < 5) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	return (
		<div className="flex gap-2 items-start">
			{otp.map((_, index) => (
				<input
					key={index}
					type="text"
					maxLength={1}
					ref={(ref) => (inputRefs.current[index] = ref)}
					value={otp[index]}
					onChange={(e) => handleChange(e.target, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					className="h-[30px] w-[30px] bg-white rounded-lg border border-solid border-[#868686] text-center p-0 font-bold text-[14px] leading-[16.8px]"
					style={{
						minWidth: '30px',
						maxWidth: '30px',
						minHeight: '30px',
						maxHeight: '30px'
					}}
					aria-label={`OTP digit ${index + 1}`}
				/>
			))}
		</div>
	);
};

export default OtpInput;