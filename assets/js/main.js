// Main JavaScript for Scuhameds
class ScuhamedsApp {
    constructor() {
        this.games = [
            {
                id: 'slope',
                title: 'Slope',
                description: 'Navigate a ball down a steep slope while avoiding obstacles in this addictive arcade game.',
                tags: ['Arcade', 'Endless', 'Physics'],
                icon: '🏃'
            },
            {
                id: 'titan-run',
                title: 'Titan Run',
                description: 'Epic running game with powerful titan abilities. Jump, slide, and smash through obstacles.',
                tags: ['Runner', 'Action', 'Adventure'],
                icon: '⚡'
            },
            {
                id: 'geometry-dash',
                title: 'Geometry Dash',
                description: 'Rhythm-based platform game with challenging levels and electronic music.',
                tags: ['Platform', 'Rhythm', 'Challenge'],
                icon: '🔷'
            },
            {
                id: '2048',
                title: '2048',
                description: 'Slide numbered tiles to combine them and reach the 2048 tile in this puzzle game.',
                tags: ['Puzzle', 'Strategy', 'Numbers'],
                icon: '🧮'
            },
            {
                id: 'snake',
                title: 'Snake Game',
                description: 'Classic snake game - eat food to grow longer while avoiding walls and your own tail.',
                tags: ['Classic', 'Arcade', 'Retro'],
                icon: '🐍'
            },
            {
                id: 'tetris',
                title: 'Tetris',
                description: 'The timeless puzzle game of falling blocks. Clear lines by completing horizontal rows.',
                tags: ['Puzzle', 'Classic', 'Strategy'],
                icon: '🧱'
            }
        ];
        
        this.settings = {
            theme: 'dark',
            performance: 'high',
            autoFullscreen: false,
            soundEnabled: true
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupRouter();
        this.loadSettings();
        
        // Set active nav link based on current page
        this.updateActiveNavLink();
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    setupRouter() {
        // Simple client-side routing
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle navigation clicks
        document.querySelectorAll('a[href^="/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            });
        });
    }

    navigateTo(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        this.updateActiveNavLink();
        
        // Route handling would be implemented here
        // For now, we'll just update the active nav link
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Game management methods
    renderGames(container) {
        if (!container) return;

        container.innerHTML = this.games.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-image">${game.icon}</div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-tags">
                        ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="game-tooltip">
                    <p>${game.description}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers for game cards
        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.gameId;
                this.launchGame(gameId);
            });
        });
    }

    launchGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game) {
            // Navigate to focus page with game parameter
            this.navigateTo(`/focus?game=${gameId}`);
            
            // If we're on the focus page, load the game
            if (window.location.pathname === '/focus') {
                this.loadGameInFocus(gameId);
            }
        }
    }

    loadGameInFocus(gameId) {
        const iframe = document.querySelector('.game-frame');
        const gameTitle = document.querySelector('.current-game-title');
        
        if (iframe && gameTitle) {
            const game = this.games.find(g => g.id === gameId);
            if (game) {
                iframe.src = `/files/${gameId}/index.html`;
                gameTitle.textContent = game.title;
            }
        }
    }

    // Settings management
    loadSettings() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('scuhameds-settings') || '{}');
            this.settings = { ...this.settings, ...savedSettings };
        } catch (error) {
            console.log('Using default settings');
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('scuhameds-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.log('Could not save settings');
        }
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        // Apply theme
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }

        // Apply other settings...
    }

    // Utility methods
    toggleFullscreen(element = document.documentElement) {
        if (!document.fullscreenElement) {
            element.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scuhamedsApp = new ScuhamedsApp();
});

// Focus page specific JavaScript
if (window.location.pathname === '/focus') {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('game');
        
        if (gameId && window.scuhamedsApp) {
            window.scuhamedsApp.loadGameInFocus(gameId);
        }

        // Setup fullscreen button
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const gameFrame = document.querySelector('.game-frame');
                if (gameFrame) {
                    window.scuhamedsApp.toggleFullscreen(gameFrame);
                }
            });
        }

        // Setup refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const gameFrame = document.querySelector('.game-frame');
                if (gameFrame) {
                    gameFrame.src = gameFrame.src;
                }
            });
        }
    });
}

// Projects page specific JavaScript
if (window.location.pathname === '/projects') {
    document.addEventListener('DOMContentLoaded', () => {
        const gamesGrid = document.querySelector('.games-grid');
        if (gamesGrid && window.scuhamedsApp) {
            window.scuhamedsApp.renderGames(gamesGrid);
        }
    });
}