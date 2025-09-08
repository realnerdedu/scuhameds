// Projects Page JavaScript

// Sample game data - you can modify this array to add/remove games
const gameData = [
    {
        id: 'space-adventure',
        title: 'Space Adventure',
        description: 'Explore the galaxy in this thrilling space exploration game with stunning visuals and epic battles.',
        image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
        tags: ['action', 'adventure'],
        rating: 4.5,
        players: 2340,
        src: 'games/space-adventure/index.html',
        difficulty: 3,
        category: 'action'
    },
    {
        id: 'puzzle-master',
        title: 'Puzzle Master',
        description: 'Challenge your mind with increasingly difficult puzzles that will test your logic and creativity.',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
        tags: ['puzzle', 'brain'],
        rating: 4.8,
        players: 1850,
        src: 'games/puzzle-master/index.html',
        difficulty: 4,
        category: 'puzzle'
    },
    {
        id: 'neon-racer',
        title: 'Neon Racer',
        description: 'Race through cyberpunk cities in this high-speed racing game with neon-lit tracks and futuristic cars.',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        tags: ['racing', 'arcade'],
        rating: 4.3,
        players: 3420,
        src: 'games/neon-racer/index.html',
        difficulty: 2,
        category: 'arcade'
    },
    {
        id: 'tower-defense',
        title: 'Tower Defense Pro',
        description: 'Defend your base from waves of enemies using strategic tower placement and upgrades.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
        tags: ['strategy', 'defense'],
        rating: 4.6,
        players: 2150,
        src: 'games/tower-defense/index.html',
        difficulty: 5,
        category: 'strategy'
    },
    {
        id: 'pixel-platformer',
        title: 'Pixel Platformer',
        description: 'Jump, run, and collect coins in this retro-style platformer with challenging levels.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        tags: ['platformer', 'retro'],
        rating: 4.2,
        players: 1680,
        src: 'games/pixel-platformer/index.html',
        difficulty: 3,
        category: 'arcade'
    },
    {
        id: 'word-wizard',
        title: 'Word Wizard',
        description: 'Expand your vocabulary and test your word skills in this addictive word puzzle game.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        tags: ['puzzle', 'word'],
        rating: 4.4,
        players: 980,
        src: 'games/word-wizard/index.html',
        difficulty: 2,
        category: 'puzzle'
    },
    {
        id: 'cyber-warrior',
        title: 'Cyber Warrior',
        description: 'Fight through digital landscapes in this intense cyberpunk action game with RPG elements.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        tags: ['action', 'rpg'],
        rating: 4.7,
        players: 2890,
        src: 'games/cyber-warrior/index.html',
        difficulty: 4,
        category: 'action'
    },
    {
        id: 'memory-matrix',
        title: 'Memory Matrix',
        description: 'Test and improve your memory with this challenging brain training game featuring unique patterns.',
        image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400',
        tags: ['puzzle', 'memory'],
        rating: 4.1,
        players: 1245,
        src: 'games/memory-matrix/index.html',
        difficulty: 3,
        category: 'puzzle'
    }
];

