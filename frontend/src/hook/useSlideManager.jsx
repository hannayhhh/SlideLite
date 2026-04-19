// Create, delete slides and slide transitions hook
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeData } from '../services/putData';
import { fetchData } from '../services/getData';

function useSlideManager (pptName) {
  const [slides, setSlides] = useState({});
  const slidesRef = useRef({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  /***************************************************************
                       Get the newest slides data
  ***************************************************************/
  const fetchSlide = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const storeData = await fetchData(token);
    const latestSlides = storeData.presentations[pptName].slides;
    slidesRef.current = latestSlides;
    setSlides(latestSlides);
    setIsLoading(false);
  };

  /***************************************************************
                       Update the slides to backend
  ***************************************************************/
  const updateSlides = async (slidesOrUpdater, options = {}) => {
    const { refresh = true } = options;
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const newSlides = typeof slidesOrUpdater === 'function'
      ? slidesOrUpdater(slidesRef.current)
      : slidesOrUpdater;

    try {
      slidesRef.current = newSlides;
      setSlides(newSlides);
      const storeData = await fetchData(token);
      const newPresentations = {
        ...storeData.presentations,
        [pptName]: {
          ...storeData.presentations[pptName],
          slides: newSlides
        }
      };
      await upgradeData(token, { ...storeData, presentations: newPresentations });
      if (refresh) {
        fetchSlide();
      }
    } catch (error) {
      console.error('Error updating slides:', error);
    }
  };

  /***************************************************************
                       Renumber Slides
  ***************************************************************/
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
      [`slide${newSlideId}`]: { id: newSlideId, background: '#fff', backgroundStyle: '', content1: { type: '', data: '' } }
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
                       Delete Element
  ***************************************************************/
  const deleteElement = async (slideId, contentId) => {
    await fetchSlide();
    const newSlides = { ...slides };
    const currentSlideContents = newSlides[`slide${slideId}`];

    if (currentSlideContents && currentSlideContents[`content${contentId}`]) {
      delete currentSlideContents[`content${contentId}`];

      const updatedContents = renumberContents(currentSlideContents, contentId);

      newSlides[`slide${slideId}`] = {
        ...currentSlideContents,
        ...updatedContents
      };
      updateSlides(newSlides);
    } else {
      console.error('Slide or content does not exist');
    }
  };

  const renumberContents = (contents, deleteContentId) => {
    const updatedContents = {};
    let newIndex = 1;
    for (const key in contents) {
      if (key.startsWith('content') && key !== `content${deleteContentId}`) {
        updatedContents[`content${newIndex}`] = {
          ...contents[key],
          id: newIndex
        };
        newIndex++;
      }
    }
    return updatedContents;
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
    deleteElement,
  };
}

export default useSlideManager;
