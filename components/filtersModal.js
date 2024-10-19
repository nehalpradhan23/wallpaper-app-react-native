import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { CommonFilterRow, SectionView } from "./filterViews";
import { data } from "@/constants/data";

const FiltersModal = ({
  modalRef,
  filters,
  onClose,
  setFilters,
  onApply,
  onReset,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);

  // =====================================================
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalize(sectionName);
            return (
              <View key={sectionName}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </View>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default FiltersModal;

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <CommonFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const containerStyle = [
    style,
    styles.overlay,
    StyleSheet.absoluteFill,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      {/* blur view */}
      <BlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={20}
        experimentalBlurMethod="dimezisBlurView"
        blurReductionFactor={4}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 24,
  //   justifyContent: "center",
  //   backgroundColor: "grey",
  // },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  content: {
    // flex: 1,
    width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
});
