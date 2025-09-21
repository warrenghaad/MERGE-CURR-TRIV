// Ziggurat Curriculum Builder JavaScript
// Data structure for historical discoveries and curriculum content

const historicalData = [
    {
        id: "ZIG",
        title: "Ziggurat of Ur",
        type: "Invention/Structure",
        era: "Bronze Age",
        eraRange: "2100 BCE",
        region: "Mesopotamia",
        themeTags: ["Urbanization", "Elevation", "Cosmology"],
        geometricOperations: ["Stepped stacking", "Axial ascent", "Tiered platform"],
        lessonSeed: "Design flood-safe layered platform; water tray test.",
        gradeBand: "5–6",
        cognitiveLoad: "Medium",
        apexIndex: 3.4,
        variableInteractionChain: "Floodplain instability → elevated platform → stepped geometry enables height → symbolic ascent legitimizes authority.",
        source: "Mesopotamian Architecture Database",
        relevancyScore: 95 // High relevancy for ziggurat theme
    },
    {
        id: "PYR",
        title: "Great Pyramid",
        type: "Invention/Structure", 
        era: "Old Kingdom",
        eraRange: "2600–2500 BCE",
        region: "Egypt",
        themeTags: ["Precision", "Logistics", "Monumentality"],
        geometricOperations: ["Slope ratio control", "Base squaring", "Mass layering"],
        lessonSeed: "Compute block volumes; explore optimal angle.",
        gradeBand: "6–7",
        cognitiveLoad: "High",
        apexIndex: 4.6,
        variableInteractionChain: "Afterlife doctrine → resource mobilization → refined base geometry → stable load path → celestial legitimacy.",
        source: "Egyptian Geometry Studies",
        relevancyScore: 88
    },
    {
        id: "STH",
        title: "Stonehenge",
        type: "Invention/Site",
        era: "Neolithic",
        eraRange: "3000–2000 BCE", 
        region: "Britain",
        themeTags: ["Astronomy", "Ritual", "Measurement"],
        geometricOperations: ["Radial alignment", "Angular sightline", "Circle construction"],
        lessonSeed: "Model solstice sightlines with cardboard arcs.",
        gradeBand: "4–5",
        cognitiveLoad: "Medium",
        apexIndex: 3.4,
        variableInteractionChain: "Seasonal agricultural risk → need to predict solstices → geometric placement encodes repetition → ritual stabilizes knowledge.",
        source: "Neolithic Astronomy Research",
        relevancyScore: 75
    },
    {
        id: "MAYA",
        title: "Maya Calendar Round",
        type: "Pattern/System",
        era: "Classic",
        eraRange: "200–900 CE",
        region: "Mesoamerica",
        themeTags: ["Timekeeping", "Cycles", "Prediction"],
        geometricOperations: ["Modular counting", "Gear-like interlock", "Positional rotation"],
        lessonSeed: "Create two cardboard gear-wheels (13 & 20) to observe 260-day cycle emergence.",
        gradeBand: "5–6",
        cognitiveLoad: "Medium", 
        apexIndex: 4.4,
        variableInteractionChain: "Agricultural + ritual scheduling → dual-cycle sync → rotational modularity multiplies period → glyph system preserves transmission.",
        source: "Mesoamerican Mathematics Archive",
        relevancyScore: 82
    },
    {
        id: "GVLT",
        title: "Gothic Rib Vault",
        type: "Invention/Structure",
        era: "High Medieval",
        eraRange: "1100–1300 CE",
        region: "Europe",
        themeTags: ["Verticality", "Light", "Optimization"],
        geometricOperations: ["Intersecting arches", "Load ribbing", "Pointed span tuning"],
        lessonSeed: "Straw + clay mini vault vs barrel arch test.",
        gradeBand: "6–8",
        cognitiveLoad: "High",
        apexIndex: 4.6,
        variableInteractionChain: "Theological drive for luminous height → pointed arch modulates thrust → rib network concentrates forces → stained glass aesthetic reinforces sacred narrative.",
        source: "Medieval Engineering Compendium",
        relevancyScore: 70
    }
];

