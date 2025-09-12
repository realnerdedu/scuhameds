// Projects page specific JavaScript
class ProjectsManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupSearch();
        this.renderGames();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                this.currentFilter = btn.dataset.filter;
                this.renderGames();
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('game-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderGames();
            });
        }
    }

    filterGames(games) {
        let filtered = games;

        // Filter by category
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(game => 
                game.tags.some(tag => tag.toLowerCase() === this.currentFilter.toLowerCase())
            );
        }

        // Filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(game => 
                game.title.toLowerCase().includes(this.searchQuery) ||
                game.description.toLowerCase().includes(this.searchQuery) ||
                game.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            );
        }

        return filtered;
    }

    renderGames() {
        const gamesGrid = document.getElementById('games-grid');
        if (!gamesGrid || !window.scuhamedsApp) return;

        const filteredGames = this.filterGames(window.scuhamedsApp.games);

        if (filteredGames.length === 0) {
            gamesGrid.innerHTML = `
                <div class="no-games">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                    <h3>No games found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        gamesGrid.innerHTML = filteredGames.map(game => `
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
        gamesGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.gameId;
                window.location.href = `/focus?game=${gameId}`;
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsManager = new ProjectsManager();
});