// Create, delete slides and slide transitions hook
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeData } from '../services/putData';
import { fetchData } from '../services/getData';

function useSlideManager (pptName) {
  const [slides, setSlides] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  /***************************************************************
                       Get the newest slides data
  ***************************************************************/
  const fetchSlide = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const storeData = await fetchData(token);
    setSlides(storeData.presentations[pptName].slides);
    setIsLoading(false);
  };

  /***************************************************************
                       Update the slides to backend
  ***************************************************************/
  const updateSlides = async (newSlides) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const storeData = await fetchData(token);
      const newPresentations = {
        ...storeData.presentations,
        [pptName]: {
          ...storeData.presentations[pptName],
          slides: newSlides
        }
      };
      await upgradeData(token, { ...storeData, presentations: newPresentations });
      fetchSlide();
    } catch (error) {
      console.error('Error updating slides:', error);
    }
  };

  const renumberSlides = (slides, deleteId) => {
    const updatedSlides = {};
    let index = 1;
    for (const key in slides) {
      // renew id after delete slide
      if (key !== `slide${deleteId}`) {
        updatedSlides[`slide${index}`] = {
          ...slides[key],
          id: index
        };
        index++;
      }
    }
    return updatedSlides;
  };

  /***************************************************************
                       Add Slide
  ***************************************************************/
  const handleAddSlide = async () => {
    fetchSlide();
    const newSlideId = Object.keys(slides).length + 1;
    const newSlides = {
      ...slides,
      [`slide${newSlideId}`]: { id: newSlideId, content1: { type: '', data: '' } }
    };
    updateSlides(newSlides);
  };

  /***************************************************************
                       Delete Slide
  ***************************************************************/
  const deleteSlide = async (slideId) => {
    fetchSlide();
    if (Object.keys(slides).length === 1) {
      alert('Cannot delete the only slide. Please delete the presentation instead.');
      return;
    }
    const newSlides = { ...slides };
    delete newSlides[`slide${slideId}`];
    const updatedSlides = renumberSlides(newSlides, slideId);
    updateSlides(updatedSlides);
  };

  /***************************************************************
                       Return the const and functions
  ***************************************************************/
  return {
    slides,
    handleAddSlide,
    deleteSlide,
    fetchSlide,
    isLoading,
    updateSlides,
  };
}

export default useSlideManager;