const fiveDayCycles = {
    "week1": {
        title: "Discovery Foundation",
        theme: "Ziggurat Building Principles",
        days: [
            {
                day: 1,
                type: "Engage",
                title: "Myth of the Sacred Mountain",
                description: "Story of the first ziggurat builders",
                activity: "Interactive storytelling with props",
                selFocus: "Community cooperation and shared goals"
            },
            {
                day: 2, 
                type: "Explore",
                title: "Clay Brick Art",
                description: "Create Mesopotamian brick patterns",
                activity: "Design sun-dried clay tiles with cuneiform",
                selFocus: "Patience in creative process"
            },
            {
                day: 3,
                type: "Explain", 
                title: "Stacked Geometry",
                description: "Explore stepped pyramid mathematics",
                activity: "Calculate blocks needed for each level",
                selFocus: "Persistence through challenging problems"
            },
            {
                day: 4,
                type: "Elaborate",
                title: "Flood Challenge",
                description: "How to build above flood waters?",
                activity: "Water table simulation with materials",
                selFocus: "Problem-solving and innovation"
            },
            {
                day: 5,
                type: "Evaluate",
                title: "Ziggurat Solution Revealed",
                description: "Ancient engineers' flood-proof design",
                activity: "Build class ziggurat model",
                selFocus: "Celebration of learning achievement"
            }
        ]
    },
    "week2": {
        title: "Pyramid Precision",
        theme: "Egyptian Mathematical Engineering",
        days: [
            {
                day: 1,
                type: "Engage",
                title: "Tale of Thoth's Wisdom",
                description: "Egyptian god of measurement and writing",
                activity: "Hieroglyphic measurement symbols",
                selFocus: "Value of knowledge and precision"
            },
            {
                day: 2,
                type: "Explore", 
                title: "Golden Pyramid Art",
                description: "Create geometric pyramid designs",
                activity: "Paper folding and golden ratio exploration",
                selFocus: "Attention to detail and craftsmanship"
            },
            {
                day: 3,
                type: "Explain",
                title: "Slope Calculations",
                description: "Why 51.8° makes perfect pyramids",
                activity: "Measure angles and test stability",
                selFocus: "Mathematical reasoning and logic"
            },
            {
                day: 4,
                type: "Elaborate",
                title: "Monument Challenge",
                description: "Build something to last forever",
                activity: "Test different shapes for durability",
                selFocus: "Long-term thinking and legacy"
            },
            {
                day: 5,
                type: "Evaluate",
                title: "Pyramid Engineering Revealed",
                description: "4,500 years of proven design",
                activity: "Calculate Great Pyramid statistics",
                selFocus: "Appreciation for human achievement"
            }
        ]
    }
};

let currentWeek = "week1";
let currentDay = 1;
let builtBlocks = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateZiggurat();
    generateCalendar();
    generateRelevancyList();
    setupLessonInput();
    updateCurrentLesson();
});

function generateZiggurat() {
    const ziggurat = document.getElementById('ziggurat');
    const levels = [
        { blocks: 1, topics: ["Apex: Symbolic Achievement"] },
        { blocks: 2, topics: ["Advanced Applications", "Complex Systems"] },
        { blocks: 3, topics: ["Mathematical Principles", "Engineering Solutions", "Cultural Impact"] },
        { blocks: 4, topics: ["Basic Geometry", "Historical Context", "Material Science", "Social Structures"] },
        { blocks: 5, topics: ["Foundation Stories", "Simple Patterns", "Community Cooperation", "Resource Management", "Cultural Identity"] }
    ];

    levels.forEach((level, levelIndex) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'ziggurat-level';
        
        for (let i = 0; i < level.blocks; i++) {
            const block = document.createElement('div');
            block.className = 'ziggurat-block';
            block.dataset.level = levelIndex;
            block.dataset.block = i;
            
            const topic = level.topics[i] || `Block ${i + 1}`;
            block.textContent = topic;
            block.title = `Click to explore: ${topic}`;
            
            block.addEventListener('click', () => buildBlock(block, topic));
            levelDiv.appendChild(block);
        }
        
        ziggurat.appendChild(levelDiv);
    });
}

function buildBlock(blockElement, topic) {
    if (blockElement.classList.contains('built')) return;
    
    blockElement.classList.add('built');
    builtBlocks.push(topic);
    
    // Add to lesson suggestions
    addLessonSuggestion(topic);
    
    // Visual feedback
    setTimeout(() => {
        showBlockDetails(topic);
    }, 500);
}

function showBlockDetails(topic) {
    const lessonPanel = document.getElementById('currentLesson');
    lessonPanel.innerHTML = `
        <div class="lesson-idea">
            <h4>🧱 Block Added: ${topic}</h4>
            <p>This concept has been added to your learning foundation.</p>
            <div class="lesson-actions">
                <button class="action-btn" onclick="generateLessonPlan('${topic}')">Create Lesson</button>
                <button class="action-btn" onclick="findConnections('${topic}')">Find Connections</button>
            </div>
        </div>
    `;
}

