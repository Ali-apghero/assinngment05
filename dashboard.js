let allIssues = []; 


const issueContainer = document.getElementById('issue-container');
const issueCountText = document.getElementById('issue-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('issue-modal');
const closeModalBtns = [document.getElementById('close-modal-top'), document.getElementById('close-modal-btn')];


async function fetchIssues() {
    const loader = document.getElementById('loader');
    
    try {
        const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const result = await response.json();
        
        if (result.status === "success") {
            allIssues = result.data;
            displayIssues(allIssues);
        }
    } catch (error) {
        console.error("Error fetching issues:", error);
    } finally {

        if (loader) {
            loader.classList.add('opacity-0');
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
    }
}


searchInput.addEventListener('input', async (e) => {
    const term = e.target.value.trim();

    if (term === "") {
        displayIssues(allIssues);
        return;
    }

    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${term}`);
        const result = await response.json();
        if (result.status === "success") {
            displayIssues(result.data);
        }
    } catch (error) {
        console.error("Search API error:", error);
    }
});


function displayIssues(data) {
    issueContainer.innerHTML = ""; 
    issueCountText.innerText = `${data.length} Issues`;

    data.forEach(issue => {
        const isOpen = issue.status.toLowerCase() === "open";
        const statusColor = isOpen ? "border-t-emerald-400" : "border-t-violet-400";
        

        const statusImg = isOpen 
            ? "./assets/Open-Status.png"  
            : "./assets/Closed- Status .png"; 
        
        let priorityClass = "text-gray-400 bg-gray-50 border-gray-100";
        if(issue.priority.toLowerCase() === "high") priorityClass = "text-red-500 bg-red-50 border-red-100";
        if(issue.priority.toLowerCase() === "medium") priorityClass = "text-yellow-600 bg-yellow-50 border-yellow-100";

        const cardDiv = document.createElement('div');
        cardDiv.className = `cursor-pointer border border-gray-100 border-t-4 ${statusColor} rounded-2xl p-5 flex flex-col bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`;
        
        cardDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 flex items-center justify-center overflow-hidden">
                    <img src="${statusImg}" class="w-full h-full object-contain" alt="${issue.status}">
                </div>
                <span class="text-[9px] font-bold ${priorityClass} px-2 py-0.5 rounded border uppercase">${issue.priority}</span>
            </div>
            <h3 class="text-sm font-bold text-gray-800 mb-2 leading-snug">${issue.title}</h3>
            <p class="text-[11px] text-gray-400 line-clamp-2 mb-4 flex-grow leading-relaxed">${issue.description}</p>
            <div class="flex flex-wrap gap-2 mb-6">
                ${issue.labels.map(label => `<span class="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-100 italic">${label}</span>`).join('')}
            </div>
            <div class="text-[10px] text-gray-400 pt-4 border-t border-gray-50 flex justify-between items-end">
                <div>
                    <p class="font-bold text-gray-700">#${issue.id} by ${issue.author}</p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
                </div>
        `;

        cardDiv.addEventListener('click', () => fetchSingleIssue(issue.id));
        issueContainer.appendChild(cardDiv);
    });
}


async function fetchSingleIssue(id) {
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await response.json();
        if (result.status === "success") {
            openModal(result.data); 
        }
    } catch (error) {
        console.error("Single issue fetch error:", error);
    }
}


function openModal(issue) {
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-description').innerText = issue.description;
    

    const statusBadge = document.getElementById('modal-status-badge');
    statusBadge.innerText = issue.status;
    statusBadge.className = issue.status.toLowerCase() === 'open' 
        ? 'bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase' 
        : 'bg-violet-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase';

    document.getElementById('modal-meta').innerText = `Opened by ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}`;
    document.getElementById('modal-user-name').innerText = issue.author;
    

    const modalAvatarContainer = document.getElementById('modal-avatar');
    if(modalAvatarContainer) {
        modalAvatarContainer.innerHTML = `<img src="./assets/Open-Status.png" class="w-full h-full object-cover" alt="user">`;
    }
    

    const priorityText = document.getElementById('modal-priority-text');
    const priorityDot = document.getElementById('modal-priority-dot').querySelector('span:last-child');
    priorityText.innerText = issue.priority;

    if(issue.priority.toLowerCase() === 'high') {
        priorityText.className = "text-[10px] font-bold uppercase text-red-500";
        priorityDot.className = "w-2.5 h-2.5 rounded-full bg-red-500";
    } else {
        priorityText.className = "text-[10px] font-bold uppercase text-gray-400";
        priorityDot.className = "w-2.5 h-2.5 rounded-full bg-gray-400";
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    }, 10);
}


filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.className = "filter-btn text-gray-400 px-6 py-1.5 hover:bg-gray-50 rounded-lg text-sm font-semibold");
        this.className = "filter-btn bg-[#4a00ff] text-white px-6 py-1.5 rounded-lg text-sm font-bold";

        const status = this.innerText.toLowerCase();
        const filtered = status === 'all' ? allIssues : allIssues.filter(i => i.status.toLowerCase() === status);
        displayIssues(filtered);
    });
});


function closeModal() {
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });


fetchIssues();