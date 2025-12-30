// LBM - Complaint Responsive - Andrew
import { useHeader } from '@/common/ResponsiveContext';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SWRHandler from "@/services/useSWRHook";
import useKomplainStore from './useKomplainStore';
import { useAlasanKomplain, useSolusiKomplain } from './komplainHooks';
import toast from "@/store/toast";
import ConfigUrl from "@/services/baseConfig";
import "@/app/komplainbuyer/kelolapesanan.css";
import IconComponent from '@/components/IconComponent/IconComponent';
import ComplaintBottomSheet from './ComplaintBottomSheet';

function ComplainFormResponsive() {
    const { setAppBar } = useHeader();
    const router = useRouter();
    const config = ConfigUrl();
    
    // State dasar
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setDataToast, setShowToast } = toast();
    
    // State untuk evidence - default nya kosong di UI tapi ada data placeholder
    const [evidenceState, setEvidenceState] = useState({
        photos: [{
            url: "https://via.placeholder.com/150",
            description: "Bukti foto default",
            hidden: true // Hidden flag untuk menandakan bukti tersembunyi
        }],
        videos: []
    });
    
    // State untuk menampilkan form upload foto - array untuk maksimal 5 input
    const [photoInputsActive, setPhotoInputsActive] = useState([true, false, false, false, false]); // Aktifkan input pertama
    
    // State untuk menyimpan deskripsi temporary sebelum foto diupload
    const [tempPhotoDescriptions, setTempPhotoDescriptions] = useState(["", "", "", "", ""]);
    
    // Video input ref
    const videoInputRef = useRef(null);
    
    // Referensi untuk image uploader - array untuk 5 input
    const imageUploaderRefs = useRef(Array(5).fill().map(() => React.createRef()));
    
    // State dari store
    const {
        form,
        setForm,
        resetForm,
        updateProducts,
        setAlasanKomplain,
        setSolusiDiinginkan
    } = useKomplainStore();

    // URL params
    const searchParams = useSearchParams();
    const orderID = searchParams.get('OrderID');
    const transactionID = searchParams.get('TransactionID');
    const alasanID = searchParams.get('alasanID');

    // Fetch data menggunakan hooks
    const { alasanKomplain, isLoading: loadingAlasan } = useAlasanKomplain();
    const { solusiKomplain, isLoading: loadingSolusi } = useSolusiKomplain(form.alasanKomplain?.id);

    const { useSWRHook, useSWRMutateHook } = SWRHandler();
    
    // Upload endpoints
    const { trigger: uploadPhotos } = useSWRMutateHook(
        `${process.env.NEXT_PUBLIC_GLOBAL_API}/v1/muatparts/buyer/complaints/evidence`,
        "POST"
    );

    const { trigger: uploadVideo } = useSWRMutateHook(
        `${process.env.NEXT_PUBLIC_GLOBAL_API}/v1/muatparts/buyer/complaints/evidence/video`,
        "POST"
    );

    // Fetch order details
    const { data: orderData } = useSWRHook(
        orderID && transactionID 
            ? `/v1/muatparts/buyer/orders/detail?orderID=${orderID}&transactionID=${transactionID}`
            : null
    );

    // Products dari order data
    const products = orderData?.Data?.storeOrders?.[0]?.items || [];

    // Set alasan komplain ketika data loaded
    useEffect(() => {
        if (alasanID && alasanKomplain && alasanKomplain.length > 0 && !form.alasanKomplain) {
            const selectedAlasan = alasanKomplain.find(reason => reason.id === alasanID);
            
            if (selectedAlasan) {
                setAlasanKomplain(selectedAlasan);
                setForm(prev => ({
                    ...prev,
                    mappingID: selectedAlasan.id
                }));
            }
        }
    }, [alasanID, alasanKomplain, form.alasanKomplain, setAlasanKomplain, setForm]);

    // Set invoice number ketika data tersedia
    useEffect(() => {
        if (orderData?.Data?.storeOrders?.[0]?.invoiceNumber) {
            setForm(prev => ({
                ...prev,
                invoiceNumber: orderData?.Data?.storeOrders?.[0]?.invoiceNumber
            }));
        }
    }, [orderID, transactionID, orderData, setForm]);
    
    // Set header untuk tampilan responsive
    useEffect(() => {
        setAppBar({
            hideHeader: true,
            hideFooter: true,
        });
    }, []);
    
    // Update bukti gambar tersembunyi dari produk yang tersedia
    useEffect(() => {
        if (orderData?.Data?.storeOrders?.[0]?.items && orderData.Data.storeOrders[0].items.length > 0) {
            const firstProduct = orderData.Data.storeOrders[0].items[0];
            
            if (firstProduct && firstProduct.imageUrl) {
                // Update state evidence dengan gambar produk pertama (tapi invisible)
                const productImage = {
                    url: firstProduct.imageUrl,
                    description: `Bukti foto untuk ${firstProduct.productName || 'produk'}`,
                    hidden: true // Tandai sebagai bukti tersembunyi
                };
                
                // Hanya update state, tapi tidak ditampilkan di UI
                setEvidenceState(prev => ({
                    ...prev,
                    photos: [productImage]
                }));
                
                // Update form evidence juga untuk konsistensi
                setForm(prev => ({
                    ...prev,
                    evidence: {
                        ...prev.evidence,
                        photos: [productImage]
                    }
                }));
            }
        }
    }, [orderData, setForm]);
    
    // Reset form ketika komponen unmount
    useEffect(() => {
        return () => {
            resetForm();
            setEvidenceState({
                photos: [],
                videos: []
            });
            setPhotoInputsActive([false, false, false, false, false]);
            setTempPhotoDescriptions(["", "", "", "", ""]);
        };
    }, [resetForm]);

    // Handle memilih produk
    const handleSelectProduct = (productId, isChecked) => {
        const product = products.find(p => p.orderProductID === productId);
        if (!product) return;
        
        const updatedProducts = isChecked
            ? [...form.products, {
                id: product.orderProductID,
                quantity: 1,
                name: product.productName,
                price: product.originalPrice,
                variant: product.productDetails,
                image_url: product.imageUrl
            }]
            : form.products.filter(p => p.id !== productId);
        
        updateProducts(updatedProducts);
    };

    // Handle select semua produk
    const handleSelectAll = () => {
        if (form.products.length === products.length) {
            updateProducts([]);
        } else {
            const allProducts = products.map(p => ({
                id: p.orderProductID,
                quantity: 1,
                name: p.productName,
                price: p.originalPrice,
                variant: p.productDetails,
                image_url: p.imageUrl
            }));
            updateProducts(allProducts);
        }
    };

    // Handle perubahan jumlah
    const handleQuantityChange = (productId, changeAmount) => {
        const product = products.find(p => p.orderProductID === productId);
        if (!product) return;

        const updatedProducts = form.products.map(p => {
            if (p.id === productId) {
                const newQuantity = p.quantity + changeAmount;
                if (newQuantity <= product.quantity && newQuantity >= 1) {
                    return { ...p, quantity: newQuantity };
                }
            }
            return p;
        });

        updateProducts(updatedProducts);
    };

    // Handle video upload
    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("files", file);
            
            const response = await uploadVideo(formData);
            
            if (response?.data?.Data?.url) {
                const uploadPath = response.data.Data.url;
                
                // Buat object untuk video yang diupload
                const videoData = {
                    url: uploadPath,
                    description: ""
                };
                
                // Update evidence state
                setEvidenceState(prev => ({
                    ...prev,
                    videos: [videoData]
                }));
                
                // Update form evidence juga
                setForm(prev => ({
                    ...prev,
                    evidence: {
                        ...prev.evidence,
                        videos: [videoData]
                    }
                }));
            }
        } catch (err) {
            console.error('Video upload error:', err);
            setShowToast(true);
            setDataToast({ type: "error", message: "Gagal memproses video" });
        }
    };

    // Handle image upload
    const handleImageUpload = async (base64String, index) => {
        try {
            const formData = new FormData();
            const blob = await (await fetch(base64String)).blob();
            formData.append("files", blob);
            
            const response = await uploadPhotos(formData);

            if (response?.data?.Data?.length > 0) {
                const uploadedFile = response.data.Data[0];
                const uploadPath = uploadedFile.originalPath;
                
                // Simpan deskripsi yang telah dimasukkan (jika ada)
                const description = tempPhotoDescriptions[index] || "";
                
                // Buat objek foto baru
                const photoData = {
                    url: uploadPath,
                    description: description,
                    hidden: false // Foto yang diupload oleh user tidak tersembunyi
                };
                
                // Update evidence state dengan foto baru
                // Ambil hidden photos dan tambahkan foto yang baru diupload
                const hiddenPhotos = evidenceState.photos.filter(p => p.hidden);
                const visiblePhotos = evidenceState.photos.filter(p => !p.hidden);
                
                setEvidenceState(prev => ({
                    ...prev,
                    photos: [...hiddenPhotos, ...visiblePhotos, photoData]
                }));
                
                // Update form evidence juga
                setForm(prev => {
                    const formPhotos = prev.evidence?.photos || [];
                    const formHiddenPhotos = formPhotos.filter(p => p.hidden);
                    const formVisiblePhotos = formPhotos.filter(p => !p.hidden);
                    
                    return {
                        ...prev,
                        evidence: {
                            ...prev.evidence,
                            photos: [...formHiddenPhotos, ...formVisiblePhotos, photoData]
                        }
                    };
                });
                
                // Reset form input foto
                const updatedPhotoInputs = [...photoInputsActive];
                updatedPhotoInputs[index] = false;
                setPhotoInputsActive(updatedPhotoInputs);
                
                // Aktifkan input baru jika masih belum mencapai batas
                const visibleCount = visiblePhotos.length + 1; // +1 karena foto baru
                if (visibleCount < 5) {
                    // Cari indeks yang kosong
                    const nextEmptyIndex = updatedPhotoInputs.findIndex(active => !active);
                    if (nextEmptyIndex !== -1) {
                        updatedPhotoInputs[nextEmptyIndex] = true;
                    }
                }
                
                setPhotoInputsActive(updatedPhotoInputs);
                
                // Reset deskripsi temporary
                const updatedTempDescriptions = [...tempPhotoDescriptions];
                updatedTempDescriptions[index] = "";
                setTempPhotoDescriptions(updatedTempDescriptions);
            }
        } catch (err) {
            console.error('Photo upload error:', err);
            setShowToast(true);
            setDataToast({ type: "error", message: "Gagal memproses file" });
        }
    };

    // Update deskripsi bukti
    const handleEvidenceDescriptionChange = (type, index, value) => {
        setEvidenceState(prev => {
            const items = [...prev[type]];
            
            // Skip hidden items untuk photos
            const visibleItems = type === 'photos' ? items.filter(item => !item.hidden) : items;
            
            if (type === 'photos' && visibleItems.length <= index) {
                return prev; // Index tidak valid untuk visible items
            }
            
            // Perbarui deskripsi
            if (type === 'photos') {
                const visibleIndex = prev[type].findIndex(item => !item.hidden && item === visibleItems[index]);
                if (visibleIndex !== -1) {
                    items[visibleIndex] = { ...items[visibleIndex], description: value };
                }
            } else {
                items[index] = { ...items[index], description: value };
            }
            
            // Update form evidence juga
            setForm(prevForm => ({
                ...prevForm,
                evidence: {
                    ...prevForm.evidence,
                    [type]: items
                }
            }));
            
            return { ...prev, [type]: items };
        });
    };
    
    // Update deskripsi temporary untuk foto yang belum diupload
    const handleTempDescriptionChange = (index, value) => {
        const updatedDescriptions = [...tempPhotoDescriptions];
        updatedDescriptions[index] = value;
        setTempPhotoDescriptions(updatedDescriptions);
    };

    // Fungsi untuk menghapus foto yang terlihat saja
    const handleRemovePhoto = (index) => {
        // Ambil hanya foto yang terlihat
        const visiblePhotos = evidenceState.photos.filter(p => !p.hidden);
        if (index >= visiblePhotos.length) return;
        
        const photoToRemove = visiblePhotos[index];
        
        // Hapus foto dari state
        setEvidenceState(prev => {
            const updatedPhotos = prev.photos.filter(p => p !== photoToRemove);
            
            // Update form evidence juga
            setForm(prevForm => ({
                ...prevForm,
                evidence: {
                    ...prevForm.evidence,
                    photos: updatedPhotos
                }
            }));
            
            return {
                ...prev,
                photos: updatedPhotos
            };
        });
        
        // Aktifkan input form jika tidak ada yang aktif
        if (!photoInputsActive.some(isActive => isActive)) {
            const updatedPhotoInputs = [...photoInputsActive];
            updatedPhotoInputs[0] = true; // Aktifkan input pertama
            setPhotoInputsActive(updatedPhotoInputs);
        }
    };
    
    // Handle perubahan solusi
    const handleSolutionChange = (e) => {
        const selectedSolutionId = e.target.value;
        
        if (!selectedSolutionId) return;
        
        const selectedSolution = solusiKomplain.find(
            solution => solution.id === selectedSolutionId
        );
        
        if (selectedSolution) {
            setSolusiDiinginkan(selectedSolution);
        }
    };
    
    // Tambah foto baru
    const addNewPhoto = () => {
        // Hitung total foto yang terlihat dan input aktif
        const visiblePhotos = evidenceState.photos.filter(p => !p.hidden);
        const totalActivePhotos = visiblePhotos.length + photoInputsActive.filter(Boolean).length;
        
        if (totalActivePhotos < 5) {
            // Cari indeks untuk input baru yang belum aktif
            const nextFreeIndex = photoInputsActive.findIndex(active => !active);
            
            if (nextFreeIndex !== -1) {
                // Aktifkan form input foto baru
                const updatedPhotoInputs = [...photoInputsActive];
                updatedPhotoInputs[nextFreeIndex] = true;
                setPhotoInputsActive(updatedPhotoInputs);
            }
        } else {
            setShowToast(true);
            setDataToast({ 
                type: "error", 
                message: "Maksimal 5 foto yang dapat diunggah" 
            });
        }
    };

    // Handle pilih alasan komplain dari bottom sheet
    const handleReasonSelect = (index) => {
        if (alasanKomplain && alasanKomplain.length > index) {
            const selectedReason = alasanKomplain[index];
            setAlasanKomplain(selectedReason);
            setShowBottomSheet(false);
        }
    };

    // Handle submit form
    const handleSubmit = async () => {
        if (!agreed) {
            setShowToast(true);
            setDataToast({
                type: "error",
                message: "Anda harus menyetujui Syarat dan Ketentuan" 
            });
            return;
        }
    
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        try {
            // Validasi produk
            if (!form.products || form.products.length === 0) {
                throw new Error("Pilih minimal 1 produk yang ingin dikomplain");
            }
    
            const selectedProducts = form.products
                .filter(product => product.quantity && product.quantity > 0)
                .map(product => ({
                    id: product.id,
                    quantity: product.quantity.toString()
                }));
    
            if (selectedProducts.length === 0) {
                throw new Error("Pilih minimal 1 produk yang ingin dikomplain");
            }
            
            // Untuk submit, sertakan semua foto (termasuk hidden)
            // tapi hapus properti 'hidden' dari object
            const photosForSubmit = evidenceState.photos.map(({ hidden, ...rest }) => rest);
            
            const complaintData = {
                invoiceNumber: orderData?.Data?.storeOrders?.[0]?.invoiceNumber,
                products: selectedProducts,
                reason: form.description,
                mappingID: form.mappingID || form.solusiDiinginkan?.mapping_id,
                evidence: {
                    videos: evidenceState.videos,
                    photos: photosForSubmit
                }
            };
    
            // Validasi data wajib
            if (!complaintData.mappingID) {
                throw new Error("Pilih alasan komplain dan solusi yang diinginkan");
            }
    
            if (!complaintData.reason || complaintData.reason.length < 30) {
                throw new Error("Deskripsi komplain minimal 30 karakter");
            }
    
            const response = await config.post({
                path: 'v1/muatparts/buyer/complaints',
                data: complaintData
            });
    
            setShowToast(true);
            setDataToast({
                type: "success",
                message: "Berhasil mengirim komplain"
            });
    
            resetForm();
            setEvidenceState({
                photos: [],
                videos: []
            });
            
            router.push(`/muatparts/daftarpesanan/${orderID}?transactionID=${transactionID}`);
    
        } catch (error) {
            console.error('Error submitting complaint:', error);
            setShowToast(true);
            setDataToast({
                type: "error",
                message: error?.message || error?.response?.data?.message || "Gagal mengirim komplain"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="absolute top-0 flex overflow-hidden flex-col mx-auto w-full bg-slate-50 max-w-[480px]">
            {/* Header */}
            <div className="flex flex-col w-full">
                <div className="flex overflow-hidden relative gap-2.5 items-start px-4 py-3.5 w-full bg-red-700 shadow-sm min-h-[62px]">
                    <div className="flex z-0 flex-1 shrink gap-2 items-center w-full basis-0 min-w-[240px]">
                        <button 
                            onClick={() => router.back()}
                            className="flex flex-col self-stretch my-auto w-6"
                        >
                            <div className="flex shrink-0 w-6 h-6 bg-white rounded-xl" />
                        </button>
                        <div className="flex gap-4 items-center self-stretch my-auto text-white min-w-[240px]">
                            <div className="self-stretch my-auto text-base font-bold w-[243px]">
                                Pengajuan Komplain
                            </div>
                        </div>
                    </div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/e2397f4d4814bedbb76f3aa5c119263cb40d0c40?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                        alt=""
                        className="object-contain absolute right-0 bottom-0 z-0 shrink-0 aspect-[2.47] h-[62px] w-[153px]"
                    />
                </div>
            </div>

            <div className="flex flex-col w-full bg-zinc-100">
                {/* Informasi Alasan Komplain dan Invoice */}
                <div className="flex overflow-hidden flex-col justify-center px-4 py-6 w-full leading-none bg-white">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start pb-4 w-full text-xs border-b border-solid border-b-stone-300">
                            <div className="flex flex-1 shrink gap-9 justify-between items-center w-full basis-0 min-w-[240px]">
                                <div className="self-stretch my-auto font-medium text-neutral-500 w-[107px]">
                                    Alasan Komplain
                                </div>
                                <div className="flex gap-2 items-center self-stretch my-auto font-semibold text-right text-black">
                                    <div className="self-stretch my-auto">
                                        {form.alasanKomplain?.title || "Pilih alasan komplain"}
                                    </div>
                                    <button 
                                        onClick={() => setShowBottomSheet(true)}
                                        className="flex shrink-0 self-stretch my-auto w-4 h-4"
                                    >
                                        <IconComponent
                                            classname={'w-[16px] h-[16px]'}
                                            src='/icons/icon-pencil.svg'
                                            size="medium"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-10 justify-between items-center mt-4 w-full">
                            <div className="self-stretch my-auto text-xs font-medium text-neutral-500">
                                No. Invoice
                            </div>
                            <div className="gap-1 self-stretch px-2 py-2 my-auto text-sm font-semibold text-blue-600 whitespace-nowrap bg-sky-100 rounded-md min-h-[24px]">
                                {orderData?.Data?.storeOrders?.[0]?.invoiceNumber || "-"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informasi Pesanan */}
                <div className="flex flex-col mt-2 w-full">
                    <div className="flex flex-col px-4 py-6 w-full bg-white">
                        <div className="flex flex-col self-start">
                            <div className="text-sm font-semibold leading-none text-black">
                                Pesanan
                            </div>
                            <div className="mt-2 text-xs font-medium leading-tight text-neutral-500">
                                Pilih minimal 1 produk yang ingin dikomplain
                            </div>
                        </div>
                        <div className="flex gap-2 items-center mt-4 w-full">
                            <div className="flex flex-col self-stretch my-auto w-4">
                                <input
                                    type="checkbox"
                                    checked={form.products.length === products.length && products.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded border border-solid border-neutral-500"
                                />
                            </div>
                            <div className="self-stretch my-auto text-sm font-semibold leading-none text-black">
                                Semua Produk
                            </div>
                        </div>
                        
                        {/* Daftar Produk */}
                        {products.map((product) => (
                            <div key={product.orderProductID} className="flex flex-col mt-4 w-full">
                                <div className="flex gap-[12px] items-start w-full">
                                    <div className="flex gap-2 items-start">
                                        <div className="flex flex-col w-4">
                                            <input
                                                type="checkbox"
                                                checked={form.products.some(p => p.id === product.orderProductID)}
                                                onChange={(e) => handleSelectProduct(product.orderProductID, e.target.checked)}
                                                className="w-4 h-4 rounded border border-solid border-neutral-500"
                                            />
                                        </div>
                                        <div className='w-[68px] h-[68px]'>
                                            <img
                                                loading="lazy"
                                                src={product.imageUrl}
                                                alt={product.productName}
                                                className="object-contain shrink-0 rounded aspect-square w-[68px] h-[68px]"
                                            />
                                        </div>
                                        
                                    </div>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-col flex-1 shrink basis-0 max-w-[198px]">
                                            <div className="text-xs font-medium leading-3 text-black text-ellipsis max-w-[198px]">
                                                {product.productName}
                                            </div>
                                            <div className="flex flex-col mt-2 w-full">
                                                <div className="text-xs font-semibold leading-none text-neutral-600">
                                                    {product.productDetails || ''}
                                                </div>
                                                <div className="flex relative flex-col mt-3 w-full leading-none">
                                                    <div className="z-0 mt-2 text-sm font-bold text-black">
                                                        Rp{product.originalPrice?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium leading-none text-right text-ellipsis text-neutral-500">
                                            x{product.quantity}
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="flex !pl-[100px] gap-10 justify-between items-center mt-2 max-w-full leading-none text-black w-full">
                                    <div className="self-stretch my-auto text-xs font-medium">
                                        Jumlah yang Dikomplain
                                    </div>
                                    <div className="flex gap-2 items-center self-stretch my-auto text-sm font-semibold text-center whitespace-nowrap w-[110px]">
                                        <div className="flex items-start self-stretch my-auto w-[110px]">
                                            <div className="flex gap-2 items-center px-3 py-2 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] w-[110px]">
                                                <button 
                                                    onClick={() => {
                                                        const selectedProduct = form.products.find(p => p.id === product.orderProductID);
                                                        if (selectedProduct) {
                                                            handleQuantityChange(product.orderProductID, -1);
                                                        }
                                                    }}
                                                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                                                >
                                                    -
                                                </button>
                                                <div className="flex-1 shrink self-stretch my-auto basis-0">
                                                    {form.products.find(p => p.id === product.orderProductID)?.quantity || 0}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if (!form.products.some(p => p.id === product.orderProductID)) {
                                                            handleSelectProduct(product.orderProductID, true);
                                                        } else {
                                                            handleQuantityChange(product.orderProductID, 1);
                                                        }
                                                    }}
                                                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Deskripsi Komplain */}
                <div className="flex flex-col px-4 py-5 mt-2 w-full leading-none bg-white">
                    <div className="text-sm font-semibold text-black">
                        {form.alasanKomplain?.title || "Alasan Komplain"}
                    </div>
                    <div className="flex flex-col mt-6 w-full">
                        <div className="flex flex-col w-full">
                            <label htmlFor="complaintReason" className="text-sm font-semibold text-black opacity-90">
                                Alasan Komplain*
                            </label>
                            <div className="flex flex-col mt-4 w-full text-neutral-500">
                                <textarea
                                    id="complaintReason"
                                    value={form.description}
                                    onChange={(e) => setForm({ description: e.target.value })}
                                    className="min-h-[100px] gap-2 px-[12px] py-[11px] w-full AvenirNormal12px Color7B7B7B bg-white rounded-md border border-solid border-neutral-500 focus:outline-none focus:border-[#176CF7] focus:ring-1 focus:ring-[#176CF7]"
                                    placeholder="Lengkapi alasan komplain pesanan kamu"
                                    rows={4}
                                    maxLength={1000}
                                />
                                <div className="flex gap-6 items-start mt-3 w-full text-xs font-medium">
                                    <div className="flex-1 shrink basis-0">
                                        {form.description.length < 30 ? "Minimal 30 karakter" : ""}
                                    </div>
                                    <div className="text-right">({form.description.length}/1.000)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Solusi Komplain dan Evidence */}
                <div className="flex flex-col px-4 py-5 mt-2 w-full bg-white">
                    <div className="text-sm font-semibold leading-none text-black">
                        Solusi Komplain
                    </div>
                    <div className="flex flex-col mt-6 w-full">
                        {/* Form Bukti Video */}
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-semibold leading-none text-black">
                                Bukti Video*
                            </div>
                            <div className="flex gap-3 items-start mt-4 w-full">
                                <div className="flex flex-1 shrink gap-3 items-start w-full basis-0 min-w-[240px]">
                                    <label className="flex flex-col justify-center items-center px-2 text-xs font-medium leading-none text-center text-black whitespace-nowrap bg-white rounded-xl border border-dashed border-neutral-400 h-[72px] min-h-[72px] w-[72px] cursor-pointer">
                                        {evidenceState.videos.length > 0 ? (
                                            <div className="w-full h-full relative">
                                                <video 
                                                    src={evidenceState.videos[0].url} 
                                                    className="w-full h-full object-cover rounded-xl"
                                                    controls
                                                />
                                                <div className="absolute inset-0 opacity-0 hover:opacity-50 bg-black flex items-center justify-center text-white rounded-xl">
                                                    Ganti Video
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/fcd4befe6afd1567a0176d369ca16a356ec4ada3?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                                                    alt="Upload icon"
                                                    className="object-contain w-5 aspect-square"
                                                />
                                                <div className="mt-3">Unggah</div>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            accept="video/mp4"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex flex-col flex-1 shrink basis-4 min-w-[240px] text-neutral-500">
                                        <textarea
                                            className="flex-1 shrink gap-2 px-3 py-3 w-full text-sm font-semibold leading-4 bg-white rounded-md border border-solid border-neutral-500 focus:outline-none focus:border-[#176CF7] focus:ring-1 focus:ring-[#176CF7]"
                                            placeholder="Lengkapi deskripsi bukti komplain pesanan kamu"
                                            value={evidenceState.videos[0]?.description || ""}
                                            onChange={(e) => handleEvidenceDescriptionChange('videos', 0, e.target.value)}
                                            maxLength={225}
                                            disabled={evidenceState.videos.length === 0} // Deskripsi hanya bisa diisi setelah video diunggah
                                        />
                                        <div className="flex-1 shrink mt-3 w-full text-xs font-medium leading-none text-right whitespace-nowrap basis-0">
                                            {(evidenceState.videos[0]?.description?.length || 0)}/225
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs font-medium leading-tight text-neutral-500">
                                Unggah 1 video dengan format .mp4 maks 50MB
                            </div>
                        </div>

                        {/* Form Bukti Foto */}
                        <div className="flex flex-col mt-6 w-full">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full">
                                    <div className="flex gap-1 w-full font-semibold text-black">
                                        <div className="flex gap-1 items-center h-full">
                                            <div className="flex gap-1 items-center self-stretch my-auto">
                                                <div className="gap-1 self-stretch my-auto text-sm leading-none">
                                                    Bukti Gambar
                                                </div>
                                                <div className="self-stretch my-auto text-xs w-[49px]">
                                                    (Opsional)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tampilkan foto yang sudah diupload (visibel saja) */}
                                    {evidenceState.photos
                                        .filter(photo => !photo.hidden)
                                        .map((photo, index) => (
                                        <div className="flex gap-3 items-start mt-4 w-full" key={`photo-${index}`}>
                                            <div className="flex flex-1 shrink gap-3 items-start w-full basis-0 min-w-[240px]">
                                                <div className="relative flex flex-col justify-center items-center px-2 text-xs font-medium leading-none text-center text-black whitespace-nowrap bg-white rounded-xl border border-dashed border-neutral-400 h-[72px] min-h-[72px] w-[72px]">
                                                    <img 
                                                        src={photo.url}
                                                        alt="Bukti foto"
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                    <button
                                                        onClick={() => handleRemovePhoto(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                        type="button"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div className="flex flex-col flex-1 shrink basis-4 min-w-[240px] text-neutral-500">
                                                    <textarea
                                                        className="flex-1 shrink gap-2 px-3 py-3 w-full text-sm font-semibold leading-4 bg-white rounded-md border border-solid border-neutral-500 focus:outline-none focus:border-[#176CF7] focus:ring-1 focus:ring-[#176CF7]"
                                                        placeholder="Lengkapi deskripsi bukti komplain pesanan kamu"
                                                        value={photo.description || ""}
                                                        onChange={(e) => handleEvidenceDescriptionChange('photos', index, e.target.value)}
                                                        maxLength={225}
                                                    />
                                                    <div className="flex-1 shrink mt-3 w-full text-xs font-medium leading-none text-right whitespace-nowrap basis-0">
                                                        {(photo.description?.length || 0)}/225
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Render form input foto baru (maksimal 5) */}
                                    {photoInputsActive.map((isActive, index) => (
                                        isActive && (
                                            <div className="flex gap-3 items-start mt-4 w-full" key={`input-${index}`}>
                                                <div className="flex flex-1 shrink gap-3 items-start w-full basis-0 min-w-[240px]">
                                                    <label className="relative flex flex-col justify-center items-center px-2 text-xs font-medium leading-none text-center text-black whitespace-nowrap bg-white rounded-xl border border-dashed border-neutral-400 h-[72px] min-h-[72px] w-[72px] cursor-pointer">
                                                        <img
                                                            loading="lazy"
                                                            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/fcd4befe6afd1567a0176d369ca16a356ec4ada3?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                                                            alt="Upload icon"
                                                            className="object-contain w-5 aspect-square"
                                                        />
                                                        <div className="mt-3">Unggah</div>
                                                        <input
                                                            type="file"
                                                            ref={el => imageUploaderRefs.current[index] = el}
                                                            accept="image/jpeg,image/jpg,image/png"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        handleImageUpload(reader.result, index);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                // Hapus form input yang sedang aktif
                                                                const updatedInputs = [...photoInputsActive];
                                                                updatedInputs[index] = false;
                                                                
                                                                // Aktifkan input yang lain jika tidak ada yang aktif
                                                                if (!updatedInputs.some(active => active)) {
                                                                    updatedInputs[0] = true;
                                                                }
                                                                
                                                                setPhotoInputsActive(updatedInputs);
                                                                
                                                                // Reset deskripsi temporary
                                                                const updatedDescs = [...tempPhotoDescriptions];
                                                                updatedDescs[index] = "";
                                                                setTempPhotoDescriptions(updatedDescs);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                            type="button"
                                                        >
                                                            ×
                                                        </button>
                                                    </label>
                                                    <div className="flex flex-col flex-1 shrink basis-4 min-w-[240px] text-neutral-500">
                                                        <textarea
                                                            className="flex-1 shrink gap-2 px-3 py-3 w-full text-sm font-semibold leading-4 bg-white rounded-md border border-solid border-neutral-500 focus:outline-none focus:border-[#176CF7] focus:ring-1 focus:ring-[#176CF7]"
                                                            placeholder="Lengkapi deskripsi bukti komplain pesanan kamu"
                                                            value={tempPhotoDescriptions[index] || ""}
                                                            onChange={(e) => handleTempDescriptionChange(index, e.target.value)}
                                                            maxLength={225}
                                                        />
                                                        <div className="flex-1 shrink mt-3 w-full text-xs font-medium leading-none text-right whitespace-nowrap basis-0">
                                                            {(tempPhotoDescriptions[index]?.length || 0)}/225
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}

</div>
                                <div className="mt-2 text-xs font-medium leading-4 text-neutral-500">
                                    Unggah maksimal 5 foto dengan format .jpg/.jpeg/.png maks. 10MB
                                </div>
                            </div>
                            
                            {/* Tombol Tambah Foto */}
                            {(evidenceState.photos.filter(p => !p.hidden).length + photoInputsActive.filter(Boolean).length) < 5 && (
                                <div className="flex flex-col mt-3 w-full text-xs font-semibold leading-none text-blue-600">
                                    <button
                                        onClick={addNewPhoto}
                                        className="flex gap-1 justify-center items-center px-6 py-1.5 bg-white rounded-3xl border border-blue-600 border-solid min-h-[28px] min-w-[112px]"
                                        type="button"
                                    >
                                        <img
                                            loading="lazy"
                                            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/b7b95adc10aa95b137a4085e8791451cbe5d332e?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                                            alt="Add photo icon"
                                            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                                        />
                                        <div className="self-stretch my-auto">Tambah Foto</div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Solusi yang Diinginkan */}
                        <div className="flex flex-col mt-6 w-full text-sm font-semibold leading-none">
                            <div className="gap-1 self-stretch w-full text-black">
                                Solusi yang Diinginkan*
                            </div>
                            <div className="flex gap-2 items-center px-3 py-2 mt-4 w-full bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] text-neutral-500">
                                <select
                                    value={form.solusiDiinginkan?.id || ""}
                                    onChange={handleSolutionChange}
                                    disabled={loadingSolusi || !form.alasanKomplain}
                                    className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none appearance-none"
                                >
                                    <option value="">Pilih Solusi yang Ingin kamu Ajukan</option>
                                    {solusiKomplain && solusiKomplain.length > 0 ? (
                                        solusiKomplain.map((solusi) => (
                                            <option key={solusi.id} value={solusi.id}>
                                                {solusi.title}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            {loadingSolusi ? "Memuat..." : form.alasanKomplain ? "Tidak ada solusi tersedia" : "Pilih alasan komplain terlebih dahulu"}
                                        </option>
                                    )}
                                </select>
                                <img
                                    loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/294c4c453459ed9c4c71e019ee15ae18886f3d93?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                                    alt="Dropdown icon"
                                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Syarat dan Ketentuan */}
                <div className="flex flex-col justify-center px-4 py-5 mt-2 w-full bg-white">
                    <div className="flex gap-2 items-start w-full">
                        <div className="flex flex-col w-4">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-4 h-4 rounded border border-solid border-neutral-500"
                            />
                        </div>
                        <div className="flex-1 shrink text-sm font-semibold leading-4 text-black basis-0">
                            Saya menyetujui <a href="#" className="text-blue-600">Syarat dan Ketentuan</a> Pengajuan Komplain Pesanan.
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer dengan Tombol Submit */}
            <div className="flex flex-col mt-1 w-full text-sm font-semibold leading-none text-white">
                <div className="flex flex-col justify-center px-4 py-3 w-full bg-white rounded-xl shadow-[0px_-3px_55px_rgba(0,0,0,0.161)]">
                    <div className="flex gap-2.5 items-start w-full">
                        <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px]">
                            <div className="flex gap-2.5 items-center w-full">
                                <div className="flex flex-1 shrink gap-2 items-start self-stretch my-auto w-full basis-0 min-w-[240px]">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!agreed || isSubmitting}
                                        className={`flex-1 shrink gap-1 self-stretch px-6 py-4 w-full rounded-3xl basis-0 min-h-[40px] min-w-[160px] ${
                                            agreed && !isSubmitting ? 'bg-blue-600' : 'bg-blue-600 opacity-50 cursor-not-allowed'
                                        }`}
                                        type="button"
                                    >
                                        {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet untuk Alasan Komplain */}
            {showBottomSheet && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowBottomSheet(false)}
                    ></div>
                    <div className="relative z-50 w-full max-w-[480px]">
                        <ComplaintBottomSheet 
                            onClose={() => setShowBottomSheet(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComplainFormResponsive;
// LBM - Complaint Responsive - Andrew