function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const weekData = fiveDayCycles[currentWeek];
    
    calendarDays.innerHTML = '';
    
    // Generate 5 days for the current week
    weekData.days.forEach((dayData, index) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day has-lesson';
        if (dayData.day === currentDay) {
            dayDiv.classList.add('current');
        }
        
        dayDiv.innerHTML = `
            <div class="day-number">Day ${dayData.day}</div>
            <div class="day-lesson">${dayData.type}: ${dayData.title}</div>
        `;
        
        dayDiv.addEventListener('click', () => selectDay(dayData.day));
        calendarDays.appendChild(dayDiv);
    });
    
    // Add navigation info
    document.getElementById('currentWeek').textContent = `Week ${currentWeek.slice(-1)}: ${weekData.title}`;
}

function selectDay(day) {
    currentDay = day;
    generateCalendar();
    updateCurrentLesson();
}

function updateCurrentLesson() {
    const weekData = fiveDayCycles[currentWeek];
    const dayData = weekData.days.find(d => d.day === currentDay);
    
    if (dayData) {
        document.getElementById('currentLesson').innerHTML = `
            <div class="lesson-idea">
                <h4>📚 ${dayData.type}: ${dayData.title}</h4>
                <p><strong>Description:</strong> ${dayData.description}</p>
                <p><strong>Activity:</strong> ${dayData.activity}</p>
                <p><strong>SEL Focus:</strong> ${dayData.selFocus}</p>
                <div class="lesson-actions">
                    <button class="action-btn" onclick="expandLesson(${currentDay})">Expand Details</button>
                    <button class="action-btn" onclick="adaptLesson(${currentDay})">Adapt for Grade</button>
                </div>
            </div>
        `;
    }
}

function generateRelevancyList() {
    const relevancyList = document.getElementById('relevancyList');
    
    // Sort by relevancy score (highest first)
    const sortedData = [...historicalData].sort((a, b) => b.relevancyScore - a.relevancyScore);
    
    relevancyList.innerHTML = sortedData.map(item => `
        <div class="relevancy-item" onclick="exploreItem('${item.id}')">
            <div class="relevancy-score">${item.relevancyScore}%</div>
            <h4>${item.title}</h4>
            <p style="font-size: 12px; color: #666;">${item.eraRange} - ${item.region}</p>
            <p style="font-size: 13px; margin: 5px 0;">${item.lessonSeed}</p>
            <a href="#" class="source-link" onclick="showSource('${item.source}', event)">
                📚 Source: ${item.source}
            </a>
        </div>
    `).join('');
}

function exploreItem(itemId) {
    const item = historicalData.find(d => d.id === itemId);
    if (!item) return;
    
    const lessonPanel = document.getElementById('currentLesson');
    lessonPanel.innerHTML = `
        <div class="lesson-idea">
            <h4>🏛️ ${item.title}</h4>
            <p><strong>Era:</strong> ${item.eraRange} (${item.era})</p>
            <p><strong>Region:</strong> ${item.region}</p>
            <p><strong>Grade Band:</strong> ${item.gradeBand}</p>
            <p><strong>Lesson Idea:</strong> ${item.lessonSeed}</p>
            <p><strong>Key Insight:</strong> ${item.variableInteractionChain}</p>
            <div class="lesson-actions">
                <button class="action-btn" onclick="createCycleFor('${itemId}')">Create 5-Day Cycle</button>
                <button class="action-btn" onclick="adaptComplexity('${itemId}')">Adjust Complexity</button>
            </div>
        </div>
    `;
}

function showSource(source, event) {
    event.stopPropagation();
    alert(`Source: ${source}\n\nThis content is traceable back to: ${source}\nClick the main item to explore lesson possibilities.`);
}

function setupLessonInput() {
    const input = document.getElementById('lessonInput');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLessonQuery(this.value);
        }
    });
}

function handleLessonQuery(query) {
    const suggestionsDiv = document.getElementById('lessonSuggestions');
    
    // Simple AI-like response based on keywords
    let response = generateLessonResponse(query);
    
    suggestionsDiv.innerHTML = `
        <div class="lesson-idea" style="margin-top: 15px;">
            <h4>💡 Suggestion for: "${query}"</h4>
            <p>${response}</p>
            <div class="lesson-actions">
                <button class="action-btn" onclick="refineIdea('${query}')">Refine This</button>
                <button class="action-btn" onclick="getMoreIdeas('${query}')">More Ideas</button>
            </div>
        </div>
    `;
}

function generateLessonResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('pyramid') || q.includes('egypt')) {
        return "For pyramid geometry, try the 5-day cycle: Day 1 - Thoth mythology, Day 2 - Paper pyramid folding, Day 3 - Slope angle calculations, Day 4 - Stability challenge, Day 5 - Great Pyramid revelation. Use sugar cubes for hands-on building!";
    } else if (q.includes('ziggurat') || q.includes('mesopotamia')) {
        return "Ziggurat lessons work great with flood simulation! Start with Gilgamesh stories, create mud brick art, explore stepped geometry, challenge with water table problems, then reveal the brilliant ziggurat solution.";
    } else if (q.includes('stone') || q.includes('circle')) {
        return "Stonehenge offers perfect astronomy connections! Use cardboard arcs to model solstice sightlines. Students love the mystery aspect - build suspense about 'why this arrangement?'";
    } else if (q.includes('maya') || q.includes('calendar')) {
        return "Maya calendars are perfect for gear mathematics! Create two cardboard wheels (13 & 20 teeth) and let students discover the 260-day cycle naturally through rotation.";
    } else if (q.includes('grade') && q.match(/\d/)) {
        const grade = q.match(/\d/)[0];
        return `For grade ${grade}, focus on ${getGradeApproach(grade)}. Adjust complexity and use appropriate manipulatives for this age group.`;
    } else {
        return "Try connecting your topic to one of our historical discoveries! Each has built-in engagement through story, hands-on activities, and real problem-solving. What specific concept are you trying to teach?";
    }
}

function getGradeApproach(grade) {
    const approaches = {
        'K': 'concrete manipulatives and simple patterns',
        '1': 'storytelling with basic shapes and counting',
        '2': 'hands-on building with guided exploration',
        '3': 'measurement activities and simple calculations', 
        '4': 'geometric relationships and cultural connections',
        '5': 'mathematical reasoning and historical context',
        '6': 'complex problem-solving and engineering principles',
        '7': 'advanced geometry and societal implications',
        '8': 'abstract reasoning and cross-cultural analysis'
    };
    return approaches[grade] || 'age-appropriate hands-on discovery';
}

function previousWeek() {
    if (currentWeek === "week2") {
        currentWeek = "week1";
        currentDay = 1;
        generateCalendar();
        updateCurrentLesson();
    }
}

function nextWeek() {
    if (currentWeek === "week1") {
        currentWeek = "week2";
        currentDay = 1;
        generateCalendar();
        updateCurrentLesson();
    }
}

function addLessonSuggestion(topic) {
    const suggestionsDiv = document.getElementById('lessonSuggestions');
    const existingContent = suggestionsDiv.innerHTML;
    
    suggestionsDiv.innerHTML = existingContent + `
        <div class="lesson-idea" style="margin-top: 10px; background: #e8f5e8;">
            <h4>🌟 Inspiration from ${topic}</h4>
            <p>This concept could connect to hands-on activities, mathematical exploration, or historical storytelling. Would you like specific suggestions?</p>
        </div>
    `;
}

// Additional interactive functions
function generateLessonPlan(topic) {
    alert(`Generating lesson plan for: ${topic}\n\nThis would create a detailed 5-day cycle with activities, assessments, and materials list.`);
}

function findConnections(topic) {
    alert(`Finding connections for: ${topic}\n\nThis would show how this concept connects to other historical discoveries and modern applications.`);
}

function expandLesson(day) {
    alert(`Expanding Day ${day} lesson\n\nThis would provide detailed timing, materials, differentiation strategies, and assessment rubrics.`);
}

function adaptLesson(day) {
    alert(`Adapting Day ${day} lesson\n\nThis would offer grade-level modifications, complexity adjustments, and alternative activities.`);
}

function createCycleFor(itemId) {
    const item = historicalData.find(d => d.id === itemId);
    alert(`Creating 5-day cycle for: ${item.title}\n\nThis would generate a complete discovery cycle following the engage-explore-explain-elaborate-evaluate framework.`);
}

function adaptComplexity(itemId) {
    const item = historicalData.find(d => d.id === itemId);
    alert(`Adjusting complexity for: ${item.title}\n\nCurrent cognitive load: ${item.cognitiveLoad}\nThis would offer simpler or more advanced versions.`);
}

function refineIdea(query) {
    alert(`Refining idea for: "${query}"\n\nThis would ask follow-up questions to better understand your specific needs and context.`);
}

function getMoreIdeas(query) {
    const moreIdeas = [
        "Try a cross-curricular approach connecting art and mathematics",
        "Consider outdoor learning opportunities with shadow measurements", 
        "Add storytelling elements to increase engagement",
        "Include collaborative building challenges",
        "Connect to modern engineering examples students know"
    ];
    
    const randomIdea = moreIdeas[Math.floor(Math.random() * moreIdeas.length)];
    
    const suggestionsDiv = document.getElementById('lessonSuggestions');
    suggestionsDiv.innerHTML += `
        <div class="lesson-idea" style="margin-top: 10px; background: #fff3cd;">
            <h4>🎲 Random Inspiration</h4>
            <p>${randomIdea}</p>
        </div>
    `;
}