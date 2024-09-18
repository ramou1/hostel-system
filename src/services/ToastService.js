import { useToast } from '@chakra-ui/react';

const useToastService = () => {
  const toast = useToast();

  const showToast = (status, title, description) => {
    toast({
      title: title || 'Notification',
      description: description || '',
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return {
    showSuccess: (title, description) => showToast('success', title, description),
    showError: (title, description) => showToast('error', title, description),
    showWarning: (title, description) => showToast('warning', title, description),
    showInfo: (title, description) => showToast('info', title, description),
  };
};

export default useToastService;
