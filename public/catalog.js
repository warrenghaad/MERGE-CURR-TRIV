// Catalog Data Store
let catalogItems = [];
let categories = ['Documents', 'Images', 'Screenshots', 'Notes', 'Code', 'References'];
let allTags = ['important', 'work', 'personal', 'archived', 'todo', 'reference', 'project', 'idea'];
let currentFilter = { category: 'all', search: '', tags: [] };
let selectedColor = '#667eea';

// Suggestion Engine
const suggestionEngine = {
    searchHistory: [],
    commonSearches: ['recent screenshots', 'important documents', 'project files', 'meeting notes', 'code snippets'],
    
    getSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();
        
        // Add matching items
        catalogItems.forEach(item => {
            if (item.title.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: item.title,
                    type: 'item',
                    category: item.category
                });
            }
        });
        
        // Add matching categories
        categories.forEach(cat => {
            if (cat.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: `Search in ${cat}`,
                    type: 'category',
                    category: cat
                });
            }
        });
        
        // Add tag suggestions
        allTags.forEach(tag => {
            if (tag.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: `Tag: ${tag}`,
                    type: 'tag',
                    category: 'Filter'
                });
            }
        });
        
        // Add common searches
        this.commonSearches.forEach(search => {
            if (search.includes(lowerQuery) && query.length > 2) {
                suggestions.push({
                    text: search,
                    type: 'common',
                    category: 'Suggested'
                });
            }
        });
        
        return suggestions.slice(0, 8); // Limit to 8 suggestions
    }
};

// Global variables for document handling
let uploadedFile = null;
let extractedImages = [];
let kindleBooks = {}; // Store parsed Kindle books

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
    loadSampleData();
    renderCatalog();
    setupEventListeners();
    updateStats();
});

// Initialize categories
function initializeCategories() {
    const categoryList = document.getElementById('category-list');
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.category = category;
        categoryItem.innerHTML = `
            <span>${category}</span>
            <span class="count">0</span>
        `;
        categoryItem.onclick = () => filterByCategory(category);
        categoryList.appendChild(categoryItem);
    });
}

// Load sample data
function loadSampleData() {
    // Add some sample items for demonstration
    catalogItems = [
        {
            id: Date.now() + 1,
            title: 'Project Documentation',
            description: 'Complete documentation for the MERGE-CURR-TRIV project including setup instructions and API references.',
            category: 'Documents',
            tags: ['important', 'project', 'reference'],
            color: '#667eea',
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: Date.now() + 2,
            title: 'Dashboard Screenshot',
            description: 'Screenshot of the analytics dashboard showing monthly metrics and user engagement data.',
            category: 'Screenshots',
            tags: ['work', 'reference'],
            color: '#4ecdc4',
            timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: Date.now() + 3,
            title: 'Meeting Notes - Q1 Planning',
            description: 'Notes from the Q1 planning meeting including action items and deadlines.',
            category: 'Notes',
            tags: ['important', 'work', 'todo'],
            color: '#ff6b6b',
            timestamp: new Date().toISOString()
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Search input with suggestions
    const searchInput = document.getElementById('search-input');
    const suggestionsDropdown = document.getElementById('search-suggestions');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query.length > 0) {
            const suggestions = suggestionEngine.getSuggestions(query);
            displaySuggestions(suggestions, suggestionsDropdown);
        } else {
            suggestionsDropdown.classList.remove('active');
        }
        
        // Filter catalog in real-time
        currentFilter.search = query;
        renderCatalog();
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length > 0) {
            const suggestions = suggestionEngine.getSuggestions(searchInput.value);
            displaySuggestions(suggestions, suggestionsDropdown);
        }
    });
    
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsDropdown.classList.remove('active');
        }
    });
    
    // Form submission
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.addEventListener('submit', handleAddItem);
    
    // Tag input suggestions
    const tagInput = document.getElementById('item-tags');
    tagInput.addEventListener('focus', showTagSuggestions);
    
    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.dataset.color;
        });
    });
    
    // Category datalist
    updateCategoryDatalist();
}

