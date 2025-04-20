import React, { useState, useEffect } from 'react';
import { Slider, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { defaultFilters } from '../config/editorConfig';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  sliderContainer: {
    marginBottom: theme.spacing(2),
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  previewContainer: {
    marginTop: theme.spacing(2),
  },
  previewGradient: {
    width: '100%',
    height: 30,
    background: 'linear-gradient(90deg, #f44336, #e91e63, #9c27b0, #673ab7, #3f51b5, #2196f3, #03a9f4, #00bcd4, #009688, #4caf50, #8bc34a, #cddc39, #ffeb3b, #ffc107, #ff9800, #ff5722)',
    marginTop: theme.spacing(1),
    borderRadius: 4,
  }
}));

/**
 * Component for image filter controls
 * Provides sliders for adjusting brightness, contrast, saturation and blur
 */
const FilterControls = ({ initialFilters, onChange, onReset }) => {
  const classes = useStyles();
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });

  useEffect(() => {
    if (initialFilters) {
      setFilters({ ...defaultFilters, ...initialFilters });
    }
  }, [initialFilters]);

  const handleChange = (filter) => (event, newValue) => {
    const updatedFilters = { ...filters, [filter]: newValue };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleReset = () => {
    setFilters({ ...defaultFilters });
    onChange({ ...defaultFilters });
    if (onReset) onReset();
  };

  // Generate filter CSS string
  const getFilterString = (filterValues) => {
    return `brightness(${filterValues.brightness}%) 
            contrast(${filterValues.contrast}%) 
            saturate(${filterValues.saturation}%) 
            blur(${filterValues.blur}px)`;
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h6" component="h2">
          Image Adjustments
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          size="small" 
          onClick={handleReset}
        >
          Reset All
        </Button>
      </div>

      <div className={classes.sliderContainer}>
        <div className={classes.sliderHeader}>
          <Typography id="brightness-slider">Brightness</Typography>
          <Typography>{filters.brightness}%</Typography>
        </div>
        <Slider
          aria-labelledby="brightness-slider"
          value={filters.brightness}
          onChange={handleChange('brightness')}
          min={0}
          max={200}
          step={5}
        />
      </div>

      <div className={classes.sliderContainer}>
        <div className={classes.sliderHeader}>
          <Typography id="contrast-slider">Contrast</Typography>
          <Typography>{filters.contrast}%</Typography>
        </div>
        <Slider
          aria-labelledby="contrast-slider"
          value={filters.contrast}
          onChange={handleChange('contrast')}
          min={0}
          max={200}
          step={5}
        />
      </div>

      <div className={classes.sliderContainer}>
        <div className={classes.sliderHeader}>
          <Typography id="saturation-slider">Saturation</Typography>
          <Typography>{filters.saturation}%</Typography>
        </div>
        <Slider
          aria-labelledby="saturation-slider"
          value={filters.saturation}
          onChange={handleChange('saturation')}
          min={0}
          max={200}
          step={5}
        />
      </div>

      <div className={classes.sliderContainer}>
        <div className={classes.sliderHeader}>
          <Typography id="blur-slider">Blur</Typography>
          <Typography>{filters.blur}px</Typography>
        </div>
        <Slider
          aria-labelledby="blur-slider"
          value={filters.blur}
          onChange={handleChange('blur')}
          min={0}
          max={10}
          step={0.5}
        />
      </div>

      <div className={classes.previewContainer}>
        <Typography variant="body2" color="textSecondary">
          Preview:
        </Typography>
        <div
          className={classes.previewGradient}
          style={{ filter: getFilterString(filters) }}
        />
      </div>
    </div>
  );
};

export default FilterControls; 