import { viewport } from "@/store/viewport";
import ImagesPreviewWeb from "./ImagesPreviewWeb";
import ImagesPreviewResponsive from "./ImagesPreviewResponsive";

const ImagesPreview = (props) => {
    const { isMobile } = viewport();

    if (isMobile) {
        return <ImagesPreviewResponsive {...props} />
    } else {
        return <ImagesPreviewWeb {...props} />
    }
}

export default ImagesPreview