import { useState, useEffect } from 'react';
import { carService } from '../services/api';

/**
 * Custom hook to fetch and manage cars data
 * Centralizes car data fetching across the application
 * 
 * @returns {{
 *   cars: Array,
 *   isLoading: Boolean,
 *   error: Error|null,
 *   refetch: Function,
 *   getCar: Function
 * }}
 */
export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await carService.getAll();
      setCars(res.data.data || []);
    } catch (err) {
      setError(err);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Get a single car by ID
  const getCar = (carId) => cars.find(c => c.id === Number(carId));

  return {
    cars,
    isLoading,
    error,
    refetch: fetchCars,
    getCar,
  };
};

export default useCars;
