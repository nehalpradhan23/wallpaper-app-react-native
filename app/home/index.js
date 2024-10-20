import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import ImageGrid from "@/components/imageGrid";
import { debounce } from "lodash";
import FiltersModal from "@/components/filtersModal";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const modalRef = useRef(null);
  const [filters, setFilters] = useState(null);

  // ===========================================================
  const applyFilters = () => {
    console.log("applying filter");
    closeFiltersModal();
  };
  const resetFilters = () => {
    console.log("resetting filter");
    setFilters(null);
    // closeFiltersModal();
  };
  // ===========================================================
  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = false) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };

  // ====================================================
  const handleSearch = (text) => {
    setSearch(text);

    if (text.length > 2) {
      page = 1;
      setImages([]);
      fetchImages({ page, q: text }, false);
      setActiveCategory(null);
    }

    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  // open filter
  const openFiltersModal = () => {
    modalRef?.current?.present();
  };
  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  // ===========================================
  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header ========================== */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        {/* filter button ------------------------------- */}
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 15 }}>
        {/* search bar ----------------------------- */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Serch"
            ref={searchInputRef}
            // value={search}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        {/* categories ----------------------------- */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* images --------------------------------------- */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
      {/* filter modal ==================================== */}
      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
});
