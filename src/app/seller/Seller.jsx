// Seller.jsx
"use client";

import { viewport } from "@/store/viewport";
import SellerWeb from "./SellerWeb";
import SellerResponsive from "./SellerResponsive";
import { useState, useEffect, useCallback } from "react";
import mockAPI from '@/services/MockServer_ProfileSellerBuyer';
import { useHeader } from "@/common/ResponsiveContext";
import useImmediateIntervalEffect from "@/libs/useImmediateIntervalEffect";

function Seller() {
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile } = viewport();
  const { search } = useHeader();
  const tabs = ["Beranda", "Etalase", "Ulasan"];

  // Shared state
  const [isFirstProductFetch, setIsFirstProductFetch] = useState(true)
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState({
    bestSeller: [],
    favorite: [],
    new: []
  });
  const [vouchers, setVouchers] = useState([]);
  const [showcases, setShowcases] = useState([]);
  const [etalaseProducts, setEtalaseProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Filter
  // const []

  // Web-specific shared search state
  const defaultFilter = {
    rating: [],
    isWithImage: false,
    sort: "newest",
    page: 1
  }
  const [selectedEtalaseOption, setSelectedEtalaseOption] = useState(null);
  const [webSearch, setWebSearch] = useState("");
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [filter, setFilter] = useState(defaultFilter)
  
  const etalaseData = {
    showcases,
    products: etalaseProducts
  };

  // Fetch store data
  const fetchStoreData = async () => {
    try {
      const data = await mockAPI.getStoreInfo(1);
      setStoreData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch store data');
      console.error('Error fetching store data:', err);
    }
  };

  useImmediateIntervalEffect(fetchStoreData, 30000);

  // Fetch products
  const fetchProducts = async (searchQuery = "", sort = "newest") => {
    setLoading(true);
    try {
      const [bestSellerProducts, favoriteProducts, newProducts] = await Promise.all([
        mockAPI.getProducts(1, 'best-seller', sort, searchQuery),
        mockAPI.getProducts(1, 'favorite', sort, searchQuery),
        mockAPI.getProducts(1, 'new', sort, searchQuery)
      ]);

      setProducts({
        bestSeller: isFirstProductFetch && bestSellerProducts.length < 3 ? [] : bestSellerProducts,
        favorite: isFirstProductFetch && favoriteProducts.length < 3 ? [] : favoriteProducts,
        new: isFirstProductFetch && newProducts.length < 3 ? [] : newProducts
      });
      setIsFirstProductFetch(false)
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await mockAPI.getReviews();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching showcases:', err);
    }
  };

  const fetchStoreReviewSummary = async () => {
    try {
      const data = await mockAPI.getStoreReviewSummary();
      setReviewSummary(data)
    } catch (err) {
      console.error('Error fetching showcases:', err);
    }
  };

  // Fetch showcases
  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        const data = await mockAPI.getEtalaseShowcases();
        setShowcases(data);
      } catch (err) {
        console.error('Error fetching showcases:', err);
      }
    };
    fetchShowcases();
  }, []);

  // Fetch etalase products
  const fetchEtalaseProducts = async (searchQuery = "", sort = "", page = 1) => {
    try {
      const data = await mockAPI.getEtalaseProducts(searchQuery, sort, page, isMobile);
      setEtalaseProducts(data);
    } catch (err) {
      console.error('Error fetching etalase products:', err);
    }
  };

  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await mockAPI.getVouchers(1);
        setVouchers(data);
      } catch (err) {
        console.error('Error fetching vouchers:', err);
      }
    };
    fetchVouchers();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle web search
  useEffect(() => {
    if (!isMobile && activeTab === 0) {
      fetchProducts(webSearchQuery);
    } else if (activeTab === 0) {
      fetchProducts(search.value);
    } else if (!isMobile && activeTab === 1) {
      fetchEtalaseProducts(webSearchQuery, filter.sort, filter.page)
    } else if (activeTab === 1) {
      fetchEtalaseProducts(search.value, filter.sort, filter.page)
    } else if (activeTab === 2) {
      fetchReviews()
    }
  }, [webSearchQuery, isMobile, search.value, activeTab, JSON.stringify(filter)]);

  // useEffect(() => {
  //   if (isMobile && activeTab === 0) {
  //     fetchProducts(search.value)
  //   }
  // }, [activeTab, isMobile, search.value])

  // useEffect(() => {
  //   if (!isMobile && activeTab === 1) {
  //     fetchEtalaseProducts(webSearchQuery, filter.sort, filter.page)
  //   }
  // }, [activeTab, isMobile, JSON.stringify(filter), webSearchQuery])

  // useEffect(() => {
  //   if (isMobile && activeTab === 1) {
  //     fetchEtalaseProducts(webSearchQuery, filter.sort, filter.page)
  //   }
  // }, [activeTab, isMobile, JSON.stringify(filter), webSearchQuery])

  useEffect(() => {
    if (activeTab === 2) {
      fetchStoreReviewSummary()
    }
  }, [activeTab])

  useEffect(() => {
    if (etalaseData.showcases.length > 0) {
        setSelectedEtalaseOption({ type: "showcase", value: etalaseData.showcases[0] })
    }
}, [JSON.stringify(etalaseData.showcases)])

  const toggleFavorite = async (productId) => {
    try {
      const newFavoriteState = !favorites[productId];
      await mockAPI.toggleFavorite(productId, newFavoriteState);
      setFavorites(prev => ({
        ...prev,
        [productId]: newFavoriteState
      }));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const productsWithFavorites = (products) => {
    return products.map(product => ({
      ...product,
      isFavorited: favorites[product.id] || false,
      onFavoriteClick: () => toggleFavorite(product.id)
    }));
  };

  const handleChangeTab = (value) => () => {
    setActiveTab(value)
    setWebSearch("")
    setWebSearchQuery("")
    setFilter(defaultFilter)
    setSelectedEtalaseOption({ type: "showcase", value: etalaseData.showcases[0] })
  }

  if (typeof isMobile !== "boolean") return null;

  const sharedProps = {
    activeTab,
    setActiveTab,
    onChangeTab: handleChangeTab,
    tabs,
    storeData,
    products,
    vouchers,
    etalaseData,
    reviews,
    reviewSummary,
    loading,
    error,
    productsWithFavorites,
    fetchProducts,
    defaultFilter,
    filter,
    setFilter,
    // Etalase
    selectedEtalaseOption,
    setSelectedEtalaseOption
  };

  // Add web-specific search props
  const webProps = {
    search: webSearch,
    setSearch: setWebSearch,
    searchQuery: webSearchQuery,
    setSearchQuery: setWebSearchQuery,
  };

  return isMobile ? (
    <SellerResponsive {...sharedProps} />
  ) : (
    <SellerWeb {...sharedProps} {...webProps} />
  );
}

export default Seller;