import React, { createContext, useContext, useState, useEffect } from 'react';

const ServiceRequestContext = createContext();

export const useServiceRequest = () => {
  const context = useContext(ServiceRequestContext);
  if (!context) {
    throw new Error('useServiceRequest must be used within a ServiceRequestProvider');
  }
  return context;
};

export const ServiceRequestProvider = ({ children }) => {
  const [serviceRequests, setServiceRequests] = useState(() => {
    const savedRequests = localStorage.getItem('serviceRequests');
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  useEffect(() => {
    localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  const addServiceRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setServiceRequests(prev => [newRequest, ...prev]);
  };

  const updateServiceRequest = (id, updates) => {
    setServiceRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, ...updates, updatedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const deleteServiceRequest = (id) => {
    setServiceRequests(prev => prev.filter(request => request.id !== id));
  };

  return (
    <ServiceRequestContext.Provider
      value={{
        serviceRequests,
        addServiceRequest,
        updateServiceRequest,
        deleteServiceRequest
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
}; 