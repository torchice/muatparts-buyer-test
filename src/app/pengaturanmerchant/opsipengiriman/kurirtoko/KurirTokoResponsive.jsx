import Toast from "@/components/Toast/Toast"
import AturKurirToko from "./screens/AturKurirToko"
import PilihProvinsi from "./screens/PilihProvinsi"

const KurirTokoResponsive = ({
    addCourierProvince,
    deleteProvince,
    handleSave,
    handleRefresh,
    validateFormData,
    address,
    count,
    provinceIds,
    lists,
    formData,
    setFormData,
}) => {
    
    return (
        <>
            {true ? (
                <AturKurirToko
                    address={address}
                    count={count}
                    formData={formData}
                    lists={lists}
                    onRefresh={handleRefresh}
                    onSave={handleSave}
                    validateFormData={validateFormData}
                />
            ) : null}
            {false ? (
                <PilihProvinsi
                    // address={address}
                />
            ) : null}
        </>
    )
}

export default KurirTokoResponsive