// Display search suggestions
function displaySuggestions(suggestions, dropdown) {
    dropdown.innerHTML = '';
    
    if (suggestions.length === 0) {
        dropdown.classList.remove('active');
        return;
    }
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        // Highlight matching text
        const searchTerm = document.getElementById('search-input').value;
        const highlightedText = suggestion.text.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<span class="match">${match}</span>`
        );
        
        item.innerHTML = `
            <span>${highlightedText}</span>
            <span class="suggestion-category">${suggestion.category}</span>
        `;
        
        item.addEventListener('click', () => {
            if (suggestion.type === 'category') {
                filterByCategory(suggestion.category);
            } else if (suggestion.type === 'tag') {
                addFilterChip('tag', suggestion.text.replace('Tag: ', ''));
            } else {
                document.getElementById('search-input').value = suggestion.text;
                currentFilter.search = suggestion.text;
                renderCatalog();
            }
            dropdown.classList.remove('active');
        });
        
        dropdown.appendChild(item);
    });
    
    dropdown.classList.add('active');
}

// Show tag suggestions
function showTagSuggestions() {
    const tagSuggestionsDiv = document.getElementById('tag-suggestions');
    tagSuggestionsDiv.innerHTML = '';
    
    allTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-suggestion';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => {
            const tagInput = document.getElementById('item-tags');
            const currentTags = tagInput.value.split(',').map(t => t.trim()).filter(t => t);
            if (!currentTags.includes(tag)) {
                currentTags.push(tag);
                tagInput.value = currentTags.join(', ');
            }
        });
        tagSuggestionsDiv.appendChild(tagElement);
    });
}

// Update category datalist
function updateCategoryDatalist() {
    const datalist = document.getElementById('category-suggestions');
    datalist.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        datalist.appendChild(option);
    });
}

// Handle adding new item
async function handleAddItem(e) {
    e.preventDefault();
    
    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-description').value;
    const category = document.getElementById('item-category').value || 'General';
    const tags = document.getElementById('item-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    const newItem = {
        id: Date.now(),
        title,
        description,
        category,
        tags,
        color: selectedColor,
        hasDocument: uploadedFile !== null,
        documentName: uploadedFile ? uploadedFile.name : null,
        documentType: uploadedFile ? getDocumentType(uploadedFile) : null,
        extractedImages: extractedImages.length > 0 ? extractedImages : null,
        timestamp: new Date().toISOString()
    };
    
    // If there's an uploaded file, upload it to server first
    if (uploadedFile) {
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const fileInfo = await response.json();
                newItem.fileInfo = fileInfo;
                showNotification(`Document "${uploadedFile.name}" uploaded and cataloged!`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            showNotification('File upload failed, but item was cataloged');
        }
    }
    
    catalogItems.unshift(newItem);
    
    // Add new category if it doesn't exist
    if (!categories.includes(category)) {
        categories.push(category);
        initializeCategories();
        updateCategoryDatalist();
    }
    
    // Add new tags to the list
    tags.forEach(tag => {
        if (!allTags.includes(tag)) {
            allTags.push(tag);
        }
    });
    
    renderCatalog();
    updateStats();
    closeModal();
    
    // Reset form and upload state
    e.target.reset();
    selectedColor = '#667eea';
    document.querySelector('.color-option').classList.add('selected');
    uploadedFile = null;
    extractedImages = [];
    document.getElementById('upload-status').innerHTML = '';
    document.getElementById('extracted-images').style.display = 'none';
    document.getElementById('image-preview-container').innerHTML = '';
    
    // Show success animation
    showNotification('Item added successfully!');
}

// Filter by category
function filterByCategory(category) {
    currentFilter.category = category;
    
    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === category) {
            item.classList.add('active');
        }
    });
    
    renderCatalog();
    updateFilterChips();
}

// Add filter chip
function addFilterChip(type, value) {
    if (type === 'tag' && !currentFilter.tags.includes(value)) {
        currentFilter.tags.push(value);
        renderCatalog();
        updateFilterChips();
    }
}

// Update filter chips display
function updateFilterChips() {
    const chipsContainer = document.getElementById('filter-chips');
    chipsContainer.innerHTML = '';
    
    if (currentFilter.category !== 'all') {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            Category: ${currentFilter.category}
            <span class="remove" onclick="removeFilter('category')">×</span>
        `;
        chipsContainer.appendChild(chip);
    }
    
    currentFilter.tags.forEach(tag => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            Tag: ${tag}
            <span class="remove" onclick="removeFilter('tag', '${tag}')">×</span>
        `;
        chipsContainer.appendChild(chip);
    });
}

// Remove filter
function removeFilter(type, value) {
    if (type === 'category') {
        currentFilter.category = 'all';
        document.querySelector('.category-item[data-category="all"]').classList.add('active');
    } else if (type === 'tag') {
        currentFilter.tags = currentFilter.tags.filter(tag => tag !== value);
    }
    
    renderCatalog();
    updateFilterChips();
}

// Render catalog items
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    
    // Filter items
    let filteredItems = catalogItems;
    
    if (currentFilter.category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentFilter.category);
    }
    
    if (currentFilter.search) {
        const searchLower = currentFilter.search.toLowerCase();
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    if (currentFilter.tags.length > 0) {
        filteredItems = filteredItems.filter(item =>
            currentFilter.tags.every(tag => item.tags.includes(tag))
        );
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No items found</h3>
                <p>Try adjusting your filters or add new items to the catalog</p>
            </div>
        `;
        return;
    }
    
    // Render items
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'catalog-item';
        itemElement.style.setProperty('--item-color', item.color);
        
        const timeAgo = getTimeAgo(new Date(item.timestamp));
        
        itemElement.innerHTML = `
            <div class="item-header">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-actions">
                    <button class="item-action" onclick="editItem(${item.id})" title="Edit">✏️</button>
                    <button class="item-action" onclick="deleteItem(${item.id})" title="Delete">🗑️</button>
                </div>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-metadata">
                <span class="item-category">${item.category}</span>
                ${item.hasDocument ? `<span class="document-indicator" title="${item.documentName}">📎 ${item.documentType || 'File'}</span>` : ''}
                ${item.extractedImages ? '<span class="image-indicator" title="Contains images">🖼️</span>' : ''}
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <span class="item-timestamp">${timeAgo}</span>
            </div>
        `;
        
        itemElement.addEventListener('click', (e) => {
            if (!e.target.closest('.item-actions')) {
                showQuickView(item);
            }
        });
        
        grid.appendChild(itemElement);
    });
    
    updateCategoryCounts();
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [name, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval > 0) {
            return `${interval} ${name}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'Just now';
}

// Update category counts
function updateCategoryCounts() {
    document.querySelectorAll('.category-item').forEach(item => {
        const category = item.dataset.category;
        const count = category === 'all' 
            ? catalogItems.length 
            : catalogItems.filter(i => i.category === category).length;
        item.querySelector('.count').textContent = count;
    });
}

// Update stats
function updateStats() {
    document.getElementById('item-count').textContent = `${catalogItems.length} items`;
    document.getElementById('category-count').textContent = `${categories.length} categories`;
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        catalogItems = catalogItems.filter(item => item.id !== id);
        renderCatalog();
        updateStats();
        showNotification('Item deleted');
    }
}

// Edit item (placeholder)
function editItem(id) {
    const item = catalogItems.find(i => i.id === id);
    if (item) {
        showNotification('Edit functionality coming soon!');
    }
}

// Show quick view
function showQuickView(item) {
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    
    content.innerHTML = `
        <h2>${item.title}</h2>
        <p style="color: #718096; margin: 20px 0;">${item.description}</p>
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <span style="background: #ebf4ff; color: #667eea; padding: 6px 12px; border-radius: 6px;">
                ${item.category}
            </span>
            ${item.hasDocument ? `<span style="background: #f0fdf4; color: #16a34a; padding: 6px 12px; border-radius: 6px;">📎 ${item.documentName}</span>` : ''}
        </div>
        ${item.extractedImages && item.extractedImages.length > 0 ? `
            <div style="margin: 20px 0;">
                <p style="color: #4a5568; margin-bottom: 10px; font-weight: 600;">Attached Images:</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${item.extractedImages.map(img => `
                        <img src="${img}" 
                             style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid #e2e8f0;"
                             onclick="window.open('${img}', '_blank')" />
                    `).join('')}
                </div>
            </div>
        ` : ''}
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
            ${item.tags.map(tag => `<span style="background: #f7fafc; color: #718096; padding: 4px 10px; border-radius: 4px;">#${tag}</span>`).join('')}
        </div>
        <p style="color: #a0aec0; font-size: 14px;">Added ${getTimeAgo(new Date(item.timestamp))}</p>
    `;
    
    modal.classList.add('active');
}

// Modal functions
function showAddItemModal() {
    document.getElementById('add-item-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('add-item-modal').classList.remove('active');
}

function closeQuickView() {
    document.getElementById('quick-view-modal').classList.remove('active');
}

// Add new category
function addNewCategory() {
    const name = prompt('Enter new category name:');
    if (name && !categories.includes(name)) {
        categories.push(name);
        initializeCategories();
        updateCategoryDatalist();
        showNotification(`Category "${name}" added`);
    }
}

// Handle document upload
function handleDocumentUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploadedFile = file;
    const statusDiv = document.getElementById('upload-status');
    const fileSize = (file.size / 1024).toFixed(2);
    
    statusDiv.innerHTML = `📄 ${file.name} (${fileSize} KB) uploaded`;
    
    // Auto-fill title if empty
    const titleInput = document.getElementById('item-title');
    if (!titleInput.value) {
        titleInput.value = file.name.split('.').slice(0, -1).join('.');
    }
    
    // Handle image files
    if (file.type.startsWith('image/')) {
        extractImagesFromFile(file);
    }
    
    // For PDFs, we'd need a PDF.js library to extract images
    // For now, show a message for PDF files
    if (file.type === 'application/pdf') {
        statusDiv.innerHTML += '<br>📋 PDF document ready for cataloging';
        // In a real implementation, you'd use PDF.js to extract images
        showNotification('PDF uploaded - image extraction would require PDF.js library');
    }
    
    // For Word documents
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        statusDiv.innerHTML += '<br>📝 Word document ready for cataloging';
        showNotification('Word doc uploaded - would require mammoth.js for extraction');
    }
}

// Extract images from uploaded files
function extractImagesFromFile(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const extractedDiv = document.getElementById('extracted-images');
            const container = document.getElementById('image-preview-container');
            
            extractedDiv.style.display = 'block';
            container.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid #e2e8f0';
            img.style.cursor = 'pointer';
            img.onclick = () => window.open(e.target.result, '_blank');
            
            container.appendChild(img);
            extractedImages = [e.target.result];
            
            showNotification('Image ready for cataloging!');
        };
        reader.readAsDataURL(file);
    }
}

// Helper function to get document type
function getDocumentType(file) {
    if (!file) return null;
    
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;
    
    if (mimeType.startsWith('image/')) return 'image';
    if (extension === 'pdf' || mimeType === 'application/pdf') return 'pdf';
    if (extension === 'doc' || extension === 'docx') return 'word';
    if (extension === 'txt' || mimeType === 'text/plain') return 'text';
    
    return 'document';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Kindle Import Functions
// Show Kindle import modal
function showKindleImport() {
    document.getElementById('kindle-modal').style.display = 'block';
}

// Close Kindle modal
function closeKindleModal() {
    document.getElementById('kindle-modal').style.display = 'none';
    document.getElementById('kindle-file').value = '';
    document.getElementById('kindle-upload-status').innerHTML = '';
    document.getElementById('kindle-preview').style.display = 'none';
}

// Handle Kindle file upload
function handleKindleFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseKindleClippings(content);
    };
    reader.readAsText(file);
    
    document.getElementById('kindle-upload-status').innerHTML = `📄 Processing ${file.name}...`;
}

// Parse Kindle My Clippings.txt format
function parseKindleClippings(content) {
    kindleBooks = {};
    const clippings = content.split('==========\n').filter(c => c.trim());
    
    clippings.forEach(clipping => {
        const lines = clipping.trim().split('\n');
        if (lines.length >= 3) {
            // Parse book title and author
            const titleLine = lines[0];
            const match = titleLine.match(/^(.+?)\s*\(([^)]+)\)$/);
            const title = match ? match[1].trim() : titleLine.trim();
            const author = match ? match[2].trim() : 'Unknown Author';
            
            // Parse highlight text (skip location/date info)
            const highlightText = lines.slice(2).join(' ').trim();
            
            if (highlightText && !highlightText.startsWith('Your ')) {
                const bookKey = `${title}|${author}`;
                if (!kindleBooks[bookKey]) {
                    kindleBooks[bookKey] = {
                        title,
                        author,
                        highlights: [],
                        category: inferBookCategory(title, highlightText)
                    };
                }
                kindleBooks[bookKey].highlights.push(highlightText);
            }
        }
    });
    
    displayKindleBooks();
}

// Infer book category based on title and content
function inferBookCategory(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    
    // Smart categorization based on keywords
    if (/psychology|mind|cognitive|brain|thinking/i.test(text)) return 'Psychology';
    if (/business|management|leadership|startup|entrepreneur/i.test(text)) return 'Business';
    if (/history|historical|war|civilization/i.test(text)) return 'History';
    if (/science|physics|biology|chemistry|research/i.test(text)) return 'Science';
    if (/philosophy|wisdom|ethics|moral/i.test(text)) return 'Philosophy';
    if (/fiction|novel|story|tale/i.test(title)) return 'Fiction';
    if (/self[-\s]help|improve|habit|success/i.test(text)) return 'Self-Help';
    if (/technology|computer|programming|software/i.test(text)) return 'Technology';
    if (/art|design|creative|aesthetic/i.test(text)) return 'Art & Design';
    
    return 'Books';
}

// Display parsed Kindle books
function displayKindleBooks() {
    const booksList = document.getElementById('kindle-books-list');
    const bookCount = Object.keys(kindleBooks).length;
    
    if (bookCount === 0) {
        booksList.innerHTML = '<p style="color: #718096;">No books found in the file.</p>';
        return;
    }
    
    document.getElementById('kindle-upload-status').innerHTML = `✅ Found ${bookCount} books with highlights`;
    document.getElementById('kindle-preview').style.display = 'block';
    document.getElementById('import-kindle-btn').style.display = 'block';
    
    booksList.innerHTML = Object.entries(kindleBooks).map(([key, book]) => `
        <div style="padding: 10px; margin-bottom: 10px; background: white; border-radius: 6px; border-left: 4px solid #667eea;">
            <label style="display: flex; align-items: flex-start; cursor: pointer;">
                <input type="checkbox" checked style="margin-right: 10px; margin-top: 3px;">
                <div>
                    <strong style="color: #2d3748;">${book.title}</strong><br>
                    <span style="color: #718096; font-size: 14px;">by ${book.author}</span><br>
                    <span style="color: #667eea; font-size: 12px;">📝 ${book.highlights.length} highlights</span>
                    <span style="color: #48bb78; font-size: 12px; margin-left: 10px;">📁 ${book.category}</span>
                </div>
            </label>
        </div>
    `).join('');
}

// Import selected Kindle books
function importKindleBooks() {
    const checkboxes = document.querySelectorAll('#kindle-books-list input[type="checkbox"]:checked');
    let importCount = 0;
    
    Object.entries(kindleBooks).forEach(([key, book], index) => {
        if (index < checkboxes.length && checkboxes[index].checked) {
            // Create summary from highlights
            const summary = book.highlights.length > 0 
                ? book.highlights.slice(0, 3).join(' ... ') 
                : 'No highlights available';
            
            // Generate smart tags based on content
            const tags = generateSmartTags(book.title, book.highlights.join(' '));
            
            const bookItem = {
                id: Date.now() + index,
                title: book.title,
                description: `by ${book.author}\n\n📖 Key Insights:\n${summary}`,
                category: book.category,
                tags: ['kindle', ...tags],
                color: '#ffa500',
                hasDocument: false,
                kindleHighlights: book.highlights,
                highlightCount: book.highlights.length,
                author: book.author,
                timestamp: new Date().toISOString()
            };
            
            catalogItems.unshift(bookItem);
            importCount++;
            
            // Update categories
            if (!categories.includes(book.category)) {
                categories.push(book.category);
            }
        }
    });
    
    // Update UI
    renderCatalog();
    updateStats();
    initializeCategories();
    saveData();
    
    showNotification(`📚 Imported ${importCount} books from your Kindle library!`);
    closeKindleModal();
}

// Generate smart tags based on content analysis
function generateSmartTags(title, content) {
    const tags = [];
    const text = (title + ' ' + content).toLowerCase();
    
    // Subject-based tags
    if (/motivat|inspir/i.test(text)) tags.push('motivation');
    if (/product|develop|agile/i.test(text)) tags.push('productivity');
    if (/invest|financ|money/i.test(text)) tags.push('finance');
    if (/health|wellness|mindful/i.test(text)) tags.push('health');
    if (/relation|love|family/i.test(text)) tags.push('relationships');
    if (/learn|education|study/i.test(text)) tags.push('learning');
    if (/creativ|innovat/i.test(text)) tags.push('creativity');
    
    return tags.slice(0, 5); // Limit to 5 tags
}

// Export catalog data
function exportData() {
    const dataStr = JSON.stringify(catalogItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `catalog-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Catalog data exported!');
}