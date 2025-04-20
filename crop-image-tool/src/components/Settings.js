import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaPalette, FaKeyboard, FaLock } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    appearance: {
      theme: 'system', // system, light, dark
      uiDensity: 'comfortable', // comfortable, compact
      showGridLines: true,
      accentColor: '#4285f4',
    },
    editor: {
      defaultAspectRatio: 'free',
      defaultFormat: 'png',
      defaultQuality: 0.9,
      preserveEXIF: true,
      showTransformationValues: true,
      enableAutoSuggestions: true,
    },
    keyboard: {
      cropShortcut: 'Ctrl+Enter',
      rotateLeftShortcut: 'Ctrl+[',
      rotateRightShortcut: 'Ctrl+]',
      flipHorizontalShortcut: 'Ctrl+H',
      flipVerticalShortcut: 'Ctrl+V',
      undoShortcut: 'Ctrl+Z',
      redoShortcut: 'Ctrl+Y',
      resetShortcut: 'Ctrl+R',
    },
    advanced: {
      maxImageSize: 20, // In MB
      autosaveInterval: 30, // In seconds
      enableCloudIntegration: false,
      enableAnalytics: false,
      keepOriginalCopy: true,
    },
    privacy: {
      localProcessingOnly: true,
      autoDeleteAfterDownload: true,
      imageMetadataHandling: 'preserve', // preserve, strip, customize
    }
  });
  
  const [isDirty, setIsDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('crop-tool-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);
  
  // Handle setting changes
  const handleChange = (category, setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [setting]: value
      }
    }));
    setIsDirty(true);
    
    // Clear success message when changes are made
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('crop-tool-settings', JSON.stringify(settings));
    setIsDirty(false);
    setSuccessMessage('Settings saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Reset settings to default
  const resetSettings = (category) => {
    if (window.confirm(`Are you sure you want to reset ${category} settings to default?`)) {
      // Define default settings for each category
      const defaultSettings = {
        appearance: {
          theme: 'system',
          uiDensity: 'comfortable',
          showGridLines: true,
          accentColor: '#4285f4',
        },
        editor: {
          defaultAspectRatio: 'free',
          defaultFormat: 'png',
          defaultQuality: 0.9,
          preserveEXIF: true,
          showTransformationValues: true,
          enableAutoSuggestions: true,
        },
        keyboard: {
          cropShortcut: 'Ctrl+Enter',
          rotateLeftShortcut: 'Ctrl+[',
          rotateRightShortcut: 'Ctrl+]',
          flipHorizontalShortcut: 'Ctrl+H',
          flipVerticalShortcut: 'Ctrl+V',
          undoShortcut: 'Ctrl+Z',
          redoShortcut: 'Ctrl+Y',
          resetShortcut: 'Ctrl+R',
        },
        advanced: {
          maxImageSize: 20,
          autosaveInterval: 30,
          enableCloudIntegration: false,
          enableAnalytics: false,
          keepOriginalCopy: true,
        },
        privacy: {
          localProcessingOnly: true,
          autoDeleteAfterDownload: true,
          imageMetadataHandling: 'preserve',
        }
      };
      
      setSettings(prevSettings => ({
        ...prevSettings,
        [category]: defaultSettings[category]
      }));
      
      setIsDirty(true);
    }
  };
  
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="settings-actions">
          <button 
            className="btn btn-primary" 
            onClick={saveSettings}
            disabled={!isDirty}
          >
            <FaSave /> Save Settings
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="settings-sections">
        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3><FaPalette /> Appearance</h3>
            <button 
              className="btn btn-small reset-btn" 
              onClick={() => resetSettings('appearance')}
            >
              <FaUndo /> Reset
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="theme">Theme:</label>
              <select 
                id="theme" 
                value={settings.appearance.theme}
                onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
              >
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label htmlFor="uiDensity">UI Density:</label>
              <select 
                id="uiDensity" 
                value={settings.appearance.uiDensity}
                onChange={(e) => handleChange('appearance', 'uiDensity', e.target.value)}
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label htmlFor="showGridLines">Show Grid Lines:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="showGridLines" 
                  checked={settings.appearance.showGridLines}
                  onChange={(e) => handleChange('appearance', 'showGridLines', e.target.checked)}
                />
                <label htmlFor="showGridLines" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="accentColor">Accent Color:</label>
              <input 
                type="color" 
                id="accentColor" 
                value={settings.appearance.accentColor}
                onChange={(e) => handleChange('appearance', 'accentColor', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Editor Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3><FaCropAlt /> Editor</h3>
            <button 
              className="btn btn-small reset-btn" 
              onClick={() => resetSettings('editor')}
            >
              <FaUndo /> Reset
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="defaultAspectRatio">Default Aspect Ratio:</label>
              <select 
                id="defaultAspectRatio" 
                value={settings.editor.defaultAspectRatio}
                onChange={(e) => handleChange('editor', 'defaultAspectRatio', e.target.value)}
              >
                <option value="free">Free</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="3:4">3:4</option>
                <option value="9:16">9:16</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label htmlFor="defaultFormat">Default Format:</label>
              <select 
                id="defaultFormat" 
                value={settings.editor.defaultFormat}
                onChange={(e) => handleChange('editor', 'defaultFormat', e.target.value)}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label htmlFor="defaultQuality">Default Quality: {Math.round(settings.editor.defaultQuality * 100)}%</label>
              <input 
                type="range" 
                id="defaultQuality" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={settings.editor.defaultQuality}
                onChange={(e) => handleChange('editor', 'defaultQuality', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="preserveEXIF">Preserve EXIF Data:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="preserveEXIF" 
                  checked={settings.editor.preserveEXIF}
                  onChange={(e) => handleChange('editor', 'preserveEXIF', e.target.checked)}
                />
                <label htmlFor="preserveEXIF" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="showTransformationValues">Show Transformation Values:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="showTransformationValues" 
                  checked={settings.editor.showTransformationValues}
                  onChange={(e) => handleChange('editor', 'showTransformationValues', e.target.checked)}
                />
                <label htmlFor="showTransformationValues" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="enableAutoSuggestions">Enable Auto Crop Suggestions:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="enableAutoSuggestions" 
                  checked={settings.editor.enableAutoSuggestions}
                  onChange={(e) => handleChange('editor', 'enableAutoSuggestions', e.target.checked)}
                />
                <label htmlFor="enableAutoSuggestions" className="toggle-label"></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Keyboard Shortcuts */}
        <div className="settings-section">
          <div className="section-header">
            <h3><FaKeyboard /> Keyboard Shortcuts</h3>
            <button 
              className="btn btn-small reset-btn" 
              onClick={() => resetSettings('keyboard')}
            >
              <FaUndo /> Reset
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="cropShortcut">Crop Image:</label>
              <input 
                type="text" 
                id="cropShortcut" 
                value={settings.keyboard.cropShortcut}
                onChange={(e) => handleChange('keyboard', 'cropShortcut', e.target.value)}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="rotateLeftShortcut">Rotate Left:</label>
              <input 
                type="text" 
                id="rotateLeftShortcut" 
                value={settings.keyboard.rotateLeftShortcut}
                onChange={(e) => handleChange('keyboard', 'rotateLeftShortcut', e.target.value)}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="rotateRightShortcut">Rotate Right:</label>
              <input 
                type="text" 
                id="rotateRightShortcut" 
                value={settings.keyboard.rotateRightShortcut}
                onChange={(e) => handleChange('keyboard', 'rotateRightShortcut', e.target.value)}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="flipHorizontalShortcut">Flip Horizontal:</label>
              <input 
                type="text" 
                id="flipHorizontalShortcut" 
                value={settings.keyboard.flipHorizontalShortcut}
                onChange={(e) => handleChange('keyboard', 'flipHorizontalShortcut', e.target.value)}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="flipVerticalShortcut">Flip Vertical:</label>
              <input 
                type="text" 
                id="flipVerticalShortcut" 
                value={settings.keyboard.flipVerticalShortcut}
                onChange={(e) => handleChange('keyboard', 'flipVerticalShortcut', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Advanced Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3><FaCog /> Advanced</h3>
            <button 
              className="btn btn-small reset-btn" 
              onClick={() => resetSettings('advanced')}
            >
              <FaUndo /> Reset
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="maxImageSize">Max Image Size (MB):</label>
              <input 
                type="number" 
                id="maxImageSize" 
                value={settings.advanced.maxImageSize}
                min="1"
                max="100"
                onChange={(e) => handleChange('advanced', 'maxImageSize', parseInt(e.target.value))}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="autosaveInterval">Autosave Interval (seconds):</label>
              <input 
                type="number" 
                id="autosaveInterval" 
                value={settings.advanced.autosaveInterval}
                min="0"
                max="300"
                onChange={(e) => handleChange('advanced', 'autosaveInterval', parseInt(e.target.value))}
              />
            </div>
            
            <div className="setting-item">
              <label htmlFor="enableCloudIntegration">Enable Cloud Integration:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="enableCloudIntegration" 
                  checked={settings.advanced.enableCloudIntegration}
                  onChange={(e) => handleChange('advanced', 'enableCloudIntegration', e.target.checked)}
                />
                <label htmlFor="enableCloudIntegration" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="enableAnalytics">Enable Usage Analytics:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="enableAnalytics" 
                  checked={settings.advanced.enableAnalytics}
                  onChange={(e) => handleChange('advanced', 'enableAnalytics', e.target.checked)}
                />
                <label htmlFor="enableAnalytics" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="keepOriginalCopy">Keep Original Copy:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="keepOriginalCopy" 
                  checked={settings.advanced.keepOriginalCopy}
                  onChange={(e) => handleChange('advanced', 'keepOriginalCopy', e.target.checked)}
                />
                <label htmlFor="keepOriginalCopy" className="toggle-label"></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3><FaLock /> Privacy</h3>
            <button 
              className="btn btn-small reset-btn" 
              onClick={() => resetSettings('privacy')}
            >
              <FaUndo /> Reset
            </button>
          </div>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="localProcessingOnly">Process Images Locally Only:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="localProcessingOnly" 
                  checked={settings.privacy.localProcessingOnly}
                  onChange={(e) => handleChange('privacy', 'localProcessingOnly', e.target.checked)}
                />
                <label htmlFor="localProcessingOnly" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="autoDeleteAfterDownload">Auto-Delete After Download:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="autoDeleteAfterDownload" 
                  checked={settings.privacy.autoDeleteAfterDownload}
                  onChange={(e) => handleChange('privacy', 'autoDeleteAfterDownload', e.target.checked)}
                />
                <label htmlFor="autoDeleteAfterDownload" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="setting-item">
              <label htmlFor="imageMetadataHandling">Image Metadata Handling:</label>
              <select 
                id="imageMetadataHandling" 
                value={settings.privacy.imageMetadataHandling}
                onChange={(e) => handleChange('privacy', 'imageMetadataHandling', e.target.value)}
              >
                <option value="preserve">Preserve All Metadata</option>
                <option value="strip">Strip All Metadata</option>
                <option value="customize">Customize (Only keep selected)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaCropAlt = () => <span role="img" aria-label="Crop">🖼️</span>;
const FaCog = () => <span role="img" aria-label="Settings">⚙️</span>;

export default Settings; 