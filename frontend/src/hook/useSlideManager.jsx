// Create, delete slides and slide transitions hook
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeData } from '../services/putData';
import { fetchData } from '../services/getData';

function useSlideManager (pptName) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState({});
  const navigate = useNavigate();

  const fetchSlide = async () => {
    const token = localStorage.getItem('token');
    const storeData = await fetchData(token);
    setSlides(storeData.presentations[pptName].slides);
  }

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

  // Add slide logic
  const handleAddSlide = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const storeData = await fetchData(token);
      setSlides(storeData.presentations[pptName].slides);
      const newSlideId = Object.keys(slides).length + 1;
      const newSlides = {
        ...slides,
        [`slide${newSlideId}`]: { id: newSlideId, content1: { type: '', data: '' } }
      };

      const newPresentations = {
        ...storeData.presentations,
        [pptName]: {
          ...storeData.presentations[pptName],
          slides: newSlides
        }
      };
      await upgradeData(token, { ...storeData, presentations: newPresentations });
      setSlides(newSlides);
    } catch (error) {
      console.error('Failed to add new slide:', error);
    }
  };

  // delete slide logic
  const deleteSlide = async (slideId) => {
    fetchSlide();
    if (Object.keys(slides).length === 1) {
      alert('Cannot delete the only slide. Please delete the presentation instead.');
      return;
    }
    const newSlides = { ...slides };
    delete newSlides[`slide${slideId}`];
    const updatedSlides = renumberSlides(newSlides, slideId);
    try {
      const token = localStorage.getItem('token');
      const storeData = await fetchData(token);
      const newPresentations = {
        ...storeData.presentations,
        [pptName]: {
          ...storeData.presentations[pptName],
          slides: updatedSlides
        }
      };
      await upgradeData(token, { ...storeData, presentations: newPresentations });
      fetchSlide();
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1 < Object.keys(slides).length ? prev + 1 : prev));
  };

  const previousSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return {
    slides,
    currentSlideIndex,
    handleAddSlide,
    deleteSlide,
    nextSlide,
    previousSlide,
    fetchSlide
  };
}

export default useSlideManager;
