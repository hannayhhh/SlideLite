// Create, delete slides and slide transitions hook
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context/StoreContext';

function useSlideManager (presentationId, initialSlides = null) {
  const navigate = useNavigate();
  const { store, isLoading: storeLoading, refreshStore, updateStoreData } = useStoreContext();
  const slides = store?.presentations?.[presentationId]?.slides || initialSlides || {};
  const isLoading = storeLoading && Object.keys(slides).length === 0;

  /***************************************************************
                       Get the newest slides data
  ***************************************************************/
  const fetchSlide = async (options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return {};
    }

    const latestStore = await refreshStore(options);
    return latestStore?.presentations?.[presentationId]?.slides || {};
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

    try {
      await updateStoreData((latestStore) => {
        const latestPresentation = latestStore?.presentations?.[presentationId];
        if (!latestPresentation) {
          return latestStore;
        }

        const latestSlides = latestPresentation.slides || {};
        const newSlides = typeof slidesOrUpdater === 'function'
          ? slidesOrUpdater(latestSlides)
          : slidesOrUpdater;

        return {
          ...latestStore,
          presentations: {
            ...latestStore.presentations,
            [presentationId]: {
              ...latestPresentation,
              slides: newSlides
            }
          }
        };
      }, { refresh });
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
    updateSlides((latestSlides) => {
      const newSlideId = Object.keys(latestSlides).length + 1;
      return {
        ...latestSlides,
        [`slide${newSlideId}`]: { id: newSlideId, background: '#fff', backgroundStyle: '', content1: { type: '', data: '' } }
      };
    }, { refresh: false });
  };

  /***************************************************************
                       Delete Slide
  ***************************************************************/
  const deleteSlide = async (slideId) => {
    updateSlides((latestSlides) => {
      if (Object.keys(latestSlides).length === 1) {
        alert('Cannot delete the only slide. Please delete the presentation instead.');
        return latestSlides;
      }
      const newSlides = { ...latestSlides };
      delete newSlides[`slide${slideId}`];
      return renumberSlides(newSlides, slideId);
    }, { refresh: false });
  };

  /***************************************************************
                       Delete Element
  ***************************************************************/
  const deleteElement = async (slideId, contentId) => {
    updateSlides((latestSlides) => {
      const newSlides = { ...latestSlides };
      const currentSlideContents = newSlides[`slide${slideId}`];

      if (!currentSlideContents || !currentSlideContents[`content${contentId}`]) {
        console.error('Slide or content does not exist');
        return latestSlides;
      }

      delete currentSlideContents[`content${contentId}`];

      const updatedContents = renumberContents(currentSlideContents, contentId);

      newSlides[`slide${slideId}`] = {
        ...currentSlideContents,
        ...updatedContents
      };

      return newSlides;
    }, { refresh: false });
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
