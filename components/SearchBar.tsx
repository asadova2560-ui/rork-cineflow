import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

function SearchBarInner({ value, onChangeText, placeholder = "Filmlar, seriallar, multfilmlar", onFilterPress, showFilter = true }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          testID="search-input"
        />
      </View>
      {showFilter && onFilterPress && (
        <Pressable style={styles.filterButton} onPress={onFilterPress} testID="filter-button">
          <SlidersHorizontal size={22} color={Colors.text} />
        </Pressable>
      )}
    </View>
  );
}

export const SearchBar = React.memo(SearchBarInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    padding: 0,
  },
  filterButton: {
    backgroundColor: Colors.searchBackground,
    padding: 12,
    borderRadius: 12,
  },
});
