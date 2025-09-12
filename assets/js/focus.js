// Focus page specific JavaScript
class FocusManager {
    constructor() {
        this.currentGame = null;
        this.isFullscreen = false;
        this.init();
    }

    init() {
        this.loadGameFromURL();
        this.setupControls();
        this.setupFullscreenListener();
    }

    loadGameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('game');
        
        if (gameId && window.scuhamedsApp) {
            this.currentGame = window.scuhamedsApp.games.find(g => g.id === gameId);
            if (this.currentGame) {
                this.loadGame(gameId);
            } else {
                this.showError('Game not found');
            }
        } else {
            this.showError('No game specified');
        }
    }

    loadGame(gameId) {
        const gameFrame = document.querySelector('.game-frame');
        const gameTitle = document.querySelector('.current-game-title');
        const instructionsContent = document.querySelector('.instructions-content');

        if (gameFrame && gameTitle && this.currentGame) {
            // Update title
            gameTitle.textContent = this.currentGame.title;
            document.title = `${this.currentGame.title} - Scuhameds`;

            // Load game in iframe
            gameFrame.src = `/files/${gameId}/index.html`;
            
            // Update instructions if available
            this.updateInstructions(gameId);

            // Show loading state
            this.showLoading();

            // Handle iframe load events
            gameFrame.onload = () => {
                this.hideLoading();
            };

            gameFrame.onerror = () => {
                this.showError('Failed to load game');
            };
        }
    }

    updateInstructions(gameId) {
        const instructionsContent = document.querySelector('.instructions-content');
        if (!instructionsContent) return;

        const gameInstructions = {
            'slope': `
                <p>Control the ball as it rolls down the endless slope. Avoid obstacles and don't fall off the edge!</p>
                <ul>
                    <li>A/D or Arrow Keys - Move left/right</li>
                    <li>Avoid red obstacles</li>
                    <li>Stay on the slope</li>
                    <li>Collect speed boosts for higher scores</li>
                </ul>
            `,
            'titan-run': `
                <p>Run as a powerful titan through challenging obstacles and enemies!</p>
                <ul>
                    <li>Arrow Keys or WASD - Movement</li>
                    <li>Space - Jump</li>
                    <li>X - Attack</li>
                    <li>Collect power-ups to enhance abilities</li>
                </ul>
            `,
            'geometry-dash': `
                <p>Jump and fly your way through dangerous passages and spiky obstacles!</p>
                <ul>
                    <li>Space, W, Up Arrow, or Mouse Click - Jump/Fly</li>
                    <li>Hold to keep flying in rocket mode</li>
                    <li>Follow the rhythm of the music</li>
                    <li>Practice mode available for difficult levels</li>
                </ul>
            `,
            '2048': `
                <p>Slide numbered tiles on a 4×4 grid to combine them and create a tile with 2048!</p>
                <ul>
                    <li>Arrow Keys or WASD - Move tiles</li>
                    <li>Combine tiles with same numbers</li>
                    <li>Reach 2048 to win</li>
                    <li>Don't let the grid fill up completely</li>
                </ul>
            `,
            'snake': `
                <p>Control the snake to eat food and grow longer without hitting walls or yourself!</p>
                <ul>
                    <li>Arrow Keys or WASD - Change direction</li>
                    <li>Eat food to grow longer</li>
                    <li>Avoid walls and your own tail</li>
                    <li>Score increases with length</li>
                </ul>
            `,
            'tetris': `
                <p>Arrange falling blocks to create complete horizontal lines and clear them!</p>
                <ul>
                    <li>Arrow Keys - Move/Rotate pieces</li>
                    <li>Down Arrow - Soft drop</li>
                    <li>Space - Hard drop</li>
                    <li>Complete horizontal lines to score</li>
                </ul>
            `
        };

        if (gameInstructions[gameId]) {
            instructionsContent.innerHTML = gameInstructions[gameId];
        }
    }

    setupControls() {
        const refreshBtn = document.querySelector('.refresh-btn');
        const fullscreenBtn = document.querySelector('.fullscreen-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshGame();
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    setupFullscreenListener() {
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }

    refreshGame() {
        const gameFrame = document.querySelector('.game-frame');
        if (gameFrame) {
            this.showLoading();
            gameFrame.src = gameFrame.src;
        }
    }

    toggleFullscreen() {
        const gameContainer = document.querySelector('.game-container');
        
        if (!this.isFullscreen) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) {
                gameContainer.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        const icon = fullscreenBtn?.querySelector('i');
        
        if (icon) {
            if (this.isFullscreen) {
                icon.className = 'fas fa-compress';
                fullscreenBtn.title = 'Exit Fullscreen';
            } else {
                icon.className = 'fas fa-expand';
                fullscreenBtn.title = 'Enter Fullscreen';
            }
        }
    }

    showLoading() {
        const gameFrame = document.querySelector('.game-frame');
        if (gameFrame) {
            gameFrame.style.opacity = '0.5';
        }
    }

    hideLoading() {
        const gameFrame = document.querySelector('.game-frame');
        if (gameFrame) {
            gameFrame.style.opacity = '1';
        }
    }

    showError(message) {
        const gameFrame = document.querySelector('.game-frame');
        const gameTitle = document.querySelector('.current-game-title');
        
        if (gameTitle) {
            gameTitle.textContent = 'Error';
        }

        if (gameFrame) {
            gameFrame.style.display = 'none';
        }

        // Create error display
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div class="error-display">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <a href="/projects" class="cta-button" style="margin-top: 1rem;">
                        <i class="fas fa-arrow-left"></i>
                        Back to Games
                    </a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.focusManager = new FocusManager();
});