import { theme } from "@/constants/theme";
import { capitalize, hp } from "@/helpers/common";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainerStyle}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedButtonText: {},
});
