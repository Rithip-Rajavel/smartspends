import { Dimensions, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro dimensions as reference)
const baseWidth = 375;
const baseHeight = 812;

// Responsive width calculation
export const wp = (widthPercent: number): number => {
  const screenWidth = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

// Responsive height calculation
export const hp = (heightPercent: number): number => {
  const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

// Scale based on width (for fonts, icons, etc.)
export const scale = (size: number): number => {
  const screenWidth = Dimensions.get('window').width;
  const scaleFactor = screenWidth / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scaleFactor);
};

// Scale based on height
export const verticalScale = (size: number): number => {
  const screenHeight = Dimensions.get('window').height;
  const scaleFactor = screenHeight / baseHeight;
  return PixelRatio.roundToNearestPixel(size * scaleFactor);
};

// Moderate scale (between width and height scaling)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const screenWidth = Dimensions.get('window').width;
  const scaleFactor = screenWidth / baseWidth;
  return PixelRatio.roundToNearestPixel(size + (scaleFactor - 1) * size * factor);
};

// Get device type
export const getDeviceType = (): 'phone' | 'tablet' => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const aspectRatio = Math.max(screenWidth, screenHeight) / Math.min(screenWidth, screenHeight);
  
  // Consider tablet if aspect ratio is less than 1.6 or screen width is greater than 600
  return aspectRatio < 1.6 || screenWidth > 600 ? 'tablet' : 'phone';
};

// Responsive font sizes
export const fontSizes = {
  xs: scale(10),
  sm: scale(12),
  base: scale(14),
  lg: scale(16),
  xl: scale(18),
  '2xl': scale(20),
  '3xl': scale(24),
  '4xl': scale(28),
  '5xl': scale(32),
  '6xl': scale(36),
};

// Responsive spacing
export const spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(5),
  '2xl': wp(6),
  '3xl': wp(8),
  '4xl': wp(10),
  '5xl': wp(12),
};

// Responsive border radius
export const borderRadius = {
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(6),
  '2xl': wp(8),
  full: wp(50),
};

// Responsive icon sizes
export const iconSizes = {
  xs: scale(12),
  sm: scale(16),
  md: scale(20),
  lg: scale(24),
  xl: scale(28),
  '2xl': scale(32),
  '3xl': scale(36),
  '4xl': scale(40),
  '5xl': scale(48),
};

// Responsive shadow
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.15,
    shadowRadius: wp(2),
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: wp(3),
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.25,
    shadowRadius: wp(4),
    elevation: 12,
  },
};

// Chart dimensions
export const chartDimensions = {
  width: wp(90),
  height: hp(25),
  pieChartSize: wp(80),
  barChartWidth: wp(85),
  lineChartHeight: hp(20),
};

// Card dimensions
export const cardDimensions = {
  small: {
    width: wp(40),
    height: hp(15),
  },
  medium: {
    width: wp(45),
    height: hp(18),
  },
  large: {
    width: wp(90),
    height: hp(25),
  },
  full: {
    width: wp(90),
    height: hp(30),
  },
};

// Button dimensions
export const buttonDimensions = {
  small: {
    height: hp(5),
    paddingHorizontal: wp(4),
  },
  medium: {
    height: hp(6),
    paddingHorizontal: wp(5),
  },
  large: {
    height: hp(7),
    paddingHorizontal: wp(6),
  },
};

// Input field dimensions
export const inputDimensions = {
  height: hp(6),
  paddingHorizontal: wp(4),
  fontSize: fontSizes.base,
};

// Tab bar dimensions
export const tabBarDimensions = {
  height: hp(8),
  iconSize: iconSizes.md,
  fontSize: fontSizes.sm,
};

// Header dimensions
export const headerDimensions = {
  height: hp(10),
  fontSize: fontSizes['2xl'],
  iconSize: iconSizes.lg,
};

// List item dimensions
export const listItemDimensions = {
  height: hp(8),
  padding: wp(4),
  fontSize: fontSizes.base,
  iconSize: iconSizes.md,
};

// Export current screen dimensions for reference
export { screenWidth, screenHeight };
