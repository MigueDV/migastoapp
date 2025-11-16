import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    marginRight: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});