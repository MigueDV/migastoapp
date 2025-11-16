import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  montoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
  },
  montoSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  montoInput: {
    flex: 1,
    height: 60,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  categoriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaButton: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  categoriaButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  categoriaIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoriaText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  categoriaTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
});
