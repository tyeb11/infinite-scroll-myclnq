import { useEffect, useReducer, useCallback } from "react";
import debounce from "lodash/debounce";

const INTERSECTION_THRESHOLD = 5;
const LOAD_DELAY_MS = 300; // request time
const INITIAL_STATE = {
  loading: false,
  currentPage: 1,
  data: [],
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "set": {
      return {
        ...state,
        ...payload,
      };
    }
    case "onGrabData": {
      return {
        ...state,
        loading: false,
        data: [...state.data, ...payload.data],
        currentPage: state.currentPage + 1,
      };
    }
    default:
      return state;
  }
};

const useLazyLoad = ({ triggerRef, onGrabData, options }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const _handleEntry = async (entry) => {
    const boundingRect = entry.boundingClientRect;
    const intersectionRect = entry.intersectionRect;

    if (
      !state.loading &&
      entry.isIntersecting &&
      intersectionRect.bottom - boundingRect.bottom <= INTERSECTION_THRESHOLD
    ) {
      dispatch({ type: "set", payload: { loading: true } }); // started request
      const data = await onGrabData(state.currentPage); // requested to fetch data
      dispatch({ type: "onGrabData", payload: { data } }); // set fetch data
    }
  };
  const handleEntry = debounce(_handleEntry, LOAD_DELAY_MS);

  const onIntersect = useCallback(
    (entries) => {
      handleEntry(entries[0]);
    },
    [handleEntry]
  );

  useEffect(() => {
    if (triggerRef.current) {
      const container = triggerRef.current; // trigger div
      const observer = new IntersectionObserver(onIntersect, options);

      observer.observe(container);

      return () => {
        observer.disconnect(); //clear observer
      };
    }
  }, [triggerRef, onIntersect, options]);

  return state;
};

export default useLazyLoad;