class ProjectsManager {
    constructor() {
        this.allGames = gameData;
        this.filteredGames = [...gameData];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.displayedGames = 0;
        this.gamesPerLoad = 6;
        this.favorites = this.loadFavorites();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialGames();
        this.updateLoadMoreButton();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterGames();
            });

            // Clear search on escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.filterGames();
                }
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-filter');
                this.filterGames();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreGames();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    filterGames() {
        this.filteredGames = this.allGames.filter(game => {
            const matchesFilter = this.currentFilter === 'all' || 
                                game.tags.includes(this.currentFilter) ||
                                game.category === this.currentFilter;
            const matchesSearch = this.searchTerm === '' || 
                                game.title.toLowerCase().includes(this.searchTerm) ||
                                game.description.toLowerCase().includes(this.searchTerm) ||
                                game.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesFilter && matchesSearch;
        });

        this.displayedGames = 0;
        this.clearGamesGrid();
        this.loadInitialGames();
        this.updateLoadMoreButton();

        // Show empty state if no games found
        if (this.filteredGames.length === 0) {
            this.showEmptyState();
        }
    }

    loadInitialGames() {
        this.loadMoreGames();
    }

    loadMoreGames() {
        const gamesToLoad = this.filteredGames.slice(
            this.displayedGames, 
            this.displayedGames + this.gamesPerLoad
        );

        gamesToLoad.forEach((game, index) => {
            setTimeout(() => {
                this.createGameCard(game);
            }, index * 100); // Stagger the loading animation
        });

        this.displayedGames += gamesToLoad.length;
        this.updateLoadMoreButton();
    }

    createGameCard(game) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-game-id', game.id);
        
        // Get category icon
        const categoryIcon = this.getCategoryIcon(game.category);
        
        // Generate difficulty dots
        const difficultyDots = this.generateDifficultyDots(game.difficulty);
        
        // Check if game is favorited
        const isFavorited = this.favorites.includes(game.id);
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${game.image}" alt="${game.title}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400'">
                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
                <div class="category-icon">
                    <i class="fas ${categoryIcon}"></i>
                </div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-game-id="${game.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="difficulty-indicator">
                    ${difficultyDots}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${game.title}</h3>
                <p class="project-description">${game.description}</p>
                <div class="project-tags">
                    ${game.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <div class="project-rating">
                        <span class="stars">${GameUtils.generateStars(game.rating)}</span>
                        <span>${game.rating}</span>
                    </div>
                    <div class="project-players">
                        <i class="fas fa-users"></i>
                        <span>${GameUtils.formatPlayerCount(game.players)}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click event to play game (except on favorite button)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                this.playGame(game);
            }
        });

        // Add favorite button functionality
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(game.id, favoriteBtn);
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            this.preloadGame(game);
        });

        grid.appendChild(card);

        // Add entrance animation
        setTimeout(() => {
            card.classList.add('fade-in-up');
        }, 50);
    }

    getCategoryIcon(category) {
        const icons = {
            'action': 'fa-sword',
            'puzzle': 'fa-puzzle-piece',
            'arcade': 'fa-gamepad',
            'strategy': 'fa-chess',
            'racing': 'fa-flag-checkered',
            'rpg': 'fa-dragon',
            'sports': 'fa-futbol',
            'adventure': 'fa-compass'
        };
        return icons[category] || 'fa-gamepad';
    }

    generateDifficultyDots(difficulty) {
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= difficulty ? 'active' : '';
            dots += `<div class="difficulty-dot ${activeClass}"></div>`;
        }
        return dots;
    }

    toggleFavorite(gameId, button) {
        const index = this.favorites.indexOf(gameId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            button.classList.remove('favorited');
        } else {
            this.favorites.push(gameId);
            button.classList.add('favorited');
        }
        this.saveFavorites();
        
        // Add animation
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    loadFavorites() {
        return JSON.parse(localStorage.getItem('scuha_favorites') || '[]');
    }

    saveFavorites() {
        localStorage.setItem('scuha_favorites', JSON.stringify(this.favorites));
    }

    preloadGame(game) {
        // Preload game assets for faster loading
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = game.src;
        document.head.appendChild(link);
    }

    playGame(game) {
        // Add click animation
        const card = document.querySelector(`[data-game-id="${game.id}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0.8';
            
            // Save recently played games
            this.addToRecentlyPlayed(game.id);
            
            setTimeout(() => {
                GameUtils.playGame(game);
            }, 150);
        }
    }

    addToRecentlyPlayed(gameId) {
        let recentGames = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
        
        // Remove if already exists
        recentGames = recentGames.filter(id => id !== gameId);
        
        // Add to beginning
        recentGames.unshift(gameId);
        
        // Keep only last 10
        recentGames = recentGames.slice(0, 10);
        
        localStorage.setItem('scuha_recent_games', JSON.stringify(recentGames));
    }

    clearGamesGrid() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = '';
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            const remainingGames = this.filteredGames.length - this.displayedGames;
            if (remainingGames <= 0) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-plus"></i> 
                    Load ${Math.min(remainingGames, this.gamesPerLoad)} More Games
                `;
            }
        }
    }

    showEmptyState() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No Games Found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
        }
    }

    // Public methods for external access
    getGameById(id) {
        return this.allGames.find(game => game.id === id);
    }

    getFavoriteGames() {
        return this.allGames.filter(game => this.favorites.includes(game.id));
    }

    getRecentlyPlayed() {
        const recentIds = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
        return recentIds.map(id => this.getGameById(id)).filter(Boolean);
    }

    searchGames(query) {
        this.searchTerm = query.toLowerCase();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
        this.filterGames();
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.projectsManager = new ProjectsManager();
});

// Export for use in other scripts
window.ProjectsManager = ProjectsManager;