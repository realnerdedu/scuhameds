// Settings page specific JavaScript
class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'dark',
            animations: true,
            performance: 'high',
            autoFullscreen: false,
            sound: true,
            analytics: false
        };
        
        this.defaultSettings = { ...this.settings };
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupControls();
        this.updateUI();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('scuhameds-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('scuhameds-settings', JSON.stringify(this.settings));
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Could not save settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    setupControls() {
        // Theme selector
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applyTheme();
            });
        }

        // Performance selector
        const performanceSelect = document.getElementById('performance-select');
        if (performanceSelect) {
            performanceSelect.addEventListener('change', (e) => {
                this.settings.performance = e.target.value;
            });
        }

        // Toggle buttons
        this.setupToggle('animations-toggle', 'animations');
        this.setupToggle('fullscreen-toggle', 'autoFullscreen');
        this.setupToggle('sound-toggle', 'sound');
        this.setupToggle('analytics-toggle', 'analytics');

        // Action buttons
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.clearGameData();
            });
        }

        const keybindsBtn = document.getElementById('keybinds-btn');
        if (keybindsBtn) {
            keybindsBtn.addEventListener('click', () => {
                this.showNotification('Keybind configuration coming soon!', 'info');
            });
        }
    }

    setupToggle(buttonId, settingKey) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                this.settings[settingKey] = !this.settings[settingKey];
                this.updateToggleButton(button, this.settings[settingKey]);
                
                // Apply setting immediately for some cases
                if (settingKey === 'animations') {
                    this.applyAnimations();
                }
            });
        }
    }

    updateUI() {
        // Update theme selector
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
        }

        // Update performance selector
        const performanceSelect = document.getElementById('performance-select');
        if (performanceSelect) {
            performanceSelect.value = this.settings.performance;
        }

        // Update toggle buttons
        this.updateToggleButton(document.getElementById('animations-toggle'), this.settings.animations);
        this.updateToggleButton(document.getElementById('fullscreen-toggle'), this.settings.autoFullscreen);
        this.updateToggleButton(document.getElementById('sound-toggle'), this.settings.sound);
        this.updateToggleButton(document.getElementById('analytics-toggle'), this.settings.analytics);

        // Apply current settings
        this.applyTheme();
        this.applyAnimations();
    }

    updateToggleButton(button, enabled) {
        if (!button) return;
        
        button.dataset.enabled = enabled.toString();
        const icon = button.querySelector('i');
        
        if (enabled) {
            button.innerHTML = '<i class="fas fa-check"></i> Enabled';
            button.classList.remove('disabled');
        } else {
            button.innerHTML = '<i class="fas fa-times"></i> Disabled';
            button.classList.add('disabled');
        }
    }

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    applyAnimations() {
        if (this.settings.animations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            this.settings = { ...this.defaultSettings };
            this.updateUI();
            this.showNotification('Settings reset to defaults', 'success');
        }
    }

    clearGameData() {
        if (confirm('Are you sure you want to clear all game data? This action cannot be undone.')) {
            try {
                // Clear game-specific data but keep settings
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('game-') || key.includes('score') || key.includes('progress')) {
                        localStorage.removeItem(key);
                    }
                });
                this.showNotification('Game data cleared successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to clear game data', 'error');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);

        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});