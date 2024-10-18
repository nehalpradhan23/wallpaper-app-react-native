import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ImageGrid = ({ images }) => {
  return (
    <View>
      <Text>{JSON.stringify(images)}</Text>
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({});
