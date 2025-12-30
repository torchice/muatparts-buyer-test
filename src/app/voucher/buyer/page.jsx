"use client"

import { viewport } from "@/store/viewport";
import VoucherResponsive from "./VoucherResponsive";
import VoucherWeb from "./VoucherWeb";

const Page =() =>
{	
	const { isMobile } = viewport();

	if (typeof isMobile !== "boolean") return <></>; //buat skeleton
	if (isMobile) return <VoucherResponsive />;
	return (
		<VoucherWeb/>
	);
}

export default Page;