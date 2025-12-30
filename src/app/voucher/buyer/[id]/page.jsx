"use client"

import { viewport } from "@/store/viewport";
import VoucherDetailResponsive from "./VoucherDetailResponsive";
import VoucherWeb from "./VoucherWeb";

const Page =() =>
{	
	const { isMobile } = viewport();

	if (typeof isMobile !== "boolean") return <></>; //buat skeleton
	if (isMobile) return <VoucherDetailResponsive />;
	return (
		<></>
	);
}

export default Page;